
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Moon, Sun, User, Bell } from "lucide-react";
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    displayName: user?.user_metadata?.full_name || user?.user_metadata?.name || '',
    email: user?.email || ''
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    marketingEmails: false,
    newGameAlerts: true,
    friendRequests: true
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user's profile in Supabase
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto pt-24 pb-16 px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-4">
            <Button
              variant="ghost" 
              className="w-full justify-start bg-muted"
            >
              <User className="mr-3 h-5 w-5" />
              Profile
            </Button>
            <Button
              variant="ghost" 
              className="w-full justify-start"
            >
              <Bell className="mr-3 h-5 w-5" />
              Notifications
            </Button>
          </div>
          
          {/* Main content */}
          <div className="space-y-8">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Manage your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input 
                      id="displayName" 
                      value={profileData.displayName}
                      onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profileData.email}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  <Button type="submit">Update Profile</Button>
                </form>
              </CardContent>
            </Card>
            
            {/* Appearance Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how UNIGAMES looks on your device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Theme</Label>
                  <RadioGroup 
                    defaultValue={theme} 
                    onValueChange={(value) => setTheme(value as 'dark' | 'light')}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light" className="flex items-center">
                        <Sun className="h-4 w-4 mr-2" /> Light
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark" className="flex items-center">
                        <Moon className="h-4 w-4 mr-2" /> Dark
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
            
            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Control how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifs">Email Notifications</Label>
                  <Switch 
                    id="emailNotifs" 
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => setNotifications({...notifications, emailNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketingEmails">Marketing Emails</Label>
                  <Switch 
                    id="marketingEmails" 
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) => setNotifications({...notifications, marketingEmails: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="gameAlerts">New Game Alerts</Label>
                  <Switch 
                    id="gameAlerts" 
                    checked={notifications.newGameAlerts}
                    onCheckedChange={(checked) => setNotifications({...notifications, newGameAlerts: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="friendRequests">Friend Request Notifications</Label>
                  <Switch 
                    id="friendRequests" 
                    checked={notifications.friendRequests}
                    onCheckedChange={(checked) => setNotifications({...notifications, friendRequests: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
