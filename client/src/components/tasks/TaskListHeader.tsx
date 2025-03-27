
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaskListHeaderProps {
  onAddTaskClick: () => void;
}

export const TaskListHeader: React.FC<TaskListHeaderProps> = ({ onAddTaskClick }) => {
  return (
    <div className="p-4 flex justify-between items-center border-b border-border">
      <h2 className="text-lg font-medium">Your Tasks</h2>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-primary hover:text-primary hover:bg-primary/10" 
        onClick={onAddTaskClick}
      >
        <Plus size={16} className="mr-1" />
        Add Task
      </Button>
    </div>
  );
};
