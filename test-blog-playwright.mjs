import { chromium } from '@playwright/test';

async function testBlogSystem() {
    console.log('🧪 Starting Playwright blog tests...\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000 
    });
    
    const context = await browser.newContext({
        ignoreHTTPSErrors: true
    });
    const page = await context.newPage();
    
    const baseUrl = 'https://codersinflow.com';
    const adminEmail = 'sales@codersinflow.com';
    const adminPassword = 'F0r3st40!';
    
    try {
        // Test 1: Navigate to login page
        console.log('1️⃣ Navigating to login page...');
        await page.goto(`${baseUrl}/blog/editor/login`, { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });
        
        // Take screenshot
        await page.screenshot({ path: 'test-login-page.png', fullPage: true });
        console.log('📸 Login page screenshot saved\n');
        
        // Check if login form exists
        const emailInput = await page.$('input[type="email"]');
        const passwordInput = await page.$('input[type="password"]');
        
        if (!emailInput || !passwordInput) {
            console.log('❌ Login form not found!');
            
            // Check page content
            const pageContent = await page.content();
            console.log('Page title:', await page.title());
            console.log('Page URL:', page.url());
            
            // Check for any error messages
            const bodyText = await page.textContent('body');
            console.log('Page text preview:', bodyText.substring(0, 500));
            
            return;
        }
        
        console.log('✅ Login form found\n');
        
        // Test 2: Fill login form
        console.log('2️⃣ Filling login form...');
        await emailInput.fill(adminEmail);
        await passwordInput.fill(adminPassword);
        
        // Find and click submit button
        const submitButton = await page.$('button[type="submit"]');
        if (submitButton) {
            console.log('Clicking submit button...');
            await submitButton.click();
        } else {
            // Try finding any button with login text
            const loginButton = await page.$('button:has-text("Login"), button:has-text("Sign In")');
            if (loginButton) {
                await loginButton.click();
            }
        }
        
        // Wait for navigation or error
        console.log('Waiting for response...');
        await page.waitForTimeout(3000);
        
        // Check current URL
        const currentUrl = page.url();
        console.log('Current URL:', currentUrl);
        
        if (currentUrl.includes('/editor') && !currentUrl.includes('/login')) {
            console.log('✅ Login successful!\n');
            
            // Test 3: Navigate to posts
            console.log('3️⃣ Navigating to posts...');
            await page.goto(`${baseUrl}/blog/editor/posts`, { 
                waitUntil: 'networkidle' 
            });
            
            await page.screenshot({ path: 'test-posts-page.png', fullPage: true });
            console.log('📸 Posts page screenshot saved\n');
            
            // Test 4: Try to create new post
            console.log('4️⃣ Navigating to create new post...');
            await page.goto(`${baseUrl}/blog/editor/posts/new`, { 
                waitUntil: 'networkidle' 
            });
            
            await page.screenshot({ path: 'test-new-post-page.png', fullPage: true });
            console.log('📸 New post page screenshot saved\n');
            
        } else {
            console.log('❌ Login failed or redirected incorrectly');
            
            // Check for error messages
            const errorMessage = await page.$('.error, .alert, [role="alert"]');
            if (errorMessage) {
                const errorText = await errorMessage.textContent();
                console.log('Error message:', errorText);
            }
            
            // Take screenshot of failed state
            await page.screenshot({ path: 'test-login-failed.png', fullPage: true });
            console.log('📸 Failed login screenshot saved');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        await page.screenshot({ path: 'test-error.png', fullPage: true });
        console.log('📸 Error screenshot saved');
    } finally {
        await browser.close();
        console.log('\n🎉 Tests completed!');
    }
}

// Run the tests
testBlogSystem().catch(console.error);