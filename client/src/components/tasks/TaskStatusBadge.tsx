
import React from 'react';
import { cn } from '@/lib/utils';
import { TaskStatus } from '@/types/task';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  size?: 'xs' | 'sm' | 'md';
}

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ 
  status, 
  size = 'md' 
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'text-xs px-1.5 py-0.5';
      case 'sm':
        return 'text-xs px-2 py-0.5';
      default:
        return 'text-xs px-2 py-1';
    }
  };

  return (
    <span className={cn(
      "rounded-full border", 
      getStatusStyles(),
      getSizeClasses()
    )}>
      {getStatusLabel()}
    </span>
  );
};

export type { TaskStatusBadgeProps };
