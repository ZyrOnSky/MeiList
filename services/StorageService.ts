import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Category, AppSettings, UrgencyLevel, TaskHistory } from '@/types/Task';

const STORAGE_KEYS = {
  TASKS: 'tasks',
  CATEGORIES: 'categories',
  URGENCY_LEVELS: 'urgencyLevels',
  SETTINGS: 'settings',
  TASK_HISTORY: 'taskHistory',
};

// Función de logging mejorada para web
const logStorage = (operation: string, data?: any) => {
  if (typeof window !== 'undefined') {
    console.log(`🔧 StorageService [${operation}]:`, data);
  }
};

export class StorageService {
  // Tasks
  static async getTasks(): Promise<Task[]> {
    try {
      logStorage('getTasks - iniciando');
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      logStorage('getTasks - datos obtenidos', data ? 'datos encontrados' : 'sin datos');
      
      if (data) {
        const tasks = JSON.parse(data);
        const parsedTasks = tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          startDate: task.startDate ? new Date(task.startDate) : undefined,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          completedDate: task.completedDate ? new Date(task.completedDate) : undefined,
        }));
        logStorage('getTasks - tareas parseadas', parsedTasks.length);
        return parsedTasks;
      }
      logStorage('getTasks - retornando array vacío');
      return [];
    } catch (error) {
      console.error('❌ Error getting tasks:', error);
      logStorage('getTasks - error', error);
      return [];
    }
  }

  static async saveTasks(tasks: Task[]): Promise<void> {
    try {
      logStorage('saveTasks - guardando', tasks.length);
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      logStorage('saveTasks - guardado exitoso');
    } catch (error) {
      console.error('❌ Error saving tasks:', error);
      logStorage('saveTasks - error', error);
    }
  }

  static async addTask(task: Task): Promise<void> {
    try {
      logStorage('addTask - añadiendo tarea', task.title);
      const tasks = await this.getTasks();
      tasks.push(task);
      await this.saveTasks(tasks);
      logStorage('addTask - tarea añadida exitosamente');
    } catch (error) {
      console.error('❌ Error adding task:', error);
      logStorage('addTask - error', error);
    }
  }

  static async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    try {
      logStorage('updateTask - actualizando', { taskId, updates });
      const tasks = await this.getTasks();
      const index = tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        const updatedTask = { ...tasks[index], ...updates, updatedAt: new Date() };
        tasks[index] = updatedTask;
        logStorage('updateTask - tarea actualizada', updatedTask.status);
        await this.saveTasks(tasks);
      } else {
        logStorage('updateTask - tarea no encontrada', taskId);
      }
    } catch (error) {
      console.error('❌ Error updating task:', error);
      logStorage('updateTask - error', error);
    }
  }

  static async deleteTask(taskId: string, reason: 'manual_deletion' = 'manual_deletion'): Promise<void> {
    try {
      logStorage('deleteTask - moviendo al historial', taskId);
      const tasks = await this.getTasks();
      const taskToDelete = tasks.find(t => t.id === taskId);
      
      if (taskToDelete) {
        // Mover al historial
        await this.addToHistory(taskToDelete, reason);
        
        // Eliminar de la lista activa
        const filteredTasks = tasks.filter(t => t.id !== taskId);
        await this.saveTasks(filteredTasks);
        logStorage('deleteTask - tarea movida al historial');
      }
    } catch (error) {
      console.error('❌ Error deleting task:', error);
      logStorage('deleteTask - error', error);
    }
  }

  // Categories
  static async getCategories(): Promise<Category[]> {
    try {
      logStorage('getCategories - iniciando');
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (data) {
        const categories = JSON.parse(data);
        const parsedCategories = categories.map((cat: any) => ({
          ...cat,
          createdAt: new Date(cat.createdAt),
        }));
        logStorage('getCategories - categorías obtenidas', parsedCategories.length);
        return parsedCategories;
      }
      logStorage('getCategories - usando categorías por defecto');
      return this.getDefaultCategories();
    } catch (error) {
      console.error('❌ Error getting categories:', error);
      logStorage('getCategories - error', error);
      return this.getDefaultCategories();
    }
  }

  static async saveCategories(categories: Category[]): Promise<void> {
    try {
      logStorage('saveCategories - guardando', categories.length);
      await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      logStorage('saveCategories - guardado exitoso');
    } catch (error) {
      console.error('❌ Error saving categories:', error);
      logStorage('saveCategories - error', error);
    }
  }

  static async addCategory(category: Category): Promise<void> {
    try {
      logStorage('addCategory - añadiendo', category.name);
      const categories = await this.getCategories();
      categories.push(category);
      await this.saveCategories(categories);
      logStorage('addCategory - categoría añadida');
    } catch (error) {
      console.error('❌ Error adding category:', error);
      logStorage('addCategory - error', error);
    }
  }

  static async updateCategory(categoryId: string, updates: Partial<Category>): Promise<void> {
    try {
      logStorage('updateCategory - actualizando', { categoryId, updates });
      const categories = await this.getCategories();
      const index = categories.findIndex(c => c.id === categoryId);
      if (index !== -1) {
        categories[index] = { ...categories[index], ...updates };
        await this.saveCategories(categories);
        logStorage('updateCategory - categoría actualizada');
      }
    } catch (error) {
      console.error('❌ Error updating category:', error);
      logStorage('updateCategory - error', error);
    }
  }

  static async deleteCategory(categoryId: string): Promise<void> {
    try {
      logStorage('deleteCategory - eliminando', categoryId);
      const categories = await this.getCategories();
      const filteredCategories = categories.filter(c => c.id !== categoryId);
      await this.saveCategories(filteredCategories);
      logStorage('deleteCategory - categoría eliminada');
    } catch (error) {
      console.error('❌ Error deleting category:', error);
      logStorage('deleteCategory - error', error);
    }
  }

  static getDefaultCategories(): Category[] {
    logStorage('getDefaultCategories - retornando categorías por defecto');
    return [
      {
        id: 'trabajo',
        name: 'Trabajo',
        color: '#3B82F6',
        createdAt: new Date(),
      },
      {
        id: 'personal',
        name: 'Personal',
        color: '#10B981',
        createdAt: new Date(),
      },
      {
        id: 'salud',
        name: 'Salud',
        color: '#EF4444',
        createdAt: new Date(),
      },
      {
        id: 'finanzas',
        name: 'Finanzas',
        color: '#F59E0B',
        createdAt: new Date(),
      },
    ];
  }

  // Urgency Levels
  static async getUrgencyLevels(): Promise<UrgencyLevel[]> {
    try {
      logStorage('getUrgencyLevels - iniciando');
      const data = await AsyncStorage.getItem(STORAGE_KEYS.URGENCY_LEVELS);
      if (data) {
        const urgencyLevels = JSON.parse(data);
        const parsedLevels = urgencyLevels.map((level: any) => ({
          ...level,
          createdAt: new Date(level.createdAt),
        }));
        logStorage('getUrgencyLevels - niveles obtenidos', parsedLevels.length);
        return parsedLevels;
      }
      logStorage('getUrgencyLevels - usando niveles por defecto');
      return this.getDefaultUrgencyLevels();
    } catch (error) {
      console.error('❌ Error getting urgency levels:', error);
      logStorage('getUrgencyLevels - error', error);
      return this.getDefaultUrgencyLevels();
    }
  }

  static async saveUrgencyLevels(urgencyLevels: UrgencyLevel[]): Promise<void> {
    try {
      logStorage('saveUrgencyLevels - guardando', urgencyLevels.length);
      await AsyncStorage.setItem(STORAGE_KEYS.URGENCY_LEVELS, JSON.stringify(urgencyLevels));
      logStorage('saveUrgencyLevels - guardado exitoso');
    } catch (error) {
      console.error('❌ Error saving urgency levels:', error);
      logStorage('saveUrgencyLevels - error', error);
    }
  }

  static async addUrgencyLevel(urgencyLevel: UrgencyLevel): Promise<void> {
    try {
      logStorage('addUrgencyLevel - añadiendo', urgencyLevel.name);
      const urgencyLevels = await this.getUrgencyLevels();
      urgencyLevels.push(urgencyLevel);
      await this.saveUrgencyLevels(urgencyLevels);
      logStorage('addUrgencyLevel - nivel añadido');
    } catch (error) {
      console.error('❌ Error adding urgency level:', error);
      logStorage('addUrgencyLevel - error', error);
    }
  }

  static async updateUrgencyLevel(urgencyLevelId: string, updates: Partial<UrgencyLevel>): Promise<void> {
    try {
      logStorage('updateUrgencyLevel - actualizando', { urgencyLevelId, updates });
      const urgencyLevels = await this.getUrgencyLevels();
      const index = urgencyLevels.findIndex(u => u.id === urgencyLevelId);
      if (index !== -1) {
        urgencyLevels[index] = { ...urgencyLevels[index], ...updates };
        await this.saveUrgencyLevels(urgencyLevels);
        logStorage('updateUrgencyLevel - nivel actualizado');
      }
    } catch (error) {
      console.error('❌ Error updating urgency level:', error);
      logStorage('updateUrgencyLevel - error', error);
    }
  }

  static async deleteUrgencyLevel(urgencyLevelId: string): Promise<void> {
    try {
      logStorage('deleteUrgencyLevel - eliminando', urgencyLevelId);
      const urgencyLevels = await this.getUrgencyLevels();
      const filteredUrgencyLevels = urgencyLevels.filter(u => u.id !== urgencyLevelId);
      await this.saveUrgencyLevels(filteredUrgencyLevels);
      logStorage('deleteUrgencyLevel - nivel eliminado');
    } catch (error) {
      console.error('❌ Error deleting urgency level:', error);
      logStorage('deleteUrgencyLevel - error', error);
    }
  }

  static getDefaultUrgencyLevels(): UrgencyLevel[] {
    logStorage('getDefaultUrgencyLevels - retornando niveles por defecto');
    return [
      {
        id: 'alta',
        name: 'Alta',
        color: '#EF4444',
        priority: 1,
        createdAt: new Date(),
      },
      {
        id: 'media',
        name: 'Media',
        color: '#F59E0B',
        priority: 2,
        createdAt: new Date(),
      },
      {
        id: 'baja',
        name: 'Baja',
        color: '#10B981',
        priority: 3,
        createdAt: new Date(),
      },
    ];
  }

  // Settings
  static async getSettings(): Promise<AppSettings> {
    try {
      logStorage('getSettings - iniciando');
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        const settings = JSON.parse(data);
        logStorage('getSettings - configuración obtenida');
        return {
          ...settings,
          lastCleanup: settings.lastCleanup ? new Date(settings.lastCleanup) : new Date(),
        };
      }
      logStorage('getSettings - usando configuración por defecto');
      return this.getDefaultSettings();
    } catch (error) {
      console.error('❌ Error getting settings:', error);
      logStorage('getSettings - error', error);
      return this.getDefaultSettings();
    }
  }

  static async saveSettings(settings: AppSettings): Promise<void> {
    try {
      logStorage('saveSettings - guardando');
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      logStorage('saveSettings - guardado exitoso');
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      logStorage('saveSettings - error', error);
    }
  }

  static getDefaultSettings(): AppSettings {
    logStorage('getDefaultSettings - retornando configuración por defecto');
    return {
      // Retención de tareas activas (más corta para mantener listas limpias)
      completedTaskRetentionDays: 7, // 7 días para tareas completadas
      overdueTaskRetentionDays: 3, // 3 días para tareas vencidas
      
      // Historial (más largo para estadísticas)
      historyRetentionMonths: 6, // 6 meses en historial
      historyCleanupFrequencyDays: 30, // Limpiar historial cada 30 días
      
      // Limpieza general
      cleanupFrequencyDays: 1, // Limpiar diariamente
      lastCleanup: new Date(),
      lastHistoryCleanup: new Date(),
    };
  }



  // Task History
  static async getTaskHistory(): Promise<TaskHistory[]> {
    try {
      logStorage('getTaskHistory - iniciando');
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TASK_HISTORY);
      if (data) {
        const history = JSON.parse(data);
        const parsedHistory = history.map((item: any) => ({
          ...item,
          task: {
            ...item.task,
            createdAt: new Date(item.task.createdAt),
            updatedAt: new Date(item.task.updatedAt),
            startDate: item.task.startDate ? new Date(item.task.startDate) : undefined,
            dueDate: item.task.dueDate ? new Date(item.task.dueDate) : undefined,
            completedDate: item.task.completedDate ? new Date(item.task.completedDate) : undefined,
          },
          deletedAt: new Date(item.deletedAt),
          retentionUntil: new Date(item.retentionUntil),
        }));
        logStorage('getTaskHistory - historial obtenido', parsedHistory.length);
        return parsedHistory;
      }
      logStorage('getTaskHistory - sin historial');
      return [];
    } catch (error) {
      console.error('❌ Error getting task history:', error);
      logStorage('getTaskHistory - error', error);
      return [];
    }
  }

  static async saveTaskHistory(history: TaskHistory[]): Promise<void> {
    try {
      logStorage('saveTaskHistory - guardando', history.length);
      await AsyncStorage.setItem(STORAGE_KEYS.TASK_HISTORY, JSON.stringify(history));
      logStorage('saveTaskHistory - guardado exitoso');
    } catch (error) {
      console.error('❌ Error saving task history:', error);
      logStorage('saveTaskHistory - error', error);
    }
  }

  static async addToHistory(task: Task, reason: TaskHistory['deletionReason']): Promise<void> {
    try {
      logStorage('addToHistory - añadiendo al historial', { taskId: task.id, reason });
      const history = await this.getTaskHistory();
      const settings = await this.getSettings();
      
      const historyItem: TaskHistory = {
        id: `${task.id}_${Date.now()}`,
        task,
        deletedAt: new Date(),
        deletionReason: reason,
        retentionUntil: new Date(Date.now() + (settings.historyRetentionMonths * 30 * 24 * 60 * 60 * 1000)),
      };
      
      history.push(historyItem);
      await this.saveTaskHistory(history);
      logStorage('addToHistory - añadido al historial exitosamente');
    } catch (error) {
      console.error('❌ Error adding to history:', error);
      logStorage('addToHistory - error', error);
    }
  }

  // Helper methods
  private static isDateOverdue(dueDate: Date): boolean {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    return dueDate < today;
  }

  private static isTaskCreatedToday(task: Task): boolean {
    const today = new Date();
    const createdDate = new Date(task.createdAt);
    return createdDate.toDateString() === today.toDateString();
  }

  private static isDueDateToday(dueDate: Date): boolean {
    const today = new Date();
    return dueDate.toDateString() === today.toDateString();
  }

  static isTaskOverdue(task: Task): boolean {
    if (!task.dueDate || task.status === 'completed') {
      return false;
    }

    // Si la tarea fue creada hoy y vence hoy, no se considera vencida
    if (this.isTaskCreatedToday(task) && this.isDueDateToday(task.dueDate)) {
      return false;
    }

    return this.isDateOverdue(task.dueDate);
  }

  // Cleanup methods
  static async cleanupExpiredTasks(): Promise<{ 
    completedMovedToHistory: number; 
    overdueMovedToHistory: number; 
    historyCleaned: number;
    overdueMarked: number;
  }> {
    try {
      logStorage('cleanupExpiredTasks - iniciando limpieza');
      
      const tasks = await this.getTasks();
      const settings = await this.getSettings();
      
      let completedMovedToHistory = 0;
      let overdueMovedToHistory = 0;
      let overdueMarked = 0;
      
      const now = new Date();
      const activeTasks: Task[] = [];
      
      for (const task of tasks) {
        // Marcar tareas vencidas
        if (task.status === 'pending' && this.isTaskOverdue(task)) {
          task.status = 'overdue';
          overdueMarked++;
        }
        
        // Mover tareas completadas expiradas al historial
        if (task.status === 'completed' && task.completedDate) {
          const daysSinceCompleted = Math.floor((now.getTime() - task.completedDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysSinceCompleted >= settings.completedTaskRetentionDays) {
            await this.addToHistory(task, 'completed_expired');
            completedMovedToHistory++;
            continue;
          }
        }
        
        // Mover tareas vencidas expiradas al historial
        if (task.status === 'overdue' && task.dueDate) {
          const daysSinceOverdue = Math.floor((now.getTime() - task.dueDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysSinceOverdue >= settings.overdueTaskRetentionDays) {
            await this.addToHistory(task, 'overdue_expired');
            overdueMovedToHistory++;
            continue;
          }
        }
        
        activeTasks.push(task);
      }
      
      // Limpiar historial expirado
      const historyCleaned = await this.cleanupHistory();
      
      // Guardar cambios
      await this.saveTasks(activeTasks);
      await this.saveSettings({ ...settings, lastCleanup: now });
      
      logStorage('cleanupExpiredTasks - limpieza completada', { 
        completedMovedToHistory, 
        overdueMovedToHistory, 
        historyCleaned,
        overdueMarked 
      });
      
      return { 
        completedMovedToHistory, 
        overdueMovedToHistory, 
        historyCleaned,
        overdueMarked 
      };
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
      logStorage('cleanupExpiredTasks - error', error);
      return { 
        completedMovedToHistory: 0, 
        overdueMovedToHistory: 0, 
        historyCleaned: 0,
        overdueMarked: 0 
      };
    }
  }

  static async cleanupHistory(): Promise<number> {
    try {
      logStorage('cleanupHistory - iniciando limpieza del historial');
      const history = await this.getTaskHistory();
      const now = new Date();
      
      const validHistory = history.filter(item => item.retentionUntil > now);
      const cleanedCount = history.length - validHistory.length;
      
      await this.saveTaskHistory(validHistory);
      logStorage('cleanupHistory - limpieza completada', { cleanedCount });
      
      return cleanedCount;
    } catch (error) {
      console.error('❌ Error cleaning history:', error);
      logStorage('cleanupHistory - error', error);
      return 0;
    }
  }

  static async shouldRunCleanup(): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      const daysSinceLastCleanup = Math.floor((new Date().getTime() - settings.lastCleanup.getTime()) / (1000 * 60 * 60 * 24));
      const shouldRun = daysSinceLastCleanup >= settings.cleanupFrequencyDays;
      logStorage('shouldRunCleanup', { daysSinceLastCleanup, shouldRun });
      return shouldRun;
    } catch (error) {
      console.error('❌ Error checking cleanup schedule:', error);
      logStorage('shouldRunCleanup - error', error);
      return false;
    }
  }
}