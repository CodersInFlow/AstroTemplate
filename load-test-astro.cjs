#!/usr/bin/env node

/**
 * Load Testing Script for Astro Server
 * Tests the server under heavy load while monitoring resources
 */

const http = require('http');
const os = require('os');
const { spawn, exec } = require('child_process');
const fs = require('fs');

// Configuration
const CONFIG = {
  serverUrl: 'http://127.0.0.1:4321',
  testDuration: 60, // seconds
  concurrentConnections: 50, // start with 50 concurrent connections
  requestsPerConnection: 100, // each connection makes 100 requests
  rampUpTime: 10, // seconds to ramp up to full load
  monitorInterval: 1000, // milliseconds between monitoring samples
  pages: [
    '/',
    '/features',
    '/enterprise',
    '/blog',
    '/blog/docs',
    '/download'
  ]
};

// Monitoring data
const metrics = {
  startTime: Date.now(),
  samples: [],
  requests: {
    total: 0,
    successful: 0,
    failed: 0,
    timeouts: 0,
    errors: {}
  },
  responseTimes: []
};

// Get Node process PID
let serverPid = null;

async function findServerPid() {
  return new Promise((resolve) => {
    exec("ps aux | grep 'node dist/server/entry.mjs' | grep -v grep | awk '{print $2}'", (err, stdout) => {
      if (!err && stdout.trim()) {
        serverPid = parseInt(stdout.trim());
        console.log(`📍 Found server PID: ${serverPid}`);
      }
      resolve();
    });
  });
}

// Monitor system resources
async function getProcessStats() {
  if (!serverPid) return null;
  
  return new Promise((resolve) => {
    // Get process-specific stats on macOS
    exec(`ps -p ${serverPid} -o %cpu,%mem,rss,vsz`, (err, stdout) => {
      if (err) {
        resolve(null);
        return;
      }
      
      const lines = stdout.trim().split('\n');
      if (lines.length < 2) {
        resolve(null);
        return;
      }
      
      const stats = lines[1].trim().split(/\s+/);
      
      // Get file descriptor count
      exec(`lsof -p ${serverPid} 2>/dev/null | wc -l`, (err2, fdCount) => {
        // Get system-wide stats
        const cpus = os.cpus();
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        
        resolve({
          timestamp: Date.now(),
          process: {
            cpu: parseFloat(stats[0]) || 0,
            memory: parseFloat(stats[1]) || 0,
            rss: parseInt(stats[2]) || 0, // RSS in KB
            vsz: parseInt(stats[3]) || 0, // VSZ in KB
            fileDescriptors: parseInt(fdCount) || 0
          },
          system: {
            loadAverage: os.loadavg(),
            cpuCount: cpus.length,
            memoryUsed: (totalMemory - freeMemory) / 1024 / 1024, // MB
            memoryTotal: totalMemory / 1024 / 1024, // MB
            memoryPercent: ((totalMemory - freeMemory) / totalMemory * 100).toFixed(2)
          }
        });
      });
    });
  });
}

// Start monitoring
function startMonitoring() {
  const monitorInterval = setInterval(async () => {
    const stats = await getProcessStats();
    if (stats) {
      metrics.samples.push(stats);
      
      // Print current stats
      console.log(
        `📊 [${new Date().toLocaleTimeString()}] ` +
        `CPU: ${stats.process.cpu}% | ` +
        `Mem: ${stats.process.memory}% (${(stats.process.rss/1024).toFixed(1)}MB) | ` +
        `FDs: ${stats.process.fileDescriptors} | ` +
        `Req: ${metrics.requests.total} (✓${metrics.requests.successful} ✗${metrics.requests.failed}) | ` +
        `Avg RT: ${metrics.responseTimes.length ? (metrics.responseTimes.reduce((a,b) => a+b, 0) / metrics.responseTimes.length).toFixed(0) : 0}ms`
      );
      
      // Check for concerning metrics
      if (stats.process.cpu > 90) {
        console.warn('⚠️  HIGH CPU USAGE DETECTED');
      }
      if (stats.process.memory > 80) {
        console.warn('⚠️  HIGH MEMORY USAGE DETECTED');
      }
      if (stats.process.fileDescriptors > 1000) {
        console.warn('⚠️  HIGH FILE DESCRIPTOR COUNT - POSSIBLE LEAK');
      }
    }
  }, CONFIG.monitorInterval);
  
  return monitorInterval;
}

