import BlogLayout from "@/components/BlogLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Twitter, Mail, Globe } from "lucide-react";
import blogLogo from "@/assets/blog-logo.png";
import profilePic from "@/assets/profile.jpg";

export default function About() {
  return (
    <BlogLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <img 
              src={profilePic} 
              alt="iamunixt Profile" 
              className="w-full h-full object-cover rounded-full border-4 border-primary shadow-lg" 
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-black/50"></div>
          </div>
          <h1 className="text-4xl font-bold mb-4">About iamunixt</h1>
          <p className="text-xl text-muted-foreground">
            Cybersecurity Researcher, Bug Hunter & Ethical Hacker
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Who I Am</h2>
              <p className="text-muted-foreground leading-relaxed">
                As an accomplished bug bounty hunter and security researcher, I've successfully identified and 
                reported critical vulnerabilities to major organizations including the U.S. Department of Defense. 
                With a proven track record on HackerOne and other platforms, I specialize in web application 
                security, with particular expertise in SQL injection, authentication bypasses, and business logic flaws. 
                making the digital world safer through responsible disclosure and knowledge sharing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Areas of Expertise</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Web Application Security & Bug Bounty Hunting</li>
                <li>• SQL Injection & Authentication Bypass Specialist</li>
                <li>• HackerOne Top Reporter for DoD Programs</li>
                <li>• Advanced Web Security Testing & Exploitation</li>
                <li>• Secure Code Review & Vulnerability Assessment</li>
                <li>• Responsible Disclosure & Technical Writing</li>
                <li>• Security Awareness & Knowledge Sharing</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-6">Connect & Collaborate</h2>
            <p className="text-muted-foreground mb-6">
              Interested in security research, bug bounty collaboration, or have vulnerabilities to discuss? 
              Let's connect and make the internet a safer place together!
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
            "Security is not a product, but a process" - Built with ❤️ for the cybersecurity community
          </p>
        </div>
      </div>
    </BlogLayout>
  );
}