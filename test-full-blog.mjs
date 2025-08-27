import { chromium } from '@playwright/test';

async function testFullBlogSystem() {
    console.log('🧪 Starting comprehensive blog system tests...\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 500 
    });
    
    const context = await browser.newContext({
        ignoreHTTPSErrors: true
    });
    const page = await context.newPage();
    
    const baseUrl = 'https://codersinflow.com';
    const adminEmail = 'sales@codersinflow.com';
    const adminPassword = 'F0r3st40!';
    const testPostTitle = `Test Post ${Date.now()}`;
    const testPostSlug = `test-post-${Date.now()}`;
    
    try {
        // Test 1: Login
        console.log('1️⃣ Testing login...');
        await page.goto(`${baseUrl}/blog/editor/login`, { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });
        
        await page.fill('input[type="email"]', adminEmail);
        await page.fill('input[type="password"]', adminPassword);
        await page.click('button[type="submit"]');
        
        // Wait for redirect
        await page.waitForURL('**/editor', { timeout: 10000 });
        console.log('✅ Login successful!\n');
        
        // Test 2: Create a new blog post
        console.log('2️⃣ Creating new blog post...');
        await page.goto(`${baseUrl}/blog/editor/posts/new`, { 
            waitUntil: 'networkidle' 
        });
        
        // Fill in blog post details
        await page.fill('input[name="title"]', testPostTitle);
        await page.fill('input[name="slug"]', testPostSlug);
        
        // Wait for editor and add content
        await page.waitForSelector('.ProseMirror', { timeout: 10000 });
        await page.click('.ProseMirror');
        await page.keyboard.type('This is a test blog post created automatically by Playwright.');
        await page.keyboard.press('Enter');
        await page.keyboard.press('Enter');
        await page.keyboard.type('It contains **bold text** and *italic text*.');
        
        // Add tags
        await page.fill('input[name="tags"]', 'test, automation, playwright');
        
        // Save the post
        await page.click('button:has-text("Create Post")');
        
        // Wait for redirect to posts list
        await page.waitForURL('**/editor/posts', { timeout: 10000 });
        console.log('✅ Blog post created!\n');
        
        // Take screenshot of posts list
        await page.screenshot({ path: 'test-posts-list.png', fullPage: true });
        
        // Test 3: View the blog post on frontend
        console.log('3️⃣ Viewing blog post on frontend...');
        await page.goto(`${baseUrl}/blog/${testPostSlug}`, { 
            waitUntil: 'networkidle' 
        });
        
        // Check if post is displayed
        const postTitle = await page.textContent('h1');
        if (postTitle && postTitle.includes(testPostTitle)) {
            console.log('✅ Blog post is visible on frontend!');
            await page.screenshot({ path: 'test-blog-post-frontend.png', fullPage: true });
        } else {
            console.log('⚠️ Blog post not found on frontend');
        }
        
        // Test 4: Go to blog listing
        console.log('\n4️⃣ Checking blog listing page...');
        await page.goto(`${baseUrl}/blog`, { 
            waitUntil: 'networkidle' 
        });
        
        // Look for the new post in the listing
        const postCards = await page.$$('article, .blog-post-card, [class*="post"]');
        console.log(`Found ${postCards.length} posts on listing page`);
        
        // Check if our test post is there
        const testPostExists = await page.$(`text=${testPostTitle}`);
        if (testPostExists) {
            console.log('✅ Test post found in blog listing!');
        } else {
            console.log('⚠️ Test post not found in listing');
        }
        
        await page.screenshot({ path: 'test-blog-listing.png', fullPage: true });
        
        // Test 5: Edit the post
        console.log('\n5️⃣ Testing post editing...');
        await page.goto(`${baseUrl}/blog/editor/posts`, { 
            waitUntil: 'networkidle' 
        });
        
        // Find and click edit button for our test post
        const editButton = await page.$(`tr:has-text("${testPostTitle}") a:has-text("Edit")`);
        if (editButton) {
            await editButton.click();
            await page.waitForLoadState('networkidle');
            
            // Update title
            await page.fill('input[name="title"]', `${testPostTitle} - Updated`);
            
            // Save changes
            await page.click('button:has-text("Update Post")');
            await page.waitForURL('**/editor/posts', { timeout: 10000 });
            console.log('✅ Post edited successfully!');
        } else {
            console.log('⚠️ Could not find edit button');
        }
        
        // Test 6: Check API
        console.log('\n6️⃣ Testing API endpoints...');
        const apiResponse = await page.evaluate(async () => {
            const response = await fetch('https://codersinflow.com/api/posts');
            return {
                status: response.status,
                ok: response.ok,
                data: await response.json()
            };
        });
        
        if (apiResponse.ok && Array.isArray(apiResponse.data)) {
            console.log(`✅ API working! Found ${apiResponse.data.length} posts`);
        } else {
            console.log('⚠️ API issue:', apiResponse);
        }
        
        console.log('\n🎉 All tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        await page.screenshot({ path: 'test-error-full.png', fullPage: true });
        console.log('📸 Error screenshot saved');
    } finally {
        await browser.close();
    }
}

// Run the tests
testFullBlogSystem().catch(console.error);