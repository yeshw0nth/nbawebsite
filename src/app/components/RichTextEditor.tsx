"use client";

import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Sparkles } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = "Start typing..." }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 text-foreground',
      },
    },
  });

  const handleAutoFormat = useCallback(() => {
    if (!editor) return;
    let html = editor.getHTML();
    
    // Strip style, class, id, dir attributes from all tags
    html = html.replace(/\s+(style|class|id|dir|data-[-a-z]+)="[^"]*"/gi, '');
    
    // Strip empty or useless span tags (which Google Docs brings heavily)
    html = html.replace(/<span[^>]*>/gi, '');
    html = html.replace(/<\/span>/gi, '');
    
    // Also strip font tags if any
    html = html.replace(/<font[^>]*>/gi, '');
    html = html.replace(/<\/font>/gi, '');

    // Replace b with strong for semantics
    html = html.replace(/<b>/gi, '<strong>');
    html = html.replace(/<\/b>/gi, '</strong>');

    // Replace i with em for semantics
    html = html.replace(/<i>/gi, '<em>');
    html = html.replace(/<\/i>/gi, '</em>');

    editor.commands.setContent(html);
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full border border-border rounded-lg bg-card overflow-hidden focus-within:ring-1 focus-within:ring-accent transition-all">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-border bg-muted/20 p-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-md transition-colors ${editor.isActive('bold') ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-md transition-colors ${editor.isActive('italic') ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-md transition-colors ${editor.isActive('bulletList') ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-md transition-colors ${editor.isActive('orderedList') ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        
        <div className="flex-1" />
        
        <button
          onClick={handleAutoFormat}
          className="p-1.5 rounded-md transition-colors text-accent hover:bg-accent/10 flex items-center gap-1.5 text-xs font-medium"
          title="Strip messy formatting (e.g. from Google Docs)"
        >
          <Sparkles size={14} />
          Auto-Format
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="cursor-text" />
      <style dangerouslySetInnerHTML={{__html: `
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--color-muted-foreground, #a1a1aa);
          pointer-events: none;
          height: 0;
        }
      `}} />
    </div>
  );
}