// Make HTTP request
function makeRequest(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const req = http.get(url, { 
      timeout: 10000,
      agent: new http.Agent({ 
        keepAlive: true,
        maxSockets: 100
      })
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        metrics.responseTimes.push(responseTime);
        metrics.requests.total++;
        
        if (res.statusCode === 200) {
          metrics.requests.successful++;
        } else {
          metrics.requests.failed++;
          metrics.requests.errors[res.statusCode] = (metrics.requests.errors[res.statusCode] || 0) + 1;
        }
        
        resolve({ 
          status: res.statusCode, 
          time: responseTime,
          size: data.length 
        });
      });
    });
    
    req.on('timeout', () => {
      metrics.requests.total++;
      metrics.requests.timeouts++;
      req.destroy();
      resolve({ status: 'timeout', time: Date.now() - startTime });
    });
    
    req.on('error', (err) => {
      metrics.requests.total++;
      metrics.requests.failed++;
      metrics.requests.errors[err.code] = (metrics.requests.errors[err.code] || 0) + 1;
      resolve({ status: 'error', error: err.code, time: Date.now() - startTime });
    });
  });
}

// Worker function to hammer the server
async function hammerServer(workerId, connections, requestsPerConnection) {
  console.log(`🔨 Worker ${workerId} starting with ${connections} connections...`);
  
  const promises = [];
  for (let c = 0; c < connections; c++) {
    // Stagger connection starts slightly
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
    
    promises.push((async () => {
      for (let r = 0; r < requestsPerConnection; r++) {
        // Pick a random page
        const page = CONFIG.pages[Math.floor(Math.random() * CONFIG.pages.length)];
        const url = `${CONFIG.serverUrl}${page}`;
        
        await makeRequest(url);
        
        // Small delay between requests from same connection
        await new Promise(resolve => setTimeout(resolve, 10 + Math.random() * 50));
      }
    })());
  }
  
  await Promise.all(promises);
  console.log(`✅ Worker ${workerId} completed`);
}

