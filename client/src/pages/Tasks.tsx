
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import TaskViewer from '@/components/tasks/TaskViewer';
import Particles from '@/components/animations/Particles';
import { GlassCard } from '@/components/ui/glass-card';
import { QuickActionButtons } from '@/components/tasks/QuickActionButtons';
import { useIsMobile } from '@/hooks/use-mobile';
import Footer from '@/components/layout/Footer';

// Importing sample tasks to pass to QuickActionButtons
import { TaskType } from '@/types/task';

const SAMPLE_TASKS: TaskType[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Draft the initial proposal for the Q2 marketing campaign including budget breakdown and timeline.',
    status: 'in-progress',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    priority: 'high',
    tags: ['work', 'important'],
    estimatedTime: 120,
    maxPoints: 85
  },
  {
    id: '2',
    title: 'Review marketing materials',
    description: 'Check the new brochures and social media assets for consistency and brand guidelines compliance.',
    status: 'pending',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    tags: ['marketing'],
    estimatedTime: 45,
    maxPoints: 40
  },
  {
    id: '3',
    title: 'Schedule team meeting',
    description: 'Organize weekly sync with design and development teams to discuss project progress.',
    status: 'completed',
    dueDate: null,
    priority: 'low',
    tags: ['team', 'communication'],
    estimatedTime: 30,
    maxPoints: 25
  },
  {
    id: '4',
    title: 'Research new tools',
    description: 'Evaluate project management software options that integrate with our current workflow.',
    status: 'pending',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    tags: ['research'],
    estimatedTime: 90,
    maxPoints: 65
  }
];

const Tasks = () => {
  const isMobile = useIsMobile();
  const [kanbanViewActive, setKanbanViewActive] = useState(false);
  
  // Fix for scroll issue - reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleViewKanban = () => {
    const taskViewerTabs = document.querySelector('[data-value="kanban"]');
    if (taskViewerTabs) {
      (taskViewerTabs as HTMLElement).click();
      setKanbanViewActive(true);
    }
  };
  
  const handleCreateTask = () => {
    // First show the list view
    const listViewTab = document.querySelector('[data-value="list"]');
    if (listViewTab) {
      (listViewTab as HTMLElement).click();
    }
    
    // Then trigger the "Add Task" button after a small delay
    setTimeout(() => {
      const addTaskButton = document.querySelector('button:has(.lucide-plus)');
      if (addTaskButton) {
        (addTaskButton as HTMLElement).click();
      }
    }, 100);
  };
  
  return (
    <div className="min-h-screen overflow-hidden animated-gradient-bg flex flex-col">
      <Particles 
        quantity={40}        // Reduced from 60
        staticity={30}       // Reduced from 40
        ease={60}            // Increased from 50
        colorIntensity={1.0} // Reduced from 1.8
        particleSize={0.6}   // Reduced from 0.9
        moveSpeed={0.8}      // Reduced from 1.2
      />
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 md:pt-28 pb-16 md:px-6 relative z-10 page-transition flex-grow">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]">Your Workspace</h1>
          <p className="text-muted-foreground drop-shadow-md">Manage your tasks and track your productivity in one place.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 animate-fade-in">
            <TaskViewer />
          </div>
          
          <div className="animate-fade-in space-y-8">
            <GlassCard className="p-5 py-6 space-y-4">
              <h2 className="text-lg font-medium">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2">
                <QuickActionButtons 
                  onCreateTask={handleCreateTask} 
                  onViewKanban={handleViewKanban}
                  tasks={SAMPLE_TASKS}
                />
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
