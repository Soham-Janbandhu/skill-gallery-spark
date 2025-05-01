
import { ArrowDown, ArrowRight, Briefcase, Code, Download, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-36 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 
              className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 
                          ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: '0.2s' }}
            >
              <span className="text-primary">Hello, I'm</span> Soham Janabandhu
            </h1>
            <p 
              className={`text-xl md:text-2xl text-muted-foreground mb-8 
                          ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: '0.4s' }}
            >
              A passionate full-stack developer crafting beautiful, functional digital experiences
            </p>
            <div 
              className={`flex flex-col sm:flex-row gap-4 justify-center 
                          ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: '0.6s' }}
            >
              <Button asChild className="font-medium">
                <Link to="/projects">
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="font-medium">
                <a href="/resume.pdf" download>
                  Download Resume
                  <Download className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Button variant="ghost" size="icon" aria-label="Scroll down">
            <ArrowDown className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Projects</h2>
              <p className="text-muted-foreground">Some of my recent work</p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link to="/projects">View All Projects</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="hover-scale overflow-hidden bg-card border border-border">
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30" />
                  <Code className="absolute inset-0 m-auto h-12 w-12 text-primary" />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">Project {item}</h3>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">Web App</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    A brief description of project {item} showcasing key features and technologies used.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">React</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">TypeScript</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">TailwindCSS</span>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="link" className="p-0 h-auto" asChild>
                      <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                        Source Code
                      </a>
                    </Button>
                    <Button variant="link" className="p-0 h-auto" asChild>
                      <a href="https://example.com" target="_blank" rel="noopener noreferrer">
                        Live Demo
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Technical Skills</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A collection of technologies and tools I've worked with
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[
              'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 
              'MongoDB', 'GraphQL', 'HTML5', 'CSS3', 'Tailwind CSS', 
              'Git', 'Docker', 'AWS', 'Firebase', 'Redux'
            ].map((skill) => (
              <Card key={skill} className="hover-scale text-center p-4 border border-border">
                <div className="p-2">
                  <Code className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">{skill}</h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl font-bold mb-4">Ready to start your project?</h2>
            <p className="text-muted-foreground mb-8">
              Let's discuss how I can help bring your ideas to life.
            </p>
            <Button asChild size="lg" className="font-medium">
              <Link to="/contact">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
