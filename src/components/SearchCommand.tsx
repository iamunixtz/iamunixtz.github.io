import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { mockPosts } from "@/data/mockPosts";
import { Button } from "@/components/ui/button";
import { Calendar, Hash, FolderOpen, Search } from "lucide-react";

type SearchResult = {
  type: "post" | "category" | "tag";
  title: string;
  link: string;
  description?: string;
};

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Get unique categories and tags
  const categories = Array.from(new Set(mockPosts.flatMap((post) => post.categories)));
  const tags = Array.from(new Set(mockPosts.flatMap((post) => post.tags)));

  const getSearchResults = useCallback((query: string): SearchResult[] => {
    if (!query) return [];

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Search posts
    mockPosts.forEach((post) => {
      if (
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          type: "post",
          title: post.title,
          link: `/post/${post.id}`,
          description: post.excerpt,
        });
      }
    });

    // Search categories
    categories.forEach((category) => {
      if (category.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: "category",
          title: category,
          link: `/?category=${encodeURIComponent(category)}`,
        });
      }
    });

    // Search tags
    tags.forEach((tag) => {
      if (tag.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: "tag",
          title: tag,
          link: `/?tag=${encodeURIComponent(tag)}`,
        });
      }
    });

    return results;
  }, []);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (link: string) => {
    setOpen(false);
    navigate(link);
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full justify-start text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search...
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search posts, categories, and tags..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {/* Posts */}
          <CommandGroup heading="Posts">
            {getSearchResults("")
              .filter((result) => result.type === "post")
              .map((result) => (
                <CommandItem
                  key={result.link}
                  onSelect={() => handleSelect(result.link)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {result.title}
                </CommandItem>
              ))}
          </CommandGroup>
          {/* Categories */}
          <CommandGroup heading="Categories">
            {getSearchResults("")
              .filter((result) => result.type === "category")
              .map((result) => (
                <CommandItem
                  key={result.link}
                  onSelect={() => handleSelect(result.link)}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  {result.title}
                </CommandItem>
              ))}
          </CommandGroup>
          {/* Tags */}
          <CommandGroup heading="Tags">
            {getSearchResults("")
              .filter((result) => result.type === "tag")
              .map((result) => (
                <CommandItem
                  key={result.link}
                  onSelect={() => handleSelect(result.link)}
                >
                  <Hash className="mr-2 h-4 w-4" />
                  {result.title}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
