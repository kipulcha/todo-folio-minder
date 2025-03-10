
import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { Task, TaskStatus, TaskCategory } from '../context/TaskContext';
import { X } from 'lucide-react';

const TaskForm: React.FC = () => {
  const { state, addTask, updateTask, toggleForm, getTaskById } = useTaskContext();
  const { isFormOpen, isEditMode, selectedTaskId } = state;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [dueDate, setDueDate] = useState<string>('');
  const [category, setCategory] = useState<TaskCategory>('blue');
  
  // Load task data when editing
  useEffect(() => {
    if (isEditMode && selectedTaskId) {
      const taskToEdit = getTaskById(selectedTaskId);
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description || '');
        setStatus(taskToEdit.status);
        setCategory(taskToEdit.category);
        setDueDate(taskToEdit.dueDate ? taskToEdit.dueDate.toISOString().substring(0, 10) : '');
      }
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setStatus('todo');
      setDueDate('');
      setCategory('blue');
    }
  }, [isEditMode, selectedTaskId, getTaskById]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return; // Prevent empty submissions
    
    const taskData = {
      title,
      description,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      category
    };
    
    if (isEditMode && selectedTaskId) {
      const existingTask = getTaskById(selectedTaskId);
      if (existingTask) {
        updateTask({
          ...existingTask,
          ...taskData
        });
      }
    } else {
      addTask(taskData);
    }
    
    // Reset form and close it
    setTitle('');
    setDescription('');
    setStatus('todo');
    setDueDate('');
    setCategory('blue');
  };
  
  const handleClose = () => {
    toggleForm(false);
  };
  
  if (!isFormOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-foreground/50 backdrop-blur-xs flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="bg-background rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            {isEditMode ? 'Edit Task' : 'New Task'}
          </h2>
          <button 
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field w-full"
                placeholder="Task title"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field w-full min-h-[100px] resize-none"
                placeholder="Task description (optional)"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="input-field w-full"
                >
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="input-field w-full"
                >
                  <option value="blue">Blue</option>
                  <option value="purple">Purple</option>
                  <option value="orange">Orange</option>
                  <option value="green">Green</option>
                  <option value="pink">Pink</option>
                  <option value="yellow">Yellow</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field w-full"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {isEditMode ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
