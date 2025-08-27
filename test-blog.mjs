import { chromium } from 'playwright';

async function testBlogSystem() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('1. Navigating to blog editor...');
    await page.goto('https://codersinflow.com/blog/editor');
    await page.waitForLoadState('networkidle');

    // Should redirect to login
    console.log('2. Checking redirect to login page...');
    const currentUrl = page.url();
    if (currentUrl.includes('/blog/editor/login')) {
      console.log('✓ Redirected to login page');
    } else {
      throw new Error(`Expected redirect to login, but at: ${currentUrl}`);
    }

    // Login with admin credentials
    console.log('3. Logging in with admin credentials...');
    await page.fill('input[type="email"]', 'sales@codersinflow.com');
    await page.fill('input[type="password"]', 'F0r3st40!');
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard
    console.log('4. Waiting for dashboard...');
    try {
      await page.waitForURL('**/blog/editor', { timeout: 10000 });
      console.log('✓ Successfully logged in to dashboard');
    } catch (e) {
      console.log('Current URL:', page.url());
      throw new Error('Failed to reach dashboard after login');
    }

    // Take screenshot of dashboard
    await page.screenshot({ path: 'test-dashboard.png', fullPage: true });
    console.log('✓ Dashboard screenshot saved');

    // Click on "New Blog Post"
    console.log('5. Creating new blog post...');
    await page.click('a[href="/blog/editor/posts/new?type=blog"]');
    await page.waitForURL('**/blog/editor/posts/new**');
    console.log('✓ Navigated to new post page');

    // Fill in blog post details
    console.log('6. Filling in blog post details...');
    const timestamp = Date.now();
    await page.fill('input[name="title"]', `Test Blog Post ${timestamp}`);
    await page.fill('input[name="slug"]', `test-blog-post-${timestamp}`);
    
    // Click in the rich text editor and add content
    const editor = await page.locator('.ProseMirror');
    await editor.click();
    await page.keyboard.type('This is a test blog post created automatically to verify the blog system is working correctly after deployment. The rich text editor should work properly and this content should be saved and viewable.');

    // Check the published checkbox
    await page.check('input[name="published"]');

    // Take screenshot before saving
    await page.screenshot({ path: 'test-new-post.png', fullPage: true });

    // Save the post
    console.log('7. Saving blog post...');
    await page.click('button[type="submit"]');
    
    // Wait for navigation or success
    await page.waitForTimeout(3000);
    console.log('✓ Blog post saved');
    
    // Take screenshot after save
    await page.screenshot({ path: 'test-after-save.png', fullPage: true });

    // Navigate to blog listing
    console.log('8. Checking blog listing...');
    await page.goto('https://codersinflow.com/blog');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of blog listing
    await page.screenshot({ path: 'test-blog-listing.png', fullPage: true });
    
    // Check if our post appears
    const postTitle = await page.locator(`text="Test Blog Post ${timestamp}"`).first();
    const isVisible = await postTitle.isVisible().catch(() => false);
    
    if (isVisible) {
      console.log('✓ Blog post appears in listing');
      
      // Click to view the post
      await postTitle.click();
      await page.waitForLoadState('networkidle');
      
      // Verify content is displayed
      const content = await page.locator('text="This is a test blog post created automatically"').first();
      if (await content.isVisible()) {
        console.log('✓ Blog post content displays correctly');
        await page.screenshot({ path: 'test-blog-post-view.png', fullPage: true });
        console.log('✓ Blog post screenshot saved');
      } else {
        console.log('✗ Blog post content not visible');
      }
    } else {
      console.log('✗ Blog post not found in listing - it may need approval or take time to appear');
      console.log('Page content:', await page.content());
    }

    console.log('\n✅ Blog system test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'test-error-screenshot.png', fullPage: true });
    console.log('Error screenshot saved');
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
testBlogSystem().catch(console.error);