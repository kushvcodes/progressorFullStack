
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

const TaskViewer = () => {
  const [tasks, setTasks] = useState<TaskType[]>(SAMPLE_TASKS);
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

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => task.id === taskId ? {
      ...task,
      status: newStatus
    } : task));
  };

  const handleDeleteTask = (taskId: string) => {
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(null);
    }
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleAddTask = (newTask?: TaskType) => {
    if (newTask) {
      // Called from KanbanBoard
      setTasks([newTask, ...tasks]);
    } else {
      // Called from TaskList
      if (!newTaskTitle.trim()) return;
      const newTask: TaskType = {
        id: Date.now().toString(),
        title: newTaskTitle,
        description: '',
        status: 'pending',
        dueDate: null,
        priority: 'medium',
        tags: []
      };
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'list' | 'kanban' | 'analytics');
  };

  const handleTaskSelect = (task: TaskType) => {
    setSelectedTask(task);
    setTaskDescription(task.description);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTaskDescription(e.target.value);
    if (selectedTask) {
      setTasks(tasks.map(task => task.id === selectedTask.id ? {
        ...task,
        description: e.target.value
      } : task));
    }
  };

  const handleEstimationComplete = (time: number, maxPoints: number) => {
    if (selectedTask) {
      setTasks(tasks.map(task => task.id === selectedTask.id ? {
        ...task,
        estimatedTime: time,
        maxPoints: maxPoints
      } : task));
      
      setSelectedTask({
        ...selectedTask,
        estimatedTime: time,
        maxPoints: maxPoints
      });
    }
  };

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
                  onAddTask={() => handleAddTask()}
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
            onAddTask={handleAddTask}
            selectedTaskId={selectedTask?.id}
          />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-0 animate-fade-in">
          <ProductivityAnalytics />
        </TabsContent>
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
