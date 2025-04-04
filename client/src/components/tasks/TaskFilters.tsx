
import React from 'react';
import { Button } from '@/components/ui/button';
import { TaskStatus } from '@/types/task';

interface TaskFiltersProps {
  activeFilter: 'all' | TaskStatus;
  onFilterChange: (filter: 'all' | TaskStatus) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ 
  activeFilter, 
  onFilterChange 
}) => {
  return (
    <div className="p-4 border-b border-border grid grid-cols-4 gap-2">
      <Button 
        variant={activeFilter === 'all' ? 'default' : 'ghost'} 
        size="sm" 
        className="text-xs font-normal" 
        onClick={() => onFilterChange('all')}
      >
        All
      </Button>
      <Button 
        variant={activeFilter === 'pending' ? 'default' : 'ghost'} 
        size="sm" 
        className="text-xs font-normal" 
        onClick={() => onFilterChange('pending')}
      >
        Pending
      </Button>
      <Button 
        variant={activeFilter === 'in_progress' ? 'default' : 'ghost'} 
        size="sm" 
        className="text-xs font-normal" 
        onClick={() => onFilterChange('in_progress')}
      >
        In Progress
      </Button>
      <Button 
        variant={activeFilter === 'completed' ? 'default' : 'ghost'} 
        size="sm" 
        className="text-xs font-normal" 
        onClick={() => onFilterChange('completed')}
      >
        Completed
      </Button>
    </div>
  );
};
