import { useParams, Link } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockPosts } from "@/data/mockPosts";
import { Calendar, User, Clock, ArrowLeft } from "lucide-react";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const post = mockPosts.find(p => p.id === parseInt(id || "1"));

  if (!post) {
    return (
      <BlogLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <article className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Posts
            </Button>
          </Link>
        </div>

        {/* Post Header */}
        <header className="mb-8">
          {post.image && (
            <div className="aspect-video mb-6 rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-blog-tag text-blog-tag-foreground"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>

            <div className="flex items-center gap-6 text-blog-post-meta">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Post Content */}
        <div className="mt-8">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Post Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Published in <span className="font-medium">{post.category}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Share
              </Button>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </div>
        </footer>
      </article>
    </BlogLayout>
  );
}