import { useSearchParams } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import PostCard from "@/components/PostCard";
import { mockPosts } from "@/data/mockPosts";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const tagFilter = searchParams.get("tag");

  const filteredPosts = mockPosts.filter(post => {
    if (categoryFilter) {
      return post.categories.includes(categoryFilter);
    }
    if (tagFilter) {
      return post.tags.includes(tagFilter);
    }
    return true;
  });

  const featuredPost = filteredPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <BlogLayout>
      <div className="space-y-8">
        {(categoryFilter || tagFilter) && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">
              Filtered by {categoryFilter ? 'category' : 'tag'}:
            </span>
            <Badge variant="secondary" className="flex items-center gap-1">
              {categoryFilter ? categoryFilter : `#${tagFilter}`}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSearchParams({})}
              />
            </Badge>
          </div>
        )}
        {/* Featured Post */}
        {featuredPost && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Featured Post</h2>
            <PostCard
              id={featuredPost.id}
              title={featuredPost.title}
              excerpt={featuredPost.excerpt}
              image={featuredPost.image}
              author={featuredPost.author}
              date={featuredPost.date}
              readTime={featuredPost.readTime}
              tags={featuredPost.tags}
              categories={featuredPost.categories}
              featured={true}
            />
          </section>
        )}

        {/* Recent Posts */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {regularPosts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                excerpt={post.excerpt}
                image={post.image}
                author={post.author}
                date={post.date}
                readTime={post.readTime}
                tags={post.tags}
                categories={post.categories}
              />
            ))}
          </div>
        </section>
      </div>
    </BlogLayout>
  );
}