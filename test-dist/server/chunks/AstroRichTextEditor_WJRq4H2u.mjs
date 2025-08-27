import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Link from '@tiptap/extension-link';
import { createLowlight, common } from 'lowlight';
import { Bold, Italic, List, ListOrdered, Code, Quote, Link2, ImageIcon } from 'lucide-react';
/* empty css                        */
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import java from 'highlight.js/lib/languages/java';
import ruby from 'highlight.js/lib/languages/ruby';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import shell from 'highlight.js/lib/languages/shell';
import plaintext from 'highlight.js/lib/languages/plaintext';

const lowlight = createLowlight(common);
lowlight.register("typescript", typescript);
lowlight.register("javascript", javascript);
lowlight.register("python", python);
lowlight.register("ruby", ruby);
lowlight.register("go", go);
lowlight.register("rust", rust);
lowlight.register("java", java);
lowlight.register("bash", bash);
lowlight.register("json", json);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("c", c);
lowlight.register("cpp", cpp);
lowlight.register("shell", shell);
lowlight.register("plaintext", plaintext);
function RichTextEditor({ content, onChange, placeholder = "Start writing..." }) {
  const [isMounted, setIsMounted] = useState(false);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    if (content && content.trim() && typeof window !== "undefined") {
      window.__editorContent = content;
    }
  }, []);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full rounded-lg my-4"
        }
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: null,
        HTMLAttributes: {
          class: "hljs not-prose bg-[#0d1117] rounded-lg p-4 overflow-x-auto text-sm leading-relaxed",
          spellcheck: "false"
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-400 hover:text-blue-300 underline",
          rel: "noopener noreferrer",
          target: "_blank"
        },
        validate: (href) => /^https?:\/\//.test(href)
      })
    ],
    content: isMounted ? (() => {
      try {
        if (content && content.trim()) {
          return typeof content === "string" ? JSON.parse(content) : content;
        }
        return "";
      } catch (e) {
        console.error("Failed to parse initial content:", e);
        return "";
      }
    })() : "",
    editorProps: {
      attributes: {
        class: "prose prose-invert min-h-[400px] max-w-none w-full p-4 focus:outline-none"
      },
      handlePaste: (view, event, slice) => {
        return false;
      }
    },
    onUpdate: ({ editor: editor2 }) => {
      const json2 = editor2.getJSON();
      const jsonString = JSON.stringify(json2);
      if (typeof window !== "undefined") {
        window.__editorContent = jsonString;
      }
      if (onChange) {
        try {
          onChange(jsonString);
        } catch (error) {
          console.error("Error calling onChange:", error);
        }
      }
    },
    immediatelyRender: false,
    placeholder
  });
  useEffect(() => {
    if (editor && content && isMounted) {
      try {
        const parsedContent = typeof content === "string" ? JSON.parse(content) : content;
        const currentContent = editor.getJSON();
        if (JSON.stringify(currentContent) !== JSON.stringify(parsedContent)) {
          editor.commands.setContent(parsedContent);
        }
      } catch (e) {
        console.error("Failed to sync content:", e);
      }
    }
  }, [content, editor, isMounted]);
  const addImage = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${"https://codersinflow.com"}/api/upload`, {
          method: "POST",
          body: formData,
          credentials: "include"
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Upload failed:", response.status, errorText);
          throw new Error(`Upload failed: ${response.status} ${errorText}`);
        }
        const { url } = await response.json();
        const fullUrl = `${"https://codersinflow.com"}${url}`;
        editor?.chain().focus().setImage({ src: fullUrl }).run();
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload image");
      } finally {
        setUploading(false);
      }
    };
    input.click();
  }, [editor]);
  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);
    if (url === null) {
      return;
    }
    if (url === "") {
      editor?.chain().focus().unsetLink().run();
      return;
    }
    try {
      new URL(url);
    } catch {
      alert("Please enter a valid URL (including http:// or https://)");
      return;
    }
    editor?.chain().focus().setLink({ href: url }).run();
  }, [editor]);
  const hasTextSelection = useCallback(() => {
    return editor?.state.selection.content().size ?? 0 > 0;
  }, [editor]);
  if (!isMounted || !editor) {
    return /* @__PURE__ */ jsx("div", { className: "border border-gray-700 rounded-lg bg-gray-800 min-h-[400px] p-4 text-gray-400", children: "Loading editor..." });
  }
  return /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "border border-gray-700 rounded-lg bg-gray-800 overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "border-b border-gray-700 bg-gray-900 p-2", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => editor.chain().focus().toggleBold().run(),
          className: `p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white ${editor.isActive("bold") ? "bg-gray-700 text-white" : ""}`,
          title: "Bold",
          children: /* @__PURE__ */ jsx(Bold, { size: 16 })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => editor.chain().focus().toggleItalic().run(),
          className: `p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white ${editor.isActive("italic") ? "bg-gray-700 text-white" : ""}`,
          title: "Italic",
          children: /* @__PURE__ */ jsx(Italic, { size: 16 })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-gray-700 mx-1" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          className: `px-2 py-1 rounded hover:bg-gray-700 text-gray-300 hover:text-white ${editor.isActive("heading", { level: 1 }) ? "bg-gray-700 text-white" : ""}`,
          title: "Heading 1",
          children: "H1"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          className: `px-2 py-1 rounded hover:bg-gray-700 text-gray-300 hover:text-white ${editor.isActive("heading", { level: 2 }) ? "bg-gray-700 text-white" : ""}`,
          title: "Heading 2",
          children: "H2"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          className: `px-2 py-1 rounded hover:bg-gray-700 text-gray-300 hover:text-white ${editor.isActive("heading", { level: 3 }) ? "bg-gray-700 text-white" : ""}`,
          title: "Heading 3",
          children: "H3"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-gray-700 mx-1" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => editor.chain().focus().toggleBulletList().run(),
          className: `p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white ${editor.isActive("bulletList") ? "bg-gray-700 text-white" : ""}`,
          title: "Bullet List",
          children: /* @__PURE__ */ jsx(List, { size: 16 })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => editor.chain().focus().toggleOrderedList().run(),
          className: `p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white ${editor.isActive("orderedList") ? "bg-gray-700 text-white" : ""}`,
          title: "Ordered List",
          children: /* @__PURE__ */ jsx(ListOrdered, { size: 16 })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-gray-700 mx-1" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => editor.chain().focus().toggleCodeBlock().run(),
          className: `p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white ${editor.isActive("codeBlock") ? "bg-gray-700 text-white" : ""}`,
          title: "Code Block",
          children: /* @__PURE__ */ jsx(Code, { size: 16 })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => editor.chain().focus().toggleBlockquote().run(),
          className: `p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white ${editor.isActive("blockquote") ? "bg-gray-700 text-white" : ""}`,
          title: "Quote",
          children: /* @__PURE__ */ jsx(Quote, { size: 16 })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-gray-700 mx-1" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: setLink,
          disabled: !hasTextSelection(),
          className: `p-2 rounded ${editor?.isActive("link") ? "bg-gray-700 text-white" : hasTextSelection() ? "hover:bg-gray-700 text-gray-300 hover:text-white" : "opacity-50 cursor-not-allowed text-gray-500"}`,
          title: hasTextSelection() ? "Add Link" : "Select text to add link",
          children: /* @__PURE__ */ jsx(Link2, { size: 16 })
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: addImage,
          className: "p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white relative",
          title: "Add Image",
          disabled: uploading,
          children: [
            /* @__PURE__ */ jsx(ImageIcon, { size: 16, className: uploading ? "opacity-50" : "" }),
            uploading && /* @__PURE__ */ jsx("div", { className: "absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs whitespace-nowrap", children: "Uploading..." })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(EditorContent, { editor })
  ] }) });
}

function AstroRichTextEditor({ content, placeholder, inputId = "content" }) {
  const contentRef = useRef(content || "");
  const handleChange = (newContent) => {
    contentRef.current = newContent;
    const hiddenInput = document.getElementById(inputId);
    if (hiddenInput) {
      hiddenInput.value = newContent;
    }
    if (typeof window !== "undefined") {
      window.__editorContent = newContent;
    }
  };
  useEffect(() => {
    if (content) {
      handleChange(content);
    }
  }, []);
  return /* @__PURE__ */ jsx(
    RichTextEditor,
    {
      content,
      onChange: handleChange,
      placeholder
    }
  );
}

export { AstroRichTextEditor as A };
