"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import type { TipTapDocument } from "@/lib/types/content"

type ToolbarButtonProps = {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded px-2 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted text-muted-foreground hover:text-foreground",
        disabled && "pointer-events-none opacity-40",
      )}
    >
      {children}
    </button>
  )
}

type BlogEditorProps = {
  value: TipTapDocument | null
  onChange: (doc: TipTapDocument) => void
  className?: string
}

export function BlogEditor({ value, onChange, className }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { languageClassPrefix: "language-" },
      }),
      Placeholder.configure({
        placeholder: "Empieza a escribir tu blog…",
      }),
    ],
    content: value ?? undefined,
    onUpdate({ editor }) {
      onChange(editor.getJSON() as TipTapDocument)
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[280px] px-4 py-3 focus:outline-none prose prose-sm max-w-none",
      },
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    if (!editor) return
    const current = JSON.stringify(editor.getJSON())
    const next = JSON.stringify(value)
    if (current !== next && value) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [editor, value])

  if (!editor) return null

  return (
    <div className={cn("rounded-md border", className)}>
      <div className="flex flex-wrap gap-0.5 border-b bg-muted/30 px-2 py-1.5">
        <ToolbarButton
          title="Negrita"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          title="Cursiva"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          title="Tachado"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
        >
          <s>S</s>
        </ToolbarButton>
        <ToolbarButton
          title="Código en línea"
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
        >
          {"</>"}
        </ToolbarButton>

        <span className="mx-1 self-stretch border-l" />

        <ToolbarButton
          title="Encabezado 1"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          title="Encabezado 2"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Encabezado 3"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
        >
          H3
        </ToolbarButton>

        <span className="mx-1 self-stretch border-l" />

        <ToolbarButton
          title="Lista con viñetas"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          •—
        </ToolbarButton>
        <ToolbarButton
          title="Lista numerada"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          1.
        </ToolbarButton>
        <ToolbarButton
          title="Cita"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          ❝
        </ToolbarButton>
        <ToolbarButton
          title="Bloque de código"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
        >
          {"{ }"}
        </ToolbarButton>
        <ToolbarButton
          title="Separador"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          —
        </ToolbarButton>

        <span className="mx-1 self-stretch border-l" />

        <ToolbarButton
          title="Deshacer"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          ↩
        </ToolbarButton>
        <ToolbarButton
          title="Rehacer"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          ↪
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
