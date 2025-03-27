
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
  
  const formatDate = (date: Date | null) => {
    if (!date) return 'No due date';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
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
            <span>{formatDate(task.dueDate)}</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{formatTime(task.estimatedTime)}</span>
          </div>
          <div className={`flex items-center ${priorityColors[task.priority]}`}>
            <Tag size={14} className="mr-1" />
            <span className="capitalize">{task.priority}</span>
          </div>
        </div>
      </div>
      
      {task.maxPoints && (
        <div className="p-4 border-b border-border">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Trophy size={14} className={`mr-2 ${getTrophyColor(task.maxPoints)}`} />
              <h3 className="text-sm font-medium">Productivity Points</h3>
            </div>
            <span className="text-sm font-medium">{task.maxPoints} pts</span>
          </div>
          <Progress value={task.status === 'completed' ? 100 : task.status === 'in-progress' ? 50 : 0} className="h-2" />
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
                {!task.estimatedTime && !task.maxPoints ? 'Estimate Task' : 'Re-estimate All'}
              </Button>
              {task.estimatedTime && (
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
              {task.maxPoints && (
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
            initialTime={task.estimatedTime}
            initialPoints={task.maxPoints}
            estimateType={estimatorType}
          />
        ) : (
          <NotionLikeEditor 
            value={description} 
            onChange={onDescriptionChange} 
          />
        )}
      </div>
      
      {task.tags && task.tags.length > 0 && (
        <div className="p-4">
          <h3 className="text-sm font-medium mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {task.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-secondary/60 text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default TaskDetails;
