import { chromium } from '@playwright/test';

async function testLogin() {
    console.log('🧪 Testing login only...\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000 
    });
    
    const context = await browser.newContext({
        ignoreHTTPSErrors: true
    });
    const page = await context.newPage();
    
    try {
        console.log('1️⃣ Going to login page...');
        await page.goto('https://codersinflow.com/blog/editor/login', { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });
        console.log('✅ Login page loaded\n');
        
        console.log('2️⃣ Filling credentials...');
        await page.fill('input[type="email"]', 'sales@codersinflow.com');
        await page.fill('input[type="password"]', 'F0r3st40!');
        console.log('✅ Credentials filled\n');
        
        console.log('3️⃣ Clicking login button...');
        await page.click('button[type="submit"]');
        
        console.log('4️⃣ Waiting for redirect...');
        await page.waitForURL('**/editor', { timeout: 10000 });
        
        const currentUrl = page.url();
        console.log('✅ Login successful!');
        console.log('Current URL:', currentUrl);
        
        // Take screenshot
        await page.screenshot({ path: 'test-dashboard.png', fullPage: true });
        console.log('📸 Dashboard screenshot saved\n');
        
        // Try to navigate to posts
        console.log('5️⃣ Navigating to posts page...');
        await page.goto('https://codersinflow.com/blog/editor/posts', { 
            waitUntil: 'networkidle' 
        });
        console.log('Current URL:', page.url());
        
        // Check if we're still logged in
        if (page.url().includes('/login')) {
            console.log('❌ Got redirected to login - session issue');
        } else {
            console.log('✅ Posts page loaded!');
            await page.screenshot({ path: 'test-posts.png', fullPage: true });
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        await page.screenshot({ path: 'test-error-simple.png', fullPage: true });
    } finally {
        await browser.close();
    }
}

testLogin().catch(console.error);