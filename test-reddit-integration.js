const { chromium } = require('playwright');

async function testRedditIntegration() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const baseURL = 'https://codersinflow.com';
  const adminEmail = 'sales@codersinflow.com';
  const adminPassword = 'F0r3st40!';
  
  try {
    // 1. Login
    console.log('Step 1: Logging in...');
    await page.goto(`${baseURL}/blog/editor/login`);
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');
    
    await page.waitForURL(`${baseURL}/blog/editor`, { timeout: 10000 });
    console.log('✅ Login successful');
    
    // 2. Navigate to Settings
    console.log('Step 2: Navigating to settings...');
    // Click on the Settings link which should be for the current user
    await page.click('a[href*="/blog/editor/users/edit/"]');
    await page.waitForLoadState('networkidle');
    console.log('✅ Settings page loaded');
    
    // 3. Fill Reddit credentials
    console.log('Step 3: Filling Reddit credentials...');
    await page.fill('input[name="reddit_client_id"]', 'vJoEjrgHICVCqis0zJZO3A');
    await page.fill('input[name="reddit_client_secret"]', 'dzYeNzZQl1GBeoLXMzQqv0_YXn--Gg');
    await page.fill('input[name="reddit_username"]', 'darkflowsdotcom');
    await page.fill('input[name="reddit_password"]', 'wostY1-sagpet-wiwqir');
    await page.fill('input[name="reddit_subreddits"]', 'darkflows,codersinflow,freeiacoding');
    console.log('✅ Reddit credentials filled');
    
    // 4. Test Reddit connection
    console.log('Step 4: Testing Reddit connection...');
    const redditTestButton = await page.locator('button.test-connection[data-platform="reddit"]');
    if (await redditTestButton.isVisible()) {
      await redditTestButton.click();
      // Wait for the test to complete
      await page.waitForTimeout(3000);
      console.log('✅ Reddit connection test clicked');
    }
    
    // 5. Save settings
    console.log('Step 5: Saving settings...');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    console.log('✅ Settings saved');
    
    // 6. Create new post
    console.log('Step 6: Creating new blog post...');
    await page.goto(`${baseURL}/blog/editor/posts/new?type=blog`);
    await page.waitForLoadState('networkidle');
    
    const postTitle = `Test Reddit Post ${Date.now()}`;
    await page.fill('input#title', postTitle);
    await page.fill('textarea#description', 'Testing Reddit integration with CodersinFlow blog system');
    
    // Add content to editor
    const editorSelector = '.tiptap.ProseMirror, [contenteditable="true"]';
    const editor = await page.locator(editorSelector).first();
    if (await editor.isVisible()) {
      await editor.click();
      await editor.type('This is a test post to verify Reddit integration. CodersinFlow is an amazing AI-powered code editor!');
    }
    
    // Check published
    await page.check('#published');
    
    // Submit the post
    await page.click('button[type="submit"]');
    
    // Wait for redirect to edit page
    await page.waitForURL(/\/blog\/editor\/posts\/edit\/[a-f0-9]{24}/, { timeout: 10000 });
    console.log('✅ Post created successfully');
    
    // 7. Look for social publishing options
    console.log('Step 7: Looking for social publishing options...');
    
    // Check if there's a social publish button
    const socialButtons = [
      'button:has-text("Share")',
      'button:has-text("Publish to Social")',
      'button:has-text("Reddit")',
      '[data-social-publish]'
    ];
    
    let found = false;
    for (const selector of socialButtons) {
      if (await page.locator(selector).isVisible()) {
        console.log(`Found social button: ${selector}`);
        await page.click(selector);
        found = true;
        break;
      }
    }
    
    if (!found) {
      console.log('⚠️ No social publishing buttons found in the UI');
      console.log('This feature may need to be implemented or exposed in the UI');
    }
    
    // Take a screenshot of the final state
    await page.screenshot({ path: 'reddit-integration-test.png', fullPage: true });
    console.log('📸 Screenshot saved as reddit-integration-test.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'reddit-integration-error.png' });
  } finally {
    await browser.close();
  }
}

testRedditIntegration().catch(console.error);