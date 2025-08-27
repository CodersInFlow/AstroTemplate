import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';
/* empty css                          */

const lowlight = createLowlight(common);
function BlogPostViewer({ post }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false
        // We'll use CodeBlockLowlight instead
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full rounded-lg my-4"
        }
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "auto",
        HTMLAttributes: {
          class: "hljs not-prose bg-[#0d1117] rounded-lg p-4 overflow-x-auto text-sm leading-relaxed",
          spellcheck: "false"
        }
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-blue-400 hover:text-blue-300 underline",
          rel: "noopener noreferrer",
          target: "_blank"
        }
      })
    ],
    content: isMounted && post?.content ? (() => {
      try {
        if (post.content && post.content.trim()) {
          return typeof post.content === "string" ? JSON.parse(post.content) : post.content;
        }
        return "";
      } catch (e) {
        console.error("Failed to parse content:", e);
        return "";
      }
    })() : "",
    editable: false,
    // Read-only mode
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none w-full focus:outline-none"
      }
    }
  }, [post?.content, isMounted]);
  if (!isMounted || !editor) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-[400px] p-4 text-gray-400", children: "Loading..." });
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  return /* @__PURE__ */ jsx("div", { className: "w-full max-w-none mx-auto px-4 py-8", children: /* @__PURE__ */ jsx("div", { className: "lg:grid lg:grid-cols-4 lg:gap-8", children: /* @__PURE__ */ jsxs("article", { className: "col-span-3 min-w-0 w-full", children: [
    /* @__PURE__ */ jsxs("header", { className: "mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-blog-text-secondary text-sm mb-2", children: [
        /* @__PURE__ */ jsx("span", { children: post.category_data?.name || "General" }),
        /* @__PURE__ */ jsx("span", { children: "•" }),
        /* @__PURE__ */ jsx("span", { children: formatDate(post.createdAt) }),
        /* @__PURE__ */ jsx("span", { children: "•" }),
        /* @__PURE__ */ jsxs("span", { children: [
          post.readingTime,
          " min read"
        ] })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-4 text-blog-text-primary", children: post.title }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-blog-author-avatar-bg text-blog-author-avatar-text flex items-center justify-center", children: post.author_data?.name?.charAt(0).toUpperCase() || "A" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-medium text-blog-text-primary", children: post.author_data?.name || "Anonymous" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-blog-text-muted", children: post.author_data?.email || "" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "prose prose-invert max-w-none", children: /* @__PURE__ */ jsx(EditorContent, { editor }) })
  ] }) }) });
}

export { BlogPostViewer as B };
