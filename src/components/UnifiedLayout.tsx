
import React from 'react';
import ResponsiveNavbar from './ResponsiveNavbar';
import AIHelpAssistant from './AIHelpAssistant';

interface UnifiedLayoutProps {
  children: React.ReactNode;
}

export const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background relative">
      <ResponsiveNavbar />
      <main className="relative">
        {children}
      </main>
      <AIHelpAssistant />
    </div>
  );
};

export default UnifiedLayout;
