
import ResponsiveNavbar from '@/components/ResponsiveNavbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Zap, Star, Gamepad2, Shield, Smartphone, Globe, Clock, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "Instant Play",
      description: "No downloads required. Play directly in your browser with lightning-fast loading times.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20"
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Unlock badges, track progress, and compete with friends through our comprehensive achievement system.",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20"
    },
    {
      icon: Users,
      title: "Social Gaming",
      description: "Share scores, challenge friends, and climb leaderboards in our vibrant gaming community.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Full responsive design with touch controls optimized for phones, tablets, and desktops.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      icon: Globe,
      title: "Cross-Platform",
      description: "Play anywhere, anytime. Your progress syncs across all devices seamlessly.",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Advanced security measures protect your data while you focus on gaming.",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20"
    }
  ];

  const stats = [
    { label: "Active Players", value: "50K+", icon: Users },
    { label: "Games Available", value: "15+", icon: Gamepad2 },
    { label: "Avg. Session", value: "25min", icon: Clock },
    { label: "User Rating", value: "4.8★", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ResponsiveNavbar />
      
      <div className="pt-20 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-unigames-purple/10 text-unigames-purple border-unigames-purple/20">
              Platform Features
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
                Premium Gaming
              </span>
              <br />
              <span className="text-foreground">Experience</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover the advanced features that make UNIGAMES the ultimate browser gaming platform. 
              From instant play to social features, we've built everything you need for the perfect gaming experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80"
                onClick={() => navigate('/games')}
              >
                <Gamepad2 className="h-5 w-5 mr-2" />
                Try Our Games
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/signup')}
                className="hover:bg-unigames-purple/10 hover:text-unigames-purple hover:border-unigames-purple/30"
              >
                Get Started Free
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-border/50 hover:border-unigames-purple/30 transition-colors">
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-unigames-purple" />
                  <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`${feature.bgColor} ${feature.borderColor} border-2 hover:shadow-xl transition-all duration-300 hover:scale-105`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gaming Engine Section */}
          <Card className="mb-16 bg-gradient-to-r from-unigames-purple/5 to-unigames-blue/5 border-unigames-purple/20">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="mb-4 bg-unigames-purple/10 text-unigames-purple border-unigames-purple/20">
                    Advanced Technology
                  </Badge>
                  <h2 className="text-3xl font-bold mb-4">
                    Built for Performance
                  </h2>
                  <p className="text-muted-foreground mb-6 text-lg">
                    Our custom gaming engine delivers 60fps gameplay, responsive controls, and seamless 
                    performance across all devices. Experience smooth gameplay with advanced features 
                    like real-time scoring, save states, and cloud synchronization.
                  </p>
                  <div className="space-y-3">
                    {[
                      "60fps smooth gameplay",
                      "Real-time save & load",
                      "Cloud progress sync",
                      "Advanced touch controls",
                      "Optimized for all devices"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-green-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-black rounded-xl p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-unigames-purple/20 to-unigames-blue/20"></div>
                    <div className="relative">
                      <div className="text-green-400 font-mono text-sm mb-4">
                        &gt; UNIGAMES Engine v2.0
                      </div>
                      <div className="space-y-2 text-sm font-mono">
                        <div className="text-blue-400">✓ WebGL Renderer: Active</div>
                        <div className="text-green-400">✓ Audio System: Initialized</div>
                        <div className="text-yellow-400">✓ Input Handler: Ready</div>
                        <div className="text-purple-400">✓ Save System: Connected</div>
                        <div className="text-cyan-400">✓ Network: Online</div>
                      </div>
                      <div className="mt-4 text-green-400 font-mono text-sm animate-pulse">
                        Ready to play &gt;
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-unigames-purple/10 via-unigames-blue/10 to-unigames-cyan/10 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience Next-Level Gaming?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of players already enjoying premium browser gaming with all the features you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 text-lg px-8"
                onClick={() => navigate('/games')}
              >
                <Gamepad2 className="h-5 w-5 mr-2" />
                Start Playing Now
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 hover:bg-unigames-purple/10 hover:text-unigames-purple hover:border-unigames-purple/30"
                onClick={() => navigate('/signup')}
              >
                Create Free Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
