import React from 'react';
import { Link } from 'react-router-dom';
import BlogLayout from '@/components/BlogLayout';
import { mockPosts } from '@/data/mockPosts';
import { format, parse } from 'date-fns';

const Archives = () => {
  // Sort posts by date
  const sortedPosts = [...mockPosts].sort((a, b) => {
    const dateA = parse(a.date, 'MMMM d, yyyy', new Date());
    const dateB = parse(b.date, 'MMMM d, yyyy', new Date());
    return dateB.getTime() - dateA.getTime();
  });

  // Group posts by year and month
  const groupedPosts = sortedPosts.reduce((acc, post) => {
    const date = parse(post.date, 'MMMM d, yyyy', new Date());
    const year = format(date, 'yyyy');
    const month = format(date, 'MMMM');

    if (!acc[year]) {
      acc[year] = {};
    }
    if (!acc[year][month]) {
      acc[year][month] = [];
    }
    acc[year][month].push(post);
    return acc;
  }, {} as Record<string, Record<string, typeof mockPosts>>);

  return (
    <BlogLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Archives</h1>
        <div className="space-y-8">
          {Object.entries(groupedPosts).reverse().map(([year, months]) => (
            <div key={year} className="space-y-4">
              <h2 className="text-3xl font-bold">{year}</h2>
              {Object.entries(months).reverse().map(([month, posts]) => (
                <div key={`${year}-${month}`} className="ml-4 space-y-2">
                  <h3 className="text-2xl font-semibold text-muted-foreground">
                    {month} ({posts.length})
                  </h3>
                  <div className="ml-4 space-y-2">
                    {posts.map((post) => (
                      <div key={post.id} className="flex gap-4">
                        <span className="text-muted-foreground">
                          {format(parse(post.date, 'MMMM d, yyyy', new Date()), 'MMM dd')}
                        </span>
                        <Link
                          to={`/post/${post.id}`}
                          className="hover:text-primary hover:underline"
                        >
                          {post.title}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </BlogLayout>
  );
};

export default Archives;
