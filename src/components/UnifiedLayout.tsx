
import React from 'react';
import ResponsiveNavbar from './ResponsiveNavbar';
import EnhancedAIAssistant from './EnhancedAIAssistant';

interface UnifiedLayoutProps {
  children: React.ReactNode;
}

export const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Global Navigation - always visible */}
      <ResponsiveNavbar />
      
      {/* Main content area with consistent styling */}
      <main className="relative min-h-screen">
        {children}
      </main>
      
      {/* Global AI Assistant - always available */}
      <EnhancedAIAssistant />
    </div>
  );
};

export default UnifiedLayout;
