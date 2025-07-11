import { useState, useEffect } from 'react';
import React from 'react';
import { Task, Category, AppSettings, UrgencyLevel, TaskFilters } from '@/types/Task';
import { StorageService } from '@/services/StorageService';

// Función para generar IDs únicos
const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [urgencyLevels, setUrgencyLevels] = useState<UrgencyLevel[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0); // Forzar actualización de vistas
  const [filters, setFilters] = useState<TaskFilters>({
    categories: [],
    urgency: [],
    status: [],
    searchQuery: '',
    sortBy: 'newest',
  });

  useEffect(() => {
    loadData();
  }, []);

  // Limpieza automática cada vez que se carga la aplicación
  useEffect(() => {
    const runCleanup = async () => {
      try {
        const shouldRun = await StorageService.shouldRunCleanup();
        if (shouldRun) {
          console.log('Running automatic cleanup...');
          const result = await StorageService.cleanupExpiredTasks();
          if (result.expiredCount > 0 || result.overdueCount > 0 || result.overdueExpiredCount > 0) {
            // Recargar datos después de la limpieza
            await loadData();
          }
        }
      } catch (error) {
        console.error('Error during automatic cleanup:', error);
      }
    };

    if (!loading) {
      runCleanup();
    }
  }, [loading]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, categoriesData, urgencyLevelsData, settingsData] = await Promise.all([
        StorageService.getTasks(),
        StorageService.getCategories(),
        StorageService.getUrgencyLevels(),
        StorageService.getSettings(),
      ]);

      setTasks(tasksData);
      setCategories(categoriesData);
      setUrgencyLevels(urgencyLevelsData);
      setSettings(settingsData);

      // Cleanup expired tasks
      await StorageService.cleanupExpiredTasks();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: generateUniqueId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await StorageService.addTask(newTask);
    setTasks(prev => [...prev, newTask]);
    
    // Forzar actualización de vistas después de añadir tarea
    setForceUpdate(prev => prev + 1);
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    console.log('Updating task:', taskId, 'with updates:', updates);
    await StorageService.updateTask(taskId, updates);
    setTasks(prev => {
      const updatedTasks = prev.map(task => 
        task.id === taskId ? { ...task, ...updates, updatedAt: new Date() } : task
      );
      console.log('Updated tasks state:', updatedTasks.length, 'tasks');
      return updatedTasks;
    });
    
    // Forzar actualización de vistas después de cambiar estado
    if (updates.status) {
      setForceUpdate(prev => prev + 1);
    }
  };

  const deleteTask = async (taskId: string) => {
    await StorageService.deleteTask(taskId);
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const addCategory = async (category: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...category,
      id: generateUniqueId(),
      createdAt: new Date(),
    };
    
    await StorageService.addCategory(newCategory);
    setCategories(prev => [...prev, newCategory]);
    
    // Retornar la nueva categoría para que pueda ser seleccionada automáticamente
    return newCategory;
  };

  const updateCategory = async (categoryId: string, updates: Partial<Category>) => {
    await StorageService.updateCategory(categoryId, updates);
    setCategories(prev => prev.map(category => 
      category.id === categoryId ? { ...category, ...updates } : category
    ));
  };

  const deleteCategory = async (categoryId: string) => {
    await StorageService.deleteCategory(categoryId);
    setCategories(prev => prev.filter(category => category.id !== categoryId));
  };

  const addUrgencyLevel = async (urgencyLevel: Omit<UrgencyLevel, 'id' | 'createdAt'>) => {
    const newUrgencyLevel: UrgencyLevel = {
      ...urgencyLevel,
      id: generateUniqueId(),
      createdAt: new Date(),
    };
    
    await StorageService.addUrgencyLevel(newUrgencyLevel);
    setUrgencyLevels(prev => [...prev, newUrgencyLevel]);
  };

  const updateUrgencyLevel = async (urgencyLevelId: string, updates: Partial<UrgencyLevel>) => {
    await StorageService.updateUrgencyLevel(urgencyLevelId, updates);
    setUrgencyLevels(prev => prev.map(urgencyLevel => 
      urgencyLevel.id === urgencyLevelId ? { ...urgencyLevel, ...updates } : urgencyLevel
    ));
  };

  const deleteUrgencyLevel = async (urgencyLevelId: string) => {
    await StorageService.deleteUrgencyLevel(urgencyLevelId);
    setUrgencyLevels(prev => prev.filter(urgencyLevel => urgencyLevel.id !== urgencyLevelId));
  };

  const updateSettings = async (newSettings: AppSettings) => {
    await StorageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const runManualCleanup = async () => {
    const result = await StorageService.cleanupExpiredTasks();
    // Recargar datos después de la limpieza manual
    await loadData();
    return result;
  };

  const applyFilters = (taskList: Task[]) => {
    let filtered = [...taskList];

    // Apply search filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.subtasks.some(subtask => subtask.title.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(task => task.categoryId && filters.categories.includes(task.categoryId));
    }

    // Apply urgency filter
    if (filters.urgency.length > 0) {
      filtered = filtered.filter(task => filters.urgency.includes(task.urgency));
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status.includes(task.status));
    }

    // Apply date range filter
    if (filters.dateRange) {
      filtered = filtered.filter(task => {
        if (!task.dueDate) return false;
        return task.dueDate >= filters.dateRange!.start && task.dueDate <= filters.dateRange!.end;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        case 'urgency':
          // Buscar la prioridad en los niveles de urgencia configurados
          const aUrgency = urgencyLevels.find(u => u.id === a.urgency);
          const bUrgency = urgencyLevels.find(u => u.id === b.urgency);
          const aOrder = aUrgency?.priority || 0;
          const bOrder = bUrgency?.priority || 0;
          return bOrder - aOrder;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Computed values - recalculados cada vez que cambian las tareas
  const activeTasks = React.useMemo(() => 
    applyFilters(tasks.filter(task => task.status !== 'completed')), 
    [tasks, filters, urgencyLevels, forceUpdate]
  );
  
  const completedTasks = React.useMemo(() => {
    const filtered = applyFilters(tasks.filter(task => task.status === 'completed'));
    console.log('Completed tasks updated:', filtered.length, 'tasks');
    return filtered;
  }, [tasks, filters, urgencyLevels, forceUpdate]);
  
  const incompleteTasks = React.useMemo(() => 
    applyFilters(tasks.filter(task => task.status === 'pending' || task.status === 'overdue')), 
    [tasks, filters, urgencyLevels, forceUpdate]
  );
  
  const overdueTasks = React.useMemo(() => 
    tasks.filter(task => {
      if (!task.dueDate || task.status === 'completed') return false;
      return new Date() > task.dueDate;
    }), 
    [tasks, forceUpdate]
  );

  return {
    tasks,
    allTasks: tasks, // Alias para compatibilidad
    categories,
    urgencyLevels,
    settings,
    loading,
    filters,
    setFilters,
    activeTasks,
    completedTasks,
    incompleteTasks,
    overdueTasks,
    addTask,
    updateTask,
    deleteTask,
    addCategory,
    updateCategory,
    deleteCategory,
    addUrgencyLevel,
    updateUrgencyLevel,
    deleteUrgencyLevel,
    updateSettings,
    runManualCleanup,
    refreshData: loadData,
  };
};