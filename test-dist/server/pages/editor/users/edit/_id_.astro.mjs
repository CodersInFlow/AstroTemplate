/* empty css                                           */
import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../../../chunks/astro/server_CDr6vjmS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../../../chunks/Layout_BjA0HMLQ.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro = createAstro("https://codersinflow.com");
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const token = Astro2.cookies.get("auth-token");
  if (!token) {
    return Astro2.redirect("/editor/login");
  }
  const { id } = Astro2.params;
  const API_URL = "https://codersinflow.com";
  const meResponse = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      "Cookie": `auth-token=${token.value}`
    }
  });
  if (!meResponse.ok) {
    return Astro2.redirect("/editor/login");
  }
  const currentUser = await meResponse.json();
  if (currentUser.id !== parseInt(id) && currentUser.role !== "admin") {
    return Astro2.redirect("/editor");
  }
  const userResponse = await fetch(`${API_URL}/api/admin/users/${id}`, {
    headers: {
      "Cookie": `auth-token=${token.value}`
    }
  });
  if (!userResponse.ok) {
    return Astro2.redirect("/editor/users");
  }
  const user = await userResponse.json();
  const saved = Astro2.url.searchParams.get("saved") === "true";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Edit User: ${user.email} - Editor` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-900"> <!-- Editor Header --> <header class="bg-gray-800 border-b border-gray-700"> <div class="container mx-auto px-4 py-4"> <div class="flex justify-between items-center"> <h1 class="text-xl font-bold text-white">Edit User</h1> <a href="/editor/users" class="text-gray-400 hover:text-white">
← Back to Users
</a> </div> </div> </header> <main class="container mx-auto px-4 py-8 max-w-4xl"> ${saved && renderTemplate`<div class="mb-6 p-4 bg-green-900/20 border border-green-700 rounded-lg text-green-400">
✓ User settings saved successfully
</div>`} <form id="userForm" class="space-y-8"> <input type="hidden" name="id"${addAttribute(user.id, "value")}> <!-- Basic Information --> <div class="bg-gray-800 rounded-lg p-6"> <h2 class="text-lg font-semibold text-white mb-4">Basic Information</h2> <div class="space-y-4"> <div> <label for="email" class="block text-sm font-medium mb-2 text-gray-300">Email</label> <input type="email" id="email" name="email" required${addAttribute(user.email, "value")} class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"> </div> <div> <label for="name" class="block text-sm font-medium mb-2 text-gray-300">Display Name</label> <input type="text" id="name" name="name"${addAttribute(user.name || "", "value")} class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"> </div> <div> <label for="role" class="block text-sm font-medium mb-2 text-gray-300">Role</label> <select id="role" name="role" class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"> <option value="editor"${addAttribute(user.role === "editor", "selected")}>Editor</option> <option value="admin"${addAttribute(user.role === "admin", "selected")}>Admin</option> </select> </div> </div> </div> <!-- Social Media Credentials --> <div class="bg-gray-800 rounded-lg p-6"> <h2 class="text-lg font-semibold text-white mb-4">Social Media Integration</h2> <p class="text-gray-400 text-sm mb-6">Configure API keys and credentials for automatic cross-posting</p> <!-- Reddit --> <div class="border-t border-gray-700 pt-6"> <div class="flex items-center justify-between mb-4"> <h3 class="text-white font-medium flex items-center gap-2"> <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"></path> </svg>
Reddit
</h3> <button type="button" class="test-connection text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded" data-platform="reddit">
Test Connection
</button> </div> <div class="grid grid-cols-2 gap-4"> <input type="text" name="reddit_client_id" placeholder="Client ID"${addAttribute(user.social?.reddit?.client_id || "", "value")} class="px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"> <input type="password" name="reddit_client_secret" placeholder="Client Secret"${addAttribute(user.social?.reddit?.client_secret || "", "value")} class="px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"> </div> <div class="mt-4 grid grid-cols-2 gap-4"> <input type="text" name="reddit_username" placeholder="Reddit Username"${addAttribute(user.social?.reddit?.username || "", "value")} class="px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"> <input type="password" name="reddit_password" placeholder="Reddit Password"${addAttribute(user.social?.reddit?.password || "", "value")} class="px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"> </div> <div class="mt-4"> <label class="block text-sm text-gray-400 mb-2">Target Subreddits (comma-separated)</label> <input type="text" name="reddit_subreddits" placeholder="e.g., programming, webdev, javascript"${addAttribute(user.social?.reddit?.subreddits || "", "value")} class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"> <p class="text-xs text-gray-500 mt-2">Enter subreddit names without r/ prefix. Required for script apps to post.</p> </div> </div> <!-- Dev.to --> <div class="border-t border-gray-700 pt-6 mt-6"> <div class="flex items-center justify-between mb-4"> <h3 class="text-white font-medium flex items-center gap-2"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.53.58.28.88.94.88 1.9 0 2.28-.31 3.18-1.03 3.92zm5.09-5.47h-2.47v1.77h1.52v1.28h-1.52v1.55h2.47v1.28H10.1v-7.16h3.55v1.28zm4.81 0h-2.47v1.77h1.52v1.28h-1.52v1.55h2.47v1.28h-3.54v-7.16h3.54v1.28z"></path> </svg>
Dev.to
</h3> <button type="button" class="test-connection text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded" data-platform="devto">
Test Connection
</button> </div> <input type="password" name="devto_api_key" placeholder="API Key"${addAttribute(user.social?.devto?.api_key || "", "value")} class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"> </div> <!-- LinkedIn --> <div class="border-t border-gray-700 pt-6 mt-6"> <div class="flex items-center justify-between mb-4"> <h3 class="text-white font-medium flex items-center gap-2"> <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"> <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path> </svg>
LinkedIn
</h3> <button type="button" class="test-connection text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded" data-platform="linkedin">
Test Connection
</button> </div> <input type="password" name="linkedin_access_token" placeholder="Access Token"${addAttribute(user.social?.linkedin?.access_token || "", "value")} class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"> <p class="text-xs text-gray-500 mt-2">Requires OAuth setup - coming soon</p> </div> <!-- Facebook --> <div class="border-t border-gray-700 pt-6 mt-6"> <div class="flex items-center justify-between mb-4"> <h3 class="text-white font-medium flex items-center gap-2"> <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"> <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path> </svg>
Facebook Page
</h3> <button type="button" class="test-connection text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded" data-platform="facebook">
Test Connection
</button> </div> <div class="grid grid-cols-2 gap-4"> <input type="text" name="facebook_page_id" placeholder="Page ID"${addAttribute(user.social?.facebook?.page_id || "", "value")} class="px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"> <input type="password" name="facebook_access_token" placeholder="Page Access Token"${addAttribute(user.social?.facebook?.access_token || "", "value")} class="px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"> </div> </div> <!-- X/Twitter --> <div class="border-t border-gray-700 pt-6 mt-6"> <div class="flex items-center justify-between mb-4"> <h3 class="text-white font-medium flex items-center gap-2"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path> </svg>
X (Twitter)
</h3> <button type="button" class="test-connection text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded" data-platform="twitter">
Test Connection
</button> </div> <div class="space-y-4"> <input type="password" name="twitter_api_key" placeholder="API Key"${addAttribute(user.social?.twitter?.api_key || "", "value")} class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"> <input type="password" name="twitter_api_secret" placeholder="API Secret"${addAttribute(user.social?.twitter?.api_secret || "", "value")} class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"> <input type="password" name="twitter_access_token" placeholder="Access Token"${addAttribute(user.social?.twitter?.access_token || "", "value")} class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"> <input type="password" name="twitter_access_secret" placeholder="Access Token Secret"${addAttribute(user.social?.twitter?.access_secret || "", "value")} class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"> </div> </div> </div> <!-- Actions --> <div class="flex gap-4"> <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium text-white transition-colors">
Save Settings
</button> <a href="/editor/users" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-medium text-white transition-colors">
Cancel
</a> </div> <div id="error" class="text-red-400 hidden"></div> </form> </main> </div> ` })} ${renderScript($$result, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/users/edit/[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/users/edit/[id].astro", void 0);
const $$file = "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/users/edit/[id].astro";
const $$url = "/editor/users/edit/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
