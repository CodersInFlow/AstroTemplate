/* empty css                                     */
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CDr6vjmS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BjA0HMLQ.mjs';
import { B as BlogPostViewer } from '../../chunks/BlogPostViewer_ltiJSlKC.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://codersinflow.com");
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const API_URL = "https://codersinflow.com";
  const response = await fetch(`${API_URL}/api/posts/${slug}`);
  const doc = response.ok ? await response.json() : null;
  if (!doc) {
    return Astro2.redirect("/docs");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": doc.title }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8 max-w-4xl"> <article> <h1 class="text-4xl font-bold mb-8">${doc.title}</h1> <div class="prose dark:prose-invert max-w-none"> ${renderComponent($$result2, "BlogPostViewer", BlogPostViewer, { "client:load": true, "content": doc.content, "client:component-hydration": "load", "client:component-path": "/Users/prestongarrison/Source/convert/blog-module/src/components/BlogPostViewer", "client:component-export": "default" })} </div> </article> </main> ` })}`;
}, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/docs/[slug].astro", void 0);
const $$file = "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/docs/[slug].astro";
const $$url = "/docs/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
