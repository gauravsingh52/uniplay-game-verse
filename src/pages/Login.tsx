
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Gamepad } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [socialAuthLoading, setSocialAuthLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password.",
      });
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message || "Unable to send reset email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'discord') => {
    try {
      setSocialAuthLoading(provider);
      
      // Get the current origin for proper redirect
      const redirectTo = `${window.location.origin}/dashboard`;
      console.log(`OAuth redirecting to: ${redirectTo}`);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) throw error;
      
      // If no error and we have a URL, we can redirect
      if (data?.url) {
        // Redirect happens automatically
        window.location.href = data.url;
      } else {
        throw new Error('No redirect URL provided by authentication service');
      }
    } catch (error: any) {
      console.error(`${provider} auth error:`, error);
      toast({
        title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} login failed`,
        description: error.message || `Unable to sign in with ${provider}. Please check if ${provider} authentication is enabled in your Supabase settings.`,
        variant: "destructive",
      });
      setSocialAuthLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-unigames-purple"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center justify-center">
              <Gamepad className="h-8 w-8 text-unigames-purple mr-2" />
              <span className="text-2xl font-bold font-mono">
                UNI<span className="text-unigames-purple">GAMES</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold mt-6">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-muted"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <button 
                  type="button" 
                  className="text-sm text-unigames-purple hover:underline"
                  onClick={handlePasswordReset}
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background border-muted"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Remember me for 30 days
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-unigames-purple hover:bg-unigames-purple/80 button-glow"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                type="button" 
                className="border-muted flex items-center justify-center"
                onClick={() => handleSocialAuth('google')}
                disabled={socialAuthLoading !== null}
              >
                {socialAuthLoading === 'google' ? (
                  <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-unigames-purple rounded-full mr-2"></div>
                ) : null}
                Google
              </Button>
              <Button 
                variant="outline" 
                type="button" 
                className="border-muted flex items-center justify-center"
                onClick={() => handleSocialAuth('discord')}
                disabled={socialAuthLoading !== null}
              >
                {socialAuthLoading === 'discord' ? (
                  <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-unigames-purple rounded-full mr-2"></div>
                ) : null}
                Discord
              </Button>
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-unigames-purple hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden md:block w-1/2 bg-muted">
        <div className="h-full w-full relative">
          <div className="absolute inset-0 bg-gradient-to-br from-unigames-purple/20 to-unigames-dark/40 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Gaming setup"
            className="h-full w-full object-cover"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20 max-w-lg p-6">
            <h2 className="text-3xl font-bold mb-4">Play Anywhere, Anytime</h2>
            <p className="text-lg text-gray-200">
              Access your favorite games instantly across all your devices with UNIGAMES cloud gaming platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
