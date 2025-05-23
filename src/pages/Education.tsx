
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, BriefcaseBusiness, Calendar, GraduationCap, MapPin } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

// Education and experience data
const educationData = [
  {
    id: 1,
    degree: "Master of Computer Management",
    institution: "RTMNU University",
    location: "Nagpur, Maharashtra, India",
    period: "2024 - persuing",
    description: "In Computer Management with a focus on programming, web development, databases, cybersecurity, and emerging technologies like AI and Big Data."
  },
  {
    id: 2,
    degree: "Java Full Stack Development Certification",
    institution: "Qspiders -Training and Deveopment Institute",
    location: "Pune",
    period: "2022 - 2023",
    description: "Trained in Java, manual testing, SQL, and web technologies with real-time project exposure at QSpiders."
  },
  {
    id: 3,
    degree: "B.E. in Computer Science and Engineering",
    institution: "RTMNU",
    location: "Nagpur, Maharashtra, India",
    period: "2017 - 2022",
    description: "Graduated with honors. Focused on web development and software architecture. Participated in various hackathons and coding competitions."
  }
];

const experienceData = [
  {
    id: 1,
    position: "Junior Full Stack Developer",
    company: "Svagam LLC USA",
    location: "Frisco, Texas",
    period: "2024 - current",
    description: "Developed and maintained web applications for enterprise clients. Implemented RESTful APIs and integrated with third-party services."
  },
  {
    id: 2,
    position: "Frontend Developer Intern",
    company: "Svagam LLC USA",
    location: "Frisco, Texas",
    period: "January 2024 - March 2024",
    description: "Lead the frontend development team for multiple web applications. Implemented modern UI/UX designs and improved performance metrics by 40%."
  },
  {
    id: 3,
    position: "TRAINEE, IT-INTERNSHIP",
    company: "IT-NETWORK INFOSYSTEMS PVT. LTD.",
    location: "Nagpur, Maharashtra, India",
    period: "Summer 2019",
    description: "Assisted in the development of responsive web applications. Collaborated with designers to implement UI components."
  }
];

// Certificates data
const certificatesData = [
  {
    id: 1,
    name: "Java Full Stack Development",
    issuer: "Qspiders -Training and Deveopment Institute",
    date: "2023",
    description: "Trained in Java, manual testing, SQL, and web technologies with real-time project exposure at QSpiders."
  },
  {
    id: 1,
    name: "Web Technologies Fundamentals",
    issuer: "IT-NETWORK INFOSYSTEMS PVT. LTD.",
    date: "2019",
    description: "Intensive 8-week program covering modern web development technologies and best practices."
  },
  // {
  //   id: 1,
  //   name: "AWS Certified Solutions Architect",
  //   issuer: "Amazon Web Services",
  //   date: "2021",
  //   description: "Expertise in designing distributed systems on AWS."
  // },
  // {
  //   id: 2,
  //   name: "Google Professional Cloud Developer",
  //   issuer: "Google Cloud",
  //   date: "2020",
  //   description: "Skills in developing and managing applications on Google Cloud Platform."
  // },
  // {
  //   id: 3,
  //   name: "React Advanced Concepts",
  //   issuer: "Frontend Masters",
  //   date: "2019",
  //   description: "Deep dive into advanced React patterns and performance optimization."
  // }
];

const Education = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeItems, setActiveItems] = useState<number[]>([]);

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      if (timelineRef.current) {
        const timelineItems = timelineRef.current.querySelectorAll('.timeline-item');
        const newActiveItems: number[] = [];
        
        timelineItems.forEach((item, index) => {
          const rect = item.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.8) {
            newActiveItems.push(index);
          }
        });
        
        setActiveItems(newActiveItems);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="pt-20 pb-16">
      {/* Education Header */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
              Education & Experience
            </h1>
            <p className={`text-muted-foreground mb-8 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              My academic background and professional journey that have shaped my skills and expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative" ref={timelineRef}>
            {/* Timeline line */}
            <div className="absolute left-6 md:left-1/2 ml-px md:-ml-px top-0 bottom-0 w-[2px] bg-border"></div>

            {/* Education Timeline */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <GraduationCap className="h-6 w-6 mr-2 text-primary" />
                Education
              </h2>

              <div className="space-y-12">
                {educationData.map((edu, index) => (
                  <div
                    key={edu.id}
                    className={`timeline-item relative pl-16 md:pl-0 ${
                      index % 2 === 0 ? 'md:ml-auto md:pl-8 md:pr-0 md:text-left' : 'md:mr-auto md:pr-8 md:pl-0 md:text-right'
                    } transition-all duration-500 ease-out max-w-full md:max-w-[calc(50%-20px)] ${
                      activeItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                  >
                    {/* Timeline dot */}
                    <div 
                      className={`absolute left-5 md:left-auto ${
                        index % 2 === 0 ? 'md:right-[calc(100%+20px-5px)]' : 'md:left-[calc(100%+20px-5px)]'
                      } top-1 h-3 w-3 rounded-full border-2 border-primary bg-background`}
                    ></div>

                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className={`flex justify-between items-start mb-2 flex-col sm:flex-row gap-2 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                        <h3 className="text-xl font-semibold">{edu.degree}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {edu.period}
                        </div>
                      </div>
                      <div className={`flex mb-4 text-sm text-muted-foreground space-x-4 ${index % 2 !== 0 ? 'md:flex-row-reverse md:space-x-reverse' : ''}`}>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1 flex-shrink-0" />
                          {edu.institution}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                          {edu.location}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{edu.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Timeline */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <BriefcaseBusiness className="h-6 w-6 mr-2 text-primary" />
                Professional Experience
              </h2>

              <div className="space-y-12">
                {experienceData.map((exp, index) => (
                  <div
                    key={exp.id}
                    className={`timeline-item relative pl-16 md:pl-0 ${
                      index % 2 === 0 ? 'md:ml-auto md:pl-8 md:pr-0 md:text-left' : 'md:mr-auto md:pr-8 md:pl-0 md:text-right'
                    } transition-all duration-500 ease-out max-w-full md:max-w-[calc(50%-20px)] ${
                      activeItems.includes(index + educationData.length) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                  >
                    {/* Timeline dot */}
                    <div 
                      className={`absolute left-5 md:left-auto ${
                        index % 2 === 0 ? 'md:right-[calc(100%+20px-5px)]' : 'md:left-[calc(100%+20px-5px)]'
                      } top-1 h-3 w-3 rounded-full border-2 border-primary bg-background`}
                    ></div>

                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className={`flex justify-between items-start mb-2 flex-col sm:flex-row gap-2 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                        <h3 className="text-xl font-semibold">{exp.position}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {exp.period}
                        </div>
                      </div>
                      <div className={`flex mb-4 text-sm text-muted-foreground space-x-4 ${index % 2 !== 0 ? 'md:flex-row-reverse md:space-x-reverse' : ''}`}>
                        <div className="flex items-center">
                          <BriefcaseBusiness className="h-4 w-4 mr-1 flex-shrink-0" />
                          {exp.company}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                          {exp.location}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">
              Certifications
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional certifications that validate my expertise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certificatesData.map((cert, index) => (
              <Card key={cert.id} className={`border border-border hover-scale ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: `${0.2 * (index + 1)}s` }}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{cert.name}</h3>
                    <span className="text-sm text-muted-foreground">{cert.date}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Issued by: {cert.issuer}
                  </div>
                  <p className="text-muted-foreground">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Education;
