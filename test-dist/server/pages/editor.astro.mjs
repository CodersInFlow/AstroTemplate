/* empty css                                  */
import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_CDr6vjmS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BjA0HMLQ.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://codersinflow.com");
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const token = Astro2.cookies.get("auth-token");
  if (!token) {
    return Astro2.redirect("/editor/login");
  }
  const API_URL = "https://codersinflow.com";
  const userResponse = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      "Cookie": `auth-token=${token.value}`
    }
  });
  if (!userResponse.ok) {
    return Astro2.redirect("/editor/login");
  }
  const user = await userResponse.json();
  const postsResponse = await fetch(`${API_URL}/api/posts`, {
    headers: {
      "Cookie": `auth-token=${token.value}`
    }
  });
  const postsData = postsResponse.ok ? await postsResponse.json() : null;
  const posts = Array.isArray(postsData) ? postsData : [];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Editor Dashboard" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-900"> <!-- Editor Header --> <header class="bg-gray-800 border-b border-gray-700"> <div class="container mx-auto px-4 py-4"> <div class="flex justify-between items-center"> <h1 class="text-xl font-bold text-white">Content Editor</h1> <div class="flex items-center gap-4"> <span class="text-gray-400">Welcome, ${user.name}</span> <a href="/editor/change-password" class="text-blue-400 hover:text-blue-300">
Change Password
</a> <button id="logoutBtn" class="text-red-400 hover:text-red-300">
Logout
</button> </div> </div> </div> </header> <!-- Editor Navigation --> <nav class="bg-gray-800 border-b border-gray-700"> <div class="container mx-auto px-4"> <div class="flex gap-6"> <a href="/editor" class="py-3 border-b-2 border-blue-500 text-blue-400">Dashboard</a> <a href="/editor/posts" class="py-3 border-b-2 border-transparent text-gray-400 hover:text-gray-300">Posts</a> <a href="/editor/categories" class="py-3 border-b-2 border-transparent text-gray-400 hover:text-gray-300">Categories</a> ${user.role === "admin" && renderTemplate`<a href="/editor/users" class="py-3 border-b-2 border-transparent text-gray-400 hover:text-gray-300">Users</a>`} </div> </div> </nav> <main class="container mx-auto px-4 py-8"> <!-- Quick Actions --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"> <a href="/editor/posts/new?type=blog" class="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition"> <h3 class="font-bold mb-2 text-white">New Blog Post</h3> <p class="text-gray-400 text-sm">Create a new blog article</p> </a> <a href="/editor/posts/new?type=docs" class="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition"> <h3 class="font-bold mb-2 text-white">New Documentation</h3> <p class="text-gray-400 text-sm">Add documentation content</p> </a> <a href="/editor/categories" class="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition"> <h3 class="font-bold mb-2 text-white">Manage Categories</h3> <p class="text-gray-400 text-sm">Organize your content</p> </a> <a href="/editor/media" class="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition"> <h3 class="font-bold mb-2 text-white">Media Library</h3> <p class="text-gray-400 text-sm">Manage uploaded files</p> </a> </div> <!-- Recent Posts --> <section> <h2 class="text-2xl font-bold mb-4 text-white">Recent Posts</h2> <div class="bg-gray-800 rounded-lg overflow-hidden"> <table class="w-full"> <thead class="bg-gray-700"> <tr> <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th> <th class="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th> </tr> </thead> <tbody class="divide-y divide-gray-700"> ${(posts || []).slice(0, 10).map((post) => renderTemplate`<tr class="hover:bg-gray-700"> <td class="px-6 py-4"> <a${addAttribute(`/editor/posts/edit/${post.id}`, "href")} class="text-blue-400 hover:text-blue-300"> ${post.title} </a> </td> <td class="px-6 py-4"> <span${addAttribute(`px-2 py-1 text-xs rounded-full ${post.type === "blog" ? "bg-blue-900 text-blue-300" : "bg-green-900 text-green-300"}`, "class")}> ${post.type} </span> </td> <td class="px-6 py-4 text-gray-400"> ${post.category_data?.name || "Uncategorized"} </td> <td class="px-6 py-4"> <span${addAttribute(`px-2 py-1 text-xs rounded-full ${post.published ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300"}`, "class")}> ${post.published ? "Published" : "Draft"} </span> </td> <td class="px-6 py-4 text-gray-400"> ${new Date(post.createdAt).toLocaleDateString()} </td> <td class="px-6 py-4 text-right"> <a${addAttribute(`/${post.type}/${post.slug}`, "href")} target="_blank" class="text-gray-400 hover:text-white mr-3">
View
</a> <a${addAttribute(`/editor/posts/edit/${post.id}`, "href")} class="text-blue-400 hover:text-blue-300">
Edit
</a> </td> </tr>`)} </tbody> </table> ${(posts || []).length === 0 && renderTemplate`<div class="text-center py-8 text-gray-400">
No posts yet. Create your first post!
</div>`} </div> </section> </main> </div> ` })} ${renderScript($$result, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/index.astro", void 0);
const $$file = "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/index.astro";
const $$url = "/editor";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
