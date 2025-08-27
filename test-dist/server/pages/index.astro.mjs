/* empty css                                  */
import { f as createComponent, m as maybeRenderHead, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_CDr6vjmS.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BjA0HMLQ.mjs';
import { $ as $$HeaderSimple } from '../chunks/HeaderSimple_snQXYYaq.mjs';
import { $ as $$Footer } from '../chunks/Footer_Wr9PnmAU.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useRef, useState, useEffect } from 'react';
export { renderers } from '../renderers.mjs';

const hero = {"title":"Our competition can't compare","subtitle":"We knew we could do better, and we proved it","quote":{"text":"Our competitors thought my ideas were unobtainable, so i decided to prove otherwise, building a solution from the ground up","authorName":"Preston Garrison","authorTitle":"Creator"}};
const features$1 = [{"id":"ai-providers","title":"Support for all AI Providers and Models","heading":"You don't have to wait for a software update to support that new provider or model!","learnMoreLink":"/features#provider-system","paragraphs":["We automatically query the providers for the latest models, and automatically support all of them.  Other extensions need the code updated just to support the new models, we load everything dynamically","**All our data is stored in JSON, so can easily be modified on the fly**","The other extensions all load most of their data from code, we have a universal standard system that lets you easily add and support your own providers.  Adding new providers takes very little work","**Mutiple accounts from the same providers are also easily added, you can even add mutiple accounts under the same mode so you can automatically rotate keys.**"]},{"id":"code-analysis","title":"Real-time code analysis","heading":"Automatically find and fix errors without using AI","learnMoreLink":"/features#codebase-intelligence","paragraphs":["**AI often makes mistakes and is constantly creating lint errors and other issues that take time and credit to fix**","We fully analyze your code base and find all issues, and allow you to automatically fix the majority of them without relying on expensive AI providers.","**Errors are found and fixed like magic**"]},{"id":"codebase-knowledge","title":"Code base knowledge","heading":"We know everything about your code","learnMoreLink":"/features#codebase-intelligence","paragraphs":["We fully analyze and give AI providers access to a query system to find every detail about your code base.","Instead of needing to do extensive searches to find that perfect spot, or to do things properly we provide the AI with the tools to find the answer immediately.","**AI Follows YOUR standards and knows how YOU want your code to be written**"]},{"id":"multitasking","title":"True Realtime Multitasking","heading":"AI not limited to one process at a time","learnMoreLink":"/features#multitasking","paragraphs":["We allow the AI to automatically create tasks that all run simeltaneously and realtime to find the perfect solution, or create the ultimate solution.","AI will automatically choose the perfect model, which builds custom instructions to run the query in the background while its processing other queries.","This allows the AI to work more economically, faster, and analyze results as they are fed back realtime into the main process","**No other extension has such power**"]},{"id":"context-control","title":"Full context control","heading":"Save huge money by allowing you or the AI to manage context","learnMoreLink":"/features#context-control","paragraphs":["Full context editor, you can easily delete items from context, and visualize it in a full context viewer.","AI has commands at its disposable where it can automatically delete elements i no longer needs.","Full mult-tasking subtasks allow the AI to keep elements seperate, saving money on your main context.","**Smart context management saves YOU ALOT OF MONEY!**"]},{"id":"mobile-apps","title":"iPhone, Android and iPad Apps","heading":"Jump in the pool and keep your project moving","learnMoreLink":"/features#mobile-apps","paragraphs":["No longer stay tethered to your desk, our apps allow you to completely control the AI and your project from anywhere.","Our applications allow you to completely respond and view the entire AI process, change tasks, models, etc all from the comfort of your couch.","**Everything full synchronized anywhere, anytime**"]},{"id":"git-management","title":"Expansive GIT Management","heading":"Control every detail of AI with your GIT","learnMoreLink":"/features#git-management","paragraphs":["Most of the extensions don't have individual chunking, selectively approve or deny individual chunks of code, so you can easily monitor what the AI is doing to your code base.","Full automatic shadow git, everytime a file is modified it can be automatically commited to a shadow git, so you never need to worry about losing any code.","**Two git systems, for the utimate control**"]},{"id":"web-management","title":"Web-based Management","heading":"All chat and statistics synchronized to the web","learnMoreLink":"/features#enterprise-cloud","paragraphs":["Monitor your team or even your own sessions on the web in realtime, easily see your costs, what is being worked on, even your entire chat history.","Keep track of your costs, see where to target your efficiency, even monitor if your employees are hard at work.","*All details are tracked in realtime**"]},{"id":"claude-codex","title":"Claude Code and Codex Support","heading":"No longer relegated to commandline","learnMoreLink":"/features#codebase-intelligence","paragraphs":["We keep the best parts of claude code and codex but integrate them directly into our extension.","Other extensions try and shoe horn using claude code and codex into their system, not taking advantageo of what they do best.  We allow them to work properly, and keep you up to date with all their tool calls, and all the information the output.  This keeps them working the absolute best, and keeps your credit usage low.","*Really make Claude Code and Codex shine**"]}];
const featuresData = {
  hero,
  features: features$1,
};

const header = {"title":"How We Compare","subtitle":"True multitasking, powerful, token optimized, intuitive - fundamentally changing how software is built","badge":"✨ 17-0 Feature Advantage"};
const competitors = [{"name":"Cline","key":"cline"},{"name":"Continue","key":"continue"},{"name":"Cursor","key":"cursor"},{"name":"Roo","key":"roo"},{"name":"Coders in Flow","key":"codersinflow","highlight":true,"icon":"⚡"}];
const features = [{"name":"Concurrent Tasks","link":"/features#multitasking","values":{"cline":{"status":false,"value":"1"},"continue":{"status":false,"value":"1"},"cursor":{"status":false,"value":"1"},"roo":{"status":false,"value":"1"},"codersinflow":{"status":true,"value":"20+"}}},{"name":"Automatic Subtasks","link":"/features#multitasking","values":{"cline":{"status":false,"value":"No"},"continue":{"status":false,"value":"No"},"cursor":{"status":false,"value":"No"},"roo":{"status":false,"value":"No"},"codersinflow":{"status":true,"value":"Yes"}}},{"name":"Dynamic Providers","link":"/features#provider-system","values":{"cline":{"status":false,"value":"Hardcoded"},"continue":{"status":false,"value":"Hardcoded"},"cursor":{"status":false,"value":"Hardcoded"},"roo":{"status":false,"value":"Hardcoded"},"codersinflow":{"status":true,"value":"JSON-based"}}},{"name":"Model Discovery","link":"/features#provider-system","values":{"cline":{"status":false,"value":"Manual"},"continue":{"status":false,"value":"Manual"},"cursor":{"status":false,"value":"Manual"},"roo":{"status":false,"value":"Manual"},"codersinflow":{"status":true,"value":"Automatic"}}},{"name":"Mobile App","link":"/features#mobile-apps","values":{"cline":{"status":false,"value":"No"},"continue":{"status":false,"value":"No"},"cursor":{"status":false,"value":"No"},"roo":{"status":false,"value":"No"},"codersinflow":{"status":true,"value":"Native iOS"}}},{"name":"Selective Staging","link":"/features#git-management","values":{"cline":{"status":false,"value":"No"},"continue":{"status":false,"value":"No"},"cursor":{"status":true,"value":"Yes"},"roo":{"status":false,"value":"No"},"codersinflow":{"status":true,"value":"Chunk-level"}}},{"name":"Cloud Backup","link":"/features#enterprise-cloud","values":{"cline":{"status":false,"value":"No"},"continue":{"status":false,"value":"No"},"cursor":{"status":false,"value":"Limited"},"roo":{"status":false,"value":"No"},"codersinflow":{"status":true,"value":"Complete"}}},{"name":"Team Management","link":"/features#enterprise-cloud","values":{"cline":{"status":false,"value":"No"},"continue":{"status":false,"value":"No"},"cursor":{"status":false,"value":"No"},"roo":{"status":false,"value":"No"},"codersinflow":{"status":true,"value":"Enterprise"}}},{"name":"AI Context Editing","link":"/features#context-control","values":{"cline":{"status":false,"value":"No"},"continue":{"status":false,"value":"No"},"cursor":{"status":false,"value":"No"},"roo":{"status":false,"value":"No"},"codersinflow":{"status":true,"value":"Dynamic"}}},{"name":"Cost Optimization","link":"/features#context-control","values":{"cline":{"status":false,"value":"No"},"continue":{"status":false,"value":"No"},"cursor":{"status":false,"value":"Limited"},"roo":{"status":false,"value":"No"},"codersinflow":{"status":true,"value":"Automatic"}}},{"name":"Code Analysis","link":"/features#codebase-intelligence","values":{"cline":{"status":false,"value":"No"},"continue":{"status":false,"value":"Basic"},"cursor":{"status":false,"value":"Basic"},"roo":{"status":false,"value":"No"},"codersinflow":{"status":true,"value":"50+ Detectors"}}},{"name":"Security Scanner","link":"/features#codebase-intelligence","values":{"cline":{"status":false,"value":"No"},"continue":{"status":false,"value":"No"},"cursor":{"status":false,"value":"No"},"roo":{"status":false,"value":"No"},"codersinflow":{"status":true,"value":"30+ Patterns"}}},{"name":"Auto-Fixes","link":"/features#codebase-intelligence","values":{"cline":{"status":false,"value":"No"},"continue":{"status":false,"value":"Limited"},"cursor":{"status":false,"value":"Limited"},"roo":{"status":false,"value":"No"},"codersinflow":{"status":true,"value":"200+ Types"}}},{"name":"Automatic MCP Passthrough","link":"/features#provider-system","values":{"cline":{"status":false,"value":"No"},"continue":{"status":false,"value":"No"},"cursor":{"status":false,"value":"No"},"roo":{"status":false,"value":"No"},"codersinflow":{"status":true,"value":"Built-in"}}},{"name":"Message Indexing","link":"/features","values":{"cline":{"status":false,"value":"No"},"continue":{"status":false,"value":"No"},"cursor":{"status":false,"value":"No"},"roo":{"status":false,"value":"No"},"codersinflow":{"status":true,"value":"Byte-offset"}}},{"name":"Lazy Loading","link":"/features","values":{"cline":{"status":false,"value":"No"},"continue":{"status":false,"value":"No"},"cursor":{"status":false,"value":"No"},"roo":{"status":false,"value":"No"},"codersinflow":{"status":true,"value":"Windowed"}}}];
const stats = [{"value":"20×","label":"More Concurrent Tasks"},{"value":"60%","label":"Cost Reduction"},{"value":"50+","label":"Code Detectors"},{"value":"200+","label":"Auto-Fix Types"}];
const comparisonData = {
  header,
  competitors,
  features,
  stats,
};

const videosData = [
	{
		id: 1,
		filename: "Claude Code.mov",
		title: "Claude Code",
		url: "/videos/Claude Code.mov",
		thumbnail: "/videos/thumbnails/Claude Code.jpg",
		duration: null,
		size: 22269708,
		description: "Video 1"
	},
	{
		id: 2,
		filename: "ClaudeCode KanBan.mp4",
		title: "ClaudeCode KanBan",
		url: "/videos/ClaudeCode KanBan.mp4",
		thumbnail: "/videos/thumbnails/ClaudeCode KanBan.jpg",
		duration: null,
		size: 24712172,
		description: "Video 2"
	},
	{
		id: 3,
		filename: "ClaudeCode Modify.mp4",
		title: "ClaudeCode Modify",
		url: "/videos/ClaudeCode Modify.mp4",
		thumbnail: "/videos/thumbnails/ClaudeCode Modify.jpg",
		duration: null,
		size: 13722927,
		description: "Video 3"
	},
	{
		id: 4,
		filename: "Code Analysis.mov",
		title: "Code Analysis",
		url: "/videos/Code Analysis.mov",
		thumbnail: "/videos/thumbnails/Code Analysis.jpg",
		duration: null,
		size: 31895240,
		description: "Video 4"
	}
];

const HeroComparison = () => {
  return /* @__PURE__ */ jsxs("section", { className: "relative bg-gradient-to-br from-[#0a0e27] via-[#151935] to-[#0a0e27] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-6 py-16 md:py-24", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-12 items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-6 opacity-0 animate-fadeInDown animation-delay-100", children: /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-sm", children: "Coders in Flow vs. Competition" }) }),
        /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-block opacity-0 animate-slideInLeft animation-delay-200", children: "Coders in Flow" }),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "inline-block bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent opacity-0 animate-slideInRight animation-delay-400", children: "AI Powered Development team" }),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "inline-block bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent opacity-0 animate-slideInLeft animation-delay-600", children: "in VS Code." })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-lg mb-8 leading-relaxed opacity-0 animate-fadeInUp animation-delay-800", children: "Work 10x faster, its like having a full development team in the palm of your hands. Powerful AI coding assistant that works for engineers, developers and the average person, boosting productivity, code quality, and collaboration." }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-lg mb-8 leading-relaxed opacity-0 animate-fadeInUp animation-delay-1000", children: "When comparing Coders in Flow and other AI assistants, discover how our true multitasking platform with AI Companion capabilities can transform team collaboration, reduce costs, and enhance the experience for developers and customers." }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 opacity-0 animate-fadeInUp animation-delay-1200",
            onClick: () => window.location.href = "/features",
            children: "↓ Scroll ↓ for more, or click for features"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative h-[400px] lg:h-[500px]", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-20 right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl opacity-0 animate-fadeIn animation-delay-500" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl opacity-0 animate-fadeIn animation-delay-700" }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute top-0 right-0 w-[320px] md:w-[380px] hover:rotate-2 transition-transform duration-300 opacity-0 animate-slideInRightRotated animation-delay-1400",
            style: { transform: "rotate(3deg)" },
            children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 rounded-xl shadow-2xl border border-gray-800 overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 px-4 py-2 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-red-500" }),
                  /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-yellow-500" }),
                  /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-green-500" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-xs ml-2", children: "main.tsx" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded bg-purple-500 flex items-center justify-center text-white text-xs font-bold", children: "AI" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsx("div", { className: "h-2 bg-gray-700 rounded w-3/4 mb-2" }),
                    /* @__PURE__ */ jsx("div", { className: "h-2 bg-gray-700 rounded w-full mb-2" }),
                    /* @__PURE__ */ jsx("div", { className: "h-2 bg-gray-700 rounded w-2/3" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 rounded p-3 border border-gray-700", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-green-400 text-xs font-mono mb-1", children: "// AI-generated code" }),
                  /* @__PURE__ */ jsx("div", { className: "h-2 bg-gray-600 rounded w-full mb-1" }),
                  /* @__PURE__ */ jsx("div", { className: "h-2 bg-gray-600 rounded w-4/5 mb-1" }),
                  /* @__PURE__ */ jsx("div", { className: "h-2 bg-gray-600 rounded w-3/4" })
                ] })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute bottom-0 left-0 w-[280px] md:w-[340px] hover:-rotate-2 transition-transform duration-300 opacity-0 animate-slideInLeftRotated animation-delay-1600",
            style: { transform: "rotate(-3deg)" },
            children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-2xl p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }),
                /* @__PURE__ */ jsx("span", { className: "text-gray-900 font-semibold", children: "Compare with Coders in Flow AI Companion" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mb-4", children: "Experience 20+ concurrent tasks, full code analysis, automatic code correction, and 60% cost reduction compared to any other solution." }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity",
                  onClick: () => window.location.href = "/download",
                  children: "Start Free →"
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute top-10 left-10 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 text-green-400 text-sm font-semibold opacity-0 animate-bounceIn animation-delay-1800", children: "20× Faster" }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-32 right-10 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 text-blue-400 text-sm font-semibold opacity-0 animate-bounceIn animation-delay-2000", children: "60% Cheaper" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-32 right-20 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 text-purple-400 text-sm font-semibold opacity-0 animate-bounceIn animation-delay-2200", children: "100% Better" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "absolute top-0 left-0 w-full h-full pointer-events-none", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRightRotated {
          from {
            opacity: 0;
            transform: translateX(100px) rotate(3deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotate(3deg);
          }
        }

        @keyframes slideInLeftRotated {
          from {
            opacity: 0;
            transform: translateX(-100px) rotate(-3deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotate(-3deg);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .animate-slideInRightRotated {
          animation: slideInRightRotated 0.8s ease-out forwards;
        }

        .animate-slideInLeftRotated {
          animation: slideInLeftRotated 0.8s ease-out forwards;
        }

        .animate-bounceIn {
          animation: bounceIn 0.8s ease-out forwards, pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 2.5s;
        }

        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-700 { animation-delay: 0.7s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1200 { animation-delay: 1.2s; }
        .animation-delay-1400 { animation-delay: 1.4s; }
        .animation-delay-1600 { animation-delay: 1.6s; }
        .animation-delay-1800 { animation-delay: 1.8s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-2200 { animation-delay: 2.2s; }
      ` })
  ] });
};

const QuotedHero = ({ title, subtitle, quote }) => {
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const mountTimer = setTimeout(() => {
      setIsMounted(true);
    }, 500);
    return () => clearTimeout(mountTimer);
  }, []);
  useEffect(() => {
    if (!isMounted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isInView) {
            setIsInView(true);
          }
        });
      },
      {
        threshold: 0.5,
        // Trigger when 50% of the component is visible
        rootMargin: "-100px 0px"
        // Additional offset to ensure component is well into view
      }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    const scrollIndicator = document.querySelector(".scroll-indicator");
    if (scrollIndicator) {
      scrollIndicator.addEventListener("click", () => {
        const firstSection = document.querySelector(".feature-showcase-item");
        if (firstSection) {
          firstSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isInView, isMounted]);
  const titleWords = title.split(" ");
  return /* @__PURE__ */ jsxs("section", { ref: sectionRef, className: "quoted-hero min-h-screen flex flex-col justify-center items-center text-center p-8 relative bg-gradient-to-br from-[#0a0e27] to-[#151935] overflow-hidden", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white", children: titleWords.map((word, index) => /* @__PURE__ */ jsx(
      "span",
      {
        className: `inline-block mr-4 ${isInView ? index % 2 === 0 ? "animate-slideInLeft" : "animate-slideInRight" : ""}`,
        style: {
          animationDelay: isInView ? `${index * 0.15}s` : "0s",
          opacity: isInView ? void 0 : 0,
          transform: !isInView ? index % 2 === 0 ? "translateX(-100%)" : "translateX(100%)" : void 0,
          animationFillMode: "forwards"
        },
        children: /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent", children: word })
      },
      index
    )) }),
    /* @__PURE__ */ jsx(
      "p",
      {
        className: `text-xl md:text-2xl text-gray-400 max-w-3xl mb-24 ${isInView ? "animate-slideInRight" : ""}`,
        style: {
          opacity: isInView ? void 0 : 0,
          transform: !isInView ? "translateX(100%)" : void 0,
          animationDelay: isInView ? "0.6s" : "0s",
          animationFillMode: "forwards"
        },
        children: subtitle
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `quote-container max-w-4xl mx-auto flex items-start gap-12 px-8 ${isInView ? "animate-slideInLeft" : ""}`,
        style: {
          opacity: isInView ? void 0 : 0,
          transform: !isInView ? "translateX(-100%)" : void 0,
          animationDelay: isInView ? "0.9s" : "0s",
          animationFillMode: "forwards"
        },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "quote-content flex-1 relative", children: [
            /* @__PURE__ */ jsx("div", { className: "quote-mark absolute -top-5 -left-8 text-7xl text-cyan-400 opacity-80 font-serif leading-none", children: '"' }),
            /* @__PURE__ */ jsx("p", { className: "quote-text text-base md:text-lg leading-relaxed text-white m-0 font-normal italic tracking-normal", children: quote.text })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "quote-attribution flex items-center gap-6 flex-shrink-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "author-info text-right", children: [
              /* @__PURE__ */ jsx("div", { className: "author-name text-lg font-semibold text-white mb-1", children: quote.authorName }),
              /* @__PURE__ */ jsx("div", { className: "author-title text-sm text-gray-400", children: quote.authorTitle })
            ] }),
            quote.authorAvatar ? /* @__PURE__ */ jsx(
              "img",
              {
                src: quote.authorAvatar,
                alt: quote.authorName,
                className: "author-avatar w-14 h-14 rounded-full object-cover"
              }
            ) : /* @__PURE__ */ jsx("div", { className: "author-avatar w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold text-xl", children: quote.authorName.split(" ").map((n) => n[0]).join("") })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer ${isInView ? "animate-fadeIn" : ""}`,
        style: {
          opacity: isInView ? void 0 : 0,
          animationDelay: isInView ? "1.2s" : "0s",
          animationFillMode: "forwards"
        },
        children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 fill-purple-500 animate-bounce", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M12 16l-6-6h12z" }) })
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease forwards;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-900 {
          animation-delay: 0.9s;
        }

        .animation-delay-1200 {
          animation-delay: 1.2s;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-10px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
          }
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }

        /* Responsive adjustments */
        @media (max-width: 968px) {
          .quote-container {
            flex-direction: column;
            gap: 1.5rem;
          }

          .quote-attribution {
            flex-direction: row-reverse;
            align-self: flex-end;
          }

          .author-info {
            text-align: left;
          }

          .quote-mark {
            left: -20px;
            font-size: 60px;
          }
        }
      ` })
  ] });
};

const TitledFeature = ({
  id,
  title,
  heading,
  paragraphs,
  learnMoreLink,
  layout = "left",
  sectionNumber
}) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const titleTextRef = useRef(null);
  const contentRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const animationFrameRef = useRef(null);
  const titlePositionRef = useRef(0);
  const getBgGradient = () => {
    const gradients = [
      "bg-gradient-to-br from-[#0a0e27] to-[#0f1429]",
      "bg-gradient-to-br from-[#0f1429] to-[#151935]",
      "bg-gradient-to-br from-[#151935] to-[#0a0e27]",
      "bg-gradient-to-br from-[#0a0e27] to-[#1a1f3a]"
    ];
    return gradients[sectionNumber % gradients.length];
  };
  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: "0px 0px -100px 0px"
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      });
    }, observerOptions);
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    const lerp = (start, end, factor) => {
      return start + (end - start) * factor;
    };
    const updateTitlePosition = () => {
      if (!sectionRef.current || !titleTextRef.current || !contentRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const contentHeight = contentRef.current.offsetHeight;
      const titleContainerHeight = titleTextRef.current.offsetHeight;
      let scrollProgress = 0;
      if (rect.top >= 0) {
        scrollProgress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
      } else {
        const distancePastTop = Math.abs(rect.top);
        scrollProgress = Math.min(1, (window.innerHeight + distancePastTop) / rect.height);
      }
      const titleStartY = contentHeight - titleContainerHeight;
      const titleTargetY = titleStartY - scrollProgress * titleStartY;
      const smoothTitleY = lerp(titlePositionRef.current, titleTargetY, 0.1);
      titlePositionRef.current = smoothTitleY;
      if (titleTextRef.current) {
        titleTextRef.current.style.transform = `translate3d(0, ${smoothTitleY}px, 0)`;
      }
      if (titleRef.current) {
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          titleRef.current.style.opacity = "1";
        } else {
          titleRef.current.style.opacity = "0";
        }
      }
    };
    const handleScroll = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(updateTitlePosition);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    updateTitlePosition();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  const isRightLayout = layout === "right";
  return /* @__PURE__ */ jsxs(
    "section",
    {
      ref: sectionRef,
      id,
      className: `feature-showcase-item min-h-[50vh] flex items-center py-12 px-8 relative ${getBgGradient()} ${isInView ? "in-view" : ""}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: `feature-container max-w-7xl mx-auto grid gap-16 items-start w-full pt-8 ${isRightLayout ? "lg:grid-cols-[1.5fr_1fr]" : "lg:grid-cols-[1fr_1.5fr]"} grid-cols-1`, children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              ref: titleRef,
              className: `feature-title lg:sticky lg:top-8 lg:h-[calc(50vh-4rem)] opacity-0 transition-opacity duration-[800ms] ${isRightLayout ? "lg:order-2" : ""}`,
              children: /* @__PURE__ */ jsxs(
                "div",
                {
                  ref: titleTextRef,
                  className: "relative will-change-transform",
                  style: {
                    transform: "translateZ(0)",
                    WebkitFontSmoothing: "antialiased",
                    backfaceVisibility: "hidden"
                  },
                  children: [
                    learnMoreLink && /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsxs(
                        "a",
                        {
                          href: learnMoreLink,
                          className: "inline-flex items-center gap-2 text-sm md:text-base text-blue-400 hover:text-blue-300 transition-colors group cursor-pointer mb-2",
                          children: [
                            /* @__PURE__ */ jsx("span", { className: "underline-offset-4 hover:underline", children: "Learn more" }),
                            /* @__PURE__ */ jsx(
                              "svg",
                              {
                                className: "w-4 h-4 transform group-hover:translate-x-1 transition-transform",
                                fill: "none",
                                viewBox: "0 0 24 24",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13 7l5 5m0 0l-5 5m5-5H6" })
                              }
                            )
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsx("br", {})
                    ] }),
                    learnMoreLink ? /* @__PURE__ */ jsx("a", { href: learnMoreLink, className: "inline-block hover:opacity-90 transition-opacity", children: /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent", children: title }) }) : /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-4", children: title })
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              ref: contentRef,
              className: `feature-content opacity-0 translate-x-12 transition-all duration-[800ms] ${isRightLayout ? "lg:order-1" : ""} ${isInView ? "opacity-100 translate-x-0" : ""}`,
              children: [
                /* @__PURE__ */ jsx("h3", { className: "text-2xl md:text-3xl mb-6 text-white font-bold", children: heading }),
                paragraphs.map((paragraph, index) => {
                  const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                  return /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl leading-relaxed text-gray-400 mb-6", children: parts.map((part, partIndex) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return /* @__PURE__ */ jsx("strong", { className: "text-gray-300 font-semibold", children: part.slice(2, -2) }, partIndex);
                    }
                    return part;
                  }) }, index);
                })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20" }),
        /* @__PURE__ */ jsx("style", { children: `
        .feature-showcase-item.in-view .feature-title {
          opacity: 1;
        }

        .feature-showcase-item.in-view .feature-content {
          opacity: 1;
          transform: translateX(0);
        }

        /* Mobile responsive adjustments */
        @media (max-width: 1024px) {
          .feature-title {
            position: relative !important;
            height: auto !important;
            top: auto !important;
            margin-bottom: 2rem;
          }

          .feature-title > div {
            transform: none !important;
          }
        }
      ` })
      ]
    }
  );
};

