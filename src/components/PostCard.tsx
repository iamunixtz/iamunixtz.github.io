import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { LazyImage } from "@/components/LazyImage";
import { ShareButtons } from "@/components/ShareButtons";

interface PostCardProps {
  id: number;
  title: string;
  excerpt: string;
  image?: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  categories: string[];
}

export default function PostCard({
  id,
  title,
  excerpt,
  image,
  author,
  date,
  readTime,
  tags,
  featured = false,
  categories
}: PostCardProps) {
  return (
    <article 
      className={cn(
        "bg-gradient-card rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group",
        featured && "ring-2 ring-primary/20"
      )}
    >
      {image && (
        <div className="aspect-video overflow-hidden">
          <LazyImage
            src={image}
            alt={title}
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-2">
          {categories.map((category) => (
            <Link key={category} to={`/?category=${encodeURIComponent(category)}`}>
              <Badge variant="secondary" className="hover:bg-secondary/80">
                {category}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-blog-tag text-blog-tag-foreground text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
          <Link to={`/post/${id}`} className="block">
            {title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center gap-4 text-sm text-blog-post-meta">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{readTime}</span>
          </div>
          
          {/* Share Buttons */}
          <div className="mt-4">
            <ShareButtons
              title={title}
              url={`${window.location.origin}/#/post/${id}`}
              description={excerpt}
            />
          </div>
        </div>
      </div>
    </article>
  );
}