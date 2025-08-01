import BlogLayout from "@/components/BlogLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Twitter, Mail, Globe } from "lucide-react";
import blogLogo from "@/assets/blog-logo.png";

export default function About() {
  return (
    <BlogLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <img src={blogLogo} alt="Blog Logo" className="w-24 h-24 mx-auto mb-6 rounded-full" />
          <h1 className="text-4xl font-bold mb-4">About This Blog</h1>
          <p className="text-xl text-muted-foreground">
            A modern, clean blog focused on sharing knowledge and ideas
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe in the power of sharing knowledge and experiences. This blog serves as a 
                platform to explore technology, design, and development while building a community 
                of learners and creators.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">What We Write About</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Web Development & Programming</li>
                <li>• User Interface & User Experience Design</li>
                <li>• Technology Trends & Insights</li>
                <li>• Tutorials & How-to Guides</li>
                <li>• Personal Development & Learning</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Have questions, suggestions, or just want to say hello? We'd love to hear from you!
            </p>
            <div className="flex justify-center gap-6">
              <a href="#" className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors">
                <Mail className="w-5 h-5" />
                <span>Email</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors">
                <Twitter className="w-5 h-5" />
                <span>Twitter</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors">
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors">
                <Globe className="w-5 h-5" />
                <span>Website</span>
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 text-center text-muted-foreground">
          <p>
            Built with ❤️ using React, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </BlogLayout>
  );
}