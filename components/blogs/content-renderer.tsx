import { cn } from "@/lib/utils"
import type {
  ContentNode,
  TipTapDocument,
  TextMark,
  TextNode,
} from "@/lib/types/content"

function applyMarks(text: string, marks: TextMark[] = []): React.ReactNode {
  let node: React.ReactNode = text
  for (const mark of marks) {
    switch (mark.type) {
      case "bold":
        node = <strong key={mark.type}>{node}</strong>
        break
      case "italic":
        node = <em key={mark.type}>{node}</em>
        break
      case "strike":
        node = <s key={mark.type}>{node}</s>
        break
      case "code":
        node = (
          <code
            key={mark.type}
            className="rounded bg-muted px-1 py-0.5 font-mono text-sm"
          >
            {node}
          </code>
        )
        break
      case "link": {
        const href = (mark.attrs?.href as string) ?? "#"
        node = (
          <a
            key={mark.type}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-primary"
          >
            {node}
          </a>
        )
        break
      }
    }
  }
  return node
}

function renderTextNode(node: TextNode, index: number): React.ReactNode {
  return (
    <span key={index}>{applyMarks(node.text, node.marks)}</span>
  )
}

function renderNode(node: ContentNode, index: number): React.ReactNode {
  switch (node.type) {
    case "doc":
      return (
        <div key={index}>
          {node.content.map((child, i) => renderNode(child, i))}
        </div>
      )

    case "paragraph":
      if (!node.content || node.content.length === 0) {
        return <p key={index} className="my-4 min-h-[1em]" />
      }
      return (
        <p key={index} className="my-4 leading-7">
          {node.content.map((child, i) => renderNode(child, i))}
        </p>
      )

    case "heading": {
      const level = node.attrs?.level ?? 2
      const classes: Record<number, string> = {
        1: "mt-8 mb-3 text-3xl font-bold tracking-tight",
        2: "mt-7 mb-3 text-2xl font-semibold tracking-tight",
        3: "mt-6 mb-2 text-xl font-semibold",
        4: "mt-5 mb-2 text-lg font-semibold",
        5: "mt-4 mb-1 text-base font-semibold",
        6: "mt-4 mb-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground",
      }
      const Tag = `h${level}` as keyof React.JSX.IntrinsicElements
      return (
        <Tag key={index} className={classes[level]}>
          {node.content?.map((child, i) => renderNode(child, i))}
        </Tag>
      )
    }

    case "text":
      return renderTextNode(node, index)

    case "bulletList":
      return (
        <ul
          key={index}
          className="my-4 list-disc space-y-1 pl-6 marker:text-muted-foreground"
        >
          {node.content.map((child, i) => renderNode(child, i))}
        </ul>
      )

    case "orderedList":
      return (
        <ol
          key={index}
          start={node.attrs?.start ?? 1}
          className="my-4 list-decimal space-y-1 pl-6 marker:text-muted-foreground"
        >
          {node.content.map((child, i) => renderNode(child, i))}
        </ol>
      )

    case "listItem":
      return (
        <li key={index} className="leading-7">
          {node.content.map((child, i) => renderNode(child, i))}
        </li>
      )

    case "blockquote":
      return (
        <blockquote
          key={index}
          className="my-6 border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground"
        >
          {node.content.map((child, i) => renderNode(child, i))}
        </blockquote>
      )

    case "codeBlock": {
      const lang = node.attrs?.language
      return (
        <pre
          key={index}
          className={cn(
            "my-6 overflow-x-auto rounded-lg bg-muted px-5 py-4 text-sm",
            lang && `language-${lang}`,
          )}
        >
          <code className="font-mono">
            {node.content?.map((child) => (child as TextNode).text).join("")}
          </code>
        </pre>
      )
    }

    case "horizontalRule":
      return <hr key={index} className="my-8 border-muted" />

    case "hardBreak":
      return <br key={index} />

    case "image":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={index}
          src={node.attrs.src}
          alt={node.attrs.alt ?? ""}
          title={node.attrs.title ?? undefined}
          className="my-6 rounded-lg"
        />
      )

    default:
      return null
  }
}

type ContentRendererProps = {
  content: TipTapDocument | null | undefined
  className?: string
}

export function ContentRenderer({ content, className }: ContentRendererProps) {
  if (!content) {
    return null
  }

  return (
    <div className={cn("text-foreground", className)}>
      {renderNode(content, 0)}
    </div>
  )
}
