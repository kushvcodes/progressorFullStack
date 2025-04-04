import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import TaskViewer from '@/components/tasks/TaskViewer';
import Particles from '@/components/animations/Particles';
import { GlassCard } from '@/components/ui/glass-card';
import { QuickActionButtons } from '@/components/tasks/QuickActionButtons';
import { useIsMobile } from '@/hooks/use-mobile';
import Footer from '@/components/layout/Footer';
import { TaskType } from '@/types/task';
import { fetchTasks, createTask, updateTask, deleteTask } from '@/services/tasks';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

const Tasks = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [kanbanViewActive, setKanbanViewActive] = useState(false);

  // Load tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const data = await fetchTasks();
        setTasks(data);
        setError(null);
      } catch (err) {
        setError('Failed to load tasks. Please try again.');
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
    window.scrollTo(0, 0);
  }, []);

  const handleCreateTask = async (taskData: Omit<TaskType, 'id' | 'user'>) => {
    try {
      const newTask = await createTask({
        ...taskData,
        status: taskData.status || 'pending',
        priority: taskData.priority || 'n',
      });
      setTasks([...tasks, newTask]);
      toast.success('Task created successfully');
      return newTask;
    } catch (err) {
      toast.error('Failed to create task');
      throw err;
    }
  };

  // Add this at the top of your component with other state variables
    const [updateTimeouts, setUpdateTimeouts] = useState<Record<string, NodeJS.Timeout>>({});
  
  const handleUpdateTask = async (id: string, updatedData: Partial<TaskType>): Promise<void> => {
    try {
      // Find the existing task
      const existingTask = tasks.find(task => task.id === id);
      if (!existingTask) {
        throw new Error('Task not found');
      }
  
      // Use existing title and category if not provided
      const dataToUpdate = {
        title: updatedData.title || existingTask.title,
        category: updatedData.category || existingTask.category,
        ...updatedData,
      };
  
      // Clear any existing timeout for this task
      if (updateTimeouts[id]) {
        clearTimeout(updateTimeouts[id]);
      }
  
      // Update the UI immediately for responsiveness
      setTasks(tasks.map(task => 
        task.id === id ? { ...existingTask, ...dataToUpdate } : task
      ));
      
      // Set a new timeout for debouncing
      const timeoutId = setTimeout(async () => {
        try {
          const updatedTask = await updateTask(id, dataToUpdate);
          setTasks(prevTasks => prevTasks.map(task => 
            task.id === id ? updatedTask : task
          ));
          toast.success('Task updated successfully');
        } catch (err) {
          // Revert to original task data on error
          setTasks(prevTasks => prevTasks.map(task => 
            task.id === id ? existingTask : task
          ));
          
          if (axios.isAxiosError(err) && err.response) {
            console.error('Failed to update task:', err.response.data);
          } else {
            console.error('Failed to update task:', err);
          }
          toast.error('Failed to update task');
        } finally {
          // Remove this timeout from the record
          setUpdateTimeouts(prev => {
            const newTimeouts = { ...prev };
            delete newTimeouts[id];
            return newTimeouts;
          });
        }
      }, 1500); // 1.5 seconds debounce time
  
      // Store the timeout ID
      setUpdateTimeouts(prev => ({
        ...prev,
        [id]: timeoutId
      }));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.error('Failed to update task:', err.response.data);
      } else {
        console.error('Failed to update task:', err);
      }
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
      throw err;
    }
  };

  const handleViewKanban = () => {
    const taskViewerTabs = document.querySelector('[data-value="kanban"]');
    if (taskViewerTabs) {
      (taskViewerTabs as HTMLElement).click();
      setKanbanViewActive(true);
    }
  };


  const handleQuickCreate = async () => {
    try { 
      // Create a new task with all required fields
      const newTask = await handleCreateTask({
        title: 'New Quick Task',
        description: '',
        status: 'pending',
        priority: 'n',
        category: 'w',
        est_points: 10,
        est_time: 30,
        due_date: null,  // Changed from empty string to null
        start_date: null, // Changed from empty string to null
        completed_date: null // Changed from empty string to null
      });
      
      // First show the list view
      const listViewTab = document.querySelector('[data-value="list"]');
      if (listViewTab) {
        (listViewTab as HTMLElement).click();
      }
      
      // Then trigger edit mode for the new task
      setTimeout(() => {
        const taskItem = document.querySelector(`[data-task-id="${newTask.id}"]`);
        if (taskItem) {
          const editButton = taskItem.querySelector('button[aria-label="Edit task"]');
          if (editButton) {
            (editButton as HTMLElement).click();
          }
        }
      }, 100);
    } catch (err) {
      console.error('Quick create failed:', err);
      if (axios.isAxiosError(err) && err.response) {
        console.error('Server response:', err.response.data);
        toast.error(`Failed to create task: ${err.response.data.detail || 'Unknown error'}`);
      } else {
        toast.error('Failed to create task');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-4 bg-destructive/10 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Error loading tasks</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden animated-gradient-bg flex flex-col">
      <Particles 
        quantity={40}
        staticity={30}
        ease={60}
        colorIntensity={1.0}
        particleSize={0.6}
        moveSpeed={0.8}
      />
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 md:pt-28 pb-16 md:px-6 relative z-10 page-transition flex-grow">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]">
            Your Workspace
          </h1>
          <p className="text-muted-foreground drop-shadow-md">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} in your list
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 animate-fade-in">
            <TaskViewer 
              tasks={tasks}
              onCreateTask={handleCreateTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              loading={loading}
              error={error}
            />
          </div>
          
          <div className="animate-fade-in space-y-8">
            <GlassCard className="p-5 py-6 space-y-4">
              <h2 className="text-lg font-medium">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2">
                <QuickActionButtons 
                  onCreateTask={handleQuickCreate} 
                  onViewKanban={handleViewKanban}
                  tasks={tasks.slice(0, 4)}
                />
              </div>
            </GlassCard>

            {/* Status Summary Card */}
            <GlassCard className="p-5 py-6 space-y-4">
              <h2 className="text-lg font-medium">Task Status</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Pending</span>
                  <span>{tasks.filter(t => t.status === 'pending').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>In Progress</span>
                  <span>{tasks.filter(t => t.status === 'in_progress').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed</span>
                  <span>{tasks.filter(t => t.status === 'completed').length}</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Tasks;