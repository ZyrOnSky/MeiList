import React, { createContext, useContext, ReactNode } from 'react';
import { useTasks } from '@/hooks/useTasks';

// Crear el contexto
const TaskContext = createContext<ReturnType<typeof useTasks> | undefined>(undefined);

// Provider del contexto
export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const taskState = useTasks();
  
  return (
    <TaskContext.Provider value={taskState}>
      {children}
    </TaskContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}; 