import { e as createAstro, f as createComponent, r as renderTemplate, n as renderSlot, o as renderHead, u as unescapeHTML, h as addAttribute } from './astro/server_CDr6vjmS.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                          */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://codersinflow.com");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title,
    description = "Coders in Flow - AI-Powered Code Assistance that is Efficient, Affordable, and Effective. Advanced context management, 90% lower costs, superior code generation.",
    keywords = "AI coding assistant, code generation, intelligent code completion, context-aware programming, DeepSeek, Claude Code, OpenAI, affordable AI coding, code refactoring, multi-file editing, semantic code analysis",
    image = "/og-image.png",
    url = "https://codersinflow.com",
    author = "Coders in Flow"
  } = Astro2.props;
  const canonicalURL = new URL(Astro2.url.pathname, url);
  const imageURL = new URL(image, url);
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><!-- Basic Meta Tags --><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"', "><!-- SEO Meta Tags --><title>", '</title><meta name="description"', '><meta name="keywords"', '><meta name="author"', '><link rel="canonical"', '><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:site_name" content="Coders in Flow"><meta property="og:locale" content="en_US"><!-- Twitter --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:url"', '><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><!-- Mobile App Meta --><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Coders in Flow"><!-- Performance & Security --><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="referrer" content="origin-when-cross-origin"><!-- Theme Color --><meta name="theme-color" content="#111827"><!-- Robots --><meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"><meta name="googlebot" content="index, follow"><!-- Favicons --><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" type="image/x-icon" href="/favicon.ico"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"><link rel="manifest" href="/site.webmanifest"><!-- Preconnect to external domains --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><!-- Structured Data --><script type="application/ld+json">', "<\/script>", "</head> <body> ", " </body></html>"])), addAttribute(Astro2.generator, "content"), title, addAttribute(description, "content"), addAttribute(keywords, "content"), addAttribute(author, "content"), addAttribute(canonicalURL, "href"), addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(imageURL, "content"), addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(imageURL, "content"), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Coders in Flow",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web, iOS, Android",
    "description": description,
    "url": url,
    "author": {
      "@type": "Organization",
      "name": "Coders in Flow"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1247"
    }
  })), renderHead(), renderSlot($$result, $$slots["default"]));
}, "/Users/prestongarrison/Source/convert/codersinflow.com/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
