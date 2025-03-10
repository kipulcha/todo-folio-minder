
import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { getTasksStatusCountByPeriod } from '../utils/taskUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CalendarDays, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

// Type for the time period selection
type TimePeriod = 'week' | 'month' | 'year';

const TaskStats: React.FC = () => {
  const { state, getTotalTasksByStatus } = useTaskContext();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');
  
  // Get tasks status count for selected period
  const statusCounts = getTasksStatusCountByPeriod(state.tasks, timePeriod);
  
  // Prepare data for bar chart
  const barChartData = [
    { name: 'To Do', value: statusCounts.todo },
    { name: 'In Progress', value: statusCounts.inProgress },
    { name: 'Done', value: statusCounts.done },
  ];
  
  // Prepare data for pie chart
  const pieChartData = [
    { name: 'To Do', value: statusCounts.todo },
    { name: 'In Progress', value: statusCounts.inProgress },
    { name: 'Done', value: statusCounts.done },
  ];
  
  // Colors for pie chart segments
  const COLORS = ['#3B82F6', '#FBBF24', '#10B981'];
  
  // Calculate totals
  const totalTasks = state.tasks.length;
  const { todo, inprogress, done } = getTotalTasksByStatus();
  const completionRate = totalTasks > 0 ? Math.round((done / totalTasks) * 100) : 0;
  
  // Calculate overdue tasks
  const overdueTasks = state.tasks.filter(task => {
    if (!task.dueDate || task.status === 'done') return false;
    return new Date(task.dueDate) < new Date();
  }).length;
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimePeriod('week')}
            className={`px-3 py-1 rounded-full text-sm ${
              timePeriod === 'week' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            Week
          </button>
          <button 
            onClick={() => setTimePeriod('month')}
            className={`px-3 py-1 rounded-full text-sm ${
              timePeriod === 'month' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            Month
          </button>
          <button 
            onClick={() => setTimePeriod('year')}
            className={`px-3 py-1 rounded-full text-sm ${
              timePeriod === 'year' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            Year
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <CalendarDays size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <h3 className="text-2xl font-semibold">{totalTasks}</h3>
            </div>
          </div>
        </div>
        
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <h3 className="text-2xl font-semibold">{inprogress}</h3>
            </div>
          </div>
        </div>
        
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle2 size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <h3 className="text-2xl font-semibold">{completionRate}%</h3>
            </div>
          </div>
        </div>
        
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <h3 className="text-2xl font-semibold">{overdueTasks}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4">Tasks by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: 'none' 
                  }} 
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-panel rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4">Task Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} tasks`, 'Count']}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: 'none' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;
