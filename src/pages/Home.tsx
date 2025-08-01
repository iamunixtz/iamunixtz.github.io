import BlogLayout from "@/components/BlogLayout";
import PostCard from "@/components/PostCard";
import { mockPosts } from "@/data/mockPosts";

export default function Home() {
  const featuredPost = mockPosts.find(post => post.featured);
  const regularPosts = mockPosts.filter(post => !post.featured);

  return (
    <BlogLayout>
      <div className="space-y-8">
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
              />
            ))}
          </div>
        </section>
      </div>
    </BlogLayout>
  );
}