
import React, { useState } from 'react';
import { TaskProvider } from '../context/TaskContext';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import TaskStats from '../components/TaskStats';
import { ListChecks, LayoutDashboard, Search, Menu, X } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'stats'>('tasks');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleTabChange = (tab: 'tasks' | 'stats') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <TaskProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="glass-panel border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <ListChecks size={24} className="text-primary mr-2" />
              <h1 className="text-xl font-bold">Minimal Tasks</h1>
            </div>
            
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => handleTabChange('tasks')}
                className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
                  activeTab === 'tasks' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <ListChecks size={18} className="mr-1" />
                Tasks
              </button>
              <button
                onClick={() => handleTabChange('stats')}
                className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
                  activeTab === 'stats' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <LayoutDashboard size={18} className="mr-1" />
                Dashboard
              </button>
            </nav>
          </div>
        </header>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-panel animate-slide-down">
            <nav className="container mx-auto px-4 py-2 flex flex-col space-y-1">
              <button
                onClick={() => handleTabChange('tasks')}
                className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
                  activeTab === 'tasks' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <ListChecks size={18} className="mr-1" />
                Tasks
              </button>
              <button
                onClick={() => handleTabChange('stats')}
                className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
                  activeTab === 'stats' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <LayoutDashboard size={18} className="mr-1" />
                Dashboard
              </button>
            </nav>
          </div>
        )}
        
        {/* Main content */}
        <main className="container mx-auto px-4 py-8">
          {activeTab === 'tasks' ? <TaskList /> : <TaskStats />}
        </main>
        
        {/* Task form (modal) */}
        <TaskForm />
      </div>
    </TaskProvider>
  );
};

export default Index;
