export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  category: string;
}

export const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with Your New Blog",
    excerpt: "Learn how to set up and customize your blog with this comprehensive guide. We'll walk through everything from initial setup to publishing your first post.",
    content: `# Getting Started with Your New Blog

Welcome to your new blog! This guide will help you get started with creating and managing your content.

## Setting Up Your Blog

Your blog comes with a beautiful, responsive design that works perfectly on all devices. The clean layout focuses on readability and user experience.

### Key Features

- **Responsive Design**: Looks great on desktop, tablet, and mobile
- **Clean Typography**: Easy-to-read fonts and proper spacing
- **Fast Loading**: Optimized for speed and performance
- **SEO Friendly**: Built with search engines in mind

## Writing Your First Post

Creating content is simple and intuitive. Use the "New Post" button to start writing, and take advantage of the built-in markdown support for formatting.

### Tips for Great Content

1. Write compelling headlines
2. Use images to break up text
3. Keep paragraphs short and scannable
4. Include relevant tags for discoverability

Happy blogging!`,
    image: "/src/assets/blog-hero.png",
    author: "Blog Admin",
    date: "Dec 15, 2023",
    readTime: "5 min read",
    tags: ["Getting Started", "Tutorial", "Blogging"],
    featured: true,
    category: "Tutorial"
  },
  {
    id: 2,
    title: "Text and Typography Best Practices",
    excerpt: "Explore the fundamentals of good typography in web design. Learn about font choices, spacing, and how to create readable, engaging content.",
    content: `# Text and Typography Best Practices

Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.

## Font Selection

Choose fonts that reflect your brand personality while maintaining excellent readability across all devices.

## Spacing and Hierarchy

Proper spacing and clear hierarchy guide readers through your content naturally.`,
    author: "Design Team",
    date: "Dec 12, 2023",
    readTime: "3 min read",
    tags: ["Typography", "Design", "Web Development"],
    category: "Design"
  },
  {
    id: 3,
    title: "Building Responsive Components",
    excerpt: "Master the art of creating components that work beautifully across all screen sizes. Learn modern CSS techniques and best practices.",
    content: `# Building Responsive Components

Creating responsive components is essential in today's multi-device world.

## Mobile-First Approach

Start with mobile designs and progressively enhance for larger screens.

## Flexible Layouts

Use CSS Grid and Flexbox for robust, flexible layouts.`,
    author: "Dev Team",
    date: "Dec 10, 2023",
    readTime: "7 min read",
    tags: ["React", "CSS", "Responsive Design"],
    category: "Development"
  },
  {
    id: 4,
    title: "Optimizing Your Blog for Search Engines",
    excerpt: "Learn essential SEO techniques to help your blog reach a wider audience. From meta tags to content strategy, we cover it all.",
    content: `# Optimizing Your Blog for Search Engines

SEO is crucial for growing your blog's audience organically.

## On-Page SEO

Optimize your content, meta descriptions, and page structure.

## Content Strategy

Create valuable content that answers your audience's questions.`,
    author: "Marketing Team",
    date: "Dec 8, 2023",
    readTime: "6 min read",
    tags: ["SEO", "Marketing", "Content Strategy"],
    category: "Marketing"
  }
];