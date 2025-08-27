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
  const userResponse = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      "Cookie": `auth-token=${token.value}`
    }
  });
  if (!userResponse.ok) {
    return Astro2.redirect("/editor/login");
  }
  const user = await userResponse.json();
  if (user.role !== "admin") {
    return Astro2.redirect("/editor");
  }
  const categoriesResponse = await fetch(`${API_URL}/api/categories`, {
    headers: {
      "Cookie": `auth-token=${token.value}`
    }
  });
  const categories = categoriesResponse.ok ? await categoriesResponse.json() : [];
  const blogCategories = categories.filter((c) => c.type === "blog");
  const docsCategories = categories.filter((c) => c.type === "docs");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Categories - Editor" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-900"> <!-- Editor Header --> <header class="bg-gray-800 border-b border-gray-700"> <div class="container mx-auto px-4 py-4"> <div class="flex justify-between items-center"> <h1 class="text-xl font-bold text-white">Manage Categories</h1> <a href="/editor" class="text-gray-400 hover:text-white">
← Back to Dashboard
</a> </div> </div> </header> <!-- Editor Navigation --> <nav class="bg-gray-800 border-b border-gray-700"> <div class="container mx-auto px-4"> <div class="flex gap-6"> <a href="/editor" class="py-3 border-b-2 border-transparent text-gray-400 hover:text-gray-300">Dashboard</a> <a href="/editor/posts" class="py-3 border-b-2 border-transparent text-gray-400 hover:text-gray-300">Posts</a> <a href="/editor/categories" class="py-3 border-b-2 border-blue-500 text-blue-400">Categories</a> ${user.role === "admin" && renderTemplate`<a href="/editor/users" class="py-3 border-b-2 border-transparent text-gray-400 hover:text-gray-300">Users</a>`} </div> </div> </nav> <main class="container mx-auto px-4 py-8 max-w-4xl"> <!-- Create New Category --> <section class="mb-8"> <h2 class="text-2xl font-bold mb-4 text-white">Create New Category</h2> <form id="categoryForm" class="bg-gray-800 rounded-lg p-6 space-y-4"> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label for="name" class="block text-sm font-medium mb-2 text-gray-300">Category Name</label> <input type="text" id="name" name="name" required class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Tutorial"> </div> <div> <label for="type" class="block text-sm font-medium mb-2 text-gray-300">Type</label> <select id="type" name="type" required class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"> <option value="blog">Blog</option> <option value="docs">Documentation</option> </select> </div> </div> <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium text-white transition-colors">
Create Category
</button> <div id="error" class="text-red-400 hidden"></div> <div id="success" class="text-green-400 hidden"></div> </form> </section> <!-- Blog Categories --> <section class="mb-8"> <h2 class="text-2xl font-bold mb-4 text-white">Blog Categories (${blogCategories.length})</h2> <div class="space-y-2"> ${blogCategories.map((category) => renderTemplate`<div class="bg-gray-800 rounded-lg p-4 flex justify-between items-center"> <div> <h3 class="font-medium text-white">${category.name}</h3> <p class="text-sm text-gray-400">Slug: ${category.slug}</p> </div> <button${addAttribute(category.id, "data-category-id")}${addAttribute(category.name, "data-category-name")} class="delete-btn text-red-400 hover:text-red-300 p-2" title="Delete category"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path> </svg> </button> </div>`)} ${blogCategories.length === 0 && renderTemplate`<p class="text-gray-400">No blog categories yet.</p>`} </div> </section> <!-- Documentation Categories --> <section> <h2 class="text-2xl font-bold mb-4 text-white">Documentation Categories (${docsCategories.length})</h2> <div class="space-y-2"> ${docsCategories.map((category) => renderTemplate`<div class="bg-gray-800 rounded-lg p-4 flex justify-between items-center"> <div> <h3 class="font-medium text-white">${category.name}</h3> <p class="text-sm text-gray-400">Slug: ${category.slug}</p> </div> <button${addAttribute(category.id, "data-category-id")}${addAttribute(category.name, "data-category-name")} class="delete-btn text-red-400 hover:text-red-300 p-2" title="Delete category"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path> </svg> </button> </div>`)} ${docsCategories.length === 0 && renderTemplate`<p class="text-gray-400">No documentation categories yet.</p>`} </div> </section> </main> </div> ` })} ${renderScript($$result, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/categories/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/categories/index.astro", void 0);
const $$file = "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/categories/index.astro";
const $$url = "/editor/categories";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
