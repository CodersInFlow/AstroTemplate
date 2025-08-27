import { chromium } from 'playwright';

async function testRedditPublishFull() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const baseURL = 'https://codersinflow.com';
  
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
    console.log('Step 2: Navigating to posts...');
    await page.click('a[href="/blog/editor/posts"]');
    await page.waitForLoadState('networkidle');
    
    // 3. Click on the first post to edit
    console.log('Step 3: Opening a post for editing...');
    const firstPost = await page.locator('a[href*="/blog/editor/posts/edit/"]').first();
    if (await firstPost.isVisible()) {
      await firstPost.click();
      await page.waitForLoadState('networkidle');
      console.log('✅ Post edit page loaded');
      
      // 4. Look for the "Publish to Social Media" button
      console.log('Step 4: Looking for Publish to Social Media button...');
      const socialButton = await page.locator('button:has-text("Publish to Social Media")');
      
      if (await socialButton.isVisible()) {
        console.log('✅ Found "Publish to Social Media" button!');
        await socialButton.click();
        await page.waitForTimeout(1000);
        
        // 5. Click on Reddit platform
        console.log('Step 5: Selecting Reddit platform...');
        const redditCard = await page.locator('text=Reddit').first();
        if (await redditCard.isVisible()) {
          await redditCard.click();
          console.log('✅ Reddit platform selected');
          
          // 6. Check if subreddit field appears
          await page.waitForTimeout(500);
          const subredditField = await page.locator('input[placeholder*="subreddit"]');
          if (await subredditField.isVisible()) {
            console.log('✅ Subreddit field found');
            // Fill in a test subreddit (r/test is a real testing subreddit)
            await subredditField.clear();
            await subredditField.fill('test');
            console.log('✅ Filled subreddit: test');
          }
          
          // 7. Look for and click the "Publish to X Platforms" button
          console.log('Step 6: Looking for publish button...');
          const publishBtn = await page.locator('button:has-text("Platform")');
          if (await publishBtn.isVisible()) {
            const buttonText = await publishBtn.textContent();
            console.log(`✅ Found publish button: "${buttonText}"`);
            
            // Click to publish
            await publishBtn.click();
            console.log('✅ Clicked publish button');
            
            // Wait for any response (give it more time for API call)
            await page.waitForTimeout(5000);
            
            // Check for success or error messages
            const successMsg = await page.locator('text=successfully').first();
            const errorMsg = await page.locator('text=error').first();
            
            if (await successMsg.isVisible()) {
              console.log('✅ SUCCESS: Post published to Reddit!');
            } else if (await errorMsg.isVisible()) {
              const error = await errorMsg.textContent();
              console.log(`⚠️ Error occurred: ${error}`);
            } else {
              console.log('⚠️ No clear success/error message found');
            }
          } else {
            console.log('❌ Publish button not found');
          }
        } else {
          console.log('❌ Reddit platform not found');
        }
      } else {
        console.log('❌ "Publish to Social Media" button not found');
      }
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'reddit-publish-complete.png', fullPage: true });
    console.log('📸 Final screenshot saved');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'reddit-publish-error.png' });
  } finally {
    await page.waitForTimeout(5000); // Keep browser open to see result
    await browser.close();
  }
}

testRedditPublishFull().catch(console.error);