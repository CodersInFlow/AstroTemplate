import fetch from 'node-fetch';

async function testReddit() {
  console.log('Testing Reddit posting...\n');
  
  // Test direct Reddit API with the credentials
  const clientId = 'vJoEjrgHICVCqis0zJZO3A';
  const clientSecret = 'dzYeNzZQl1GBeoLXMzQqv0_YXn--Gg';
  const username = 'darkflowsdotcom';
  const password = 'wostY1-sagpet-wiwqir';
  
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
    console.log('Token response:', token);
    
    if (!token.access_token) {
      console.error('Failed to get access token');
      return;
    }
    
    console.log('✅ Got access token\n');
    
    // Test posting
    console.log('2. Testing post to r/test...');
    const postData = new URLSearchParams({
      api_type: 'json',
      sr: 'test',
      kind: 'link',
      title: 'Test Post from CodersinFlow Blog System',
      url: 'https://codersinflow.com/blog'
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
    console.log('Post result:', JSON.stringify(result, null, 2));
    
    if (result.json && result.json.data && result.json.data.url) {
      console.log('\n✅ Successfully posted to Reddit!');
      console.log('Post URL:', result.json.data.url);
    } else if (result.json && result.json.errors) {
      console.error('\n❌ Reddit API errors:', result.json.errors);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testReddit();
