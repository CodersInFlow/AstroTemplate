/* empty css                                     */
import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CDr6vjmS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BjA0HMLQ.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://codersinflow.com");
const prerender = false;
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  const token = Astro2.cookies.get("auth-token");
  if (token) {
    return Astro2.redirect("/editor");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Login - Editor" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen flex items-center justify-center bg-gray-900"> <div class="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md"> <h1 class="text-2xl font-bold text-center mb-6">Editor Login</h1> <form id="loginForm" class="space-y-4"> <div> <label for="email" class="block text-sm font-medium mb-2">Email</label> <input type="email" id="email" name="email" required class="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="admin@example.com"> </div> <div> <label for="password" class="block text-sm font-medium mb-2">Password</label> <input type="password" id="password" name="password" required class="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••"> </div> <div id="error" class="text-red-400 text-sm hidden"></div> <button type="submit" class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors">
Login
</button> </form> <p class="text-center mt-4 text-sm text-gray-400">
Don't have an account?
<a href="/editor/register" class="text-blue-400 hover:text-blue-300">Register</a> </p> </div> </main> ` })} ${renderScript($$result, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/login.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/login.astro", void 0);

const $$file = "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/login.astro";
const $$url = "/editor/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
