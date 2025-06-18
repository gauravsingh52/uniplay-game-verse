
import ResponsiveNavbar from '@/components/ResponsiveNavbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageSquare, HelpCircle, Mail, Phone, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    alert('Your message has been sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const faqs = [
    {
      question: "How do I start playing games?",
      answer: "Simply click on any game card on our Games page and it will open instantly in your browser. No downloads or installations required!"
    },
    {
      question: "Do I need to create an account?",
      answer: "You can play our games without an account, but creating one allows you to save progress, unlock achievements, and compete on leaderboards."
    },
    {
      question: "Are the games free to play?",
      answer: "Yes! All our games are completely free to play. We offer premium features for registered users like cloud saves and exclusive content."
    },
    {
      question: "Can I play on mobile devices?",
      answer: "Absolutely! All our games are optimized for mobile, tablet, and desktop devices with responsive controls and layouts."
    },
    {
      question: "How do I report a bug or issue?",
      answer: "You can report bugs through our contact form below, or use the AI chat assistant for immediate help with common issues."
    },
    {
      question: "Can I suggest new games?",
      answer: "We love hearing from our community! Use the contact form to suggest new games or features you'd like to see added."
    }
  ];

  const supportOptions = [
    {
      icon: MessageSquare,
      title: "AI Chat Support",
      description: "Get instant help with our AI assistant",
      action: "Chat Now",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      action: "Send Email",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: HelpCircle,
      title: "Help Center",
      description: "Browse our knowledge base",
      action: "Browse FAQs",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ResponsiveNavbar />
      
      <div className="pt-20 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-unigames-purple/10 text-unigames-purple border-unigames-purple/20">
              Support Center
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
                We're Here to Help
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Get support, find answers, and connect with our team. We're committed to providing 
              you with the best gaming experience possible.
            </p>
          </div>

          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {supportOptions.map((option, index) => (
              <Card key={index} className={`${option.bgColor} border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}>
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${option.bgColor} flex items-center justify-center`}>
                    <option.icon className={`h-8 w-8 ${option.color}`} />
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                  <CardDescription className="text-base">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    className="w-full bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80"
                    onClick={() => {
                      if (option.title === "Help Center") {
                        navigate('/help-center');
                      }
                    }}
                  >
                    {option.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Mail className="h-6 w-6 text-unigames-purple" />
                  Contact Form
                </CardTitle>
                <CardDescription>
                  Send us a message and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Name *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email *</label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject *</label>
                    <Input
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message *</label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Describe your issue or question in detail..."
                      rows={5}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQs */}
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <HelpCircle className="h-6 w-6 text-unigames-purple" />
                  Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground">
                  Quick answers to common questions
                </p>
              </div>
              
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:text-unigames-purple">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Support Hours */}
          <Card className="mt-16 bg-gradient-to-r from-unigames-purple/5 to-unigames-blue/5 border-unigames-purple/20">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <Clock className="h-12 w-12 mx-auto mb-4 text-unigames-purple" />
                  <h3 className="text-xl font-bold mb-2">Support Hours</h3>
                  <p className="text-muted-foreground">
                    Monday - Friday<br />
                    9:00 AM - 6:00 PM EST
                  </p>
                </div>
                <div>
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-unigames-blue" />
                  <h3 className="text-xl font-bold mb-2">Response Time</h3>
                  <p className="text-muted-foreground">
                    AI Chat: Instant<br />
                    Email: Within 24 hours
                  </p>
                </div>
                <div>
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-xl font-bold mb-2">Satisfaction Rate</h3>
                  <p className="text-muted-foreground">
                    95% of users rate our<br />
                    support as excellent
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
