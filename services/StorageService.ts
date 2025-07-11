import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Category, AppSettings, UrgencyLevel } from '@/types/Task';

const STORAGE_KEYS = {
  TASKS: 'tasks',
  CATEGORIES: 'categories',
  URGENCY_LEVELS: 'urgencyLevels',
  SETTINGS: 'settings',
  EXPIRED_TASKS: 'expiredTasks',
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

  static async deleteTask(taskId: string): Promise<void> {
    try {
      logStorage('deleteTask - eliminando', taskId);
      const tasks = await this.getTasks();
      const filteredTasks = tasks.filter(t => t.id !== taskId);
      await this.saveTasks(filteredTasks);
      logStorage('deleteTask - tarea eliminada');
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
      completedTaskExpirationDays: 30,
      overdueTaskExpirationDays: 90,
      historyRetentionMonths: 3,
      cleanupFrequencyDays: 7,
      lastCleanup: new Date(),
    };
  }

  // Expired Tasks
  static async getExpiredTasks(): Promise<Task[]> {
    try {
      logStorage('getExpiredTasks - iniciando');
      const data = await AsyncStorage.getItem(STORAGE_KEYS.EXPIRED_TASKS);
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
        logStorage('getExpiredTasks - tareas expiradas obtenidas', parsedTasks.length);
        return parsedTasks;
      }
      logStorage('getExpiredTasks - sin tareas expiradas');
      return [];
    } catch (error) {
      console.error('❌ Error getting expired tasks:', error);
      logStorage('getExpiredTasks - error', error);
      return [];
    }
  }

  static async saveExpiredTasks(tasks: Task[]): Promise<void> {
    try {
      logStorage('saveExpiredTasks - guardando', tasks.length);
      await AsyncStorage.setItem(STORAGE_KEYS.EXPIRED_TASKS, JSON.stringify(tasks));
      logStorage('saveExpiredTasks - guardado exitoso');
    } catch (error) {
      console.error('❌ Error saving expired tasks:', error);
      logStorage('saveExpiredTasks - error', error);
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
  static async cleanupExpiredTasks(): Promise<{ expiredCount: number; overdueCount: number; overdueExpiredCount: number }> {
    try {
      logStorage('cleanupExpiredTasks - iniciando limpieza');
      
      const tasks = await this.getTasks();
      const settings = await this.getSettings();
      const expiredTasks = await this.getExpiredTasks();
      
      let expiredCount = 0;
      let overdueCount = 0;
      let overdueExpiredCount = 0;
      
      const now = new Date();
      const activeTasks: Task[] = [];
      
      for (const task of tasks) {
        // Marcar tareas vencidas
        if (task.status === 'pending' && this.isTaskOverdue(task)) {
          task.status = 'overdue';
          overdueCount++;
        }
        
        // Mover tareas completadas expiradas al historial
        if (task.status === 'completed' && task.completedDate) {
          const daysSinceCompleted = Math.floor((now.getTime() - task.completedDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysSinceCompleted >= settings.completedTaskExpirationDays) {
            expiredTasks.push(task);
            expiredCount++;
            continue;
          }
        }
        
        // Mover tareas vencidas expiradas al historial
        if (task.status === 'overdue') {
          const daysSinceOverdue = Math.floor((now.getTime() - task.dueDate!.getTime()) / (1000 * 60 * 60 * 24));
          if (daysSinceOverdue >= settings.overdueTaskExpirationDays) {
            expiredTasks.push(task);
            overdueExpiredCount++;
            continue;
          }
        }
        
        activeTasks.push(task);
      }
      
      // Guardar cambios
      await this.saveTasks(activeTasks);
      await this.saveExpiredTasks(expiredTasks);
      await this.saveSettings({ ...settings, lastCleanup: now });
      
      logStorage('cleanupExpiredTasks - limpieza completada', { expiredCount, overdueCount, overdueExpiredCount });
      
      return { expiredCount, overdueCount, overdueExpiredCount };
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
      logStorage('cleanupExpiredTasks - error', error);
      return { expiredCount: 0, overdueCount: 0, overdueExpiredCount: 0 };
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