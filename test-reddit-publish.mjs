import { chromium } from 'playwright';

async function testRedditPublish() {
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
        
        // 5. Click the button
        await socialButton.click();
        console.log('✅ Clicked social media button');
        
        // 6. Wait for modal to appear
        await page.waitForTimeout(1000);
        
        // 7. Check if modal opened
        const modalTitle = await page.locator('h2:has-text("Share to Social Media")');
        if (await modalTitle.isVisible()) {
          console.log('✅ Social media modal opened successfully!');
          
          // 8. Look for Reddit option
          const redditOption = await page.locator('text=Reddit');
          if (await redditOption.isVisible()) {
            console.log('✅ Reddit option is available in the modal');
            
            // Select Reddit
            await redditOption.click();
            console.log('✅ Selected Reddit platform');
            
            // Look for publish button in modal
            const publishBtn = await page.locator('button:has-text("Publish")');
            if (await publishBtn.isVisible()) {
              console.log('✅ Publish button found in modal');
              // Could click it here to actually publish
            }
          }
        } else {
          console.log('⚠️ Modal did not open');
        }
      } else {
        console.log('❌ "Publish to Social Media" button not found');
      }
    } else {
      console.log('❌ No posts found to edit');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'reddit-publish-test.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'reddit-publish-error.png' });
  } finally {
    await page.waitForTimeout(3000); // Keep browser open to see result
    await browser.close();
  }
}

testRedditPublish().catch(console.error);