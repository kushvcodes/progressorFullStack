
import React, { useState } from 'react';
import { TaskType, TaskStatus } from '@/types/task';
import { GlassCard } from '@/components/ui/glass-card';
import { KanbanColumn } from './KanbanColumn';
import { Button } from '@/components/ui/button';
import { Plus, CalendarDays, ListChecks, KanbanSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KanbanBoardProps {
  tasks: TaskType[];
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onTaskSelect: (task: TaskType) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask?: (task: TaskType) => void;
  selectedTaskId?: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskStatusChange,
  onTaskSelect,
  onDeleteTask,
  onAddTask,
  selectedTaskId
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('pending');
  const { toast } = useToast();
  
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Task title is required",
        description: "Please enter a title for your task"
      });
      return;
    }
    
    const newTask: TaskType = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: '',
      status: newTaskStatus,
      dueDate: null,
      priority: 'medium',
      tags: []
    };
    
    if (onAddTask) {
      onAddTask(newTask);
      toast({
        title: "Task created",
        description: `"${newTaskTitle}" has been added to ${newTaskStatus} tasks`
      });
    }
    
    setNewTaskTitle('');
    setShowAdd(false);
  };
  
  return (
    <div className="overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1" 
            onClick={() => setShowAdd(!showAdd)}
          >
            <Plus size={16} />
            <span>Add Task</span>
          </Button>
        </div>
      </div>
      
      {showAdd && (
        <GlassCard className="p-4 mb-4 animate-slide-down">
          <div className="flex flex-col space-y-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              placeholder="Task title..."
              className="bg-background/50 border border-border rounded-md px-3 py-2 text-sm w-full"
              autoFocus
            />
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className={`flex-1 ${newTaskStatus === 'pending' ? 'bg-primary/10 border-primary' : ''}`}
                onClick={() => setNewTaskStatus('pending')}
              >
                Pending
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={`flex-1 ${newTaskStatus === 'in-progress' ? 'bg-primary/10 border-primary' : ''}`}
                onClick={() => setNewTaskStatus('in-progress')}
              >
                In Progress
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={`flex-1 ${newTaskStatus === 'completed' ? 'bg-primary/10 border-primary' : ''}`}
                onClick={() => setNewTaskStatus('completed')}
              >
                Completed
              </Button>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddTask}>
                Create
              </Button>
            </div>
          </div>
        </GlassCard>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto pb-2">
        <KanbanColumn
          title="Pending"
          tasks={pendingTasks}
          status="pending"
          onTaskStatusChange={onTaskStatusChange}
          onTaskSelect={onTaskSelect}
          onDeleteTask={onDeleteTask}
          selectedTaskId={selectedTaskId}
        />
        
        <KanbanColumn
          title="In Progress"
          tasks={inProgressTasks}
          status="in-progress"
          onTaskStatusChange={onTaskStatusChange}
          onTaskSelect={onTaskSelect}
          onDeleteTask={onDeleteTask}
          selectedTaskId={selectedTaskId}
        />
        
        <KanbanColumn
          title="Completed"
          tasks={completedTasks}
          status="completed"
          onTaskStatusChange={onTaskStatusChange}
          onTaskSelect={onTaskSelect}
          onDeleteTask={onDeleteTask}
          selectedTaskId={selectedTaskId}
        />
      </div>
    </div>
  );
};
