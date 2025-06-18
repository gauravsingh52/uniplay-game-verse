
import ResponsiveNavbar from '@/components/ResponsiveNavbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Book, Zap, Users, Mail, Phone, Clock, CheckCircle } from 'lucide-react';

const Support = () => {
  const faqs = [
    {
      question: "How do I play games on mobile?",
      answer: "All our games are optimized for mobile devices with touch controls. Simply tap the game card and click 'Play Now' to start playing on your phone or tablet."
    },
    {
      question: "Are the games really free?",
      answer: "Yes! All games on UNIGAMES are completely free to play. No hidden fees, no subscriptions, no in-app purchases required."
    },
    {
      question: "Can I save my game progress?",
      answer: "Game progress is automatically saved in your browser. For persistent saves across devices, create a free account by signing up."
    },
    {
      question: "Why won't a game load?",
      answer: "Try refreshing the page, clearing your browser cache, or ensuring JavaScript is enabled. All games are tested and work on modern browsers."
    },
    {
      question: "How do I create an account?",
      answer: "Click the 'Sign Up' button in the top navigation, enter your email and create a password. You'll receive a verification email to complete the process."
    }
  ];

  const supportChannels = [
    {
      icon: MessageSquare,
      title: "AI Assistant",
      description: "Get instant help with our AI chatbot",
      action: "Chat Now",
      available: "24/7",
      color: "bg-blue-500"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us detailed questions or feedback",
      action: "support@unigames.com",
      available: "Reply within 24h",
      color: "bg-green-500"
    },
    {
      icon: Book,
      title: "Game Guides",
      description: "Learn how to play each game",
      action: "Browse Guides",
      available: "Always updated",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ResponsiveNavbar />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-unigames-purple/20 to-unigames-blue/20 backdrop-blur-sm border border-unigames-purple/30 rounded-full px-4 py-2 text-sm font-medium mb-4">
              <Zap className="w-4 h-4 text-unigames-purple" />
              <span>24/7 Support Available</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
                How Can We Help?
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get support, find answers, and learn how to make the most of UNIGAMES
            </p>
          </div>

          {/* Support Channels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {supportChannels.map((channel, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center pb-3">
                  <div className={`w-12 h-12 ${channel.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <channel.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{channel.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {channel.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    className="w-full mb-3 bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80"
                    onClick={() => {
                      if (channel.action === "Chat Now") {
                        // Trigger AI assistant
                        const event = new CustomEvent('openAIAssistant');
                        window.dispatchEvent(event);
                      } else if (channel.action.includes("@")) {
                        window.location.href = `mailto:${channel.action}`;
                      }
                    }}
                  >
                    {channel.action}
                  </Button>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {channel.available}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Quick answers to common questions</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-r from-unigames-purple/10 to-unigames-blue/10 border-unigames-purple/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Need More Help?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our AI assistant is available 24/7 to help with game recommendations, technical issues, and account questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80"
                  onClick={() => {
                    const event = new CustomEvent('openAIAssistant');
                    window.dispatchEvent(event);
                  }}
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Chat with AI Assistant
                </Button>
                <Button variant="outline" size="lg">
                  <Users className="h-5 w-5 mr-2" />
                  Join Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
