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
  const currentUser = await userResponse.json();
  if (currentUser.role !== "admin") {
    return Astro2.redirect("/editor");
  }
  const usersResponse = await fetch(`${API_URL}/api/admin/users`, {
    headers: {
      "Cookie": `auth-token=${token.value}`
    }
  });
  const users = usersResponse.ok ? await usersResponse.json() : [];
  const approvedUsers = users.filter((u) => u.approved);
  const pendingUsers = users.filter((u) => !u.approved);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "User Management - Editor" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-900"> <!-- Editor Header --> <header class="bg-gray-800 border-b border-gray-700"> <div class="container mx-auto px-4 py-4"> <div class="flex justify-between items-center"> <h1 class="text-xl font-bold text-white">User Management</h1> <div class="flex items-center gap-4"> <a href="/editor/users/new" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition">
Create User
</a> <a href="/editor" class="text-gray-400 hover:text-white">
← Back to Dashboard
</a> </div> </div> </div> </header> <!-- Editor Navigation --> <nav class="bg-gray-800 border-b border-gray-700"> <div class="container mx-auto px-4"> <div class="flex gap-6"> <a href="/editor" class="py-3 border-b-2 border-transparent text-gray-400 hover:text-gray-300">Dashboard</a> <a href="/editor/posts" class="py-3 border-b-2 border-transparent text-gray-400 hover:text-gray-300">Posts</a> <a href="/editor/categories" class="py-3 border-b-2 border-transparent text-gray-400 hover:text-gray-300">Categories</a> <a href="/editor/users" class="py-3 border-b-2 border-blue-500 text-blue-400">Users</a> </div> </div> </nav> <main class="container mx-auto px-4 py-8 max-w-6xl"> <!-- Pending Approvals --> ${pendingUsers.length > 0 && renderTemplate`<section class="mb-8"> <h2 class="text-2xl font-bold mb-4 text-yellow-400">Pending Approvals (${pendingUsers.length})</h2> <div class="bg-yellow-900/20 border border-yellow-700 rounded-lg overflow-hidden"> <table class="w-full"> <thead class="bg-yellow-900/30"> <tr> <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Registered</th> <th class="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th> </tr> </thead> <tbody class="divide-y divide-yellow-800"> ${pendingUsers.map((user) => renderTemplate`<tr> <td class="px-6 py-4 text-white">${user.name}</td> <td class="px-6 py-4 text-gray-300">${user.email}</td> <td class="px-6 py-4 text-gray-400"> ${new Date(user.createdAt).toLocaleDateString()} </td> <td class="px-6 py-4 text-right"> <button${addAttribute(user.id, "data-user-id")}${addAttribute(user.name, "data-user-name")} class="approve-btn px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm mr-2">
Approve
</button> <button${addAttribute(user.id, "data-user-id")}${addAttribute(user.name, "data-user-name")} class="reject-btn px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm">
Reject
</button> </td> </tr>`)} </tbody> </table> </div> </section>`} <!-- Approved Users --> <section> <h2 class="text-2xl font-bold mb-4 text-white">Active Users (${approvedUsers.length})</h2> <div class="bg-gray-800 rounded-lg overflow-hidden"> <table class="w-full"> <thead class="bg-gray-700"> <tr> <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Registered</th> <th class="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th> </tr> </thead> <tbody class="divide-y divide-gray-700"> ${approvedUsers.map((user) => renderTemplate`<tr> <td class="px-6 py-4 text-white"> ${user.name} ${user.id === currentUser.id && renderTemplate`<span class="ml-2 text-xs text-gray-400">(You)</span>`} </td> <td class="px-6 py-4 text-gray-300">${user.email}</td> <td class="px-6 py-4"> <span${addAttribute(`px-2 py-1 text-xs rounded-full ${user.role === "admin" ? "bg-purple-900 text-purple-300" : "bg-gray-700 text-gray-300"}`, "class")}> ${user.role} </span> </td> <td class="px-6 py-4 text-gray-400"> ${new Date(user.createdAt).toLocaleDateString()} </td> <td class="px-6 py-4 text-right"> ${user.id !== currentUser.id && renderTemplate`<select${addAttribute(user.id, "data-user-id")}${addAttribute(user.name, "data-user-name")} class="role-select px-3 py-1 bg-gray-700 rounded text-sm"> <option value="" disabled selected>Change role</option> <option value="admin"${addAttribute(user.role === "admin", "disabled")}>Make Admin</option> <option value="user"${addAttribute(user.role === "user", "disabled")}>Make User</option> </select>`} </td> </tr>`)} </tbody> </table> </div> </section> ${users.length === 0 && renderTemplate`<div class="text-center py-12 text-gray-400"> <p>No users found.</p> </div>`} </main> </div> ` })} ${renderScript($$result, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/users/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/users/index.astro", void 0);
const $$file = "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/editor/users/index.astro";
const $$url = "/editor/users";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
