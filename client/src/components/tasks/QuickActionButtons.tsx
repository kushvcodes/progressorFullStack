
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Zap, LineChart, KanbanSquare, BarChart2, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

interface QuickActionButtonProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  to?: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  to
}) => {
  const buttonContent = (
    <>
      <Icon size={18} className="mb-1" />
      <span className="text-xs">{label}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to}>
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center w-full h-auto py-3 hover:bg-primary/10 hover:text-primary transition-colors"
        >
          {buttonContent}
        </Button>
      </Link>
    );
  }

  return (
    <Button 
      variant="outline" 
      className="flex flex-col items-center justify-center h-auto py-3 hover:bg-primary/10 hover:text-primary transition-colors"
      onClick={onClick}
    >
      {buttonContent}
    </Button>
  );
};

interface QuickActionButtonsProps {
  onCreateTask?: () => void;
  onViewKanban?: () => void;
  onViewAnalytics?: () => void;
  tasks?: Array<{
    status: string;
    maxPoints?: number;
  }>;
}

export const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({ 
  onCreateTask,
  onViewKanban,
  onViewAnalytics,
  tasks = []
}) => {
  const [productivityPercent, setProductivityPercent] = useState(0);
  
  useEffect(() => {
    // Calculate productivity percentage based on completed tasks and their points
    if (tasks && tasks.length > 0) {
      const completedTasks = tasks.filter(task => task.status === 'completed');
      const totalPoints = tasks.reduce((sum, task) => sum + (task.maxPoints || 0), 0);
      const earnedPoints = completedTasks.reduce((sum, task) => sum + (task.maxPoints || 0), 0);
      
      const percent = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
      
      // Animate the percentage change
      let start = 0;
      const target = percent;
      const duration = 1500;
      const startTime = Date.now();
      
      const animatePercent = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentPercent = Math.round(progress * target);
        
        setProductivityPercent(currentPercent);
        
        if (progress < 1) {
          requestAnimationFrame(animatePercent);
        }
      };
      
      animatePercent();
    }
  }, [tasks]);
  
  // Function to determine productivity color
  const getProductivityColor = (percent: number) => {
    if (percent >= 75) return "text-green-400";
    if (percent >= 50) return "text-amber-400";
    if (percent >= 25) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <>
      <QuickActionButton icon={Zap} label="Create Task" onClick={onCreateTask} />
      <QuickActionButton icon={Calendar} label="Schedule" />
      <QuickActionButton icon={KanbanSquare} label="Kanban View" onClick={onViewKanban} />
      <QuickActionButton icon={BarChart2} label="Analytics" to="/analytics" />
      
      {/* Productivity Metric */}
      <div className="col-span-2 mt-6 rounded-md p-3 border border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy size={16} className={tasks.length > 0 ? getProductivityColor(productivityPercent) : "text-muted-foreground"} />
            <span className="text-xs font-medium">Current Productivity</span>
          </div>
          <span className={`text-sm font-bold ${tasks.length > 0 ? getProductivityColor(productivityPercent) : "text-muted-foreground"}`}>
            {productivityPercent}%
          </span>
        </div>
        <Progress value={productivityPercent} className="h-1.5" />
        <p className="text-xs text-muted-foreground mt-2">
          Based on your completed tasks over the last 7 days
        </p>
      </div>
    </>
  );
};
