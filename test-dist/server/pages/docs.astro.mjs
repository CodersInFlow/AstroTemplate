/* empty css                                  */
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_CDr6vjmS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BjA0HMLQ.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const API_URL = "https://codersinflow.com";
  const response = await fetch(`${API_URL}/api/posts?type=docs`);
  const docs = response.ok ? await response.json() : [];
  const docsByCategory = docs.reduce((acc, doc) => {
    const category = doc.category_data?.name || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(doc);
    return acc;
  }, {});
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Documentation" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8 max-w-7xl"> <h1 class="text-4xl font-bold mb-8">Documentation</h1> <div class="grid grid-cols-1 lg:grid-cols-4 gap-8"> <!-- Sidebar --> <aside class="lg:col-span-1"> <nav class="sticky top-4"> <h2 class="font-semibold mb-4 text-lg">Categories</h2> <ul class="space-y-2"> ${Object.keys(docsByCategory).map((category) => renderTemplate`<li> <a${addAttribute(`#${category.toLowerCase().replace(/\s+/g, "-")}`, "href")} class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"> ${category} (${docsByCategory[category].length})
</a> </li>`)} </ul> </nav> </aside> <!-- Main content --> <div class="lg:col-span-3"> ${Object.entries(docsByCategory).map(([category, categoryDocs]) => renderTemplate`<section${addAttribute(category.toLowerCase().replace(/\s+/g, "-"), "id")} class="mb-12"> <h2 class="text-2xl font-bold mb-4">${category}</h2> <div class="grid gap-4"> ${categoryDocs.map((doc) => renderTemplate`<article class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition"> <h3 class="text-xl font-semibold mb-2"> <a${addAttribute(`/docs/${doc.slug}`, "href")} class="hover:text-blue-600 transition"> ${doc.title} </a> </h3> <p class="text-gray-600 dark:text-gray-400"> ${doc.excerpt || doc.description} </p> </article>`)} </div> </section>`)} </div> </div> ${docs.length === 0 && renderTemplate`<div class="text-center py-12 text-gray-500"> <p>No documentation found.</p> </div>`} </main> ` })}`;
}, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/docs/index.astro", void 0);
const $$file = "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/docs/index.astro";
const $$url = "/docs";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
