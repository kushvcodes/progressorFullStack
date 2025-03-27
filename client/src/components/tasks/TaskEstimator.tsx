
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Clock, Sparkles, Loader2, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskEstimatorProps {
  taskTitle: string;
  taskDescription: string;
  onEstimationComplete: (minutes: number, maxPoints: number) => void;
  initialTime?: number;
  initialPoints?: number;
  estimateType?: 'both' | 'time' | 'points';
}

export const TaskEstimator: React.FC<TaskEstimatorProps> = ({
  taskTitle,
  taskDescription,
  onEstimationComplete,
  initialTime,
  initialPoints,
  estimateType = 'both'
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(initialTime || null);
  const [maxPoints, setMaxPoints] = useState<number | null>(initialPoints || null);
  
  const generateEstimate = async () => {
    if (!taskTitle) {
      setError("Task needs a title to generate an estimate");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulating AI estimation - in a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let time = estimatedTime;
      let points = maxPoints;
      
      // Generate estimates based on the type of estimation requested
      if (estimateType === 'both' || estimateType === 'time') {
        // Generate a random time between 15 and 120 minutes based on title/description length
        const baseTime = 15;
        const titleFactor = taskTitle.length * 0.5;
        const descriptionFactor = taskDescription ? taskDescription.length * 0.1 : 0;
        const randomFactor = Math.floor(Math.random() * 30);
        
        time = Math.min(Math.max(Math.floor(baseTime + titleFactor + descriptionFactor + randomFactor), 15), 120);
        setEstimatedTime(time);
      }
      
      if (estimateType === 'both' || estimateType === 'points') {
        // Generate max points based on estimated time and task complexity
        // Points scale with time but have diminishing returns for longer tasks
        const actualTime = time || initialTime || 30; // Fallback to a default if no time is available
        const complexityFactor = taskTitle.length + (taskDescription ? taskDescription.length * 0.05 : 0);
        points = Math.floor(Math.min(100, actualTime * 0.8 + complexityFactor * 0.5));
        setMaxPoints(points);
      }
      
      if (time !== null && points !== null) {
        onEstimationComplete(time, points);
      }
    } catch (err) {
      setError("Failed to generate estimation. Please try again.");
      console.error("Estimation error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const getEstimateLabel = () => {
    if (estimateType === 'time') return 'Estimate Time';
    if (estimateType === 'points') return 'Estimate Points';
    return 'Generate Estimate';
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {estimateType === 'points' ? (
            <Trophy size={16} className="text-muted-foreground" />
          ) : (
            <Clock size={16} className="text-muted-foreground" />
          )}
          <h3 className="text-sm font-medium">
            {estimateType === 'points' ? 'Points Estimate' : 'Time Estimate'}
          </h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "h-7 text-xs gap-1",
            loading && "bg-muted/20"
          )}
          onClick={generateEstimate}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              Estimating...
            </>
          ) : (
            <>
              <Sparkles size={12} className="text-amber-400" />
              {getEstimateLabel()}
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <div className="text-xs text-destructive">
          {error}
        </div>
      )}
      
      {(estimateType === 'both' || estimateType === 'time') && estimatedTime && !error && (
        <div className="flex flex-col bg-background/50 rounded-md p-3 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <Brain size={14} className="text-primary" />
            <span className="text-xs font-medium">AI Estimated Time</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">{estimatedTime}</span>
            <span className="text-sm text-muted-foreground">minutes</span>
          </div>
        </div>
      )}
      
      {(estimateType === 'both' || estimateType === 'points') && maxPoints && !error && (
        <div className="flex flex-col bg-background/50 rounded-md p-3 border border-border mt-3">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={14} className={getTrophyColor(maxPoints)} />
            <span className="text-xs font-medium">Maximum Points</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">{maxPoints}</span>
            <span className="text-sm text-muted-foreground">points</span>
          </div>
          
          <p className="text-xs text-muted-foreground mt-1">
            Based on task complexity, title, and description analysis
          </p>
        </div>
      )}
    </div>
  );
};

// Function to determine trophy color based on point value
export const getTrophyColor = (points: number): string => {
  if (points >= 80) return "text-amber-400"; // Gold for high points
  if (points >= 50) return "text-slate-400"; // Silver for medium points
  if (points >= 30) return "text-orange-400"; // Bronze for average points
  return "text-zinc-500"; // Gray for low points
};
