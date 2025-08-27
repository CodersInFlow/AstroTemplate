import { chromium } from 'playwright';

async function testRedditAPICall() {
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true  // Open DevTools to see network requests
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const baseURL = 'https://codersinflow.com';
  
  // Listen to all network requests
  page.on('request', request => {
    if (request.url().includes('api/social')) {
      console.log('>>> Social API Request:', request.method(), request.url());
      console.log('>>> Headers:', request.headers());
      console.log('>>> Post Data:', request.postData());
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('api/social')) {
      console.log('<<< Social API Response:', response.status(), response.url());
      response.text().then(body => {
        console.log('<<< Response Body:', body);
      }).catch(() => {});
    }
  });
  
  // Also catch any console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Browser Console Error:', msg.text());
    }
  });
  
  try {
    // 1. Login
    console.log('Step 1: Logging in...');
    await page.goto(`${baseURL}/blog/editor/login`);
    await page.fill('input[type="email"]', 'sales@codersinflow.com');
    await page.fill('input[type="password"]', 'F0r3st40!');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${baseURL}/blog/editor`, { timeout: 10000 });
    console.log('✅ Login successful');
    
    // 2. Navigate to posts
    await page.click('a[href="/blog/editor/posts"]');
    await page.waitForLoadState('networkidle');
    
    // 3. Open first post
    const firstPost = await page.locator('a[href*="/blog/editor/posts/edit/"]').first();
    await firstPost.click();
    await page.waitForLoadState('networkidle');
    console.log('✅ Post edit page loaded');
    
    // 4. Click "Publish to Social Media" button
    console.log('Step 2: Opening social publish interface...');
    const socialButton = await page.locator('button:has-text("Publish to Social Media")');
    await socialButton.click();
    await page.waitForTimeout(1000);
    
    // 5. Select Reddit
    console.log('Step 3: Selecting Reddit...');
    const redditCard = await page.locator('text=Reddit').first();
    await redditCard.click();
    console.log('✅ Reddit selected');
    
    // 6. Fill subreddit
    const subredditField = await page.locator('input[placeholder*="subreddit"]');
    await subredditField.clear();
    await subredditField.fill('test');
    console.log('✅ Filled subreddit: test');
    
    // 7. Click publish button
    console.log('Step 4: Clicking publish button...');
    const publishBtn = await page.locator('button:has-text("Platform")');
    console.log('Button found:', await publishBtn.textContent());
    
    // Wait a moment then click
    await page.waitForTimeout(1000);
    await publishBtn.click();
    console.log('✅ Clicked publish button - watching for API calls...');
    
    // Wait for potential API call
    await page.waitForTimeout(10000);
    
    // Take screenshot
    await page.screenshot({ path: 'reddit-api-test.png', fullPage: true });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'reddit-api-error.png' });
  } finally {
    console.log('Test complete. Check DevTools Network tab for requests.');
    await page.waitForTimeout(10000); // Keep open to inspect
    await browser.close();
  }
}

testRedditAPICall().catch(console.error);