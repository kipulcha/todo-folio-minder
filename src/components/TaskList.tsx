
import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from './TaskItem';
import { sortTasksByDueDate } from '../utils/taskUtils';
import { Plus, ListFilter, LayoutGrid, LayoutList } from 'lucide-react';
import { TaskStatus } from '../context/TaskContext';

const TaskList: React.FC = () => {
  const { state, toggleForm } = useTaskContext();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'default' | 'dueDate'>('default');
  
  const handleAddTask = () => {
    toggleForm(true);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as TaskStatus | 'all');
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'default' | 'dueDate');
  };
  
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };
  
  // Filter tasks based on status
  const filteredTasks = statusFilter === 'all' 
    ? state.tasks 
    : state.tasks.filter(task => task.status === statusFilter);
    
  // Sort tasks based on selected sort order
  const sortedTasks = sortOrder === 'dueDate'
    ? sortTasksByDueDate(filteredTasks)
    : filteredTasks;
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Tasks</h2>
        
        <button
          onClick={handleAddTask}
          className="btn-primary flex items-center"
        >
          <Plus size={18} className="mr-1" />
          New Task
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center rounded-lg overflow-hidden border">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-secondary text-foreground' : 'bg-background text-muted-foreground'}`}
              aria-label="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-secondary text-foreground' : 'bg-background text-muted-foreground'}`}
              aria-label="List view"
            >
              <LayoutList size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center">
            <ListFilter size={16} className="mr-1 text-muted-foreground" />
            <select
              className="input-field py-1 text-sm"
              value={statusFilter}
              onChange={handleFilterChange}
              aria-label="Filter by status"
            >
              <option value="all">All Tasks</option>
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <select
              className="input-field py-1 text-sm"
              value={sortOrder}
              onChange={handleSortChange}
              aria-label="Sort tasks"
            >
              <option value="default">Default</option>
              <option value="dueDate">Due Date</option>
            </select>
          </div>
        </div>
      </div>
      
      {sortedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg bg-muted/30">
          <p className="text-muted-foreground mb-4 text-center">No tasks found. Create your first task to get started!</p>
          <button
            onClick={handleAddTask}
            className="btn-primary flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Add Task
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
          : "flex flex-col space-y-3"}>
          {sortedTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