// Main test function
async function runLoadTest() {
  console.log('🚀 Starting Astro Server Load Test');
  console.log('================================');
  console.log(`Server: ${CONFIG.serverUrl}`);
  console.log(`Duration: ${CONFIG.testDuration}s`);
  console.log(`Concurrent Connections: ${CONFIG.concurrentConnections}`);
  console.log(`Requests per Connection: ${CONFIG.requestsPerConnection}`);
  console.log(`Total Expected Requests: ${CONFIG.concurrentConnections * CONFIG.requestsPerConnection}`);
  console.log('================================\n');
  
  // Find server PID
  await findServerPid();
  
  // Start monitoring
  const monitorInterval = startMonitoring();
  
  // Initial baseline
  console.log('📏 Getting baseline metrics...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Start the load test
  console.log('\n🔥 Starting load generation...\n');
  
  const testStart = Date.now();
  const workers = [];
  
  // Create multiple workers to generate load
  const workerCount = 4;
  const connectionsPerWorker = Math.ceil(CONFIG.concurrentConnections / workerCount);
  
  for (let i = 0; i < workerCount; i++) {
    workers.push(hammerServer(i + 1, connectionsPerWorker, CONFIG.requestsPerConnection));
  }
  
  // Wait for all workers to complete or timeout
  const timeout = new Promise(resolve => 
    setTimeout(() => {
      console.log('\n⏱️  Test duration reached');
      resolve();
    }, CONFIG.testDuration * 1000)
  );
  
  await Promise.race([Promise.all(workers), timeout]);
  
  // Cool down period
  console.log('\n📉 Cool down period (5 seconds)...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Stop monitoring
  clearInterval(monitorInterval);
  
  // Generate report
  generateReport();
}

// Generate final report
function generateReport() {
  console.log('\n================================');
  console.log('📈 LOAD TEST REPORT');
  console.log('================================\n');
  
  const duration = (Date.now() - metrics.startTime) / 1000;
  
  console.log('📊 Request Statistics:');
  console.log(`   Total Requests: ${metrics.requests.total}`);
  console.log(`   Successful: ${metrics.requests.successful} (${(metrics.requests.successful / metrics.requests.total * 100).toFixed(1)}%)`);
  console.log(`   Failed: ${metrics.requests.failed}`);
  console.log(`   Timeouts: ${metrics.requests.timeouts}`);
  console.log(`   Requests/sec: ${(metrics.requests.total / duration).toFixed(1)}`);
  
  if (Object.keys(metrics.requests.errors).length > 0) {
    console.log('\n❌ Errors:');
    for (const [error, count] of Object.entries(metrics.requests.errors)) {
      console.log(`   ${error}: ${count}`);
    }
  }
  
  if (metrics.responseTimes.length > 0) {
    const sorted = [...metrics.responseTimes].sort((a, b) => a - b);
    console.log('\n⏱️  Response Times:');
    console.log(`   Min: ${sorted[0]}ms`);
    console.log(`   Max: ${sorted[sorted.length - 1]}ms`);
    console.log(`   Avg: ${(sorted.reduce((a, b) => a + b, 0) / sorted.length).toFixed(0)}ms`);
    console.log(`   P50: ${sorted[Math.floor(sorted.length * 0.5)]}ms`);
    console.log(`   P95: ${sorted[Math.floor(sorted.length * 0.95)]}ms`);
    console.log(`   P99: ${sorted[Math.floor(sorted.length * 0.99)]}ms`);
  }
  
  if (metrics.samples.length > 0) {
    const cpuValues = metrics.samples.map(s => s.process.cpu);
    const memValues = metrics.samples.map(s => s.process.memory);
    const fdValues = metrics.samples.map(s => s.process.fileDescriptors);
    
    console.log('\n💻 Resource Usage:');
    console.log(`   CPU: ${Math.min(...cpuValues).toFixed(1)}% min, ${Math.max(...cpuValues).toFixed(1)}% max, ${(cpuValues.reduce((a,b) => a+b, 0) / cpuValues.length).toFixed(1)}% avg`);
    console.log(`   Memory: ${Math.min(...memValues).toFixed(1)}% min, ${Math.max(...memValues).toFixed(1)}% max, ${(memValues.reduce((a,b) => a+b, 0) / memValues.length).toFixed(1)}% avg`);
    console.log(`   File Descriptors: ${Math.min(...fdValues)} min, ${Math.max(...fdValues)} max, ${Math.floor(fdValues.reduce((a,b) => a+b, 0) / fdValues.length)} avg`);
    
    // Check for resource leaks
    const fdIncrease = fdValues[fdValues.length - 1] - fdValues[0];
    if (fdIncrease > 100) {
      console.log(`\n⚠️  WARNING: File descriptors increased by ${fdIncrease} - possible leak!`);
    }
    
    const memIncrease = memValues[memValues.length - 1] - memValues[0];
    if (memIncrease > 10) {
      console.log(`⚠️  WARNING: Memory usage increased by ${memIncrease.toFixed(1)}% - possible memory leak!`);
    }
  }
  
  // Save detailed metrics to file
  const reportFile = `load-test-report-${new Date().toISOString().replace(/:/g, '-')}.json`;
  fs.writeFileSync(reportFile, JSON.stringify(metrics, null, 2));
  console.log(`\n💾 Detailed report saved to: ${reportFile}`);
  
  console.log('\n================================');
  console.log('✅ Load test completed!');
  
  // Determine if server survived
  exec(`curl -s -o /dev/null -w "%{http_code}" ${CONFIG.serverUrl}`, (err, stdout) => {
    if (stdout.trim() === '200') {
      console.log('🎉 Server is still responding after load test!');
    } else {
      console.log('💀 Server is NOT responding after load test - it may have crashed or locked up');
    }
    console.log('================================\n');
  });
}

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n\n🛑 Test interrupted by user');
  generateReport();
  process.exit(0);
});

// Run the test
runLoadTest().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});