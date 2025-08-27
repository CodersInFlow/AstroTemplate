import { chromium } from '@playwright/test';

async function createBlogPost() {
    console.log('🧪 Testing blog post creation...\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 800 
    });
    
    const context = await browser.newContext({
        ignoreHTTPSErrors: true
    });
    const page = await context.newPage();
    
    const baseUrl = 'https://codersinflow.com';
    const testTitle = `Playwright Test Post ${new Date().toLocaleString()}`;
    const testSlug = `test-post-${Date.now()}`;
    
    try {
        // Step 1: Login
        console.log('1️⃣ Logging in...');
        await page.goto(`${baseUrl}/blog/editor/login`, { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });
        
        await page.fill('input[type="email"]', 'sales@codersinflow.com');
        await page.fill('input[type="password"]', 'F0r3st40!');
        await page.click('button[type="submit"]');
        await page.waitForURL('**/editor', { timeout: 10000 });
        console.log('✅ Logged in successfully\n');
        
        // Step 2: Navigate to new post page
        console.log('2️⃣ Navigating to new post page...');
        
        // Try clicking the "New Blog Post" button
        const newPostButton = await page.$('text=New Blog Post');
        if (newPostButton) {
            await newPostButton.click();
            console.log('Clicked "New Blog Post" button');
        } else {
            // Navigate directly
            await page.goto(`${baseUrl}/blog/editor/posts/new`, {
                waitUntil: 'networkidle',
                timeout: 30000
            });
        }
        
        // Wait for the form to load
        console.log('Waiting for form to load...');
        await page.waitForSelector('input[name="title"]', { timeout: 10000 });
        console.log('✅ New post form loaded\n');
        
        // Step 3: Fill in the post details
        console.log('3️⃣ Filling post details...');
        
        // Title
        await page.fill('input[name="title"]', testTitle);
        console.log(`   Title: ${testTitle}`);
        
        // Slug
        await page.fill('input[name="slug"]', testSlug);
        console.log(`   Slug: ${testSlug}`);
        
        // Wait for editor to be ready
        console.log('   Waiting for editor...');
        const editorSelector = '.ProseMirror';
        await page.waitForSelector(editorSelector, { timeout: 10000 });
        
        // Click in the editor and add content
        await page.click(editorSelector);
        await page.keyboard.type('# This is a test blog post');
        await page.keyboard.press('Enter');
        await page.keyboard.press('Enter');
        await page.keyboard.type('This post was created automatically using **Playwright** testing framework.');
        await page.keyboard.press('Enter');
        await page.keyboard.press('Enter');
        await page.keyboard.type('## Features tested:');
        await page.keyboard.press('Enter');
        await page.keyboard.type('- Login authentication');
        await page.keyboard.press('Enter');
        await page.keyboard.type('- Post creation');
        await page.keyboard.press('Enter');
        await page.keyboard.type('- Rich text editor');
        await page.keyboard.press('Enter');
        await page.keyboard.press('Enter');
        await page.keyboard.type(`Created at: ${new Date().toLocaleString()}`);
        console.log('   Content added');
        
        // Add tags
        const tagsInput = await page.$('input[name="tags"]');
        if (tagsInput) {
            await tagsInput.fill('test, automation, playwright');
            console.log('   Tags: test, automation, playwright');
        }
        
        // Take screenshot before saving
        await page.screenshot({ path: 'test-new-post-filled.png', fullPage: true });
        console.log('📸 Screenshot saved: test-new-post-filled.png\n');
        
        // Step 4: Save the post
        console.log('4️⃣ Saving the post...');
        const saveButton = await page.$('button:has-text("Create Post")');
        if (saveButton) {
            await saveButton.click();
            console.log('   Clicked "Create Post" button');
            
            // Wait for redirect to posts list
            await page.waitForURL('**/editor/posts', { timeout: 10000 });
            console.log('✅ Post created successfully!\n');
            
            // Take screenshot of posts list
            await page.screenshot({ path: 'test-posts-after-create.png', fullPage: true });
            
            // Step 5: Verify post appears in list
            console.log('5️⃣ Verifying post in listing...');
            const postInList = await page.$(`text=${testTitle}`);
            if (postInList) {
                console.log('✅ Post found in listing!\n');
            } else {
                console.log('⚠️ Post not found in listing\n');
            }
            
            // Step 6: View the post on frontend
            console.log('6️⃣ Viewing post on frontend...');
            await page.goto(`${baseUrl}/blog/${testSlug}`, {
                waitUntil: 'networkidle'
            });
            
            // Check if post loads
            const postTitle = await page.$('h1');
            if (postTitle) {
                const titleText = await postTitle.textContent();
                console.log(`✅ Post visible on frontend: "${titleText}"`);
                await page.screenshot({ path: 'test-post-frontend.png', fullPage: true });
                console.log('📸 Frontend screenshot saved\n');
            } else {
                console.log('⚠️ Post not found on frontend\n');
            }
            
            // Step 7: Check blog listing page
            console.log('7️⃣ Checking blog listing page...');
            await page.goto(`${baseUrl}/blog`, {
                waitUntil: 'networkidle'
            });
            
            const postCard = await page.$(`text=${testTitle}`);
            if (postCard) {
                console.log('✅ Post appears in blog listing!');
                await page.screenshot({ path: 'test-blog-listing-with-post.png', fullPage: true });
            } else {
                console.log('⚠️ Post not in blog listing');
            }
            
        } else {
            console.log('❌ Could not find "Create Post" button');
        }
        
        console.log('\n🎉 Blog post creation test completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        await page.screenshot({ path: 'test-create-error.png', fullPage: true });
        console.log('📸 Error screenshot saved');
    } finally {
        await browser.close();
    }
}

createBlogPost().catch(console.error);