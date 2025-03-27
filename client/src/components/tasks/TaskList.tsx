
import React from 'react';
import { TaskItem } from './TaskItem';
import { TaskType, TaskStatus } from '@/types/task';

interface TaskListProps {
  tasks: TaskType[];
  selectedTaskId?: string;
  onTaskSelect: (task: TaskType) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  selectedTaskId,
  onTaskSelect,
  onStatusChange,
  onDelete
}) => {
  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>No tasks found.</p>
      </div>
    );
  }

  return (
    <div className="max-h-[360px] overflow-y-auto scrollbar-none">
      {tasks.map(task => (
        <TaskItem 
          key={task.id} 
          task={task} 
          selected={task.id === selectedTaskId}
          onStatusChange={onStatusChange} 
          onDelete={onDelete}
          onSelect={() => onTaskSelect(task)} 
        />
      ))}
    </div>
  );
};
