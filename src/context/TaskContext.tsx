
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { format } from 'date-fns';

// Define types
export type TaskStatus = 'todo' | 'inprogress' | 'done';
export type TaskCategory = 'blue' | 'purple' | 'orange' | 'green' | 'pink' | 'yellow';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date | null;
  category: TaskCategory;
  createdAt: Date;
  completedAt: Date | null;
}

interface TaskState {
  tasks: Task[];
  selectedTaskId: string | null;
  isFormOpen: boolean;
  isEditMode: boolean;
}

type TaskAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SELECT_TASK'; payload: string | null }
  | { type: 'TOGGLE_FORM'; payload: boolean }
  | { type: 'SET_EDIT_MODE'; payload: boolean }
  | { type: 'LOAD_TASKS'; payload: Task[] };

interface TaskContextType {
  state: TaskState;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  selectTask: (id: string | null) => void;
  toggleForm: (isOpen: boolean) => void;
  setEditMode: (isEdit: boolean) => void;
  getTaskById: (id: string) => Task | undefined;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByDateRange: (startDate: Date, endDate: Date) => Task[];
  getTotalTasksByStatus: () => { todo: number; inprogress: number; done: number };
}

// Create context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Reducer function
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        isFormOpen: false
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        ),
        isFormOpen: false,
        selectedTaskId: null
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        selectedTaskId: state.selectedTaskId === action.payload ? null : state.selectedTaskId
      };
    case 'SELECT_TASK':
      return {
        ...state,
        selectedTaskId: action.payload,
        isFormOpen: action.payload !== null
      };
    case 'TOGGLE_FORM':
      return {
        ...state,
        isFormOpen: action.payload,
        selectedTaskId: action.payload ? state.selectedTaskId : null
      };
    case 'SET_EDIT_MODE':
      return {
        ...state,
        isEditMode: action.payload
      };
    case 'LOAD_TASKS':
      return {
        ...state,
        tasks: action.payload
      };
    default:
      return state;
  }
};

// Provider component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialState: TaskState = {
    tasks: [],
    selectedTaskId: null,
    isFormOpen: false,
    isEditMode: false
  };

  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks, (key, value) => {
          // Convert string dates back to Date objects
          if (key === 'dueDate' || key === 'createdAt' || key === 'completedAt') {
            return value ? new Date(value) : null;
          }
          return value;
        });
        dispatch({ type: 'LOAD_TASKS', payload: parsedTasks });
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);

  // Helper functions
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      completedAt: null
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (task: Task) => {
    const updatedTask = { ...task };
    
    // If status changed to done, set completedAt
    if (task.status === 'done' && !task.completedAt) {
      updatedTask.completedAt = new Date();
    }
    
    // If status changed from done to something else, clear completedAt
    if (task.status !== 'done' && task.completedAt) {
      updatedTask.completedAt = null;
    }
    
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const selectTask = (id: string | null) => {
    dispatch({ type: 'SELECT_TASK', payload: id });
    if (id) {
      dispatch({ type: 'SET_EDIT_MODE', payload: true });
    }
  };

  const toggleForm = (isOpen: boolean) => {
    dispatch({ type: 'TOGGLE_FORM', payload: isOpen });
    if (isOpen) {
      dispatch({ type: 'SET_EDIT_MODE', payload: false });
    }
  };

  const setEditMode = (isEdit: boolean) => {
    dispatch({ type: 'SET_EDIT_MODE', payload: isEdit });
  };

  const getTaskById = (id: string) => {
    return state.tasks.find(task => task.id === id);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return state.tasks.filter(task => task.status === status);
  };

  const getTasksByDateRange = (startDate: Date, endDate: Date) => {
    return state.tasks.filter(task => {
      if (!task.createdAt) return false;
      const taskDate = new Date(task.createdAt);
      return taskDate >= startDate && taskDate <= endDate;
    });
  };

  const getTotalTasksByStatus = () => {
    const counts = { todo: 0, inprogress: 0, done: 0 };
    state.tasks.forEach(task => {
      if (task.status === 'todo') counts.todo++;
      else if (task.status === 'inprogress') counts.inprogress++;
      else if (task.status === 'done') counts.done++;
    });
    return counts;
  };

  const value = {
    state,
    addTask,
    updateTask,
    deleteTask,
    selectTask,
    toggleForm,
    setEditMode,
    getTaskById,
    getTasksByStatus,
    getTasksByDateRange,
    getTotalTasksByStatus
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// Custom hook for using the context
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
