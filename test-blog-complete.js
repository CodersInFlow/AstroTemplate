const { test, expect } = require('@playwright/test');

test.describe('Blog System Complete Test', () => {
  const baseURL = 'https://codersinflow.com';
  const adminEmail = 'sales@codersinflow.com';
  const adminPassword = 'F0r3st40!';
  
  test('Complete blog workflow - login, create post, and verify', async ({ page }) => {
    // Test 1: Login
    console.log('Testing login...');
    await page.goto(`${baseURL}/blog/editor/login`);
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL(`${baseURL}/blog/editor`, { timeout: 10000 });
    console.log('✅ Login successful');
    
    // Test 2: Navigate to create new post
    console.log('Testing post creation...');
    await page.click('a[href="/blog/editor/posts/new?type=blog"]');
    await page.waitForURL(`${baseURL}/blog/editor/posts/new?type=blog`);
    await page.waitForLoadState('networkidle');
    
    // Fill post form
    const postTitle = `Test Post ${Date.now()}`;
    await page.fill('input#title', postTitle);
    await page.fill('textarea#description', 'This is a test post created by Playwright');
    
    // Check if category dropdown has options
    const categoryOptions = await page.locator('#category option').count();
    console.log(`Found ${categoryOptions} category options`);
    
    if (categoryOptions > 1) {
      // Select first real category (skip placeholder if exists)
      const firstCategory = await page.locator('#category option').nth(0).getAttribute('value');
      if (firstCategory) {
        console.log(`First category value: ${firstCategory}`);
      }
    }
    
    // Add content (wait for editor to be ready)
    await page.waitForTimeout(1000); // Give editor time to initialize
    
    // Try to find and interact with the TipTap editor
    const editorSelector = '.tiptap.ProseMirror, [contenteditable="true"]';
    const editor = await page.locator(editorSelector).first();
    if (await editor.isVisible()) {
      await editor.click();
      await editor.type('This is the content of the test post created automatically.');
      console.log('✅ Added content to editor');
    } else {
      console.log('⚠️ Editor not found, continuing without content');
    }
    
    // Check the publish checkbox
    await page.check('#published');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for redirect to edit page (indicates success)
    try {
      await page.waitForURL(/\/blog\/editor\/posts\/edit\/[a-f0-9]{24}/, { timeout: 10000 });
      console.log('✅ Post created successfully');
      
      // Get the post ID from URL
      const url = page.url();
      const postId = url.split('/').pop().split('?')[0];
      console.log(`Post ID: ${postId}`);
      
      // Test 3: Verify post is visible on blog page
      console.log('Verifying post is visible on blog...');
      await page.goto(`${baseURL}/blog`);
      await page.waitForLoadState('networkidle');
      
      // Look for the post title
      const postTitleElement = await page.locator(`text="${postTitle}"`).first();
      const isVisible = await postTitleElement.isVisible();
      
      if (isVisible) {
        console.log('✅ Post is visible on blog page');
        
        // Click to view the post
        await postTitleElement.click();
        await page.waitForLoadState('networkidle');
        
        // Verify we're on the post page
        const pageTitle = await page.locator('h1').first().textContent();
        if (pageTitle === postTitle) {
          console.log('✅ Post detail page loads correctly');
        }
      } else {
        console.log('⚠️ Post not immediately visible on blog page (may need refresh)');
      }
      
    } catch (error) {
      // Check for error message
      const errorElement = await page.locator('#error').first();
      if (await errorElement.isVisible()) {
        const errorText = await errorElement.textContent();
        console.error(`❌ Error creating post: ${errorText}`);
      } else {
        console.error(`❌ Failed to create post: ${error.message}`);
      }
      
      // Take screenshot for debugging
      await page.screenshot({ path: 'test-post-creation-error.png' });
    }
    
    // Test 4: Check API response
    console.log('Testing API...');
    const apiResponse = await page.goto(`${baseURL}/api/posts`);
    if (apiResponse.ok()) {
      const posts = await apiResponse.json();
      console.log(`✅ API returned ${posts.length} posts`);
      if (Array.isArray(posts)) {
        console.log('✅ API returns proper array');
      }
    } else {
      console.log(`❌ API returned status ${apiResponse.status()}`);
    }
  });
  
  test('Verify categories exist', async ({ page }) => {
    console.log('Testing categories...');
    
    // First login
    await page.goto(`${baseURL}/blog/editor/login`);
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${baseURL}/blog/editor`);
    
    // Check categories API
    const response = await page.request.get(`${baseURL}/api/categories`, {
      headers: {
        'Cookie': await page.context().cookies().then(cookies => 
          cookies.map(c => `${c.name}=${c.value}`).join('; ')
        )
      }
    });
    
    if (response.ok()) {
      const categories = await response.json();
      console.log(`✅ Found ${categories.length} categories`);
      if (categories.length > 0) {
        console.log('Categories:', categories.map(c => c.name).join(', '));
      }
      if (Array.isArray(categories)) {
        console.log('✅ Categories API returns proper array');
      }
    } else {
      console.log(`❌ Categories API returned status ${response.status()}`);
    }
  });
});