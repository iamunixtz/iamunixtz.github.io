import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Twitter } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

export function ShareButtons({ title, url, description = '' }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      '_blank'
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center text-sm text-muted-foreground">
        <Share2 className="h-4 w-4 mr-2" />
        Share:
      </span>
      <Button
        size="sm"
        variant="outline"
        onClick={shareOnTwitter}
        className="hover:text-[#1DA1F2]"
      >
        <Twitter className="h-4 w-4 mr-2" />
        Share on X
      </Button>
    </div>
  );
}
