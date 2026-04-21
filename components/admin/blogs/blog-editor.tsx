"use client"

import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"
import { useCallback, useEffect, useRef, useState } from "react"
import { ImageIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { uploadCoverImage } from "@/lib/actions/blog"
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

async function uploadImageFile(file: File): Promise<string> {
  const fd = new FormData()
  fd.append("file", file)
  const result = await uploadCoverImage(fd)
  if (result.error || !result.url) {
    throw new Error(result.error ?? "No se pudo subir la imagen.")
  }
  return result.url
}

type JsonNode = {
  type: string
  attrs?: Record<string, unknown>
  content?: JsonNode[]
  [key: string]: unknown
}

// Strip any image nodes that lack a usable remote src. This guards against
// default paste/drop pipelines (or foreign HTML) inserting bare <img> nodes
// without a valid uploaded URL.
function sanitizeDoc(doc: JsonNode): JsonNode {
  if (!doc) return doc
  if (Array.isArray(doc.content)) {
    doc.content = doc.content
      .map((child) => sanitizeDoc(child))
      .filter((child): child is JsonNode => {
        if (child.type !== "image") return true
        const src = (child.attrs?.src as string | undefined) ?? ""
        return src.startsWith("http://") || src.startsWith("https://")
      })
  }
  return doc
}

export function BlogEditor({ value, onChange, className }: BlogEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<Editor | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleUploadAndInsert = useCallback(async (file: File) => {
    const editorInstance = editorRef.current
    if (!editorInstance) return
    if (!file.type.startsWith("image/")) return
    setUploadError(null)
    setIsUploading(true)
    try {
      const url = await uploadImageFile(file)
      editorInstance
        .chain()
        .focus()
        .setImage({ src: url, alt: file.name })
        .run()
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Error subiendo imagen.",
      )
    } finally {
      setIsUploading(false)
    }
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { languageClassPrefix: "language-" },
      }),
      Placeholder.configure({
        placeholder: "Empieza a escribir tu blog…",
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: "my-6 rounded-lg max-w-full h-auto",
        },
      }),
    ],
    content: value ?? undefined,
    onUpdate({ editor }) {
      const json = editor.getJSON() as unknown as JsonNode
      const clean = sanitizeDoc(
        JSON.parse(JSON.stringify(json)) as JsonNode,
      )
      onChange(clean as unknown as TipTapDocument)
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[280px] px-4 py-3 focus:outline-none prose prose-sm max-w-none",
      },
      handlePaste(_view, event) {
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) =>
          f.type.startsWith("image/"),
        )
        const html = event.clipboardData?.getData("text/html") ?? ""
        const htmlHasImage = /<img[\s>]/i.test(html)

        if (files.length === 0 && !htmlHasImage) return false

        event.preventDefault()
        files.forEach((file) => {
          void handleUploadAndInsert(file)
        })
        // If the clipboard HTML had an <img> but no File (e.g. copied from
        // another page), we drop it entirely to avoid inserting an image
        // node with a foreign/unsafe src. The user must re-insert via the
        // toolbar so it gets uploaded to our storage.
        return true
      },
      handleDrop(_view, event) {
        const files = Array.from(
          (event as DragEvent).dataTransfer?.files ?? [],
        ).filter((f) => f.type.startsWith("image/"))
        const dragHtml =
          (event as DragEvent).dataTransfer?.getData("text/html") ?? ""
        const dragHasImage = /<img[\s>]/i.test(dragHtml)

        if (files.length === 0 && !dragHasImage) return false

        event.preventDefault()
        files.forEach((file) => {
          void handleUploadAndInsert(file)
        })
        return true
      },
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    editorRef.current = editor ?? null
  }, [editor])

  useEffect(() => {
    if (!editor) return
    const current = JSON.stringify(editor.getJSON())
    const next = JSON.stringify(value)
    if (current !== next && value) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [editor, value])

  function handleImageButtonClick() {
    if (isUploading) return
    fileInputRef.current?.click()
  }

  async function handleFileInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    await handleUploadAndInsert(file)
  }

  if (!editor) return null

  return (
    <div className={cn("rounded-md border", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />

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
          title={isUploading ? "Subiendo imagen…" : "Insertar imagen"}
          onClick={handleImageButtonClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <ImageIcon className="size-3.5" />
          )}
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

      {uploadError ? (
        <p className="border-t bg-destructive/10 px-4 py-2 text-xs text-destructive">
          {uploadError}
        </p>
      ) : null}
    </div>
  )
}
