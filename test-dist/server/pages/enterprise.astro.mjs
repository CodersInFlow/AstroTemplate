/* empty css                                  */
import { f as createComponent, m as maybeRenderHead, r as renderTemplate, k as renderComponent } from '../chunks/astro/server_CDr6vjmS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BjA0HMLQ.mjs';
import { $ as $$HeaderSimple } from '../chunks/HeaderSimple_snQXYYaq.mjs';
import { $ as $$Footer } from '../chunks/Footer_Wr9PnmAU.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$EnterpriseSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="w-full bg-gray-900"> <div class="max-w-7xl mx-auto py-16 px-4"> <h2 class="text-4xl md:text-5xl font-bold text-center text-white mb-8">Enterprise Features</h2> <p class="text-xl text-center text-gray-300 mb-12 max-w-3xl mx-auto">
Powerful team management and monitoring capabilities for organizations
</p> <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"> <!-- Employee Monitoring --> <div class="bg-gray-800 p-6 rounded-lg"> <h3 class="text-2xl font-semibold text-white mb-4">Team Monitoring</h3> <ul class="space-y-3 text-gray-300"> <li class="flex items-start"> <span class="text-indigo-500 mr-2">•</span>
Track developer productivity in real-time
</li> <li class="flex items-start"> <span class="text-indigo-500 mr-2">•</span>
Monitor AI usage across your entire team
</li> <li class="flex items-start"> <span class="text-indigo-500 mr-2">•</span>
See which projects each developer is working on
</li> <li class="flex items-start"> <span class="text-indigo-500 mr-2">•</span>
Detailed time tracking and activity reports
</li> </ul> </div> <!-- Access Control --> <div class="bg-gray-800 p-6 rounded-lg"> <h3 class="text-2xl font-semibold text-white mb-4">Access Control</h3> <ul class="space-y-3 text-gray-300"> <li class="flex items-start"> <span class="text-indigo-500 mr-2">•</span>
Grant/revoke access to specific AI models per employee
</li> <li class="flex items-start"> <span class="text-indigo-500 mr-2">•</span>
Set spending limits per developer or team
</li> <li class="flex items-start"> <span class="text-indigo-500 mr-2">•</span>
Control which providers each team member can use
</li> <li class="flex items-start"> <span class="text-indigo-500 mr-2">•</span>
Company-wide mode templates
</li> </ul> </div> <!-- Analytics Dashboard --> <div class="bg-gray-800 p-6 rounded-lg"> <h3 class="text-2xl font-semibold text-white mb-4">Analytics Dashboard</h3> <ul class="space-y-3 text-gray-300"> <li class="flex items-start"> <span class="text-indigo-500 mr-2">•</span>
Token usage per employee, project, and time period
</li> <li class="flex items-start"> <span class="text-indigo-500 mr-2">•</span>
Cost allocation by department or project
</li> <li class="flex items-start"> <span class="text-indigo-500 mr-2">•</span>
ROI tracking on AI investment
</li> <li class="flex items-start"> <span class="text-indigo-500 mr-2">•</span>
Export reports for management
</li> </ul> </div> <!-- Security & Compliance --> <div class="bg-gray-800 p-6 rounded-lg"> <h3 class="text-2xl font-semibold text-white mb-4">Security & Compliance</h3> <ul class="space-y-3 text-gray-300"> <li class="flex items-start"> <span class="text-indigo-500 mr-2">•</span>
Self-hosting option for complete GDPR compliance
</li> <li class="flex items-start"> <span class="text-indigo-500 mr-2">•</span>
Automatic security scanning of all AI outputs
</li> <li class="flex items-start"> <span class="text-indigo-500 mr-2">•</span>
API key and secrets detection/prevention
</li> <li class="flex items-start"> <span class="text-indigo-500 mr-2">•</span>
Full audit logs and data export capabilities
</li> </ul> </div> </div> <div class="text-center mt-12"> <a href="/contact" class="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-colors">
Contact Us for Enterprise
</a> </div> </div> </div>`;
}, "/Users/prestongarrison/Source/convert/codersinflow.com/src/components/sections/EnterpriseSection.astro", void 0);

const $$Enterprise = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Enterprise - Coders In Flow for Teams", "description": "Enterprise features for teams - employee monitoring, access control, analytics, and compliance", "keywords": "enterprise AI coding, team management, employee monitoring, access control, SOC2 compliance, GDPR" }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Header", $$HeaderSimple, {})}  ${maybeRenderHead()}<div class="pt-14 bg-gray-950"> <div class="max-w-7xl mx-auto py-16 px-4 text-center"> <h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
Enterprise-Grade AI Development
</h1> <p class="text-xl text-gray-300 max-w-3xl mx-auto">
Empower your entire development team with advanced AI capabilities, 
        complete monitoring, and enterprise-level security.
</p> </div> </div>  ${renderComponent($$result2, "EnterpriseSection", $$EnterpriseSection, {})}  <div class="bg-gray-950 py-16"> <div class="max-w-7xl mx-auto px-4"> <h2 class="text-3xl font-bold text-white mb-12 text-center">Why Choose Enterprise?</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"> <div class="text-center"> <div class="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path> </svg> </div> <h3 class="text-xl font-semibold text-white mb-3">5x Faster Development</h3> <p class="text-gray-300">Teams using Coders In Flow report 5x faster development through AI-powered parallelization.</p> </div> <div class="text-center"> <div class="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <h3 class="text-xl font-semibold text-white mb-3">60% Cost Reduction</h3> <p class="text-gray-300">Intelligent model selection and context optimization reduce AI costs by 60%.</p> </div> <div class="text-center"> <div class="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path> </svg> </div> <h3 class="text-xl font-semibold text-white mb-3">Enterprise Security</h3> <p class="text-gray-300">Self-hosting capability for complete GDPR compliance. Automatic scanning of all AI outputs for security leaks including API keys and secrets.</p> </div> </div> </div> </div>  <div class="bg-gray-900 py-16"> <div class="max-w-4xl mx-auto px-4 text-center"> <h2 class="text-3xl font-bold text-white mb-6">Enterprise Pricing</h2> <p class="text-xl text-gray-300 mb-8">
Custom pricing based on your team size and requirements. 
        Volume discounts available for large organizations.
</p> <div class="bg-gray-800 p-8 rounded-lg max-w-2xl mx-auto"> <h3 class="text-2xl font-semibold text-white mb-4">What's Included:</h3> <ul class="text-left text-gray-300 space-y-3 mb-8"> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg>
All Pro features for every team member
</li> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg>
Centralized team management dashboard
</li> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg>
Advanced analytics and reporting
</li> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg>
Priority support with dedicated account manager
</li> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg>
Custom integrations and deployment options
</li> </ul> <a href="mailto:enterprise@codersinflow.com" class="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
Contact Sales
</a> </div> </div> </div>  ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/enterprise.astro", void 0);

const $$file = "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/enterprise.astro";
const $$url = "/enterprise";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Enterprise,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
