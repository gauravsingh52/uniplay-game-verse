
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Settings, 
  Crown, 
  Heart, 
  Clock, 
  Gamepad, 
  Trophy, 
  Star,
  Bell,
  HelpCircle,
  Shield,
  CreditCard,
  LogOut,
  Home,
  Bookmark
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

export function AppSidebar() {
  const { user, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const userName = user?.user_metadata?.full_name || 
                   user?.user_metadata?.name ||
                   (user?.email ? user.email.split('@')[0] : 'Guest');

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Mock user stats - in a real app these would come from your database
  const userStats = {
    gamesPlayed: 127,
    hoursPlayed: 48,
    achievements: 23,
    level: 15,
    experience: 750,
    nextLevelExp: 1000,
    favoriteGames: 12,
    streakDays: 7
  };

  const navigationItems = [
    { title: "Home", url: "/", icon: Home },
    { title: "Dashboard", url: "/dashboard", icon: Gamepad },
    { title: "Browse Games", url: "/browse", icon: Gamepad },
    { title: "Categories", url: "/categories", icon: Bookmark },
    { title: "Trending", url: "/trending", icon: Trophy },
  ];

  const accountItems = [
    { title: "Profile Settings", url: "/settings", icon: User },
    { title: "Notifications", url: "/notifications", icon: Bell },
    { title: "Privacy & Security", url: "/privacy", icon: Shield },
    { title: "Billing", url: "/billing", icon: CreditCard },
    { title: "Help & Support", url: "/help", icon: HelpCircle },
  ];

  if (!isAuthenticated) {
    return (
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-foreground font-mono">
              UNI<span className="text-unigames-purple">GAMES</span>
            </span>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.slice(0, 4).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarSeparator />
          
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="p-4 space-y-3">
                <h3 className="text-sm font-medium">Join UNIGAMES</h3>
                <p className="text-xs text-muted-foreground">
                  Sign up to track your progress, save favorites, and access premium features.
                </p>
                <div className="space-y-2">
                  <Button asChild className="w-full bg-unigames-purple hover:bg-unigames-purple/80">
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/login">Sign In</Link>
                  </Button>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-unigames-purple to-unigames-blue flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium truncate">{userName}</h3>
            <div className="flex items-center space-x-1">
              <Badge variant="secondary" className="text-xs">
                <Crown className="h-3 w-3 mr-1" />
                Free Plan
              </Badge>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* User Stats */}
        <SidebarGroup>
          <SidebarGroupLabel>Player Stats</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-4 space-y-4">
              {/* Level Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    Level {userStats.level}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {userStats.experience}/{userStats.nextLevelExp} XP
                  </span>
                </div>
                <Progress value={(userStats.experience / userStats.nextLevelExp) * 100} className="h-2" />
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-unigames-purple">{userStats.gamesPlayed}</div>
                  <div className="text-xs text-muted-foreground">Games Played</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-unigames-blue">{userStats.hoursPlayed}h</div>
                  <div className="text-xs text-muted-foreground">Hours Played</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-yellow-500">{userStats.achievements}</div>
                  <div className="text-xs text-muted-foreground">Achievements</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-500">{userStats.streakDays}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard">
                    <Clock className="h-4 w-4" />
                    <span>Recently Played</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard">
                    <Heart className="h-4 w-4" />
                    <span>Favorites</span>
                    <Badge variant="secondary" className="ml-auto">
                      {userStats.favoriteGames}
                    </Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard">
                    <Trophy className="h-4 w-4" />
                    <span>Achievements</span>
                    <Badge variant="secondary" className="ml-auto">
                      {userStats.achievements}
                    </Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Account & Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Account & Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {/* Membership Upgrade */}
        <div className="bg-gradient-to-r from-unigames-purple/20 to-unigames-blue/20 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Crown className="h-4 w-4 text-unigames-purple" />
            <span className="font-medium text-sm">Upgrade to Pro</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Unlock premium games, 4K streaming, and exclusive features.
          </p>
          <Button size="sm" className="w-full bg-unigames-purple hover:bg-unigames-purple/80">
            Upgrade Now
          </Button>
        </div>

        {/* Logout */}
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
