
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, ExternalLink, Github, Heart, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

// Project data
const projectsData = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A full-featured e-commerce platform with product listings, cart functionality, and secure checkout.',
    image: '',
    category: 'web',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    likes: 24
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'A productivity app for organizing tasks with drag-and-drop functionality and user authentication.',
    image: '',
    category: 'web',
    technologies: ['React', 'Firebase', 'Tailwind CSS'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    likes: 18
  },
  {
    id: 3,
    title: 'Weather Dashboard',
    description: 'Real-time weather forecasting app with location detection and interactive charts.',
    image: '',
    category: 'web',
    technologies: ['JavaScript', 'Chart.js', 'Weather API'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    likes: 12
  },
  {
    id: 4,
    title: 'Social Media Dashboard',
    description: 'Analytics dashboard for tracking engagement across multiple social media platforms.',
    image: '',
    category: 'data',
    technologies: ['React', 'D3.js', 'REST API'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    likes: 31
  },
  {
    id: 5,
    title: 'Portfolio Generator',
    description: 'A tool that helps developers create beautiful portfolio websites without coding.',
    image: '',
    category: 'tools',
    technologies: ['TypeScript', 'React', 'Node.js'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    likes: 27
  },
  {
    id: 6,
    title: 'Markdown Editor',
    description: 'Feature-rich markdown editor with live preview and file management.',
    image: '',
    category: 'tools',
    technologies: ['Vue.js', 'Express', 'MongoDB'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    likes: 22
  }
];

const Projects = () => {
  const [filter, setFilter] = useState('all');
  const [likedProjects, setLikedProjects] = useState<number[]>([]);
  const [filteredProjects, setFilteredProjects] = useState(projectsData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Filtering projects based on selected category
    if (filter === 'all') {
      setFilteredProjects(projectsData);
    } else {
      setFilteredProjects(projectsData.filter(project => project.category === filter));
    }
  }, [filter]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleLike = (id: number) => {
    if (likedProjects.includes(id)) {
      setLikedProjects(likedProjects.filter(projectId => projectId !== id));
      toast({
        title: "Unliked",
        description: "You've removed this project from your liked projects.",
      });
    } else {
      setLikedProjects([...likedProjects, id]);
      toast({
        title: "Liked!",
        description: "You've added this project to your liked projects.",
      });
    }
  };

  const handleShare = (project: any) => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.description,
        url: project.liveUrl,
      })
      .then(() => {
        toast({
          title: "Shared successfully!",
          description: "Project has been shared.",
        });
      })
      .catch((error) => {
        console.error('Error sharing:', error);
        fallbackShare(project);
      });
    } else {
      fallbackShare(project);
    }
  };

  const fallbackShare = (project: any) => {
    // Fallback for browsers that don't support Web Share API
    navigator.clipboard.writeText(project.liveUrl);
    toast({
      title: "Link copied!",
      description: "Project URL has been copied to clipboard.",
    });
  };

  return (
    <div className="pt-20 pb-16">
      {/* Projects Header */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
              My Projects
            </h1>
            <p className={`text-muted-foreground mb-8 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              Browse through a selection of my recent work and personal projects.
              Each one represents different challenges and learning experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Gallery */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className={`${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
                <TabsTrigger value="all" onClick={() => setFilter('all')}>All Projects</TabsTrigger>
                <TabsTrigger value="web" onClick={() => setFilter('web')}>Web Apps</TabsTrigger>
                <TabsTrigger value="data" onClick={() => setFilter('data')}>Data Viz</TabsTrigger>
                <TabsTrigger value="tools" onClick={() => setFilter('tools')}>Tools</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => (
                  <Card 
                    key={project.id} 
                    className={`overflow-hidden border border-border hover:shadow-md transition-all 
                                ${isLoaded ? 'animate-scale' : 'opacity-0'}`}
                    style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                  >
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <div className={`absolute inset-0 bg-gradient-to-br 
                                      ${project.category === 'web' ? 'from-primary/30 to-secondary/30' : 
                                        project.category === 'data' ? 'from-blue-500/30 to-purple-500/30' :
                                        'from-green-500/30 to-yellow-500/30'}`} />
                      <Code className="absolute inset-0 m-auto h-12 w-12 text-primary" />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold">{project.title}</h3>
                        <Badge variant="outline" className="capitalize">
                          {project.category}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, i) => (
                          <Badge key={i} variant="secondary" className="bg-primary/10 text-primary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 flex justify-between border-t border-border/50">
                      <div className="flex space-x-3">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={cn(
                            "rounded-full", 
                            likedProjects.includes(project.id) && "text-red-500"
                          )}
                          onClick={() => handleLike(project.id)}
                          aria-label="Like project"
                        >
                          <Heart className="h-5 w-5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-full"
                          onClick={() => handleShare(project)}
                          aria-label="Share project"
                        >
                          <Share2 className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="flex space-x-3">
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 mr-2" />
                            Code
                          </a>
                        </Button>
                        <Button size="sm" asChild>
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Demo
                          </a>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* These TabsContent components are not actually needed since we're filtering in the "all" tab,
                but they're included for completeness */}
            <TabsContent value="web" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Content will be shown through the filter */}
              </div>
            </TabsContent>
            <TabsContent value="data" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Content will be shown through the filter */}
              </div>
            </TabsContent>
            <TabsContent value="tools" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Content will be shown through the filter */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Interested in working together?</h2>
            <p className="text-muted-foreground mb-8">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
            </p>
            <Button asChild size="lg">
              <a href="/contact">Get in Touch</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
