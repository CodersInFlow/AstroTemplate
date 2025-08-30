export const prerender = false;

export async function GET({ params, request }: { params: { slug: string }, request: Request }) {
  const database = request.headers.get('X-Site-Database') || 'codersinflow';
  
  const response = await fetch(`http://127.0.0.1:3001/api/posts/${params.slug}`, {
    method: 'GET',
    headers: {
      'X-Site-Database': database
    }
  });
  
  return new Response(await response.text(), {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/json'
    }
  });
}