const FeatureShowcaseSection = ({ data }) => {
  const featureShowcaseData = data;
  useEffect(() => {
    const handleParallax = () => {
      const scrolled = window.pageYOffset;
      const shapes = document.querySelectorAll(".shape");
      shapes.forEach((shape, index) => {
        const speed = 0.5 + index * 0.1;
        shape.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };
    window.addEventListener("scroll", handleParallax, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleParallax);
    };
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "feature-showcase-section", children: [
    /* @__PURE__ */ jsx(
      QuotedHero,
      {
        title: featureShowcaseData.hero.title,
        subtitle: featureShowcaseData.hero.subtitle,
        quote: featureShowcaseData.hero.quote
      }
    ),
    featureShowcaseData.features.map((feature, index) => /* @__PURE__ */ jsx(
      TitledFeature,
      {
        id: feature.id,
        title: feature.title,
        heading: feature.heading,
        paragraphs: feature.paragraphs,
        learnMoreLink: feature.learnMoreLink,
        layout: index % 2 === 0 ? "left" : "right",
        sectionNumber: index
      },
      index
    )),
    /* @__PURE__ */ jsx("style", { children: `
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #0a0e27;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
          border-radius: 4px;
        }

        /* Floating shapes (invisible but available) */
        .shape {
          position: absolute;
          opacity: 0.05;
          animation: float 20s infinite ease-in-out;
          display: none; /* Hidden as requested */
        }

        .shape-1 {
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          top: 10%;
          left: 5%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 150px;
          height: 150px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
          top: 60%;
          right: 10%;
          animation-delay: 5s;
        }

        .shape-3 {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
          border-radius: 50%;
          bottom: 20%;
          left: 15%;
          animation-delay: 10s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
        }
      ` })
  ] });
};

const ComparisonTable = ({ data }) => {
  const comparisonData = data;
  const tableRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    const rows = tableRef.current?.querySelectorAll("tbody tr");
    rows?.forEach((row) => observer.observe(row));
    return () => {
      rows?.forEach((row) => observer.unobserve(row));
    };
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "comparison-section bg-black py-8 md:py-16 px-4 md:px-6 relative overflow-x-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none z-[1]", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-[20%] w-96 h-96 bg-blue-500/15 rounded-full blur-[100px]" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-[20%] w-96 h-96 bg-purple-500/15 rounded-full blur-[100px]" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-[40%] w-96 h-96 bg-pink-500/10 rounded-full blur-[100px]" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto relative z-[2]", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8 md:mb-16", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-shift", children: comparisonData.header.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm md:text-xl max-w-2xl mx-auto mb-4 md:mb-6 px-4", children: comparisonData.header.subtitle }),
        /* @__PURE__ */ jsx("span", { className: "inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold animate-pulse-subtle", children: comparisonData.header.badge })
      ] }),
      /* @__PURE__ */ jsx("div", { ref: tableRef, className: "bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg md:rounded-2xl overflow-hidden shadow-2xl animate-slide-up", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-black/50 border-b-2 border-gray-800", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "sticky left-0 z-10 bg-black/90 backdrop-blur-sm px-3 md:px-8 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-300 uppercase tracking-wider", children: "Feature" }),
          comparisonData.competitors.map((competitor) => /* @__PURE__ */ jsxs(
            "th",
            {
              className: `px-2 md:px-4 py-3 md:py-4 text-center text-xs md:text-sm font-semibold uppercase tracking-wider whitespace-nowrap ${competitor.highlight ? "bg-gradient-to-br from-blue-900/50 to-purple-900/50 text-white relative overflow-hidden" : "text-gray-400"}`,
              children: [
                competitor.highlight && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-shimmer" }),
                /* @__PURE__ */ jsxs("span", { className: "relative", children: [
                  competitor.name,
                  " ",
                  competitor.icon
                ] })
              ]
            },
            competitor.key
          ))
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: comparisonData.features.map((feature, index) => /* @__PURE__ */ jsxs(
          "tr",
          {
            className: "border-b border-gray-800/50 hover:bg-blue-500/5 transition-colors duration-300 opacity-0 animate-fade-in-row",
            style: { animationDelay: `${index * 50}ms` },
            children: [
              /* @__PURE__ */ jsxs("td", { className: "sticky left-0 z-10 bg-gray-900/95 backdrop-blur-sm px-3 md:px-8 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-200 relative group", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-0.5 md:w-1 h-4 md:h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" }),
                feature.link ? /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: feature.link,
                    className: "block md:inline hover:text-blue-400 transition-colors cursor-pointer group/link relative",
                    children: [
                      /* @__PURE__ */ jsxs("span", { className: "relative", children: [
                        feature.name,
                        /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 w-0 h-[1px] bg-blue-400 transition-all duration-300 group-hover/link:w-full" })
                      ] }),
                      /* @__PURE__ */ jsx("svg", { className: "inline-block w-3 h-3 ml-1 opacity-0 group-hover/link:opacity-50 transition-opacity", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) })
                    ]
                  }
                ) : /* @__PURE__ */ jsx("span", { className: "block md:inline", children: feature.name })
              ] }),
              comparisonData.competitors.map((competitor) => {
                const value = feature.values[competitor.key];
                return /* @__PURE__ */ jsx(
                  "td",
                  {
                    className: `px-2 md:px-4 py-3 md:py-4 text-center ${competitor.highlight ? "bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-l-2 border-gradient-to-b from-blue-500 to-purple-500" : ""}`,
                    children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center", children: [
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: `inline-flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full text-xs md:text-sm font-bold ${value.status ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/40 animate-check-pulse" : "bg-gray-800 border border-gray-700 text-gray-500"}`,
                          children: value.status ? "✓" : "−"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: `mt-1 text-[10px] md:text-xs ${value.status && competitor.highlight ? "font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent" : "text-gray-400"}`,
                          children: value.value
                        }
                      )
                    ] })
                  },
                  competitor.key
                );
              })
            ]
          },
          index
        )) })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-8 md:mt-12", children: comparisonData.stats.map((stat, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg md:rounded-xl p-4 md:p-6 text-center hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300",
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent", children: stat.value }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2 uppercase tracking-wider", children: stat.label })
          ]
        },
        index
      )) })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        @keyframes check-pulse {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
          }
          50% { 
            transform: scale(1.1); 
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.6);
          }
        }

        @keyframes fade-in-row {
          to {
            opacity: 1;
          }
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 5s ease infinite;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .animate-check-pulse {
          animation: check-pulse 2s ease-in-out infinite;
        }

        .animate-fade-in-row {
          animation: fade-in-row 0.5s ease-out forwards;
        }

        tbody tr.visible {
          opacity: 1;
        }

        /* Custom scrollbar for the table */
        .overflow-x-auto::-webkit-scrollbar {
          height: 6px;
        }

        .overflow-x-auto::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 3px;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 3px;
        }

        /* Mobile specific optimizations */
        @media (max-width: 768px) {
          .comparison-section {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }

          table {
            font-size: 0.75rem;
          }

          th, td {
            padding: 0.5rem 0.25rem;
          }

          .sticky {
            position: sticky;
            left: 0;
            z-index: 10;
          }

          /* Ensure the feature column doesn't get too narrow */
          th:first-child,
          td:first-child {
            min-width: 100px;
            max-width: 120px;
            word-wrap: break-word;
          }

          /* Make competitor columns narrower on mobile */
          th:not(:first-child),
          td:not(:first-child) {
            min-width: 60px;
          }
        }

        /* Gradient border effect */
        .border-gradient-to-b {
          border-image: linear-gradient(180deg, #3b82f6, #8b5cf6) 1;
        }
      ` })
  ] });
};

const CustomizableCard = ({
  width = "100%",
  height = "auto",
  title,
  content,
  className = "",
  draggable = false,
  onMouseDown,
  style = {}
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `card bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(99,102,241,0.1)] ${className}`,
      style: {
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-gradient-to-b from-gray-700/90 to-gray-800/90 backdrop-blur-sm px-4 py-2.5 flex items-center border-b border-gray-600/50",
            style: {
              cursor: draggable ? "grab" : "default",
              userSelect: "none"
            },
            onMouseDown: draggable ? onMouseDown : void 0,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex space-x-2 mr-4", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-red-500/80 rounded-full border border-red-600/50 hover:bg-red-500 transition-colors duration-200" }),
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-yellow-500/80 rounded-full border border-yellow-600/50 hover:bg-yellow-500 transition-colors duration-200" }),
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-green-500/80 rounded-full border border-green-600/50 hover:bg-green-500 transition-colors duration-200" })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-200 flex-1 text-center tracking-wide", children: title }),
              /* @__PURE__ */ jsx("div", { className: "w-16" }),
              " "
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "p-6 bg-gradient-to-b from-gray-900/95 to-gray-900/98", style: { height: "calc(100% - 44px)" }, children: content })
      ]
    }
  );
};

const DraggableCustomizableCard = ({
  width,
  height,
  title,
  children,
  className = "",
  style = {}
}) => {
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - transform.x,
      y: e.clientY - transform.y
    };
  };
  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e) => {
      setTransform({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y
      });
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: cardRef,
      style: {
        position: "relative",
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: isDragging ? 1e3 : "auto",
        cursor: isDragging ? "grabbing" : "grab",
        transition: isDragging ? "none" : "transform 0.1s ease-out",
        ...style
      },
      children: /* @__PURE__ */ jsx(
        CustomizableCard,
        {
          width,
          height,
          title,
          content: children,
          className,
          draggable: true,
          onMouseDown: handleMouseDown
        }
      )
    }
  );
};

const WhyBetterSection = () => {
  const [cardsVisible, setCardsVisible] = useState([false, false, false]);
  useEffect(() => {
    const timer1 = setTimeout(() => setCardsVisible([true, false, false]), 100);
    const timer2 = setTimeout(() => setCardsVisible([true, true, false]), 400);
    const timer3 = setTimeout(() => setCardsVisible([true, true, true]), 700);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);
  return /* @__PURE__ */ jsx("div", { className: "w-full bg-gradient-to-b from-gray-800 to-gray-900 py-12 px-4", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full", children: [
    /* @__PURE__ */ jsx("div", { className: `flex justify-center transition-all duration-700 transform ${cardsVisible[0] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`, children: /* @__PURE__ */ jsx(
      DraggableCustomizableCard,
      {
        width: 400,
        height: 560,
        title: "Advanced Code Understanding",
        children: /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col p-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsx("div", { className: "h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 mb-4 transition-all duration-500 hover:w-24" }),
            /* @__PURE__ */ jsx("h4", { className: "text-2xl font-bold text-gray-100 mb-3", children: "Code Understanding" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 leading-relaxed" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5 text-left flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "group", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("div", { className: "w-1 h-12 bg-gradient-to-b from-indigo-500 to-transparent mr-4 transition-all duration-300 group-hover:h-14" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h5", { className: "text-sm font-semibold text-gray-200 mb-1", children: "Automatic Codebase Documentation" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 leading-relaxed", children: "AI analyzes and documents your entire codebase. 50%+ reduction in token usage through deep understanding. Framework-specific intelligence (React vs Django vs Rails)." })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "group", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("div", { className: "w-1 h-12 bg-gradient-to-b from-purple-500 to-transparent mr-4 transition-all duration-300 group-hover:h-14" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h5", { className: "text-sm font-semibold text-gray-200 mb-1", children: "Intelligent Project Awareness" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 leading-relaxed", children: "Generates executive summaries of your architecture. Maps all component relationships automatically. Understands your specific design patterns." })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "group", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("div", { className: "w-1 h-12 bg-gradient-to-b from-indigo-500 to-transparent mr-4 transition-all duration-300 group-hover:h-14" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h5", { className: "text-sm font-semibold text-gray-200 mb-1", children: "Context-Aware Search" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 leading-relaxed", children: "Customizes queries for YOUR tech stack. AST-aware code chunking for precision. Real-time index updates as you code." })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-6 pt-4 border-t border-gray-700", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-500", children: [
            /* @__PURE__ */ jsx("span", { children: "Automatic Context Compression" }),
            /* @__PURE__ */ jsx("span", { children: "Savings: 50%" })
          ] }) })
        ] })
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: `flex justify-center transition-all duration-700 transform ${cardsVisible[1] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`, style: { marginTop: "-35px" }, children: /* @__PURE__ */ jsx(
      DraggableCustomizableCard,
      {
        width: 400,
        height: 560,
        title: "Optimized Cost Structure",
        children: /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col p-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsx("div", { className: "h-1 w-16 bg-gradient-to-r from-green-500 to-emerald-500 mb-4 transition-all duration-500 hover:w-24" }),
            /* @__PURE__ */ jsx("h4", { className: "text-2xl font-bold text-gray-100 mb-3", children: "Optimized Cost Structure" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 leading-relaxed", children: "AI chooses the cheapest capable model for each task. Simple tasks → cheap models, Complex tasks → advanced models. Average 60% cost reduction." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5 text-left flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "group", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("div", { className: "w-1 h-12 bg-gradient-to-b from-green-500 to-transparent mr-4 transition-all duration-300 group-hover:h-14" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h5", { className: "text-sm font-semibold text-gray-200 mb-1", children: "Automatic Model Selection" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 leading-relaxed", children: "AI chooses the cheapest capable model for each task." })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "group", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("div", { className: "w-1 h-12 bg-gradient-to-b from-emerald-500 to-transparent mr-4 transition-all duration-300 group-hover:h-14" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h5", { className: "text-sm font-semibold text-gray-200 mb-1", children: "Multi-Task Efficiency" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 leading-relaxed", children: "20+ concurrent tasks with focused contexts. Each subtask uses minimal tokens. Main context stays small = massive savings." })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "group", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("div", { className: "w-1 h-12 bg-gradient-to-b from-green-500 to-transparent mr-4 transition-all duration-300 group-hover:h-14" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h5", { className: "text-sm font-semibold text-gray-200 mb-1", children: "Smart Context Management" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 leading-relaxed", children: "Automatic conversation condensing. Token-perfect counting for every model. Budget enforcement per task or globally." })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-6 pt-4 border-t border-gray-700", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-500", children: [
            /* @__PURE__ */ jsx("span", { children: "Huge Savings" }),
            /* @__PURE__ */ jsx("span", { children: "Estimated: 50-75%" })
          ] }) })
        ] })
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: `flex justify-center transition-all duration-700 transform ${cardsVisible[2] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`, children: /* @__PURE__ */ jsx(
      DraggableCustomizableCard,
      {
        width: 400,
        height: 560,
        title: "Rapid Development",
        children: /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col p-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsx("div", { className: "h-1 w-16 bg-gradient-to-r from-orange-500 to-red-500 mb-4 transition-all duration-500 hover:w-24" }),
            /* @__PURE__ */ jsx("h4", { className: "text-2xl font-bold text-gray-100 mb-3", children: "Next Generation Features" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 leading-relaxed", children: "True multi-tasking capabilities." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5 text-left flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "group", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("div", { className: "w-1 h-12 bg-gradient-to-b from-orange-500 to-transparent mr-4 transition-all duration-300 group-hover:h-14" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h5", { className: "text-sm font-semibold text-gray-200 mb-1", children: "Massive Parallelization" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 leading-relaxed", children: "Run 20+ AI tasks simultaneously. Complete hours of work in minutes. Automatic task decomposition and routing." })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "group", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("div", { className: "w-1 h-12 bg-gradient-to-b from-red-500 to-transparent mr-4 transition-all duration-300 group-hover:h-14" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h5", { className: "text-sm font-semibold text-gray-200 mb-1", children: "Enterprise Cloud & Team Management" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 leading-relaxed", children: "Complete cloud backup of all conversations. Monitor your entire dev team's AI usage. Synchronize modes across your organization. View comprehensive reports for management." })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "group", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("div", { className: "w-1 h-12 bg-gradient-to-b from-orange-500 to-transparent mr-4 transition-all duration-300 group-hover:h-14" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h5", { className: "text-sm font-semibold text-gray-200 mb-1", children: "Mobile Continuity" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 leading-relaxed", children: "Native iOS app with real-time sync. Start on desktop, continue on iPhone. Zero context switches." })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-6 pt-4 border-t border-gray-700", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-500", children: [
            /* @__PURE__ */ jsx("span", { children: "Full Cloud Enterprise Solution" }),
            /* @__PURE__ */ jsx("span", { children: "More Savings" })
          ] }) })
        ] })
      }
    ) })
  ] }) }) });
};

const $$KeyFeaturesSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="w-full bg-gray-950"> <div class="max-w-7xl mx-auto py-16 px-4"> <h2 class="text-4xl md:text-5xl font-bold text-center text-white mb-12">Key Features</h2> ${renderComponent($$result, "FeatureGrid", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/prestongarrison/Source/convert/codersinflow.com/src/components/FeatureGrid", "client:component-export": "default" })} </div> </div>`;
}, "/Users/prestongarrison/Source/convert/codersinflow.com/src/components/sections/KeyFeaturesSection.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "AI-Powered Pair Programming with Coders In Flow - VSCode Extension for Developers", "description": "Better than RooCode, Cline & Cursor combined! Coders In Flow delivers next-gen AI pair programming for VSCode developers", "keywords": "AI coding assistant, code generation, Claude Code, DeepSeek, OpenAI, LM Studio, Ollama, context editing, VS Code extension, GitHub Copilot alternative, automatic memory, smart code completion" }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Header", $$HeaderSimple, {})}  ${renderComponent($$result2, "HeroComparison", HeroComparison, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/prestongarrison/Source/convert/codersinflow.com/src/components/HeroComparison", "client:component-export": "default" })}  ${renderComponent($$result2, "FeatureShowcaseSection", FeatureShowcaseSection, { "client:load": true, "data": featuresData, "client:component-hydration": "load", "client:component-path": "/Users/prestongarrison/Source/convert/codersinflow.com/src/components/FeatureShowcaseSection", "client:component-export": "default" })}  ${renderComponent($$result2, "ComparisonTable", ComparisonTable, { "client:load": true, "data": comparisonData, "client:component-hydration": "load", "client:component-path": "/Users/prestongarrison/Source/convert/codersinflow.com/src/components/ComparisonTable", "client:component-export": "default" })}  ${renderComponent($$result2, "WhyBetterSection", WhyBetterSection, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/prestongarrison/Source/convert/codersinflow.com/src/components/sections/WhyBetterSection", "client:component-export": "default" })}  ${renderComponent($$result2, "VideoSection", null, { "client:only": "react", "data": videosData, "client:component-hydration": "only", "client:component-path": "/Users/prestongarrison/Source/convert/codersinflow.com/src/components/sections/VideoSection", "client:component-export": "default" })}    ${renderComponent($$result2, "KeyFeaturesSection", $$KeyFeaturesSection, {})}      ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/index.astro", void 0);

const $$file = "/Users/prestongarrison/Source/convert/codersinflow.com/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
