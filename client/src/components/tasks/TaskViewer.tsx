import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { BarChart2, ListChecks, KanbanSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskList } from './TaskList';
import { TaskFilters } from './TaskFilters';
import { TaskListHeader } from './TaskListHeader';
import { AddTaskInput } from './AddTaskInput';
import { TaskDetails } from './TaskDetails';
import { ProductivityAnalytics } from './ProductivityAnalytics';
import { KanbanBoard } from './KanbanBoard';
import { TaskType, TaskStatus } from '@/types/task';

interface TaskViewerProps {
  tasks: TaskType[];
  onCreateTask: (taskData: Omit<TaskType, 'id' | 'user'>) => Promise<void>;
  onUpdateTask: (id: string, updatedData: Partial<TaskType>) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const TaskViewer: React.FC<TaskViewerProps> = ({
  tasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  loading,
  error
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | TaskStatus>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'kanban' | 'analytics'>('list');
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [taskDescription, setTaskDescription] = useState('');

  const filteredTasks = activeFilter === 'all' ? tasks : tasks.filter(task => task.status === activeFilter);

  const handleFilterChange = (filter: 'all' | TaskStatus) => {
    setActiveFilter(filter);
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await onUpdateTask(taskId, { status: newStatus });
      // The parent component will update the tasks list
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await onDeleteTask(taskId);
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask(null);
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const getDefaultTaskData = (title: string): Omit<TaskType, 'id' | 'user'> => ({
    title,
    description: '',
    status: 'pending',
    priority: 'n',
    est_points: 10,
    est_time: 30,
    due_date: null,
    start_date: null,
    completed_date: null,
    category: 'p'
  });

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    try {

      
      await onCreateTask(getDefaultTaskData(newTaskTitle));
      setNewTaskTitle('');
      setIsAddingTask(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'list' | 'kanban' | 'analytics');
  };

  const handleTaskSelect = (task: TaskType) => {
    setSelectedTask(task);
    setTaskDescription(task.description || '');
  };

  const handleDescriptionChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setTaskDescription(newDescription);
    
    if (selectedTask) {
      try {
        await onUpdateTask(selectedTask.id, { description: newDescription });
      } catch (error) {
        console.error('Failed to update task description:', error);
      }
    }
  };

  const handleEstimationComplete = async (time: number, maxPoints: number) => {
    if (selectedTask) {
      try {
        await onUpdateTask(selectedTask.id, {
          est_time: time,
          est_points: maxPoints
        });
      } catch (error) {
        console.error('Failed to update task estimation:', error);
      }
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading tasks...</div>;
  if (error) return <div className="text-red-500 p-8">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-8">
      <Tabs defaultValue="list" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="list" className="text-sm">
            <ListChecks size={15} className="mr-2" />
            List View
          </TabsTrigger>
          <TabsTrigger value="kanban" className="text-sm">
            <KanbanSquare size={15} className="mr-2" />
            Kanban Board
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-sm">
            <BarChart2 size={15} className="mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-0 animate-fade-in">
          <div className="grid grid-cols-1 gap-6">
            <GlassCard className="p-0 overflow-hidden">
              <TaskListHeader onAddTaskClick={() => setIsAddingTask(true)} />
              
              <TaskFilters 
                activeFilter={activeFilter} 
                onFilterChange={handleFilterChange} 
              />

              {isAddingTask && (
                <AddTaskInput 
                  newTaskTitle={newTaskTitle}
                  onTitleChange={setNewTaskTitle}
                  onAddTask={handleAddTask}
                  onCancel={() => setIsAddingTask(false)}
                />
              )}
              
              <TaskList 
                tasks={filteredTasks} 
                selectedTaskId={selectedTask?.id}
                onTaskSelect={handleTaskSelect}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
              />
            </GlassCard>
          </div>
        </TabsContent>
        
        <TabsContent value="kanban" className="mt-0 animate-fade-in">
          <KanbanBoard
            tasks={tasks}
            onTaskStatusChange={handleStatusChange}
            onTaskSelect={handleTaskSelect}
            onDeleteTask={handleDeleteTask}
            selectedTaskId={selectedTask?.id}
          />
        </TabsContent>
        
        {/* <TabsContent value="analytics" className="mt-0 animate-fade-in">
          <ProductivityAnalytics tasks={tasks} />
        </TabsContent> */}
      </Tabs>
      
      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          description={taskDescription}
          onDescriptionChange={handleDescriptionChange}
          onEstimationComplete={handleEstimationComplete}
        />
      )}
    </div>
  );
};

export default TaskViewer;