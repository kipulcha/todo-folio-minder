
import { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { Task, TaskStatus } from '../context/TaskContext';

type Filter = {
  status?: TaskStatus | 'all';
  searchTerm?: string;
};

type SortOption = 'dueDate' | 'createdAt' | 'title';
type SortDirection = 'asc' | 'desc';

export const useTasks = (initialFilter?: Filter) => {
  const { state } = useTaskContext();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>(initialFilter || { status: 'all', searchTerm: '' });
  const [sort, setSort] = useState<{ by: SortOption; direction: SortDirection }>({
    by: 'createdAt',
    direction: 'desc'
  });

  useEffect(() => {
    let result = [...state.tasks];
    
    // Apply status filter
    if (filter.status && filter.status !== 'all') {
      result = result.filter(task => task.status === filter.status);
    }
    
    // Apply search filter
    if (filter.searchTerm && filter.searchTerm.trim() !== '') {
      const searchLower = filter.searchTerm.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchLower) || 
        (task.description && task.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      switch (sort.by) {
        case 'dueDate':
          valueA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          valueB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          break;
        case 'createdAt':
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;
        case 'title':
          valueA = a.title;
          valueB = b.title;
          break;
        default:
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
      }
      
      const direction = sort.direction === 'asc' ? 1 : -1;
      
      // Handle string comparison for title
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction * valueA.localeCompare(valueB);
      }
      
      // Handle numeric comparison
      return direction * (valueA - valueB);
    });
    
    setFilteredTasks(result);
  }, [state.tasks, filter, sort]);
  
  return {
    tasks: filteredTasks,
    setFilter,
    setSort,
    filter,
    sort,
    totalCount: state.tasks.length,
    filteredCount: filteredTasks.length
  };
};
