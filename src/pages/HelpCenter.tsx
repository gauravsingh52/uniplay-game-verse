
import { useState } from 'react';
import ResponsiveNavbar from '@/components/ResponsiveNavbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Search, 
  BookOpen, 
  Gamepad2, 
  Shield, 
  Settings,
  Send,
  Star,
  CheckCircle
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import AIHelpAssistant from '@/components/AIHelpAssistant';

const HelpCenter = () => {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const faqs = [
    {
      category: "Getting Started",
      items: [
        {
          question: "How do I create an account?",
          answer: "Click the 'Sign Up' button in the top navigation, enter your email and password, then verify your email address to get started."
        },
        {
          question: "Are all games really free?",
          answer: "Yes! All games on UNIGAMES are completely free to play. No hidden fees, subscriptions, or in-app purchases required."
        },
        {
          question: "Do I need to download anything?",
          answer: "No downloads needed! All games run directly in your browser using HTML5 technology."
        }
      ]
    },
    {
      category: "Gaming",
      items: [
        {
          question: "How do I play games on mobile?",
          answer: "All games are optimized for mobile with touch controls. Simply tap any game card and click 'Play Now' to start."
        },
        {
          question: "Can I save my game progress?",
          answer: "Game progress is automatically saved in your browser. For cross-device saves, create an account to sync your progress."
        },
        {
          question: "Why won't a game load?",
          answer: "Try refreshing the page, clearing browser cache, or ensuring JavaScript is enabled. Contact support if issues persist."
        }
      ]
    },
    {
      category: "Account & Settings",
      items: [
        {
          question: "How do I reset my password?",
          answer: "Click 'Forgot Password' on the login page, enter your email, and follow the instructions sent to your inbox."
        },
        {
          question: "Can I change my username?",
          answer: "Yes, go to Settings > Profile to update your display name and other profile information."
        },
        {
          question: "How do I delete my account?",
          answer: "Contact our support team through the contact form below, and we'll help you delete your account permanently."
        }
      ]
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setContactForm({ name: '', email: '', subject: '', message: '', category: 'general' });
  };

  return (
    <div className="min-h-screen bg-background">
      <ResponsiveNavbar />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-unigames-purple/20 to-unigames-blue/20 backdrop-blur-sm border border-unigames-purple/30 rounded-full px-4 py-2 text-sm font-medium mb-4">
              <HelpCircle className="w-4 h-4 text-unigames-purple" />
              <span>24/7 AI Support Available</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
                Help Center
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get instant help, browse FAQs, or contact our support team
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="faq" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="faq" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    FAQs
                  </TabsTrigger>
                  <TabsTrigger value="guides" className="flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4" />
                    Game Guides
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Us
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="faq" className="space-y-6">
                  {faqs.map((category, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          {category.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible>
                          {category.items.map((item, itemIndex) => (
                            <AccordionItem key={itemIndex} value={`${index}-${itemIndex}`}>
                              <AccordionTrigger className="text-left">
                                {item.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-muted-foreground">
                                {item.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="guides" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { title: "Snake Classic", desc: "Master the classic snake game with tips and strategies", difficulty: "Easy" },
                      { title: "Tetris", desc: "Learn advanced Tetris techniques and line clearing combos", difficulty: "Medium" },
                      { title: "2048", desc: "Strategic guide to reaching the 2048 tile and beyond", difficulty: "Medium" },
                      { title: "Flappy Bird", desc: "Timing and rhythm techniques for high scores", difficulty: "Hard" }
                    ].map((guide, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{guide.title}</CardTitle>
                            <Badge variant={guide.difficulty === 'Easy' ? 'secondary' : guide.difficulty === 'Medium' ? 'default' : 'destructive'}>
                              {guide.difficulty}
                            </Badge>
                          </div>
                          <CardDescription>{guide.desc}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="w-full">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Read Guide
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Support</CardTitle>
                      <CardDescription>
                        Send us a message and we'll get back to you within 24 hours
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              value={contactForm.name}
                              onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={contactForm.email}
                              onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            value={contactForm.subject}
                            onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            rows={5}
                            value={contactForm.message}
                            onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full bg-unigames-purple hover:bg-unigames-purple/80">
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Help</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      const event = new CustomEvent('openAIAssistant');
                      window.dispatchEvent(event);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    AI Assistant
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Search className="h-4 w-4 mr-2" />
                    Search FAQs
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Topics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Login Issues</span>
                    <Badge variant="secondary">156</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Game Controls</span>
                    <Badge variant="secondary">89</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Mobile Gaming</span>
                    <Badge variant="secondary">67</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Save Progress</span>
                    <Badge variant="secondary">45</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-unigames-purple/10 to-unigames-blue/10 border-unigames-purple/20">
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 text-unigames-purple mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Need More Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our AI assistant is available 24/7 for instant support
                  </p>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80"
                    onClick={() => {
                      const event = new CustomEvent('openAIAssistant');
                      window.dispatchEvent(event);
                    }}
                  >
                    Chat Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
