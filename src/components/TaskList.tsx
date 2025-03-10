
import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from './TaskItem';
import { sortTasksByDueDate } from '../utils/taskUtils';
import { Plus, ListFilter, LayoutGrid, LayoutList } from 'lucide-react';
import { TaskStatus } from '../context/TaskContext';

const TaskList: React.FC = () => {
  const { state, toggleForm, updateTask } = useTaskContext();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
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
  
  const toggleViewMode = (mode: 'grid' | 'list' | 'kanban') => {
    setViewMode(mode);
  };
  
  // Filter tasks based on status
  const filteredTasks = statusFilter === 'all' 
    ? state.tasks 
    : state.tasks.filter(task => task.status === statusFilter);
    
  // Sort tasks based on selected sort order
  const sortedTasks = sortOrder === 'dueDate'
    ? sortTasksByDueDate(filteredTasks)
    : filteredTasks;
  
  // Tasks separated by status for kanban view
  const todoTasks = state.tasks.filter(task => task.status === 'todo');
  const inProgressTasks = state.tasks.filter(task => task.status === 'inprogress');
  const doneTasks = state.tasks.filter(task => task.status === 'done');
  
  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = state.tasks.find(t => t.id === taskId);
    
    if (task && task.status !== newStatus) {
      updateTask({ ...task, status: newStatus });
    }
  };
  
  // Handle drag over event
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
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
              onClick={() => toggleViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-secondary text-foreground' : 'bg-background text-muted-foreground'}`}
              aria-label="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => toggleViewMode('list')}
              className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-secondary text-foreground' : 'bg-background text-muted-foreground'}`}
              aria-label="List view"
            >
              <LayoutList size={18} />
            </button>
            <button
              onClick={() => toggleViewMode('kanban')}
              className={`p-2 px-3 transition-colors ${viewMode === 'kanban' ? 'bg-secondary text-foreground' : 'bg-background text-muted-foreground'}`}
              aria-label="Kanban view"
            >
              Kanban
            </button>
          </div>
        </div>
        
        {viewMode !== 'kanban' && (
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
        )}
      </div>
      
      {state.tasks.length === 0 ? (
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
      ) : viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* TODO Column */}
          <div 
            className="kanban-column"
            onDrop={(e) => handleDrop(e, 'todo')}
            onDragOver={handleDragOver}
          >
            <div className="bg-blue-100 p-3 rounded-t-lg">
              <h3 className="font-medium text-blue-800">To Do ({todoTasks.length})</h3>
            </div>
            <div className="bg-white rounded-b-lg shadow-sm border border-t-0 p-3 min-h-[300px]">
              {todoTasks.length === 0 ? (
                <div className="flex justify-center items-center h-20 text-muted-foreground text-sm border border-dashed rounded-lg p-4">
                  Drag tasks here
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  {todoTasks.map(task => (
                    <TaskItem key={task.id} task={task} isDraggable={true} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* IN PROGRESS Column */}
          <div 
            className="kanban-column"
            onDrop={(e) => handleDrop(e, 'inprogress')}
            onDragOver={handleDragOver}
          >
            <div className="bg-yellow-100 p-3 rounded-t-lg">
              <h3 className="font-medium text-yellow-800">In Progress ({inProgressTasks.length})</h3>
            </div>
            <div className="bg-white rounded-b-lg shadow-sm border border-t-0 p-3 min-h-[300px]">
              {inProgressTasks.length === 0 ? (
                <div className="flex justify-center items-center h-20 text-muted-foreground text-sm border border-dashed rounded-lg p-4">
                  Drag tasks here
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  {inProgressTasks.map(task => (
                    <TaskItem key={task.id} task={task} isDraggable={true} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* DONE Column */}
          <div 
            className="kanban-column"
            onDrop={(e) => handleDrop(e, 'done')}
            onDragOver={handleDragOver}
          >
            <div className="bg-green-100 p-3 rounded-t-lg">
              <h3 className="font-medium text-green-800">Done ({doneTasks.length})</h3>
            </div>
            <div className="bg-white rounded-b-lg shadow-sm border border-t-0 p-3 min-h-[300px]">
              {doneTasks.length === 0 ? (
                <div className="flex justify-center items-center h-20 text-muted-foreground text-sm border border-dashed rounded-lg p-4">
                  Drag tasks here
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  {doneTasks.map(task => (
                    <TaskItem key={task.id} task={task} isDraggable={true} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
          : "flex flex-col space-y-3"}>
          {sortedTasks.map(task => (
            <TaskItem key={task.id} task={task} isDraggable={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
