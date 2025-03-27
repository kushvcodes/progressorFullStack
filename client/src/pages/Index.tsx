
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import ChatInterface from '@/components/chat/ChatInterface';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import Particles from '@/components/animations/Particles';
import { BrainCircuit, Sparkles, BarChart2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen overflow-hidden animated-gradient-bg">
      <Particles quantity={isMobile ? 30 : 50} staticity={30} ease={30} />
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 pb-16 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-8 md:mb-12 animate-fade-in">
          <div className="inline-block mb-3">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/20 text-primary">
              Introducing ProgressorAI
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3 md:mb-4 px-1">
            Your <span className="text-slate-50">AI-Powered</span> Task Manager
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl px-1">
            Elevate your productivity with an intelligent assistant that learns your work habits.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center">
          <div className="order-2 lg:order-1 animate-fade-in" data-tour="chat-interface">
            <ChatInterface 
              introText="Hello! Welcome to ProgressorAI. I can help manage your tasks and optimize your workflow. How can I assist you today?" 
              suggestions={[{
                id: '1',
                text: 'What can you help me with?'
              }, {
                id: '2',
                text: 'How do you organize tasks?'
              }, {
                id: '3',
                text: 'Show me my productivity stats'
              }]} 
            />
          </div>
          
          <div className="order-1 lg:order-2 flex flex-col gap-4 md:gap-8 animate-fade-in">
            <FeatureCard 
              icon={BrainCircuit} 
              title="AI-Powered Task Management" 
              description="Our intelligent system learns your preferences and work patterns to suggest optimal task organization." 
            />
            
            <FeatureCard 
              icon={Sparkles} 
              title="Smart Productivity Insights" 
              description="Get personalized recommendations to improve your workflow based on your productivity patterns." 
            />
            
            <FeatureCard 
              icon={BarChart2} 
              title="Detailed Analytics" 
              description="Visualize your productivity trends with comprehensive analytics that help you understand when you work best." 
            />
            
            <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full">
              <Link to="/tasks" className="w-full sm:w-auto">
                <Button className="group w-full justify-center h-12 rounded-xl text-base">
                  Try Task Manager
                  <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/signup" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full justify-center h-12 rounded-xl text-base">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-16 md:mt-24 text-center animate-fade-in">
          <h2 className="text-xl md:text-2xl font-bold mb-8 md:mb-12">How ProgressorAI Works</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <ProcessStep 
              number={1} 
              title="Chat with your AI assistant" 
              description="Interact naturally with ProgressorAI to create tasks, get updates, or analyze your productivity." 
            />
            <ProcessStep 
              number={2} 
              title="Organize and prioritize" 
              description="Your tasks are automatically categorized and prioritized based on urgency and importance." 
            />
            <ProcessStep 
              number={3} 
              title="Optimize your workflow" 
              description="Receive personalized insights and suggestions to improve your productivity over time." 
            />
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto px-4 py-6 mt-8 border-t border-border text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ProgressorAI. All rights reserved.</p>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description
}) => {
  return (
    <GlassCard className="p-4 md:p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 rounded-xl">
      <div className="flex gap-3 md:gap-4">
        <div className="p-2.5 md:p-3 rounded-lg bg-primary/10 text-primary">
          <Icon size={20} />
        </div>
        <div>
          <h3 className="font-medium text-base mb-1 md:mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </GlassCard>
  );
};

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
}

const ProcessStep: React.FC<ProcessStepProps> = ({
  number,
  title,
  description
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3 md:mb-4 text-primary font-medium">
        {number}
      </div>
      <h3 className="font-medium mb-1 md:mb-2 text-base">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
