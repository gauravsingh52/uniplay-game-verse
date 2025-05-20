
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from './use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthChange = async () => {
      // First set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          console.log('Auth state changed:', event, currentSession?.user?.email);
          
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (event === 'SIGNED_IN' && currentSession) {
            toast({
              title: "Welcome!",
              description: `You've successfully signed in as ${currentSession.user.email}`,
            });
            
            // Only navigate if we're not already on dashboard
            if (location.pathname === '/login' || location.pathname === '/signup') {
              navigate('/dashboard');
            }
          }
          
          if (event === 'SIGNED_OUT') {
            toast({
              title: "Signed out",
              description: "You've been successfully signed out",
            });
            navigate('/');
          }
          
          setIsLoading(false);
        }
      );

      // Then get the current session
      const { data: { session: initialSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        toast({
          title: "Session Error",
          description: "There was a problem retrieving your session",
          variant: "destructive",
        });
      } else {
        console.log('Initial session check:', initialSession?.user?.email || 'No session');
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      }
      
      setIsLoading(false);
      return () => subscription.unsubscribe();
    };

    handleAuthChange();
  }, [navigate, toast, location.pathname]);

  // Check for OAuth redirect response
  useEffect(() => {
    const handleOAuthResponse = async () => {
      // Check for hash fragment from OAuth redirect
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      
      if (accessToken) {
        console.log('OAuth redirect detected');
        // Manually process OAuth redirect if needed
        const { data, error } = await supabase.auth.getUser(accessToken);
        if (data?.user && !error) {
          // Successfully authenticated
          console.log('OAuth user retrieved:', data.user.email);
        } else if (error) {
          console.error('OAuth error:', error);
          toast({
            title: "Authentication Failed",
            description: error.message || "Could not complete the authentication process",
            variant: "destructive",
          });
        }
      }
    };

    handleOAuthResponse();
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      // The session handling will be done by the onAuthStateChange listener
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Could not log in with those credentials",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Welcome to UNIGAMES!",
      });
      
      // If email confirmation is required
      if (data?.user?.identities?.length === 0) {
        toast({
          title: "Verification email sent",
          description: "Please check your email to confirm your account",
        });
        navigate('/login');
      }
      // The session handling will be done by the onAuthStateChange listener
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Could not create your account",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // The session handling will be done by the onAuthStateChange listener
    } catch (error: any) {
      toast({
        title: "Error",
        description: "There was a problem signing out",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
