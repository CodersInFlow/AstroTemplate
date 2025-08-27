import fetch from 'node-fetch';

async function testMultiReddit() {
  console.log('Testing multi-subreddit posting...\n');
  
  const clientId = 'vJoEjrgHICVCqis0zJZO3A';
  const clientSecret = 'dzYeNzZQl1GBeoLXMzQqv0_YXn--Gg';
  const username = 'darkflowsdotcom';
  const password = 'wostY1-sagpet-wiwqir';
  
  const subreddits = ['test']; // Testing with r/test for safety
  const postTitle = 'CodersinFlow Blog System - Multi-Subreddit Test';
  const postUrl = 'https://codersinflow.com/blog';
  
  try {
    // Get access token
    console.log('1. Getting Reddit access token...');
    const authResp = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'CodersinFlow:v1.0.0 (by /u/darkflowsdotcom)'
      },
      body: 'grant_type=password&username=' + username + '&password=' + password
    });
    
    const token = await authResp.json();
    if (!token.access_token) {
      console.error('Failed to get access token');
      return;
    }
    console.log('✅ Got access token\n');
    
    // Post to each subreddit
    console.log('2. Posting to subreddits...');
    for (const subreddit of subreddits) {
      const cleanSub = subreddit.replace(/^r\//, '').replace(/^\/r\//, '').trim();
      console.log(`\n  Posting to r/${cleanSub}...`);
      
      const postData = new URLSearchParams({
        api_type: 'json',
        sr: cleanSub,
        kind: 'link',
        title: postTitle,
        url: postUrl
      });
      
      const postResp = await fetch('https://oauth.reddit.com/api/submit', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token.access_token,
          'User-Agent': 'CodersinFlow:v1.0.0 (by /u/darkflowsdotcom)',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: postData.toString()
      });
      
      const result = await postResp.json();
      
      if (result.json && result.json.data && result.json.data.url) {
        console.log(`  ✅ Posted to r/${cleanSub}`);
        console.log(`  URL: ${result.json.data.url}`);
      } else if (result.json && result.json.errors && result.json.errors.length > 0) {
        console.error(`  ❌ Failed to post to r/${cleanSub}:`, result.json.errors);
      }
    }
    
    console.log('\n✅ Multi-subreddit posting test complete!');
    console.log('\nNOTE: When posting from the blog editor:');
    console.log('- Posts will be link posts (showing preview with cover image)');
    console.log('- Multiple subreddits can be entered comma-separated');
    console.log('- Works with or without r/ prefix');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testMultiReddit();
