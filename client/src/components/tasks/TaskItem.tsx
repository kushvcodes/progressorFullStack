
import React from 'react';
import { Button } from '@/components/ui/button';
import { Circle, CheckCircle, Clock, MoreHorizontal, X, Trophy } from 'lucide-react';
import { TaskType, TaskStatus } from '@/types/task';
import { TaskStatusBadge } from './TaskStatusBadge';
import { cn } from '@/lib/utils';
import { getTrophyColor } from './TaskEstimator';

interface TaskItemProps {
  task: TaskType;
  selected?: boolean;
  onSelect: (task: TaskType) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  selected = false,
  onSelect,
  onStatusChange,
  onDelete
}) => {
  const handleStatusChange = () => {
    const nextStatus = task.status === 'completed' 
      ? 'pending' 
      : task.status === 'pending' 
        ? 'in-progress' 
        : 'completed';
    
    onStatusChange(task.id, nextStatus);
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div 
      className={cn(
        "flex items-center justify-between p-4 border-b border-border transition-colors cursor-pointer hover:bg-secondary/5",
        selected && "bg-secondary/10 hover:bg-secondary/15"
      )}
      onClick={() => onSelect(task)}
    >
      <div className="flex items-center flex-1 overflow-hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5 rounded-full mr-3 p-0 text-muted-foreground hover:text-primary hover:bg-transparent"
          onClick={(e) => {
            e.stopPropagation();
            handleStatusChange();
          }}
        >
          {task.status === 'completed' 
            ? <CheckCircle size={18} className="text-primary" /> 
            : <Circle size={18} />
          }
        </Button>
        
        <div className="overflow-hidden">
          <h3 className={cn("text-sm font-medium truncate", task.status === 'completed' && "line-through text-muted-foreground")}>
            {task.title}
          </h3>
          
          <div className="flex items-center mt-1 space-x-2 text-xs text-muted-foreground">
            <TaskStatusBadge status={task.status} size="xs" />
            
            {task.dueDate && (
              <span className="flex items-center">
                <Clock size={12} className="mr-1" />
                {formatDate(task.dueDate)}
              </span>
            )}
            
            {task.maxPoints && (
              <span className="flex items-center">
                <Trophy size={12} className={cn("mr-1", getTrophyColor(task.maxPoints))} />
                {task.maxPoints} pts
              </span>
            )}
          </div>
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7 text-muted-foreground hover:text-destructive"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
      >
        <X size={14} />
      </Button>
    </div>
  );
};
