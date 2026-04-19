import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Post } from "@/lib/types/Posts";
import { cn } from "@/lib/utils";

function formatPostDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type BlogPostCardProps = {
  post: Post;
  className?: string;
};

export function BlogPostCard({ post, className }: BlogPostCardProps) {
  const dateLabel = formatPostDate(post.published_at ?? post.created_at);

  return (
    <Link
      href={`/blogs/${post.slug}`}
      className={cn("group block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl", className)}
    >
      <Card className="flex h-full flex-col transition-shadow group-hover:shadow-md">
        <CardHeader className="gap-2">
          {dateLabel ? (
            <p className="text-xs font-medium text-muted-foreground">
              {dateLabel}
            </p>
          ) : null}
          <h3 className="text-lg font-semibold leading-snug tracking-tight line-clamp-2 group-hover:underline underline-offset-4">
            {post.title}
          </h3>
        </CardHeader>
        <CardContent className="flex-1">
          {post.excerpt ? (
            <CardDescription className="line-clamp-3 text-pretty">
              {post.excerpt}
            </CardDescription>
          ) : (
            <p className="text-sm text-muted-foreground italic">No hay resumen</p>
          )}
        </CardContent>
        <CardFooter className="text-sm font-medium text-primary">
          Leer blog
          <span
            aria-hidden
            className="ml-1 inline-block transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
