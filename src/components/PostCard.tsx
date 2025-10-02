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
        "bg-background border border-border hover:border-primary/50 rounded-lg overflow-hidden group",
        "dark:bg-background/50 dark:backdrop-blur-sm dark:hover:bg-background/80",
        "transition-all duration-300",
        featured && "ring-1 ring-primary"
      )}
    >
      {image && (
        <div className="relative aspect-[2/1] overflow-hidden">
          <LazyImage
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        </div>
      )}
      
      <div className="p-6">
        {/* Date and Categories */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <time className="text-sm text-muted-foreground font-mono">
            {date}
          </time>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link key={category} to={`/?category=${encodeURIComponent(category)}`}>
                <Badge 
                  variant="outline"
                  className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors"
                >
                  {category}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Title */}
        <Link to={`/post/${id}`}>
          <h2 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
          {excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground/80">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>{readTime}</span>
          </div>
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