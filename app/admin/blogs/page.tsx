import BlogsTemplate, {
  type AdminPostRow,
} from "@/components/admin/blogs/blogs-template"
import { getAdminPosts } from "@/lib/actions/blog"

export default async function AdminBlogsPage() {
  const { data, error } = await getAdminPosts()

  if (error) {
    return <BlogsTemplate posts={[]} error={error as string} />
  }

  return <BlogsTemplate posts={data as AdminPostRow[]} />
}
