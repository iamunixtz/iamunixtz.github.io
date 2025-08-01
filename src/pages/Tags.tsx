import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlogLayout from '@/components/BlogLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockPosts } from '@/data/mockPosts';

const Tags = () => {
  const navigate = useNavigate();
  
  // Get all unique tags from posts
  const tags = Array.from(new Set(mockPosts.flatMap(post => post.tags)));
  
  // Count posts per tag
  const tagCount = tags.reduce((acc, tag) => {
    acc[tag] = mockPosts.filter(post => post.tags.includes(tag)).length;
    return acc;
  }, {} as Record<string, number>);

  // Sort tags by post count
  const sortedTags = tags.sort((a, b) => tagCount[b] - tagCount[a]);

  const handleTagClick = (tag: string) => {
    navigate(`/?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <BlogLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Tags</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTags.map((tag) => (
            <Card key={tag} className="p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-2">#{tag}</h2>
              <p className="text-muted-foreground mb-4">
                {tagCount[tag]} {tagCount[tag] === 1 ? 'post' : 'posts'}
              </p>
              <Button
                onClick={() => handleTagClick(tag)}
                variant="outline"
                className="w-full"
              >
                View Posts
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </BlogLayout>
  );
};

export default Tags;
