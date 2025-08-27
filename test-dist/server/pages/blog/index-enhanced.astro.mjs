/* empty css                                     */
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_CDr6vjmS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BjA0HMLQ.mjs';
import { $ as $$HeaderSimple } from '../../chunks/HeaderSimple_snQXYYaq.mjs';
/* empty css                                             */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://codersinflow.com");
const $$IndexEnhanced = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$IndexEnhanced;
  const currentCategory = Astro2.url.searchParams.get("category");
  const API_URL = "https://codersinflow.com";
  const postsUrl = currentCategory ? `${API_URL}/api/posts?type=blog&category=${currentCategory}` : `${API_URL}/api/posts?type=blog`;
  const response = await fetch(postsUrl);
  const allPosts = response.ok ? await response.json() : [];
  const categoryResponse = await fetch(`${API_URL}/api/categories?type=blog`);
  const categories = categoryResponse.ok ? await categoryResponse.json() : [];
  const featuredPosts = allPosts.filter(
    (post) => post.category_data?.name === "Featured" && !currentCategory
  );
  const regularPosts = allPosts.filter(
    (post) => post.category_data?.name !== "Featured"
  );
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Blog - Coders Website", "data-astro-cid-jfffisa6": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "HeaderSimple", $$HeaderSimple, { "data-astro-cid-jfffisa6": true })} ${maybeRenderHead()}<main class="container mx-auto px-4 py-8 max-w-7xl pt-20" data-astro-cid-jfffisa6> <div class="mb-8" data-astro-cid-jfffisa6> <h1 class="text-4xl font-bold mb-6" data-astro-cid-jfffisa6>Blog</h1> <!-- Category Filter --> <div class="flex gap-2 flex-wrap" data-astro-cid-jfffisa6> <a href="/blog"${addAttribute(`px-4 py-2 rounded-full transition ${!currentCategory ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"}`, "class")} data-astro-cid-jfffisa6>
All
</a> ${categories.map((category) => renderTemplate`<a${addAttribute(`/blog?category=${category.slug}`, "href")}${addAttribute(`px-4 py-2 rounded-full transition ${currentCategory === category.slug ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"}`, "class")} data-astro-cid-jfffisa6> ${category.name} </a>`)} </div> </div> <!-- Featured Posts (only show on main page) --> ${featuredPosts.length > 0 && !currentCategory && renderTemplate`<section class="mb-12" data-astro-cid-jfffisa6> <h2 class="text-2xl font-bold mb-6 text-gray-200" data-astro-cid-jfffisa6>Featured</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-astro-cid-jfffisa6> ${featuredPosts.slice(0, 2).map((post) => renderTemplate`<article class="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-700" data-astro-cid-jfffisa6> ${post.coverImage && renderTemplate`<div class="relative h-64 overflow-hidden" data-astro-cid-jfffisa6> <img${addAttribute(post.coverImage, "src")}${addAttribute(post.title, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-astro-cid-jfffisa6> <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" data-astro-cid-jfffisa6></div> </div>`} <div class="p-8" data-astro-cid-jfffisa6> <div class="flex items-center gap-2 text-sm text-gray-400 mb-3" data-astro-cid-jfffisa6> <span class="text-blue-400" data-astro-cid-jfffisa6>${post.category_data?.name || "Uncategorized"}</span> <span data-astro-cid-jfffisa6>•</span> <span data-astro-cid-jfffisa6>${new Date(post.createdAt).toLocaleDateString()}</span> <span data-astro-cid-jfffisa6>•</span> <span data-astro-cid-jfffisa6>${post.readingTime} min read</span> </div> <h3 class="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors" data-astro-cid-jfffisa6> <a${addAttribute(`/blog/${post.slug}`, "href")} class="hover:underline" data-astro-cid-jfffisa6> ${post.title} </a> </h3> <p class="text-gray-300 mb-6 line-clamp-3" data-astro-cid-jfffisa6> ${post.description} </p> <div class="flex items-center justify-between" data-astro-cid-jfffisa6> <div class="flex items-center gap-3" data-astro-cid-jfffisa6> <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-medium" data-astro-cid-jfffisa6> ${post.author_data?.name?.[0]?.toUpperCase() || "A"} </div> <div data-astro-cid-jfffisa6> <div class="font-medium" data-astro-cid-jfffisa6>${post.author_data?.name || "Anonymous"}</div> <div class="text-sm text-gray-400" data-astro-cid-jfffisa6>${post.author_data?.email || ""}</div> </div> </div> <a${addAttribute(`/blog/${post.slug}`, "href")} class="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 group/link" data-astro-cid-jfffisa6>
Read more
<span class="group-hover/link:translate-x-1 transition-transform" data-astro-cid-jfffisa6>→</span> </a> </div> </div> </article>`)} </div> </section>`} <!-- Regular Posts --> <section data-astro-cid-jfffisa6> ${!currentCategory && featuredPosts.length > 0 && renderTemplate`<h2 class="text-2xl font-bold mb-6 text-gray-200" data-astro-cid-jfffisa6>Recent Posts</h2>`} <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-astro-cid-jfffisa6> ${regularPosts.map((post) => renderTemplate`<article class="group bg-gray-900 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-800 hover:border-gray-700" data-astro-cid-jfffisa6> ${post.coverImage && renderTemplate`<div class="relative h-48 overflow-hidden" data-astro-cid-jfffisa6> <img${addAttribute(post.coverImage, "src")}${addAttribute(post.title, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-astro-cid-jfffisa6> </div>`} <div class="p-6" data-astro-cid-jfffisa6> <div class="flex items-center gap-2 text-sm text-gray-400 mb-2" data-astro-cid-jfffisa6> <span class="text-blue-400" data-astro-cid-jfffisa6>${post.category_data?.name || "Uncategorized"}</span> <span data-astro-cid-jfffisa6>•</span> <span data-astro-cid-jfffisa6>${new Date(post.createdAt).toLocaleDateString()}</span> </div> <h3 class="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors" data-astro-cid-jfffisa6> <a${addAttribute(`/blog/${post.slug}`, "href")} data-astro-cid-jfffisa6> ${post.title} </a> </h3> <p class="text-gray-400 mb-4 line-clamp-2" data-astro-cid-jfffisa6> ${post.description} </p> <div class="flex items-center justify-between" data-astro-cid-jfffisa6> <div class="flex items-center gap-2" data-astro-cid-jfffisa6> <div class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm" data-astro-cid-jfffisa6> ${post.author_data?.name?.[0]?.toUpperCase() || "A"} </div> <div class="text-sm" data-astro-cid-jfffisa6> <div class="text-gray-300" data-astro-cid-jfffisa6>${post.author_data?.name || "Anonymous"}</div> <div class="text-gray-500" data-astro-cid-jfffisa6>${post.readingTime} min read</div> </div> </div> <a${addAttribute(`/blog/${post.slug}`, "href")} class="text-gray-400 hover:text-blue-400 text-sm font-medium" data-astro-cid-jfffisa6>
Read →
</a> </div> </div> </article>`)} </div> </section> ${allPosts.length === 0 && renderTemplate`<div class="text-center py-12 text-gray-400" data-astro-cid-jfffisa6> <p class="text-xl mb-2" data-astro-cid-jfffisa6>No blog posts found${currentCategory && ` in "${currentCategory}" category`}.</p> <p data-astro-cid-jfffisa6>Check back soon for new content!</p> </div>`} </main> ` })} `;
}, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/blog/index-enhanced.astro", void 0);
const $$file = "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/blog/index-enhanced.astro";
const $$url = "/blog/index-enhanced";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$IndexEnhanced,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
