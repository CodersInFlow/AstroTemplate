/* empty css                                  */
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_CDr6vjmS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BjA0HMLQ.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://codersinflow.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const API_URL = "https://codersinflow.com";
  const currentCategory = Astro2.url.searchParams.get("category");
  const postsUrl = currentCategory ? `${API_URL}/api/posts?type=blog&category=${currentCategory}` : `${API_URL}/api/posts?type=blog`;
  const response = await fetch(postsUrl);
  const posts = response.ok ? await response.json() : [];
  const categoryResponse = await fetch(`${API_URL}/api/categories?type=blog`);
  const categories = categoryResponse.ok ? await categoryResponse.json() : [];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Blog" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8 max-w-7xl"> <div class="mb-8"> <h1 class="text-4xl font-bold mb-4">Blog</h1> <!-- Category Filter --> <div class="flex gap-2 flex-wrap"> <a href="/blog"${addAttribute(`px-4 py-2 rounded-full transition ${!currentCategory ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"}`, "class")}>
All
</a> ${categories.map((category) => renderTemplate`<a${addAttribute(`/blog?category=${category.slug}`, "href")}${addAttribute(`px-4 py-2 rounded-full transition ${currentCategory === category.slug ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"}`, "class")}> ${category.name} </a>`)} </div> </div> <!-- Blog Posts Grid --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${posts.map((post) => renderTemplate`<article class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"> ${post.image && renderTemplate`<img${addAttribute(post.image, "src")}${addAttribute(post.title, "alt")} class="w-full h-48 object-cover">`} <div class="p-6"> <h2 class="text-xl font-semibold mb-2"> <a${addAttribute(`/blog/${post.slug}`, "href")} class="hover:text-blue-600 transition"> ${post.title} </a> </h2> <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3"> ${post.excerpt || post.description} </p> <div class="flex justify-between items-center text-sm text-gray-500"> <span>${new Date(post.publishDate || post.created_at).toLocaleDateString()}</span> ${post.category_data && renderTemplate`<span class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"> ${post.category_data.name} </span>`} </div> </div> </article>`)} </div> ${posts.length === 0 && renderTemplate`<div class="text-center py-12 text-gray-500"> <p>No blog posts found.</p> </div>`} </main> ` })}`;
}, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/blog/index.astro", void 0);
const $$file = "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/blog/index.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
