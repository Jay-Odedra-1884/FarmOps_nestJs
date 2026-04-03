"use client"; // required for client-side rendering in Next.js app directory

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Heading2, Undo2, Redo2 } from "lucide-react";

export default function RichTextEditor({ editorRef }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false
  });

  // Expose the editor to parent component
  React.useEffect(() => {
    if (editorRef) editorRef.current = editor;
  }, [editor, editorRef]);

  if (!editor) {
    return <div className="border border-gray-300 rounded-md p-4 min-h-[200px] mb-4 bg-white" />;
  }

  const toolbarButtonClass = "p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 border border-gray-300 bg-white text-gray-700 cursor-pointer";
  const activeButtonClass = "p-2 rounded-md transition-colors duration-200 border border-gray-400 bg-blue-100 text-blue-700 cursor-pointer font-semibold";

  return (
    <div className="mb-4">
      {/* Toolbar */}
      <div className="flex gap-1 mb-2 p-2 bg-gray-100 border border-gray-300 rounded-t-md flex-wrap">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? activeButtonClass : toolbarButtonClass}
          title="Bold (Ctrl+B)"
          type="button"
        >
          <Bold size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? activeButtonClass : toolbarButtonClass}
          title="Italic (Ctrl+I)"
          type="button"
        >
          <Italic size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? activeButtonClass : toolbarButtonClass}
          title="Heading"
          type="button"
        >
          <Heading2 size={18} />
        </button>

        <div className="border-l border-gray-300"></div>

        <button
          onClick={() => editor.chain().focus().undo().run()}
          className={toolbarButtonClass}
          title="Undo"
          type="button"
        >
          <Undo2 size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          className={toolbarButtonClass}
          title="Redo"
          type="button"
        >
          <Redo2 size={18} />
        </button>
      </div>

      {/* Editor Content */}
      <div className="border border-gray-300 rounded-b-md bg-white overflow-hidden">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none focus:outline-none"
          style={{
            minHeight: "200px",
            padding: "12px",
            fontSize: "14px",
            lineHeight: "1.6"
          }}
        />
      </div>

      <style>{`
        .ProseMirror {
          outline: none;
          min-height: 200px;
          padding: 12px;
          font-size: 14px;
          line-height: 1.6;
          color: #374151;
        }

        .ProseMirror h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin: 0.67em 0;
        }

        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0.75em 0;
        }

        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.83em 0;
        }

        .ProseMirror p {
          margin: 0.5em 0;
        }

        .ProseMirror strong {
          font-weight: 600;
        }

        .ProseMirror em {
          font-style: italic;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }

        .ProseMirror li {
          margin: 0.25em 0;
        }

        .ProseMirror a {
          color: #3b82f6;
          text-decoration: underline;
          cursor: pointer;
        }

        .ProseMirror a:hover {
          color: #1d4ed8;
        }

        .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
        }

        .ProseMirror pre {
          background-color: #1f2937;
          color: #f3f4f6;
          padding: 1em;
          border-radius: 5px;
          overflow-x: auto;
          margin: 0.5em 0;
        }

        .ProseMirror pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }

        .ProseMirror blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1em;
          margin-left: 0;
          margin-right: 0;
          color: #6b7280;
          font-style: italic;
        }

        .ProseMirror hr {
          border: none;
          border-top: 1px solid #d1d5db;
          margin: 1em 0;
        }
      `}</style>
    </div>
  );
}
