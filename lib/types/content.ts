/**
 * TipTap / ProseMirror JSON document types.
 * These match the shape that @tiptap/starter-kit outputs via editor.getJSON().
 */

export type TextMark = {
  type: "bold" | "italic" | "strike" | "code" | "link" | string
  attrs?: Record<string, unknown>
}

export type ContentNode =
  | DocNode
  | ParagraphNode
  | HeadingNode
  | TextNode
  | BulletListNode
  | OrderedListNode
  | ListItemNode
  | BlockquoteNode
  | CodeBlockNode
  | HorizontalRuleNode
  | HardBreakNode
  | ImageNode

export type DocNode = {
  type: "doc"
  content: ContentNode[]
}

export type ParagraphNode = {
  type: "paragraph"
  content?: ContentNode[]
}

export type HeadingNode = {
  type: "heading"
  attrs: { level: 1 | 2 | 3 | 4 | 5 | 6 }
  content?: ContentNode[]
}

export type TextNode = {
  type: "text"
  text: string
  marks?: TextMark[]
}

export type BulletListNode = {
  type: "bulletList"
  content: ListItemNode[]
}

export type OrderedListNode = {
  type: "orderedList"
  attrs?: { start: number }
  content: ListItemNode[]
}

export type ListItemNode = {
  type: "listItem"
  content: ContentNode[]
}

export type BlockquoteNode = {
  type: "blockquote"
  content: ContentNode[]
}

export type CodeBlockNode = {
  type: "codeBlock"
  attrs?: { language?: string | null }
  content?: TextNode[]
}

export type HorizontalRuleNode = {
  type: "horizontalRule"
}

export type HardBreakNode = {
  type: "hardBreak"
}

export type ImageNode = {
  type: "image"
  attrs: {
    src: string
    alt?: string | null
    title?: string | null
  }
}

export type TipTapDocument = DocNode
