
import ResponsiveNavbar from '@/components/ResponsiveNavbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Brain, Gamepad2, Star, Zap, Shield, Globe } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Gamepad2,
      title: "30+ Premium Games",
      description: "Carefully curated collection of browser games across multiple genres",
      badge: "Free to Play",
      color: "text-blue-500"
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Unlock badges and achievements as you progress through games",
      badge: "Gamification",
      color: "text-yellow-500"
    },
    {
      icon: Users,
      title: "Social Gaming",
      description: "Compete with friends and share your high scores",
      badge: "Community",
      color: "text-green-500"
    },
    {
      icon: Brain,
      title: "AI Game Assistant",
      description: "Get help, tips, and recommendations from our smart assistant",
      badge: "AI Powered",
      color: "text-purple-500"
    },
    {
      icon: Star,
      title: "Personalized Experience",
      description: "Tailored game recommendations based on your preferences",
      badge: "Smart",
      color: "text-pink-500"
    },
    {
      icon: Zap,
      title: "Instant Play",
      description: "No downloads required - games load instantly in your browser",
      badge: "Fast",
      color: "text-orange-500"
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Family-friendly content with secure gameplay environment",
      badge: "Protected",
      color: "text-red-500"
    },
    {
      icon: Globe,
      title: "Cross-Platform",
      description: "Play on any device - desktop, tablet, or mobile",
      badge: "Universal",
      color: "text-cyan-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ResponsiveNavbar />
      
      <div className="pt-20 pb-16">
        <div className="container-responsive">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fadeIn">
            <Badge className="mb-4 bg-unigames-purple/20 text-unigames-purple border-unigames-purple/30">
              Platform Features
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Powerful Features</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover what makes UNIGAMES the ultimate browser gaming platform with cutting-edge features designed for the modern gamer.
            </p>
            <div className="section-divider"></div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card key={feature.title} className="card-responsive hover-lift animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-unigames-purple/10 via-unigames-blue/10 to-unigames-cyan/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience All Features?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of players who are already enjoying the full UNIGAMES experience with all these amazing features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="btn-primary-modern"
                onClick={() => navigate('/games')}
              >
                Start Playing Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-secondary-modern"
                onClick={() => navigate('/browse')}
              >
                Browse All Games
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
