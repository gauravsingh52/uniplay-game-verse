
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Play, ArrowRight, Gamepad2, Star, Zap, Users, Clock, Shield, TrendingUp } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';

const EnhancedHeroSection = () => {
  const navigate = useNavigate();
  const [currentStatistic, setCurrentStatistic] = useState(0);
  
  const statistics = [
    { label: 'Active Games', value: '30+', icon: Gamepad2, color: 'text-unigames-purple' },
    { label: 'Daily Players', value: '10K+', icon: Users, color: 'text-unigames-blue' },
    { label: 'Avg Rating', value: '4.8★', icon: Star, color: 'text-yellow-500' },
    { label: 'Load Time', value: '<1s', icon: Zap, color: 'text-green-500' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatistic((prev) => (prev + 1) % statistics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const FloatingCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
    <div className={`animate-float ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-animate opacity-10"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-unigames-purple/5 rounded-full filter blur-3xl animate-pulse-custom"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-80 md:h-80 bg-unigames-blue/5 rounded-full filter blur-3xl animate-pulse-custom" style={{ animationDelay: '1s' }}></div>
      
      <div className="container-responsive relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left stagger-children">
            {/* Announcement Badge */}
            <div className="inline-flex items-center space-x-2 glass-effect rounded-full px-4 py-2 text-sm font-medium border border-unigames-purple/30">
              <Zap className="w-4 h-4 text-unigames-purple animate-pulse-custom" />
              <span>NEW: 30+ Games Added This Month!</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-responsive-3xl font-bold font-['Poppins']">
                <span className="block bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                  Game. Achieve.
                </span>
                <span className="block bg-gradient-to-r from-unigames-purple via-unigames-blue to-unigames-cyan bg-clip-text text-transparent">
                  Dominate.
                </span>
              </h1>
              <p className="text-responsive-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Experience the ultimate browser gaming platform with instant play, achievements, and social features. No downloads, no limits.
              </p>
            </div>
            
            {/* Feature Highlights */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              {[
                { icon: Clock, text: 'Instant Play', color: 'text-unigames-purple' },
                { icon: Users, text: 'Social Gaming', color: 'text-unigames-blue' },
                { icon: Shield, text: 'Achievements', color: 'text-unigames-cyan' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <feature.icon className={`w-4 h-4 ${feature.color}`} />
                  <span className="text-muted-foreground">{feature.text}</span>
                </div>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="group bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 text-white font-semibold px-8 py-4 rounded-xl ripple-effect smooth-transition"
                onClick={() => navigate('/games')}
              >
                <Play className="mr-2 h-5 w-5 group-hover:animate-pulse-custom" /> 
                Start Gaming Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="group glass-effect border-unigames-purple/50 text-unigames-purple hover:bg-unigames-purple/10 font-semibold px-8 py-4 rounded-xl smooth-transition"
                onClick={() => navigate('/browse')}
              >
                <Gamepad2 className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" /> 
                Explore Games
              </Button>
            </div>

            {/* Dynamic Statistics */}
            <div className="pt-8">
              <div className="glass-effect rounded-2xl p-6 max-w-sm mx-auto lg:mx-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r from-unigames-purple/20 to-unigames-blue/20`}>
                      {React.createElement(statistics[currentStatistic].icon, {
                        className: `h-6 w-6 ${statistics[currentStatistic].color}`
                      })}
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{statistics[currentStatistic].value}</p>
                      <p className="text-sm text-muted-foreground">{statistics[currentStatistic].label}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {statistics.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          index === currentStatistic ? 'bg-unigames-purple' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Floating Game Cards */}
          <div className="hidden lg:flex relative justify-center items-center">
            {/* Main Showcase Card */}
            <FloatingCard className="relative z-30 group">
              <div className="absolute -inset-4 bg-gradient-to-r from-unigames-purple/20 to-unigames-blue/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <Card className="relative glass-effect rounded-2xl overflow-hidden shadow-2xl border border-border/50 transform group-hover:scale-105 transition-all duration-500 w-80">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-unigames-purple to-unigames-blue"></div>
                <img
                  src="https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
                  alt="Gaming showcase"
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Premium Games</h3>
                    <Badge className="bg-unigames-purple/20 text-unigames-purple border-unigames-purple/30">
                      NEW
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Experience next-level browser gaming with achievements and social features
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">5.0/5</span>
                    </div>
                    <span className="text-xs text-muted-foreground">30+ Games</span>
                  </div>
                </CardContent>
              </Card>
            </FloatingCard>
            
            {/* Floating Accent Cards */}
            <FloatingCard delay={300} className="absolute top-16 -left-20 z-10 rotate-[-15deg] hidden xl:block">
              <Card className="glass-effect w-48 h-32 rounded-xl overflow-hidden shadow-lg border border-border/30 hover:scale-110 transition-transform duration-300 cursor-pointer">
                <div className="h-full bg-gradient-to-br from-unigames-purple/20 to-unigames-blue/20 flex items-center justify-center">
                  <div className="text-center">
                    <Gamepad2 className="h-8 w-8 mx-auto mb-2 text-unigames-purple" />
                    <p className="text-sm font-medium">Instant Play</p>
                  </div>
                </div>
              </Card>
            </FloatingCard>
            
            <FloatingCard delay={500} className="absolute bottom-12 -right-16 z-10 rotate-[12deg] hidden xl:block">
              <Card className="glass-effect w-40 h-28 rounded-xl overflow-hidden shadow-lg border border-border/30 hover:scale-110 transition-transform duration-300 cursor-pointer">
                <div className="h-full bg-gradient-to-br from-unigames-cyan/20 to-unigames-pink/20 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto mb-1 text-unigames-cyan" />
                    <p className="text-xs font-medium">Social Gaming</p>
                  </div>
                </div>
              </Card>
            </FloatingCard>
          </div>
        </div>
        
        {/* Enhanced Search Section */}
        <div className="w-full max-w-2xl mx-auto mt-16 animate-fadeIn">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-unigames-purple/20 to-unigames-blue/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative glass-effect rounded-2xl p-2">
              <SearchBar fullWidth={true} />
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Search from 30+ premium games with achievements and social features
          </p>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;
