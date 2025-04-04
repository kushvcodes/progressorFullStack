
import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Calendar, CircleX, Tag, FileEdit, Trophy, Sparkles } from 'lucide-react';
import { NotionLikeEditor } from './NotionLikeEditor';
import { TaskType, TaskPriority } from '@/types/task';
import { TaskEstimator, getTrophyColor } from './TaskEstimator';
import { Progress } from '@/components/ui/progress';

interface TaskDetailsProps {
  task: TaskType;
  description: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onEstimationComplete: (time: number, maxPoints: number) => void;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  description,
  onDescriptionChange,
  onEstimationComplete
}) => {
  const [showEstimator, setShowEstimator] = useState(false);
  const [estimatorType, setEstimatorType] = useState<'both' | 'time' | 'points'>('both');
  
  const priorityColors = {
    high: 'text-red-400',
    medium: 'text-amber-400',
    low: 'text-blue-400'
  };
  
  const formatDate = (date: Date | string | null) => {
    if (!date) return 'No due date';
    
    // Convert string date to Date object if needed
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(dateObj);
  };
  
  const formatTime = (minutes: number | undefined) => {
    if (!minutes) return 'Not estimated';
    
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
  };
  
  const handleEstimationComplete = (minutes: number, maxPoints: number) => {
    onEstimationComplete(minutes, maxPoints);
    setShowEstimator(false);
  };

  const showTimeEstimator = () => {
    setEstimatorType('time');
    setShowEstimator(true);
  };

  const showPointsEstimator = () => {
    setEstimatorType('points');
    setShowEstimator(true);
  };

  const showBothEstimator = () => {
    setEstimatorType('both');
    setShowEstimator(true);
  };
  
  return (
    <GlassCard className="overflow-hidden animate-scale-in">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-medium mb-1">{task.title}</h2>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{formatDate(task.due_date)}</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{formatTime(task.est_time)}</span>
          </div>
          <div className={`flex items-center ${priorityColors[task.priority]}`}>
            <Tag size={14} className="mr-1" />
            <span className="capitalize">{task.priority}</span>
          </div>
        </div>
      </div>
      
      {task.est_points && (
        <div className="p-4 border-b border-border">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Trophy size={14} className={`mr-2 ${getTrophyColor(task.est_points)}`} />
              <h3 className="text-sm font-medium">Productivity Points</h3>
            </div>
            <span className="text-sm font-medium">{task.est_points} pts</span>
          </div>
          <Progress value={task.status === 'completed' ? 100 : task.status === 'in_progress' ? 50 : 0} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            These points represent the maximum productivity value for completing this task.
          </p>
        </div>
      )}
      
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium flex items-center">
            <FileEdit size={14} className="mr-2" />
            Description
          </h3>
          {!showEstimator && (
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs hover:bg-primary/10 hover:text-primary" 
                onClick={showBothEstimator}
              >
                <Trophy size={14} className="mr-1 text-amber-400" />
                {!task.est_time && !task.est_points ? 'Estimate Task' : 'Re-estimate All'}
              </Button>
              {task.est_time && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs hover:bg-primary/10 hover:text-primary" 
                  onClick={showTimeEstimator}
                >
                  <Clock size={14} className="mr-1" />
                  Re-estimate Time
                </Button>
              )}
              {task.est_points && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs hover:bg-primary/10 hover:text-primary" 
                  onClick={showPointsEstimator}
                >
                  <Trophy size={14} className="mr-1" />
                  Re-estimate Points
                </Button>
              )}
            </div>
          )}
        </div>
        
        {showEstimator ? (
          <TaskEstimator 
            taskTitle={task.title}
            taskDescription={description}
            onEstimationComplete={handleEstimationComplete}
            initialTime={task.est_time}
            initialPoints={task.est_points}
            estimateType={estimatorType}
          />
        ) : (
          <NotionLikeEditor 
            value={description} 
            onChange={onDescriptionChange} 
          />
        )}
      </div>
      
    </GlassCard>
  );
};

export default TaskDetails;
