import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SearchCommand } from "@/components/SearchCommand";
import { LazyImage } from "@/components/LazyImage";
import { 
  Home, 
  FolderOpen, 
  Archive, 
  User, 
  Search,
  PenTool,
  Moon,
  Sun
} from "lucide-react";
import blogLogo from "@/assets/blog-logo.png";
import profilePic from "@/assets/profile.jpg";

interface BlogLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Categories", href: "/categories", icon: FolderOpen },
  { name: "Archives", href: "/archives", icon: Archive },
  { name: "About", href: "/about", icon: User }
];

const trendingTags = [
  "zeroday",
  "exploitation", 
  "research",
  "bughunting",
  "recon",
  "red team",
  "malware dev"
];

const recentPosts = [
  "Zero-Day Vulnerability Research",
  "Advanced Reconnaissance Techniques", 
  "Bug Hunting for Beginners",
  "Malware Development Research"
];

export default function BlogLayout({ children }: BlogLayoutProps) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-background flex relative">
      <div className="matrix-bg" />
      {/* Sidebar */}
      <aside className="w-64 bg-blog-sidebar border-r border-blog-sidebar-border flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-blog-sidebar-border">
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary shadow-md">
              <LazyImage src={profilePic} alt="iamunixt Profile" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-blog-sidebar-foreground">iamunixt</h1>
              <p className="text-sm text-blog-sidebar-muted">Cybersecurity Researcher & Bug Hunter</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-blog-sidebar-foreground hover:bg-blog-sidebar-hover"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Search */}
        <div className="p-4 border-t border-blog-sidebar-border">
          <SearchCommand />
        </div>

        {/* Theme Toggle */}
        <div className="p-4 border-t border-blog-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="w-full justify-start"
          >
            {isDarkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">Home</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button asChild>
                <Link to="/new-post">
                  <PenTool className="w-4 h-4 mr-2" />
                  New Post
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 max-w-6xl mx-auto w-full p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <main className="lg:col-span-3">
              {children}
            </main>

            {/* Right Sidebar */}
            <aside className="space-y-6">
              {/* Recently Updated */}
              <div className="bg-card rounded-lg p-6 shadow-card">
                <h3 className="text-lg font-semibold mb-4">Recently Updated</h3>
                <ul className="space-y-2">
                  {recentPosts.map((post, index) => (
                    <li key={index}>
                      <Link
                        to={`/post/${index + 1}`}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {post}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trending Tags */}
              <div className="bg-card rounded-lg p-6 shadow-card">
                <h3 className="text-lg font-semibold mb-4">Trending Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-blog-tag text-blog-tag-foreground hover:bg-blog-tag/80 cursor-pointer"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}