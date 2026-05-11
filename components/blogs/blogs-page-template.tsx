import { BlogPostCard } from "@/components/blogs/blog-post-card";
import { Post } from "@/lib/types/Posts";
import Link from "next/link";
import { SectionWrapper } from "../sections/section-wrapper";

type BlogsPageTemplateProps = {
  posts: Post[];
};

const BlogsPageTemplate = ({ posts }: BlogsPageTemplateProps) => {
  return (
    <SectionWrapper className="min-h-screen">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blogs</h1>
        <p className="mt-2 text-muted-foreground">
          Blogs y actualizaciones del equipo.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No hay blogs todavía.</p>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-0 m-0">
          {posts.map((post) => (
            <li key={post.id} className="min-w-0">
              <BlogPostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </SectionWrapper>
  );
};

export default BlogsPageTemplate;
