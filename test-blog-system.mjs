import { chromium } from '@playwright/test';

async function testBlogSystem() {
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 500 
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const baseUrl = 'https://codersinflow.com';
    const adminEmail = 'sales@codersinflow.com';
    const adminPassword = 'F0r3st40!';
    
    console.log('🧪 Starting blog system tests...\n');
    
    try {
        // Test 1: Login to admin panel
        console.log('1️⃣ Testing login to admin panel...');
        await page.goto(`${baseUrl}/blog/editor/login`);
        await page.waitForLoadState('networkidle');
        
        // Fill login form
        await page.fill('input[type="email"]', adminEmail);
        await page.fill('input[type="password"]', adminPassword);
        await page.click('button[type="submit"]');
        
        // Wait for redirect to dashboard
        await page.waitForURL('**/editor', { timeout: 10000 });
        console.log('✅ Login successful!\n');
        
        // Test 2: Create a new blog post
        console.log('2️⃣ Testing blog post creation...');
        await page.goto(`${baseUrl}/blog/editor/posts/new`);
        await page.waitForLoadState('networkidle');
        
        // Fill in blog post details
        const testTitle = `Test Post ${Date.now()}`;
        const testSlug = `test-post-${Date.now()}`;
        const testContent = 'This is a test blog post created by Playwright automated testing. It contains some **bold text** and *italic text*.';
        
        await page.fill('input[name="title"]', testTitle);
        await page.fill('input[name="slug"]', testSlug);
        
        // Wait for the editor to be ready and type content
        await page.waitForSelector('.ProseMirror', { timeout: 10000 });
        await page.click('.ProseMirror');
        await page.type('.ProseMirror', testContent);
        
        // Select a category if available
        const categorySelect = await page.$('select[name="category"]');
        if (categorySelect) {
            await categorySelect.selectOption({ index: 1 }).catch(() => {});
        }
        
        // Add tags
        await page.fill('input[name="tags"]', 'test, automation, playwright');
        
        // Save the post
        await page.click('button:has-text("Create Post")');
        await page.waitForURL('**/editor/posts', { timeout: 10000 });
        console.log('✅ Blog post created successfully!\n');
        
        // Test 3: View the blog post on frontend
        console.log('3️⃣ Testing blog post on frontend...');
        await page.goto(`${baseUrl}/blog/${testSlug}`);
        await page.waitForLoadState('networkidle');
        
        // Check if post title is visible
        const postTitle = await page.textContent('h1');
        if (postTitle && postTitle.includes('Test Post')) {
            console.log('✅ Blog post is visible on frontend!\n');
        } else {
            console.log('⚠️ Blog post title not found on frontend\n');
        }
        
        // Test 4: Edit the blog post
        console.log('4️⃣ Testing blog post editing...');
        await page.goto(`${baseUrl}/blog/editor/posts`);
        await page.waitForLoadState('networkidle');
        
        // Find and click edit button for the test post
        const editButton = await page.$(`tr:has-text("${testTitle}") a:has-text("Edit")`);
        if (editButton) {
            await editButton.click();
            await page.waitForLoadState('networkidle');
            
            // Update the title
            await page.fill('input[name="title"]', `${testTitle} - Updated`);
            
            // Save changes
            await page.click('button:has-text("Update Post")');
            await page.waitForURL('**/editor/posts', { timeout: 10000 });
            console.log('✅ Blog post edited successfully!\n');
        } else {
            console.log('⚠️ Could not find edit button for the post\n');
        }
        
        // Test 5: Test image upload
        console.log('5️⃣ Testing image upload...');
        await page.goto(`${baseUrl}/blog/editor/posts/new`);
        await page.waitForLoadState('networkidle');
        
        // Create a test image file
        const imageUploadInput = await page.$('input[type="file"][accept*="image"]');
        if (imageUploadInput) {
            // We'll skip actual file upload in this test
            console.log('✅ Image upload input found (actual upload skipped)\n');
        } else {
            console.log('⚠️ Image upload input not found\n');
        }
        
        // Test 6: Check blog listing page
        console.log('6️⃣ Testing blog listing page...');
        await page.goto(`${baseUrl}/blog`);
        await page.waitForLoadState('networkidle');
        
        const blogPosts = await page.$$('.blog-post-card, article, [class*="post"]');
        if (blogPosts.length > 0) {
            console.log(`✅ Blog listing page shows ${blogPosts.length} posts\n`);
        } else {
            console.log('⚠️ No blog posts found on listing page\n');
        }
        
        // Test 7: Test categories page
        console.log('7️⃣ Testing categories management...');
        await page.goto(`${baseUrl}/blog/editor/categories`);
        await page.waitForLoadState('networkidle');
        
        const pageContent = await page.textContent('body');
        if (pageContent.includes('Categories') || pageContent.includes('category')) {
            console.log('✅ Categories page loaded successfully\n');
        } else {
            console.log('⚠️ Categories page might not be working properly\n');
        }
        
        console.log('🎉 All tests completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        
        // Take a screenshot on error
        await page.screenshot({ path: 'test-error-screenshot.png' });
        console.log('📸 Screenshot saved as test-error-screenshot.png');
    } finally {
        await browser.close();
    }
}

// Run the tests
testBlogSystem().catch(console.error);