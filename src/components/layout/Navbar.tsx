import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, X, Code, Home, User, BookOpen, Briefcase, Mail, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  const navItems = [{
    name: 'Home',
    path: '/',
    icon: <Home className="h-4 w-4 mr-2" />
  }, {
    name: 'About',
    path: '/about',
    icon: <User className="h-4 w-4 mr-2" />
  }, {
    name: 'Projects',
    path: '/projects',
    icon: <Briefcase className="h-4 w-4 mr-2" />
  }, {
    name: 'Education',
    path: '/education',
    icon: <BookOpen className="h-4 w-4 mr-2" />
  }, {
    name: 'Contact',
    path: '/contact',
    icon: <Mail className="h-4 w-4 mr-2" />
  }, {
    name: 'Game',
    path: '/game',
    icon: <Gamepad2 className="h-4 w-4 mr-2" />
  }];
  return <header className={cn('fixed top-0 w-full z-50 transition-all duration-300', scrolled ? 'bg-background/80 backdrop-blur-md border-b' : 'bg-transparent')}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg tracking-wide">DevPortfolio</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(item => <Link key={item.path} to={item.path} className={cn('px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary hover:bg-primary/10', location.pathname === item.path ? 'text-primary bg-primary/10' : 'text-foreground/80')}>
                {item.name}
              </Link>)}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-foreground" aria-label="Toggle menu">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={cn('md:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-sm transform transition-transform duration-300 ease-in-out z-40', isOpen ? 'translate-x-0' : 'translate-x-full')}>
        <nav className="flex flex-col p-4 space-y-1 bg-inherit">
          {navItems.map(item => <Link key={item.path} to={item.path} className={cn('flex items-center px-4 py-3 rounded-md transition-colors', location.pathname === item.path ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-accent')}>
              {item.icon}
              {item.name}
            </Link>)}
        </nav>
      </div>
    </header>;
};