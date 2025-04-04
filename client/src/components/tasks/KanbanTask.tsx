
import React from 'react';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TaskType } from '@/types/task';
import { Clock, Tag, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTrophyColor } from './TaskEstimator';

interface KanbanTaskProps {
  task: TaskType;
  selected?: boolean;
  onClick: () => void;
}

export const KanbanTask: React.FC<KanbanTaskProps> = ({ 
  task, 
  selected = false,
  onClick 
}) => {
  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    
    // Convert string date to Date object if needed
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(dateObj);
  };
  
  const priorityClasses = {
    high: 'border-l-red-400',
    medium: 'border-l-amber-400',
    low: 'border-l-blue-400'
  };
  
  return (
    <div 
      className={cn(
        "bg-background/50 p-3 rounded-md border border-border border-l-4 select-none cursor-pointer transition-all duration-200 ease-in-out",
        priorityClasses[task.priority],
        selected ? "ring-1 ring-primary" : "hover:bg-background"
      )}
      onClick={onClick}
    >
      <h3 className="font-medium text-sm mb-2 line-clamp-2">{task.title}</h3>
      
      <div className="flex flex-wrap gap-1.5 items-center text-xs text-muted-foreground">
        <TaskStatusBadge status={task.status} size="xs" />
        
        {task.due_date && (
          <div className="flex items-center">
            <Clock size={10} className="mr-0.5" />
            <span>{formatDate(task.due_date)}</span>
          </div>
        )}
        
        {task.est_points && (
          <div className="flex items-center">
            <Trophy size={10} className={cn("mr-0.5", getTrophyColor(task.est_points))} />
            <span>{task.est_points} pts</span>
          </div>
        )}
        
        {/* {task.tags && task.tags.length > 0 && (
          <div className="flex items-center">
            <Tag size={10} className="mr-0.5" />
            <span>{task.tags[0]}{task.tags.length > 1 ? `+${task.tags.length - 1}` : ''}</span>
          </div>
        )} */}
      </div>
    </div>
  );
};
