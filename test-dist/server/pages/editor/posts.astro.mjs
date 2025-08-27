/* empty css                                     */
import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_CDr6vjmS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BjA0HMLQ.mjs';
export { renderers } from '../../renderers.mjs';

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
  const postsResponse = await fetch(`${API_URL}/api/posts`, {
    headers: {
      "Cookie": `auth-token=${token.value}`
    }
  });
  const postsData = postsResponse.ok ? await postsResponse.json() : null;
  const posts = Array.isArray(postsData) ? postsData : [];
  const blogPosts = posts.filter((p) => p.type === "blog");
  const docsPosts = posts.filter((p) => p.type === "docs");
  if (posts.length > 0) {
    console.log("First post structure:", posts[0]);
    console.log("Post ID:", posts[0].id);
    console.log("Edit URL would be:", `/editor/posts/edit/${posts[0].id}`);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Posts - Editor" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-900"> <!-- Editor Header --> <header class="bg-gray-800 border-b border-gray-700"> <div class="container mx-auto px-4 py-4"> <div class="flex justify-between items-center"> <h1 class="text-xl font-bold text-white">Manage Posts</h1> <div class="flex gap-2"> <a href="/editor/posts/new?type=blog" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm text-white">
New Blog Post
</a> <a href="/editor/posts/new?type=docs" class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm text-white">
New Documentation
</a> </div> </div> </div> </header> <!-- Editor Navigation --> <nav class="bg-gray-800 border-b border-gray-700"> <div class="container mx-auto px-4"> <div class="flex gap-6"> <a href="/editor" class="py-3 border-b-2 border-transparent text-gray-400 hover:text-gray-300">Dashboard</a> <a href="/editor/posts" class="py-3 border-b-2 border-blue-500 text-blue-400">Posts</a> <a href="/editor/categories" class="py-3 border-b-2 border-transparent text-gray-400 hover:text-gray-300">Categories</a> </div> </div> </nav> <main class="container mx-auto px-4 py-8"> <!-- Blog Posts Section --> <section class="mb-8"> <h2 class="text-2xl font-bold mb-4 text-white">Blog Posts (${blogPosts.length})</h2> <div class="bg-gray-800 rounded-lg overflow-hidden"> <table class="w-full"> <thead class="bg-gray-700"> <tr> <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th> <th class="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th> </tr> </thead> <tbody class="divide-y divide-gray-700"> ${blogPosts.map((post) => renderTemplate`<tr class="hover:bg-gray-700"> <td class="px-6 py-4"> <a${addAttribute(`/editor/posts/edit/${post.id}`, "href")} class="text-blue-400 hover:text-blue-300"> ${post.title} </a> </td> <td class="px-6 py-4 text-gray-400"> ${post.category_data?.name || "Uncategorized"} </td> <td class="px-6 py-4"> <span${addAttribute(`px-2 py-1 text-xs rounded-full ${post.published ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300"}`, "class")}> ${post.published ? "Published" : "Draft"} </span> </td> <td class="px-6 py-4 text-gray-400"> ${new Date(post.createdAt).toLocaleDateString()} </td> <td class="px-6 py-4 text-right"> <a${addAttribute(`/blog/${post.slug}`, "href")} target="_blank" class="text-gray-400 hover:text-white mr-3">
View
</a> <a${addAttribute(`/editor/posts/edit/${post.id}`, "href")} class="text-blue-400 hover:text-blue-300 mr-3">
Edit
</a> <button${addAttribute(post.id, "data-post-id")} class="delete-btn text-red-400 hover:text-red-300">
Delete
</button> </td> </tr>`)} </tbody> </table> ${blogPosts.length === 0 && renderTemplate`<div class="text-center py-8 text-gray-400">
No blog posts yet.
</div>`} </div> </section> <!-- Documentation Section --> <section> <h2 class="text-2xl font-bold mb-4 text-white">Documentation (${docsPosts.length})</h2> <div class="bg-gray-800 rounded-lg overflow-hidden"> <table class="w-full"> <thead class="bg-gray-700"> <tr> <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th> <th class="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th> </tr> </thead> <tbody class="divide-y divide-gray-700"> ${docsPosts.map((post) => renderTemplate`<tr class="hover:bg-gray-700"> <td class="px-6 py-4"> <a${addAttribute(`/editor/posts/edit/${post.id}`, "href")} class="text-blue-400 hover:text-blue-300"> ${post.title} </a> </td> <td class="px-6 py-4 text-gray-400"> ${post.category_data?.name || "Uncategorized"} </td> <td class="px-6 py-4"> <span${addAttribute(`px-2 py-1 text-xs rounded-full ${post.published ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300"}`, "class")}> ${post.published ? "Published" : "Draft"} </span> </td> <td class="px-6 py-4 text-gray-400"> ${new Date(post.createdAt).toLocaleDateString()} </td> <td class="px-6 py-4 text-right"> <a${addAttribute(`/docs/${post.slug}`, "href")} target="_blank" class="text-gray-400 hover:text-white mr-3">
View
</a> <a${addAttribute(`/editor/posts/edit/${post.id}`, "href")} class="text-blue-400 hover:text-blue-300 mr-3">
Edit
</a> <button${addAttribute(post.id, "data-post-id")} class="delete-btn text-red-400 hover:text-red-300">
Delete
</button> </td> </tr>`)} </tbody> </table> ${docsPosts.length === 0 && renderTemplate`<div class="text-center py-8 text-gray-400">
No documentation yet.
</div>`} </div> </section> </main> </div> ` })} ${renderScript($$result, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/posts/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/posts/index.astro", void 0);
const $$file = "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/posts/index.astro";
const $$url = "/editor/posts";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
