import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Twitter, Facebook, Linkedin, Link2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

export function ShareButtons({ title, url, description = '' }: ShareButtonsProps) {
  const { toast } = useToast();
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the link manually.",
        variant: "destructive",
      });
    }
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
        onClick={() => window.open(shareLinks.twitter, '_blank')}
        className="hover:text-[#1DA1F2]"
      >
        <Twitter className="h-4 w-4 mr-2" />
        Tweet
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => window.open(shareLinks.facebook, '_blank')}
        className="hover:text-[#4267B2]"
      >
        <Facebook className="h-4 w-4 mr-2" />
        Share
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => window.open(shareLinks.linkedin, '_blank')}
        className="hover:text-[#0077B5]"
      >
        <Linkedin className="h-4 w-4 mr-2" />
        Post
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={copyToClipboard}
      >
        <Link2 className="h-4 w-4 mr-2" />
        Copy Link
      </Button>
    </div>
  );
}
