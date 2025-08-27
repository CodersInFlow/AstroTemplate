import fetch from 'node-fetch';

async function testRedditPost() {
  try {
    // First login to get session
    const loginResp = await fetch('https://codersinflow.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'sales@codersinflow.com',
        password: 'F0r3st40!'
      })
    });
    
    if (!loginResp.ok) {
      console.error('Login failed:', loginResp.status);
      return;
    }
    
    const cookies = loginResp.headers.get('set-cookie');
    console.log('✅ Logged in successfully');
    
    // Get first post
    const postsResp = await fetch('https://codersinflow.com/api/posts?limit=1', {
      headers: { 'Cookie': cookies }
    });
    
    const posts = await postsResp.json();
    if (!posts || posts.length === 0) {
      console.error('No posts found');
      return;
    }
    
    const post = posts[0];
    console.log(`📝 Using post: ${post.title}`);
    
    // Test Reddit posting
    const publishResp = await fetch('https://codersinflow.com/api/social/publish', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
      body: JSON.stringify({
        postId: post._id,
        platforms: [{
          platform: 'reddit',
          message: `Test: ${post.title}`,
          subreddit: 'test',
          useImage: false
        }]
      })
    });
    
    const result = await publishResp.json();
    console.log('Result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testRedditPost();
