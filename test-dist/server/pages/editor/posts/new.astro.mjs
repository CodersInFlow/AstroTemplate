/* empty css                                        */
import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../../chunks/astro/server_CDr6vjmS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../../chunks/Layout_BjA0HMLQ.mjs';
import { A as AstroRichTextEditor } from '../../../chunks/AstroRichTextEditor_WJRq4H2u.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://codersinflow.com");
const prerender = false;
const $$New = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$New;
  const token = Astro2.cookies.get("auth-token");
  if (!token) {
    return Astro2.redirect("/editor/login");
  }
  const postType = Astro2.url.searchParams.get("type") || "blog";
  const API_URL = "https://codersinflow.com";
  const categoriesResponse = await fetch(`${API_URL}/api/categories?type=${postType}`, {
    headers: {
      "Cookie": `auth-token=${token.value}`
    }
  });
  const categories = categoriesResponse.ok ? await categoriesResponse.json() : [];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "New Post - Editor" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-900"> <!-- Editor Header --> <header class="bg-gray-800 border-b border-gray-700"> <div class="container mx-auto px-4 py-4"> <div class="flex justify-between items-center"> <h1 class="text-xl font-bold text-white">Create New ${postType === "blog" ? "Blog Post" : "Documentation"}</h1> <a href="/editor" class="text-gray-400 hover:text-white">
← Back to Dashboard
</a> </div> </div> </header> <main class="container mx-auto px-4 py-8 max-w-4xl"> <form id="postForm" class="space-y-6"> <input type="hidden" name="type"${addAttribute(postType, "value")}> <!-- Title --> <div> <label for="title" class="block text-sm font-medium mb-2 text-gray-300">Title</label> <input type="text" id="title" name="title" required class="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter post title"> </div> <!-- Slug --> <div> <label for="slug" class="block text-sm font-medium mb-2 text-gray-300">
Slug (URL)
<span class="text-gray-400 text-xs ml-2">Leave empty to auto-generate</span> </label> <input type="text" id="slug" name="slug" class="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="post-url-slug"> </div> <!-- Description --> <div> <label for="description" class="block text-sm font-medium mb-2 text-gray-300">Description</label> <textarea id="description" name="description" required rows="3" class="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Brief description for listing pages"></textarea> </div> <!-- Category --> <div> <label for="category" class="block text-sm font-medium mb-2 text-gray-300">Category</label> <select id="category" name="category" required class="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"> <option value="">Select a category</option> ${categories.map((cat) => renderTemplate`<option${addAttribute(cat.id, "value")}>${cat.name}</option>`)} </select> </div> <!-- Cover Image --> <div> <label class="block text-sm font-medium mb-2 text-gray-300">
Cover Image
<span class="text-gray-400 text-xs ml-2">Optional</span> </label> <div class="flex items-center gap-4"> <!-- Hidden input to store the URL --> <input type="hidden" id="coverImage" name="coverImage"> <!-- Image preview or placeholder --> <div id="coverPreviewContainer" class="relative"> <div id="coverPlaceholder" class="w-32 h-32 bg-gray-800 rounded-md border-2 border-dashed border-gray-600 flex items-center justify-center"> <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> </div> <img id="coverPreviewImg" class="w-32 h-32 object-cover rounded-md border border-gray-700 hidden"> </div> <!-- Upload/Change button --> <div class="flex flex-col gap-2"> <button type="button" id="uploadCoverBtn" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors flex items-center gap-2"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path> </svg> <span id="uploadBtnText">Upload Image</span> </button> <button type="button" id="removeCoverBtn" class="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md transition-colors hidden">
Remove
</button> </div> </div> </div> <!-- Content --> <div> <label class="block text-sm font-medium mb-2 text-gray-300">Content</label> ${renderComponent($$result2, "AstroRichTextEditor", AstroRichTextEditor, { "client:load": true, "content": "", "placeholder": "Start writing your content...", "inputId": "content", "client:component-hydration": "load", "client:component-path": "/Users/prestongarrison/Source/convert/codersinflow.com/src/components/editor/AstroRichTextEditor", "client:component-export": "default" })} <input type="hidden" id="content" name="content"> </div> <!-- Publish Options --> <div class="flex items-center gap-4"> <label class="flex items-center gap-2"> <input type="checkbox" name="published" id="published" class="rounded bg-gray-700 border-gray-600"> <span class="text-gray-300">Publish immediately</span> </label> </div> <!-- Actions --> <div class="flex gap-4"> <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium text-white transition-colors">
Create Post
</button> <a href="/editor" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-medium text-white transition-colors">
Cancel
</a> </div> <div id="error" class="text-red-400 hidden"></div> </form> </main> </div> ` })} ${renderScript($$result, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/posts/new.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/posts/new.astro", void 0);
const $$file = "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/posts/new.astro";
const $$url = "/editor/posts/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
