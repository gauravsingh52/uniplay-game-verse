
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Gamepad, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  // Get the access token from the URL
  useEffect(() => {
    const handleTokenInUrl = async () => {
      // Supabase Auth will automatically process the token in the URL
      const { error } = await supabase.auth.refreshSession();
      
      if (error) {
        toast({
          title: "Invalid or expired link",
          description: "Please request a new password reset link.",
          variant: "destructive",
        });
      }
    };

    // If we have a hash in the URL, try to handle it
    if (window.location.hash) {
      handleTokenInUrl();
    }
  }, [toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
      
      setIsSuccess(true);
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to update password",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center">
            <Gamepad className="h-8 w-8 text-unigames-purple mr-2" />
            <span className="text-2xl font-bold font-mono">
              UNI<span className="text-unigames-purple">GAMES</span>
            </span>
          </Link>
          
          <h1 className="text-2xl font-bold mt-6">Reset your password</h1>
          {isSuccess ? (
            <p className="text-muted-foreground mt-2">
              Your password has been reset successfully.
            </p>
          ) : (
            <p className="text-muted-foreground mt-2">
              Enter your new password below.
            </p>
          )}
        </div>
        
        {isSuccess ? (
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/30 text-green-600 rounded-md p-4">
              Your password has been reset successfully. You can now log in with your new password.
            </div>
            
            <Button asChild className="w-full bg-unigames-purple hover:bg-unigames-purple/80">
              <Link to="/login">
                Go to Login
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                New Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                className="bg-background border-muted"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                className="bg-background border-muted"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-unigames-purple hover:bg-unigames-purple/80 button-glow"
              disabled={isLoading}
            >
              {isLoading ? "Resetting password..." : "Reset password"}
            </Button>
            
            <Button
              variant="ghost"
              asChild
              className="w-full"
            >
              <Link to="/login" className="flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to login
              </Link>
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
