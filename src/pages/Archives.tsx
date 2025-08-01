import React from 'react';
import { Link } from 'react-router-dom';
import BlogLayout from '@/components/BlogLayout';
import { mockPosts } from '@/data/mockPosts';
import { format, parse } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Archives = () => {
  // Sort posts by date
  const sortedPosts = [...mockPosts].sort((a, b) => {
    const dateA = parse(a.date, 'MMMM d, yyyy', new Date());
    const dateB = parse(b.date, 'MMMM d, yyyy', new Date());
    return dateB.getTime() - dateA.getTime();
  });

  // Group posts by year
  const postsByYear = sortedPosts.reduce((acc, post) => {
    const date = parse(post.date, 'MMMM d, yyyy', new Date());
    const year = format(date, 'yyyy');
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push({
      ...post,
      formattedDate: format(date, 'MMM dd'),
    });
    return acc;
  }, {} as Record<string, Array<typeof mockPosts[0] & { formattedDate: string }>>);

  return (
    <BlogLayout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-primary">Archives</h1>
        <div className="space-y-12">
          {Object.entries(postsByYear).map(([year, posts]) => (
            <div key={year} className="relative">
              <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-2">
                <h2 className="text-2xl font-bold text-primary/80">{year}</h2>
              </div>
              <div className="mt-4 space-y-4 relative pl-6 border-l-2 border-primary/20">
                {posts.map((post) => (
                  <div key={post.id} className="group relative">
                    <div className="absolute -left-[25px] h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    <Link 
                      to={`/post/${post.id}`}
                      className="block p-4 rounded-lg hover:bg-secondary/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {post.categories.map((category) => (
                              <Badge 
                                key={category} 
                                variant="secondary"
                                className="text-xs bg-primary/10 hover:bg-primary/20"
                              >
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{post.formattedDate}</span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </BlogLayout>
  );
};

export default Archives;
