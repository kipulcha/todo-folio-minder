
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, formatDistanceToNow } from 'date-fns';
import { Task, TaskStatus } from '../context/TaskContext';

// Format date for display
export const formatDate = (date: Date | null): string => {
  if (!date) return 'No date';
  return format(date, 'MMM d, yyyy');
};

// Format date with time
export const formatDateTime = (date: Date | null): string => {
  if (!date) return 'No date';
  return format(date, 'MMM d, yyyy h:mm a');
};

// Get relative time (e.g., "2 days ago")
export const getRelativeTime = (date: Date | null): string => {
  if (!date) return '';
  return formatDistanceToNow(date, { addSuffix: true });
};

// Get color based on task category
export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    blue: 'bg-task-blue text-blue-800',
    purple: 'bg-task-purple text-purple-800',
    orange: 'bg-task-orange text-orange-800',
    green: 'bg-task-green text-green-800',
    pink: 'bg-task-pink text-pink-800',
    yellow: 'bg-task-yellow text-yellow-800'
  };
  
  return colors[category] || colors.blue;
};

// Get status badge class
export const getStatusClass = (status: TaskStatus): string => {
  const statusClasses: Record<TaskStatus, string> = {
    todo: 'status-todo',
    inprogress: 'status-progress',
    done: 'status-done'
  };
  
  return statusClasses[status];
};

// Get human-readable status text
export const getStatusText = (status: TaskStatus): string => {
  const statusText: Record<TaskStatus, string> = {
    todo: 'To Do',
    inprogress: 'In Progress',
    done: 'Done'
  };
  
  return statusText[status];
};

// Get tasks for current week
export const getCurrentWeekTasks = (tasks: Task[]): Task[] => {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });
  
  return tasks.filter(task => {
    const createdDate = task.createdAt;
    return createdDate >= start && createdDate <= end;
  });
};

// Get tasks for current month
export const getCurrentMonthTasks = (tasks: Task[]): Task[] => {
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());
  
  return tasks.filter(task => {
    const createdDate = task.createdAt;
    return createdDate >= start && createdDate <= end;
  });
};

// Get tasks for current year
export const getCurrentYearTasks = (tasks: Task[]): Task[] => {
  const start = startOfYear(new Date());
  const end = endOfYear(new Date());
  
  return tasks.filter(task => {
    const createdDate = task.createdAt;
    return createdDate >= start && createdDate <= end;
  });
};

// Group tasks by month (for charts)
export const getTasksByMonth = (tasks: Task[], monthsToShow = 6): { name: string; count: number }[] => {
  const result: { name: string; count: number }[] = [];
  const today = new Date();
  
  for (let i = monthsToShow - 1; i >= 0; i--) {
    const date = subMonths(today, i);
    const monthName = format(date, 'MMM');
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    const monthTasks = tasks.filter(task => {
      const createdDate = task.createdAt;
      return createdDate >= monthStart && createdDate <= monthEnd;
    });
    
    result.push({
      name: monthName,
      count: monthTasks.length
    });
  }
  
  return result;
};

// Get tasks by status for a specific period
export const getTasksStatusCountByPeriod = (
  tasks: Task[], 
  period: 'week' | 'month' | 'year'
): { todo: number; inProgress: number; done: number } => {
  let filteredTasks: Task[];
  
  if (period === 'week') {
    filteredTasks = getCurrentWeekTasks(tasks);
  } else if (period === 'month') {
    filteredTasks = getCurrentMonthTasks(tasks);
  } else {
    filteredTasks = getCurrentYearTasks(tasks);
  }
  
  return {
    todo: filteredTasks.filter(t => t.status === 'todo').length,
    inProgress: filteredTasks.filter(t => t.status === 'inprogress').length,
    done: filteredTasks.filter(t => t.status === 'done').length
  };
};

// Sort tasks by due date
export const sortTasksByDueDate = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    // Tasks without due dates go to the bottom
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.getTime() - b.dueDate.getTime();
  });
};

// Check if a task is overdue
export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueDate) return false;
  if (task.status === 'done') return false;
  return task.dueDate < new Date();
};
