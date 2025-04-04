import { LucideIcon } from 'lucide-react';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'vl' | 'l' | 'n' | 'h' | 'vh';
export type category = 'e' | 'f' | 'p' | 'h' | 's' | 'w';

export interface TaskType {
  id: string;
  user: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  est_points: number;
  est_time: number;
  due_date: string | null;
  start_date: string | null;
  completed_date: string | null;
  category: category;
  priority: TaskPriority;
}


export type TaskView = 'list' | 'kanban' | 'calendar';

// export interface TaskType {
//   id: string;
//   title: string;
//   description: string;
//   status: TaskStatus;
//   dueDate: Date | null;
//   priority: TaskPriority;
//   tags: string[];
//   parentTaskId?: string | null; // For subtasks
//   subtasks?: string[]; // IDs of subtasks
//   collaborators?: string[]; // IDs of users who are collaborating on this task
//   estimatedTime?: number; // Estimated time in minutes
//   actualTime?: number; // Actual time spent in minutes
//   attachments?: string[]; // URLs or IDs of attachments
//   aiScore?: number; // AI-generated complexity score (0-100)
//   maxPoints?: number; // Maximum productivity points for the task
// }

export interface KanbanColumn {
  id: string;
  title: string;
  status: TaskStatus;
  taskIds: string[];
}

export interface MetricType {
  name: string;
  value: string | number;
  change: number;
  icon: LucideIcon;
}

export interface TaskFilterOptions {
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  tags?: string[];
  dueDate?: 'today' | 'thisWeek' | 'thisMonth' | 'all';
  search?: string;
}
