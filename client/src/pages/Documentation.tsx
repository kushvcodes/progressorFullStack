
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Particles from '@/components/animations/Particles';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Book, Code, Layers, Lock, Unlock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Documentation = () => {
  const [accessCode, setAccessCode] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const checkAccessCode = () => {
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      if (accessCode === 'DHBWSTUTTGART') {
        setHasAccess(true);
        toast({
          title: "Access granted",
          description: "You now have access to the full documentation.",
          variant: "default",
        });
      } else {
        toast({
          title: "Invalid access code",
          description: "Please check your code and try again.",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="min-h-screen overflow-hidden animated-gradient-bg flex flex-col">
      <Particles quantity={65} staticity={50} ease={60} />
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 md:pt-28 pb-16 md:px-6 relative z-10 page-transition flex-grow">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]">Documentation</h1>
          <p className="text-muted-foreground drop-shadow-md">Learn about the technologies and functionality of ProgressorAI.</p>
        </div>
        
        {!hasAccess ? (
          <GlassCard className="p-8 max-w-md mx-auto mb-16 animate-fade-in">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock size={32} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Documentation Access</h2>
              <p className="text-muted-foreground">
                Full documentation requires an access code. 
                Please enter your code below to gain access to the complete documentation.
              </p>
              
              <div className="w-full mt-4 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="accessCode" className="text-sm text-left block">
                    Access Code
                  </label>
                  <Input
                    id="accessCode"
                    type="text"
                    placeholder="Enter your access code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <Button 
                  onClick={checkAccessCode} 
                  className="w-full" 
                  disabled={isSubmitting || !accessCode.trim()}
                >
                  {isSubmitting ? "Verifying..." : "Submit"}
                </Button>
              </div>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 gap-8 mb-16 animate-fade-in">
            <GlassCard className="p-6">
              <div className="flex items-center mb-4">
                <Unlock size={20} className="text-green-400 mr-2" />
                <span className="text-green-400 text-sm">Full access granted</span>
              </div>
              
              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">
                    <Book size={16} className="mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="tech">
                    <Code size={16} className="mr-2" />
                    Technology
                  </TabsTrigger>
                  <TabsTrigger value="architecture">
                    <Layers size={16} className="mr-2" />
                    Architecture
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">ProgressorAI: Overview</h3>
                    <p className="text-muted-foreground mb-4">
                      ProgressorAI is a modern productivity application designed to help users manage tasks,
                      track productivity, and gain insights through AI-powered analytics.
                    </p>
                    
                    <h4 className="text-md font-medium mb-2">Key Features</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Task management with priority levels and due dates</li>
                      <li>Kanban board for visual task organization</li>
                      <li>AI-powered task time estimation</li>
                      <li>Productivity analytics and reporting</li>
                      <li>Real-time chat interface with AI assistant</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium mb-2">User Interface</h4>
                    <p className="text-muted-foreground">
                      The application features a modern, responsive design with a dark theme and glassmorphism effects.
                      The UI is built with React and Tailwind CSS, utilizing shadcn/ui components for consistent styling.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="tech" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Technology Stack</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-md font-medium mb-2">Frontend</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>React 18 with TypeScript</li>
                          <li>Tailwind CSS for styling</li>
                          <li>shadcn/ui component library</li>
                          <li>React Router for navigation</li>
                          <li>Lucide React for icons</li>
                          <li>Recharts for data visualization</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-md font-medium mb-2">State Management</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>React Context API</li>
                          <li>TanStack Query (React Query)</li>
                          <li>Local state with useState</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium mb-2">Build Tools</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Vite for fast development and building</li>
                      <li>TypeScript for type safety</li>
                      <li>ESLint and Prettier for code quality</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="architecture" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Application Architecture</h3>
                    <p className="text-muted-foreground mb-4">
                      ProgressorAI follows a component-based architecture with a focus on reusability and maintainability.
                    </p>
                    
                    <h4 className="text-md font-medium mb-2">Project Structure</h4>
                    <div className="bg-background/50 p-4 rounded-md">
                      <pre className="text-xs overflow-auto">
{`src/
  ├── components/
  │   ├── animations/     # Animation components
  │   ├── chat/           # Chat interface components
  │   ├── layout/         # Layout components (Navbar, Footer)
  │   ├── tasks/          # Task management components
  │   └── ui/             # UI components from shadcn/ui
  ├── hooks/              # Custom React hooks
  ├── lib/                # Utility functions
  ├── pages/              # Page components
  ├── providers/          # Context providers
  └── types/              # TypeScript type definitions`}
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium mb-2">Component Design</h4>
                    <p className="text-muted-foreground">
                      Components are designed to be modular and composable, with a clear separation of concerns:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                      <li>UI components are focused on presentation</li>
                      <li>Container components manage state and business logic</li>
                      <li>Context providers handle application-wide state</li>
                      <li>Custom hooks encapsulate reusable logic</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </GlassCard>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Documentation;
