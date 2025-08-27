import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_d7t0l-hm.mjs';
import { manifest } from './manifest_e1yWbpyv.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/blog/index-enhanced.astro.mjs');
const _page2 = () => import('./pages/blog/_slug_.astro.mjs');
const _page3 = () => import('./pages/blog.astro.mjs');
const _page4 = () => import('./pages/docs/_slug_.astro.mjs');
const _page5 = () => import('./pages/docs.astro.mjs');
const _page6 = () => import('./pages/editor/categories.astro.mjs');
const _page7 = () => import('./pages/editor/change-password.astro.mjs');
const _page8 = () => import('./pages/editor/login.astro.mjs');
const _page9 = () => import('./pages/editor/posts/edit/_id_.astro.mjs');
const _page10 = () => import('./pages/editor/posts/new.astro.mjs');
const _page11 = () => import('./pages/editor/posts.astro.mjs');
const _page12 = () => import('./pages/editor/register.astro.mjs');
const _page13 = () => import('./pages/editor/users/edit/_id_.astro.mjs');
const _page14 = () => import('./pages/editor/users/new.astro.mjs');
const _page15 = () => import('./pages/editor/users.astro.mjs');
const _page16 = () => import('./pages/editor.astro.mjs');
const _page17 = () => import('./pages/enterprise.astro.mjs');
const _page18 = () => import('./pages/features.astro.mjs');
const _page19 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/blog/index-enhanced.astro", _page1],
    ["src/pages/blog/[slug].astro", _page2],
    ["src/pages/blog/index.astro", _page3],
    ["src/pages/docs/[slug].astro", _page4],
    ["src/pages/docs/index.astro", _page5],
    ["src/pages/editor/categories/index.astro", _page6],
    ["src/pages/editor/change-password.astro", _page7],
    ["src/pages/editor/login.astro", _page8],
    ["src/pages/editor/posts/edit/[id].astro", _page9],
    ["src/pages/editor/posts/new.astro", _page10],
    ["src/pages/editor/posts/index.astro", _page11],
    ["src/pages/editor/register.astro", _page12],
    ["src/pages/editor/users/edit/[id].astro", _page13],
    ["src/pages/editor/users/new.astro", _page14],
    ["src/pages/editor/users/index.astro", _page15],
    ["src/pages/editor/index.astro", _page16],
    ["src/pages/enterprise.astro", _page17],
    ["src/pages/features.astro", _page18],
    ["src/pages/index.astro", _page19]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///Users/prestongarrison/Source/convert/codersinflow.com/test-dist/client/",
    "server": "file:///Users/prestongarrison/Source/convert/codersinflow.com/test-dist/server/",
    "host": false,
    "port": 4321,
    "assets": "_astro",
    "experimentalStaticHeaders": false
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
