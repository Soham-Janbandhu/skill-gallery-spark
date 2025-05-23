
import { Code, FileText, Laptop, Layers, LifeBuoy, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

const About = () => {
  const [skills, setSkills] = useState([
    { name: 'JavaScript', value: 0 },
    { name: 'TypeScript', value: 0 },
    { name: 'React', value: 0 },
    { name: 'Node.js', value: 0 },
    { name: 'CSS/SASS', value: 0 },
    { name: 'UI/UX Design', value: 0 },
  ]);

  // Animate the skills progress bars
  useEffect(() => {
    const timer = setTimeout(() => {
      setSkills([
        { name: 'JavaScript', value: 71 },
        { name: 'TypeScript', value: 68 },
        { name: 'React', value: 75 },
        { name: 'Node.js', value: 70 },
        { name: 'CSS/SASS', value: 85 },
        { name: 'UI/UX Design', value: 75 },
      ]);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pt-20 pb-16">
      {/* Hero Section */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="animate-slide-in-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">About Me</h1>
              <p className="text-muted-foreground mb-6">
                I'm a passionate full-stack developer with over 2 years of experience building 
                modern web applications. My journey in the world of programming started when 
                I was in college, and since then, I've been constantly learning and improving my skills.
              </p>
              <p className="text-muted-foreground mb-6">
                My approach to development focuses on creating clean, efficient, and maintainable code. 
                I believe in the power of well-designed user experiences and the importance of 
                responsive, accessible web applications.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <a href="/resume.pdf" download>Download Resume</a>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/contact">Get in Touch</Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-slide-in-right">
              <div className="aspect-square bg-muted rounded-xl overflow-hidden border border-border">
                <div className="absolute inset-0" />
                <img src='src\assets\profile.jpg'></img>
                {/* <Code className="absolute inset-0 m-auto h-16 w-16 text-primary" /> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-2">Skills & Expertise</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Here are some of the technologies and skills I've mastered over the years
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6 animate-fade-in">
              {skills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-muted-foreground">{skill.value}%</span>
                  </div>
                  <Progress value={skill.value} className="h-2" />
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
              <Card className="border border-border hover-scale">
                <CardContent className="p-6">
                  <Laptop className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Frontend Development</h3>
                  <p className="text-sm text-muted-foreground">
                    Creating responsive and intuitive user interfaces with modern frameworks.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-border hover-scale">
                <CardContent className="p-6">
                  <Layers className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Backend Development</h3>
                  <p className="text-sm text-muted-foreground">
                    Building robust APIs and server-side applications.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-border hover-scale">
                <CardContent className="p-6">
                  <Users className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
                  <p className="text-sm text-muted-foreground">
                    Working effectively with cross-functional teams to deliver projects.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-border hover-scale">
                <CardContent className="p-6">
                  <LifeBuoy className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Problem Solving</h3>
                  <p className="text-sm text-muted-foreground">
                    Finding efficient solutions to complex technical challenges.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-2">Services I Offer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional services tailored to your project needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Laptop className="h-10 w-10 text-primary" />,
                title: 'Web Application Development',
                description: 'Building modern, responsive web applications using React, Next.js, and other cutting-edge technologies.'
              },
              {
                icon: <Code className="h-10 w-10 text-primary" />,
                title: 'Custom API Development',
                description: 'Creating robust APIs and backend services using Node.js, Express, and various database technologies.'
              },
              {
                icon: <FileText className="h-10 w-10 text-primary" />,
                title: 'Technical Consultation',
                description: 'Providing expert advice on architecture, technology stack, and best practices for your projects.'
              }
            ].map((service, index) => (
              <Card key={index} className="border border-border hover-scale animate-fade-in">
                <CardContent className="p-6">
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
