
import { useState } from 'react';
import ResponsiveNavbar from '@/components/ResponsiveNavbar';
import AIHelpAssistant from '@/components/AIHelpAssistant';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageSquare, Mail, Phone, Clock, HelpCircle, Search, Bot } from "lucide-react";

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: "How do I play games on UNIGAMES?",
      answer: "Simply click on any game card and select 'Play Now'. Games load instantly in your browser - no downloads needed! All games are optimized for web browsers and work on desktop, tablet, and mobile devices."
    },
    {
      question: "Are all games really free?",
      answer: "Yes! All games on UNIGAMES are completely free to play. There are no hidden fees, subscriptions, or in-app purchases required. You can enjoy our entire game library without any cost."
    },
    {
      question: "Can I save my game progress?",
      answer: "Game progress is automatically saved in your browser for most games. For persistent saves across devices and enhanced features, you can create a free account to sync your progress and achievements."
    },
    {
      question: "Which devices are supported?",
      answer: "UNIGAMES works on all modern devices and browsers including Chrome, Firefox, Safari, and Edge. Our games are responsive and optimized for desktop computers, tablets, and smartphones."
    },
    {
      question: "How do I report a bug or issue?",
      answer: "You can report issues through our AI chat assistant (bottom-right corner), use the contact form below, or email us directly. We aim to resolve all reported issues within 24-48 hours."
    },
    {
      question: "Can I suggest new games?",
      answer: "Absolutely! We love hearing from our community. Use our contact form or chat with our AI assistant to suggest new games. We regularly add new games based on user feedback."
    },
    {
      question: "Is my data safe and private?",
      answer: "Yes, we take privacy seriously. We only collect necessary data to improve your gaming experience. You can review our privacy policy and manage your data preferences in the settings."
    },
    {
      question: "How do achievements work?",
      answer: "Achievements are unlocked automatically as you play games and reach certain milestones. You can view your achievements in your profile (if you have an account) or they're saved locally in your browser."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <ResponsiveNavbar />
      
      <div className="pt-20 pb-16">
        <div className="container-responsive max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fadeIn">
            <Badge className="mb-4 bg-unigames-purple/20 text-unigames-purple border-unigames-purple/30">
              Help & Support
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">We're Here to Help</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Get instant support through our AI assistant, browse FAQs, or contact our team directly. We're committed to providing the best gaming experience.
            </p>
            <div className="section-divider"></div>
          </div>

          {/* Quick Help Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="card-responsive hover-lift">
              <CardHeader className="text-center">
                <Bot className="h-8 w-8 text-unigames-purple mx-auto mb-2" />
                <CardTitle>AI Assistant</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Get instant answers from our smart AI assistant
                </p>
                <Button 
                  className="btn-primary-modern w-full"
                  onClick={() => {
                    // AI Assistant is already available on the page
                    const event = new CustomEvent('open-ai-assistant');
                    window.dispatchEvent(event);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat Now
                </Button>
              </CardContent>
            </Card>

            <Card className="card-responsive hover-lift">
              <CardHeader className="text-center">
                <Mail className="h-8 w-8 text-unigames-blue mx-auto mb-2" />
                <CardTitle>Email Support</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Send us a detailed message about your issue
                </p>
                <Button variant="outline" className="btn-secondary-modern w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Form
                </Button>
              </CardContent>
            </Card>

            <Card className="card-responsive hover-lift">
              <CardHeader className="text-center">
                <Clock className="h-8 w-8 text-unigames-cyan mx-auto mb-2" />
                <CardTitle>Response Time</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  We typically respond within 24-48 hours
                </p>
                <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                  Fast Support
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card className="mb-12">
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="h-6 w-6 text-unigames-purple" />
                <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:text-unigames-purple">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              {filteredFaqs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No FAQs match your search. Try our AI assistant for personalized help!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Mail className="h-6 w-6 text-unigames-purple" />
                Contact Us
              </CardTitle>
              <p className="text-muted-foreground">
                Still need help? Send us a message and we'll get back to you soon.
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name</label>
                    <Input placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input placeholder="What's this about?" />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea 
                    placeholder="Describe your issue or question in detail..."
                    rows={6}
                  />
                </div>
                
                <Button className="btn-primary-modern w-full md:w-auto">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Help Assistant - Enhanced for Support Page */}
      <AIHelpAssistant />
    </div>
  );
};

export default Support;
