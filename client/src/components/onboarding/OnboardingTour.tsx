
import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface TourStep {
  id: string;
  title: string;
  description: string;
  targetElement: string;
  position: 'top' | 'right' | 'bottom' | 'left';
  route: string;
}

interface OnboardingTourProps {
  onComplete?: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const tourSteps: TourStep[] = [
    {
      id: 'intro',
      title: 'Welcome to ProgressorAI',
      description: 'This quick tour will help you discover the key features of the platform.',
      targetElement: 'body',
      position: 'top',
      route: '/'
    },
    {
      id: 'tasks',
      title: 'Task Management',
      description: 'Create, organize, and track your tasks with our intuitive interface.',
      targetElement: '[data-tour="tasks-link"]',
      position: 'bottom',
      route: '/'
    },
    {
      id: 'chat',
      title: 'AI Assistant',
      description: 'Chat with our AI assistant for help managing your tasks and productivity.',
      targetElement: '[data-tour="chat-interface"]',
      position: 'right',
      route: '/'
    },
    {
      id: 'analytics',
      title: 'Productivity Analytics',
      description: 'Track your progress with detailed analytics and visualization.',
      targetElement: '[data-tour="analytics-link"]',
      position: 'bottom',
      route: '/'
    }
  ];

  const currentStep = tourSteps[currentStepIndex];

  useEffect(() => {
    // Show the tour for new users (in a real app, this would check if the user has completed the tour)
    const hasCompletedTour = localStorage.getItem('onboardingCompleted');
    
    if (!hasCompletedTour && location.pathname === '/') {
      // Delay the start of the tour to allow the page to fully load
      const timer = setTimeout(() => {
        setIsVisible(true);
        positionTooltip();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isVisible) {
      positionTooltip();
    }
  }, [currentStepIndex, isVisible]);

  const positionTooltip = () => {
    const targetElement = document.querySelector(currentStep.targetElement);
    
    if (!targetElement) {
      return;
    }
    
    const rect = targetElement.getBoundingClientRect();
    let top = 0;
    let left = 0;
    
    switch (currentStep.position) {
      case 'top':
        top = rect.top - 10;
        left = rect.left + rect.width / 2;
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + 10;
        break;
      case 'bottom':
        top = rect.bottom + 10;
        left = rect.left + rect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - 10;
        break;
    }
    
    setPosition({ top, left });
  };

  const handleNext = () => {
    if (currentStepIndex < tourSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const completeTour = () => {
    setIsVisible(false);
    localStorage.setItem('onboardingCompleted', 'true');
    
    toast({
      title: "Tour completed!",
      description: "You've successfully completed the ProgressorAI tour. Enjoy the platform!",
    });
    
    if (onComplete) {
      onComplete();
    }
  };

  const skipTour = () => {
    setIsVisible(false);
    localStorage.setItem('onboardingCompleted', 'true');
    
    toast({
      description: "Tour skipped. You can restart it from the help menu.",
    });
  };

  if (!isVisible || location.pathname !== currentStep.route) {
    return null;
  }

  return (
    <div
      className="fixed z-[100] transition-opacity"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: `translate(-50%, ${currentStep.position === 'top' ? '-100%' : currentStep.position === 'bottom' ? '0' : '-50%'})`
      }}
    >
      <div 
        className={cn(
          "absolute w-2 h-2 bg-primary rotate-45",
          currentStep.position === 'bottom' && "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
          currentStep.position === 'top' && "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
          currentStep.position === 'left' && "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
          currentStep.position === 'right' && "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
        )}
      />
      <Card className="p-4 w-64 shadow-lg border-primary/20 animate-fade-in">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-sm">{currentStep.title}</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={skipTour}>
            <X size={14} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          {currentStep.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {tourSteps.map((_, index) => (
              <div 
                key={index} 
                className={`w-1.5 h-1.5 rounded-full ${
                  index === currentStepIndex ? 'bg-primary' : 'bg-muted'
                }`} 
              />
            ))}
          </div>
          <div className="flex gap-2">
            {currentStepIndex > 0 && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handlePrevious}>
                <ArrowLeft size={14} />
              </Button>
            )}
            <Button size="sm" className="h-7 text-xs px-3" onClick={handleNext}>
              {currentStepIndex < tourSteps.length - 1 ? 'Next' : 'Finish'}
              {currentStepIndex < tourSteps.length - 1 && <ArrowRight size={12} className="ml-1" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OnboardingTour;
