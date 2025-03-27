
import React from 'react';
import { TaskType, TaskStatus } from '@/types/task';
import { GlassCard } from '@/components/ui/glass-card';
import { KanbanTask } from './KanbanTask';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface KanbanColumnProps {
  title: string;
  tasks: TaskType[];
  status: TaskStatus;
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onTaskSelect: (task: TaskType) => void;
  onDeleteTask: (taskId: string) => void;
  selectedTaskId?: string;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  tasks,
  status,
  onTaskStatusChange,
  onTaskSelect,
  onDeleteTask,
  selectedTaskId
}) => {
  const getColumnIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={16} className="text-green-400" />;
      case 'in-progress':
        return <Clock size={16} className="text-amber-400" />;
      default:
        return <Circle size={16} className="text-muted-foreground" />;
    }
  };

  return (
    <GlassCard className="flex flex-col overflow-hidden">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getColumnIcon()}
          <h3 className="font-medium text-sm">{title}</h3>
        </div>
        <span className="text-xs bg-background/40 px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto max-h-[420px] scrollbar-thin">
        {tasks.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No tasks
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {tasks.map(task => (
              <KanbanTask
                key={task.id}
                task={task}
                selected={task.id === selectedTaskId}
                onClick={() => onTaskSelect(task)}
              />
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
};
