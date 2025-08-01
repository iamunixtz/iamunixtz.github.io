import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockPosts } from '@/data/mockPosts';
import BlogLayout from '@/components/BlogLayout';

const Categories = () => {
  const navigate = useNavigate();
  
  // Get unique categories from posts
  const categories = Array.from(new Set(mockPosts.flatMap(post => post.categories || [])));
  
  // Count posts per category
  const categoryCount = categories.reduce((acc, category) => {
    acc[category] = mockPosts.filter(post => post.categories?.includes(category)).length;
    return acc;
  }, {} as Record<string, number>);

  const handleCategoryClick = (category: string) => {
    navigate(`/?category=${encodeURIComponent(category)}`);
  };

  return (
    <BlogLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Categories</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category} className="p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-2">{category}</h2>
              <p className="text-muted-foreground mb-4">
                {categoryCount[category]} {categoryCount[category] === 1 ? 'post' : 'posts'}
              </p>
              <Button
                onClick={() => handleCategoryClick(category)}
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

export default Categories;
