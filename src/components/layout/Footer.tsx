import { Code, Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Code className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg tracking-wide">Nimbus</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Showcasing my journey, skills, and projects as a developer. From responsive web applications
              to innovative solutions, explore my work and let's connect!
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-muted-foreground hover:text-primary transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/education" className="text-muted-foreground hover:text-primary transition-colors">
                  Education
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/game" className="text-muted-foreground hover:text-primary transition-colors">
                  Game
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact info */}
          <div>
            <h3 className="font-medium mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">
                <span>Email: </span>
                <a href="mailto:sohamjanbandhu08@gmail.com" className="text-primary hover:underline">
                  sohamjanbandhu08@gmail.com
                </a>
              </li>
              <li className="text-muted-foreground">
                <span>Phone: </span>
                <a href="tel:9112108814" className="text-primary hover:underline">
                  +91 9112108814
                </a>
              </li>
              <li className="text-muted-foreground">
                <span>Location: </span>
                <span>New Ramdaspeth, Nagpur</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          © {currentYear} Nimbus. All rights reserved.
        </div>
      </div>
    </footer>;
};
