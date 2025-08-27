/* empty css                                     */
import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CDr6vjmS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BjA0HMLQ.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://codersinflow.com");
const prerender = false;
const $$ChangePassword = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ChangePassword;
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
  await userResponse.json();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Change Password - Editor" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-900"> <!-- Editor Header --> <header class="bg-gray-800 border-b border-gray-700"> <div class="container mx-auto px-4 py-4"> <div class="flex justify-between items-center"> <h1 class="text-xl font-bold text-white">Change Password</h1> <a href="/editor" class="text-gray-400 hover:text-white">
← Back to Dashboard
</a> </div> </div> </header> <main class="container mx-auto px-4 py-8 max-w-md"> <div class="bg-gray-800 rounded-lg p-6"> <form id="changePasswordForm"> <div class="mb-4"> <label for="currentPassword" class="block text-sm font-medium text-gray-300 mb-2">
Current Password
</label> <input type="password" id="currentPassword" name="currentPassword" required class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"> </div> <div class="mb-4"> <label for="newPassword" class="block text-sm font-medium text-gray-300 mb-2">
New Password
</label> <input type="password" id="newPassword" name="newPassword" required minlength="8" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"> <p class="mt-1 text-sm text-gray-400">Must be at least 8 characters</p> </div> <div class="mb-6"> <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
Confirm New Password
</label> <input type="password" id="confirmPassword" name="confirmPassword" required minlength="8" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"> </div> <div id="errorMessage" class="mb-4 text-red-400 text-sm hidden"></div> <div id="successMessage" class="mb-4 text-green-400 text-sm hidden"></div> <button type="submit" class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
Change Password
</button> </form> </div> </main> </div> ` })} ${renderScript($$result, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/change-password.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/change-password.astro", void 0);
const $$file = "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/change-password.astro";
const $$url = "/editor/change-password";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ChangePassword,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
