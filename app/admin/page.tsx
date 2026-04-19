import { createClient } from "@/lib/supabase/server"

export default async function AdminPage() {


  const supabase = await createClient()

  const { data: blogs, error: blogsError } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, content, created_at, cover_image, status')
    .order('created_at', { ascending: false })

  console.log(blogs, "blogs")

  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-sm text-muted-foreground">
        Welcome to your admin panel. You can start adding content management modules here.
      </p>
      <pre>{JSON.stringify(blogs, null, 2)}</pre>
    </section>
  )
}
