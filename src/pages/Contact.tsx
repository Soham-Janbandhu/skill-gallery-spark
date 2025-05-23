
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { AtSign, Mail, MapPin, Phone, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon!",
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="pt-20 pb-16">
      {/* Contact Header */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-muted-foreground mb-8">
              Have a project in mind or want to discuss potential opportunities? 
              I'd love to hear from you! Fill out the form below or use my contact details.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Form */}
            <Card className="border border-border animate-slide-in-left">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      placeholder="Soham Janabandhu"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject"
                      name="subject"
                      placeholder="Project Inquiry"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message"
                      name="message"
                      placeholder="Tell me about your project or inquiry..."
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Processing<span className="ml-2 animate-pulse">...</span></>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {/* Contact Information */}
            <div className="space-y-6 animate-slide-in-right">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <p className="text-muted-foreground mb-8">
                  Feel free to get in touch using any of the methods below. 
                  I aim to respond to all inquiries within 24 hours.
                </p>
              </div>
              
              <Card className="border border-border hover-scale">
                <CardContent className="p-6 flex items-start">
                  <Mail className="h-6 w-6 text-primary mr-4" />
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <a 
                      href="mailto:sohamjanbandhu08@gmail.com" 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      sohamjanbandhu08@gmail.com
                    </a>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-border hover-scale">
                <CardContent className="p-6 flex items-start">
                  <Phone className="h-6 w-6 text-primary mr-4" />
                  <div>
                    <h3 className="font-medium mb-1">Phone</h3>
                    <a 
                      href="tel:9112108814" 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      +91 9112108814
                    </a>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-border hover-scale">
                <CardContent className="p-6 flex items-start">
                  <MapPin className="h-6 w-6 text-primary mr-4" />
                  <div>
                    <h3 className="font-medium mb-1">Location</h3>
                    <p className="text-muted-foreground">
                      New Ramdaspeth, Nagpur
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-border hover-scale">
                <CardContent className="p-6 flex items-start">
                  <AtSign className="h-6 w-6 text-primary mr-4" />
                  <div>
                    <h3 className="font-medium mb-1">Social Media</h3>
                    <div className="flex space-x-4 mt-2">
                      <a 
                        href="https://github.com/Soham-Janbandhu" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        GitHub
                      </a>
                      <a 
                        href="https://www.linkedin.com/in/soham-janbandhu" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        LinkedIn
                      </a>
                      <a 
                        href="https://x.com/SOHAMJANBANDHU?t=k08VqMhqWhAw2gYbk3QRCQ&s=09" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        Twitter
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (placeholder) */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">
              My Location
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Based in New Ramdashpeth, Nagpur, Maharashtra, India
            </p>
          </div>
          
          <div className="aspect-video max-w-4xl mx-auto overflow-hidden rounded-lg border border-border bg-muted flex items-center justify-center">
            <div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.4503164223743!2d79.0701328!3d21.134470099999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c088d2d6baf3%3A0xbf9c77b975ab2a13!2s204%2C%20Ramdaspeth%2C%20Nagpur%2C%20Maharashtra%20440012!5e0!3m2!1sen!2sin!4v1747994241397!5m2!1sen!2sin"
              width="900"
              height="510"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
