#!/usr/bin/env node

/**
 * Stress Test to Failure - Gradually increases load until server fails
 */

const http = require('http');
const os = require('os');
const { exec } = require('child_process');
const fs = require('fs');

// Configuration
const CONFIG = {
  serverUrl: 'http://127.0.0.1:4321',
  startConnections: 10,
  connectionIncrement: 10,
  maxConnections: 500,
  requestsPerConnection: 50,
  stepDuration: 10000, // milliseconds per load level
  pages: ['/', '/features', '/enterprise', '/blog', '/blog/docs', '/download']
};

let currentConnections = CONFIG.startConnections;
let serverAlive = true;
let testRunning = true;
const startTime = Date.now();
const results = [];

// Check if server is alive
async function checkServerHealth() {
  return new Promise((resolve) => {
    const req = http.get(CONFIG.serverUrl, { timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(res.statusCode === 200));
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    
    req.on('error', () => resolve(false));
  });
}

// Get server process stats
async function getServerStats() {
  return new Promise((resolve) => {
    exec("ps aux | grep 'node dist/server/entry.mjs' | grep -v grep", (err, stdout) => {
      if (err || !stdout.trim()) {
        resolve(null);
        return;
      }
      
      const parts = stdout.trim().split(/\s+/);
      const pid = parts[1];
      
      exec(`lsof -p ${pid} 2>/dev/null | wc -l`, (err2, fdCount) => {
        resolve({
          pid,
          cpu: parseFloat(parts[2]) || 0,
          memory: parseFloat(parts[3]) || 0,
          rss: parseInt(parts[5]) || 0,
          fileDescriptors: parseInt(fdCount) || 0
        });
      });
    });
  });
}

// Make concurrent requests
async function bombardServer(connections) {
  const stats = {
    requests: 0,
    successful: 0,
    failed: 0,
    timeouts: 0,
    responseTimes: []
  };
  
  const promises = [];
  
  for (let i = 0; i < connections; i++) {
    promises.push((async () => {
      for (let j = 0; j < CONFIG.requestsPerConnection; j++) {
        const page = CONFIG.pages[Math.floor(Math.random() * CONFIG.pages.length)];
        const url = `${CONFIG.serverUrl}${page}`;
        const startTime = Date.now();
        
        try {
          const result = await new Promise((resolve, reject) => {
            const req = http.get(url, { timeout: 5000 }, (res) => {
              let data = '';
              res.on('data', chunk => data += chunk);
              res.on('end', () => {
                const responseTime = Date.now() - startTime;
                stats.responseTimes.push(responseTime);
                stats.requests++;
                
                if (res.statusCode === 200) {
                  stats.successful++;
                } else {
                  stats.failed++;
                }
                resolve(true);
              });
            });
            
            req.on('timeout', () => {
              stats.requests++;
              stats.timeouts++;
              req.destroy();
              resolve(false);
            });
            
            req.on('error', () => {
              stats.requests++;
              stats.failed++;
              resolve(false);
            });
          });
        } catch (err) {
          stats.failed++;
        }
      }
    })());
  }
  
  await Promise.all(promises);
  return stats;
}

// Run stress test
async function runStressTest() {
  console.log('🔥 STRESS TEST TO FAILURE');
  console.log('================================');
  console.log('This test will gradually increase load until the server fails.\n');
  
  while (testRunning && currentConnections <= CONFIG.maxConnections) {
    // Check server health
    serverAlive = await checkServerHealth();
    if (!serverAlive) {
      console.log('\n💀 SERVER HAS FAILED!');
      break;
    }
    
    // Get server stats before load
    const statsBefore = await getServerStats();
    
    console.log(`\n📊 Testing with ${currentConnections} concurrent connections...`);
    console.log(`   Sending ${currentConnections * CONFIG.requestsPerConnection} total requests`);
    
    // Apply load
    const testStart = Date.now();
    const loadStats = await bombardServer(currentConnections);
    const testDuration = Date.now() - testStart;
    
    // Get server stats after load
    const statsAfter = await getServerStats();
    
    // Calculate metrics
    const avgResponseTime = loadStats.responseTimes.length > 0 
      ? loadStats.responseTimes.reduce((a, b) => a + b, 0) / loadStats.responseTimes.length 
      : 0;
    
    const p95ResponseTime = loadStats.responseTimes.length > 0
      ? loadStats.responseTimes.sort((a, b) => a - b)[Math.floor(loadStats.responseTimes.length * 0.95)]
      : 0;
    
    const successRate = (loadStats.successful / loadStats.requests * 100).toFixed(1);
    const requestsPerSec = (loadStats.requests / (testDuration / 1000)).toFixed(1);
    
    // Display results
    console.log(`   ✅ Success Rate: ${successRate}%`);
    console.log(`   📈 Requests/sec: ${requestsPerSec}`);
    console.log(`   ⏱️  Avg Response: ${avgResponseTime.toFixed(0)}ms`);
    console.log(`   ⏱️  P95 Response: ${p95ResponseTime}ms`);
    console.log(`   ❌ Failed: ${loadStats.failed}, Timeouts: ${loadStats.timeouts}`);
    
    if (statsAfter) {
      console.log(`   💻 CPU: ${statsAfter.cpu}%`);
      console.log(`   💾 Memory: ${statsAfter.memory}% (${(statsAfter.rss / 1024).toFixed(1)}MB)`);
      console.log(`   📁 File Descriptors: ${statsAfter.fileDescriptors}`);
    }
    
    // Store results
    results.push({
      connections: currentConnections,
      timestamp: Date.now(),
      stats: loadStats,
      serverStats: statsAfter,
      metrics: {
        successRate: parseFloat(successRate),
        requestsPerSec: parseFloat(requestsPerSec),
        avgResponseTime,
        p95ResponseTime
      }
    });
    
    // Check for failure conditions
    if (parseFloat(successRate) < 50) {
      console.log('\n⚠️  Success rate below 50% - server is struggling!');
    }
    
    if (avgResponseTime > 5000) {
      console.log('⚠️  Response times exceeding 5 seconds!');
    }
    
    if (statsAfter && statsAfter.fileDescriptors > 1000) {
      console.log('⚠️  File descriptor count very high - possible leak!');
    }
    
    if (loadStats.timeouts > loadStats.successful) {
      console.log('⚠️  More timeouts than successful requests!');
    }
    
    // Increase load for next iteration
    currentConnections += CONFIG.connectionIncrement;
    
    // Brief pause between levels
    if (testRunning && currentConnections <= CONFIG.maxConnections) {
      console.log('\n⏸️  Pausing for 3 seconds before next level...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  // Final health check
  serverAlive = await checkServerHealth();
  
  // Generate report
  generateFinalReport();
}

// Generate final report
function generateFinalReport() {
  console.log('\n================================');
  console.log('📊 STRESS TEST COMPLETE');
  console.log('================================\n');
  
  const duration = (Date.now() - startTime) / 1000;
  
  if (!serverAlive) {
    const lastSuccessful = results[results.length - 2] || results[results.length - 1];
    console.log('💀 SERVER FAILURE DETECTED');
    console.log(`   Failed at: ${currentConnections} concurrent connections`);
    if (lastSuccessful) {
      console.log(`   Last successful: ${lastSuccessful.connections} connections`);
      console.log(`   Last success rate: ${lastSuccessful.metrics.successRate}%`);
    }
  } else if (currentConnections > CONFIG.maxConnections) {
    console.log('✅ SERVER SURVIVED MAXIMUM LOAD!');
    console.log(`   Handled up to: ${CONFIG.maxConnections} concurrent connections`);
  }
  
  console.log(`\n📈 Performance Degradation:`);
  
  // Show how performance degraded with load
  if (results.length > 0) {
    console.log('\nConnections | Success% | Req/s | Avg RT | P95 RT | FDs');
    console.log('------------|----------|-------|--------|--------|----');
    
    for (const result of results) {
      const fds = result.serverStats ? result.serverStats.fileDescriptors : 'N/A';
      console.log(
        `${result.connections.toString().padEnd(11)} | ` +
        `${result.metrics.successRate.toFixed(1).padEnd(8)} | ` +
        `${result.metrics.requestsPerSec.toString().padEnd(5)} | ` +
        `${result.metrics.avgResponseTime.toFixed(0).padEnd(6)} | ` +
        `${result.metrics.p95ResponseTime.toString().padEnd(6)} | ` +
        `${fds}`
      );
    }
  }
  
  // Identify breaking point
  const breakingPoint = results.find(r => r.metrics.successRate < 90);
  if (breakingPoint) {
    console.log(`\n⚠️  Performance degradation started at ${breakingPoint.connections} connections`);
  }
  
  // Save detailed results
  const reportFile = `stress-test-report-${new Date().toISOString().replace(/:/g, '-')}.json`;
  fs.writeFileSync(reportFile, JSON.stringify({
    config: CONFIG,
    duration,
    serverFailed: !serverAlive,
    failurePoint: currentConnections,
    results
  }, null, 2));
  
  console.log(`\n💾 Detailed report saved to: ${reportFile}`);
  console.log('================================\n');
}

// Handle interruption
process.on('SIGINT', () => {
  console.log('\n\n🛑 Test interrupted by user');
  testRunning = false;
  generateFinalReport();
  process.exit(0);
});

// Run the test
runStressTest().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});