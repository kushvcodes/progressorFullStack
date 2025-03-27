
import React from 'react';
import { Button } from '@/components/ui/button';
import { Circle, X } from 'lucide-react';

interface AddTaskInputProps {
  newTaskTitle: string;
  onTitleChange: (title: string) => void;
  onAddTask: () => void;
  onCancel: () => void;
}

export const AddTaskInput: React.FC<AddTaskInputProps> = ({
  newTaskTitle,
  onTitleChange,
  onAddTask,
  onCancel
}) => {
  return (
    <div className="p-4 border-b border-border animate-slide-up">
      <div className="flex gap-2 items-center">
        <Circle size={16} className="text-muted-foreground" />
        <input 
          type="text" 
          value={newTaskTitle} 
          onChange={e => onTitleChange(e.target.value)} 
          placeholder="Enter task title..." 
          className="flex-1 bg-transparent border-none outline-none text-sm" 
          autoFocus 
        />
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={onCancel}>
          <X size={14} />
        </Button>
        <Button variant="default" size="sm" className="h-7 text-xs" onClick={onAddTask}>
          Add
        </Button>
      </div>
    </div>
  );
};
