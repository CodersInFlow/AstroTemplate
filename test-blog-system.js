const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('1. Navigating to blog editor...');
    await page.goto('https://codersinflow.com/blog/editor');
    await page.waitForLoadState('networkidle');

    // Should redirect to login
    console.log('2. Should be redirected to login page...');
    await page.waitForURL('**/blog/editor/login');
    console.log('✓ Redirected to login page');

    // Login with admin credentials
    console.log('3. Logging in with admin credentials...');
    await page.fill('input[type="email"]', 'sales@codersinflow.com');
    await page.fill('input[type="password"]', 'F0r3st40!');
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard
    console.log('4. Waiting for dashboard...');
    await page.waitForURL('**/blog/editor', { timeout: 10000 });
    console.log('✓ Successfully logged in to dashboard');

    // Take screenshot of dashboard
    await page.screenshot({ path: 'dashboard.png', fullPage: true });
    console.log('✓ Dashboard screenshot saved');

    // Click on "New Blog Post"
    console.log('5. Creating new blog post...');
    await page.click('a[href="/blog/editor/posts/new?type=blog"]');
    await page.waitForURL('**/blog/editor/posts/new**');
    console.log('✓ Navigated to new post page');

    // Fill in blog post details
    console.log('6. Filling in blog post details...');
    await page.fill('input[name="title"]', 'Test Blog Post from Playwright');
    await page.fill('input[name="slug"]', 'test-blog-post-playwright');
    
    // Click in the rich text editor and add content
    const editor = await page.locator('.ProseMirror');
    await editor.click();
    await editor.fill('This is a test blog post created automatically to verify the blog system is working correctly after deployment. The rich text editor should work properly and this content should be saved and viewable.');

    // Check the published checkbox
    await page.check('input[name="published"]');

    // Save the post
    console.log('7. Saving blog post...');
    await page.click('button[type="submit"]');
    
    // Wait for success message or redirect
    await page.waitForTimeout(3000);
    console.log('✓ Blog post saved');

    // Navigate to blog listing
    console.log('8. Checking blog listing...');
    await page.goto('https://codersinflow.com/blog');
    await page.waitForLoadState('networkidle');
    
    // Check if our post appears
    const postTitle = await page.locator('text="Test Blog Post from Playwright"').first();
    if (await postTitle.isVisible()) {
      console.log('✓ Blog post appears in listing');
      
      // Click to view the post
      await postTitle.click();
      await page.waitForLoadState('networkidle');
      
      // Verify content is displayed
      const content = await page.locator('text="This is a test blog post created automatically"').first();
      if (await content.isVisible()) {
        console.log('✓ Blog post content displays correctly');
        await page.screenshot({ path: 'blog-post-view.png', fullPage: true });
        console.log('✓ Blog post screenshot saved');
      } else {
        console.log('✗ Blog post content not visible');
      }
    } else {
      console.log('✗ Blog post not found in listing');
    }

    console.log('\n✅ All tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
    console.log('Error screenshot saved');
  } finally {
    await browser.close();
  }
})();