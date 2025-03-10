
import React from 'react';
import { Task } from '../context/TaskContext';
import { useTaskContext } from '../context/TaskContext';
import { formatDate, getCategoryColor, getStatusClass, getStatusText, isTaskOverdue } from '../utils/taskUtils';
import { CalendarDays, CheckCircle2, Clock, Edit, Trash2 } from 'lucide-react';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { selectTask, deleteTask, updateTask } = useTaskContext();
  
  const handleEdit = () => {
    selectTask(task.id);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };
  
  const handleStatusChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Cycle through statuses: todo -> inprogress -> done -> todo
    const newStatus = task.status === 'todo' 
      ? 'inprogress' 
      : task.status === 'inprogress' 
        ? 'done' 
        : 'todo';
    
    updateTask({ ...task, status: newStatus });
  };
  
  const isOverdue = isTaskOverdue(task);
  
  return (
    <div 
      className="task-card animate-scale-in cursor-pointer group"
      onClick={handleEdit}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`task-category ${getCategoryColor(task.category)}`}>
          {task.category}
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleStatusChange}
            className="p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="Change status"
          >
            <CheckCircle2 size={16} className="text-muted-foreground" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="Delete task"
          >
            <Trash2 size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>
      
      <h3 className={`font-medium text-lg mb-1 line-clamp-2 ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
        {task.title}
      </h3>
      
      {task.description && (
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between mt-2">
        <div className={`status-badge ${getStatusClass(task.status)}`}>
          {getStatusText(task.status)}
        </div>
        
        {task.dueDate && (
          <div className={`flex items-center text-xs ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
            <CalendarDays size={14} className="mr-1" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
