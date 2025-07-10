import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Category, AppSettings, UrgencyLevel } from '@/types/Task';

const STORAGE_KEYS = {
  TASKS: 'tasks',
  CATEGORIES: 'categories',
  URGENCY_LEVELS: 'urgencyLevels',
  SETTINGS: 'settings',
  EXPIRED_TASKS: 'expiredTasks',
};

export class StorageService {
  // Tasks
  static async getTasks(): Promise<Task[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      if (data) {
        const tasks = JSON.parse(data);
        return tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          startDate: task.startDate ? new Date(task.startDate) : undefined,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          completedDate: task.completedDate ? new Date(task.completedDate) : undefined,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  }

  static async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  static async addTask(task: Task): Promise<void> {
    const tasks = await this.getTasks();
    tasks.push(task);
    await this.saveTasks(tasks);
  }

  static async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    console.log('StorageService: Updating task', taskId, 'with updates:', updates);
    const tasks = await this.getTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      const updatedTask = { ...tasks[index], ...updates, updatedAt: new Date() };
      tasks[index] = updatedTask;
      console.log('StorageService: Task updated successfully:', updatedTask.status);
      await this.saveTasks(tasks);
    } else {
      console.log('StorageService: Task not found:', taskId);
    }
  }

  static async deleteTask(taskId: string): Promise<void> {
    const tasks = await this.getTasks();
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    await this.saveTasks(filteredTasks);
  }

  // Categories
  static async getCategories(): Promise<Category[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (data) {
        const categories = JSON.parse(data);
        return categories.map((cat: any) => ({
          ...cat,
          createdAt: new Date(cat.createdAt),
        }));
      }
      return this.getDefaultCategories();
    } catch (error) {
      console.error('Error getting categories:', error);
      return this.getDefaultCategories();
    }
  }

  static async saveCategories(categories: Category[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }

  static async addCategory(category: Category): Promise<void> {
    const categories = await this.getCategories();
    categories.push(category);
    await this.saveCategories(categories);
  }

  static async updateCategory(categoryId: string, updates: Partial<Category>): Promise<void> {
    const categories = await this.getCategories();
    const index = categories.findIndex(c => c.id === categoryId);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates };
      await this.saveCategories(categories);
    }
  }

  static async deleteCategory(categoryId: string): Promise<void> {
    const categories = await this.getCategories();
    const filteredCategories = categories.filter(c => c.id !== categoryId);
    await this.saveCategories(filteredCategories);
  }

  static getDefaultCategories(): Category[] {
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
      const data = await AsyncStorage.getItem(STORAGE_KEYS.URGENCY_LEVELS);
      if (data) {
        const urgencyLevels = JSON.parse(data);
        return urgencyLevels.map((level: any) => ({
          ...level,
          createdAt: new Date(level.createdAt),
        }));
      }
      return this.getDefaultUrgencyLevels();
    } catch (error) {
      console.error('Error getting urgency levels:', error);
      return this.getDefaultUrgencyLevels();
    }
  }

  static async saveUrgencyLevels(urgencyLevels: UrgencyLevel[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.URGENCY_LEVELS, JSON.stringify(urgencyLevels));
    } catch (error) {
      console.error('Error saving urgency levels:', error);
    }
  }

  static async addUrgencyLevel(urgencyLevel: UrgencyLevel): Promise<void> {
    const urgencyLevels = await this.getUrgencyLevels();
    urgencyLevels.push(urgencyLevel);
    await this.saveUrgencyLevels(urgencyLevels);
  }

  static async updateUrgencyLevel(urgencyLevelId: string, updates: Partial<UrgencyLevel>): Promise<void> {
    const urgencyLevels = await this.getUrgencyLevels();
    const index = urgencyLevels.findIndex(u => u.id === urgencyLevelId);
    if (index !== -1) {
      urgencyLevels[index] = { ...urgencyLevels[index], ...updates };
      await this.saveUrgencyLevels(urgencyLevels);
    }
  }

  static async deleteUrgencyLevel(urgencyLevelId: string): Promise<void> {
    const urgencyLevels = await this.getUrgencyLevels();
    const filteredUrgencyLevels = urgencyLevels.filter(u => u.id !== urgencyLevelId);
    await this.saveUrgencyLevels(filteredUrgencyLevels);
  }

  static getDefaultUrgencyLevels(): UrgencyLevel[] {
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
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        const settings = JSON.parse(data);
        return {
          ...settings,
          lastCleanup: new Date(settings.lastCleanup),
        };
      }
      return {
        completedTaskExpirationDays: 30,
        overdueTaskExpirationDays: 90, // Por defecto 90 días para tareas vencidas
        historyRetentionMonths: 3,
        cleanupFrequencyDays: 7, // Por defecto cada 7 días
        lastCleanup: new Date(),
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        completedTaskExpirationDays: 30,
        overdueTaskExpirationDays: 90, // Por defecto 90 días para tareas vencidas
        historyRetentionMonths: 3,
        cleanupFrequencyDays: 7, // Por defecto cada 7 días
        lastCleanup: new Date(),
      };
    }
  }

  static async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  // Expired tasks
  static async getExpiredTasks(): Promise<Task[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.EXPIRED_TASKS);
      if (data) {
        const tasks = JSON.parse(data);
        return tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          startDate: task.startDate ? new Date(task.startDate) : undefined,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          completedDate: task.completedDate ? new Date(task.completedDate) : undefined,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting expired tasks:', error);
      return [];
    }
  }

  static async saveExpiredTasks(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EXPIRED_TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving expired tasks:', error);
    }
  }

  // Helper function to compare dates by day (ignoring time)
  private static isDateOverdue(dueDate: Date): boolean {
    const now = new Date();
    const dueDay = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Una tarea está vencida si su fecha de vencimiento es anterior a hoy
    return dueDay < today;
  }

  // Helper function to check if task was created today
  private static isTaskCreatedToday(task: Task): boolean {
    if (!task.createdAt) return false;
    
    const now = new Date();
    const createdDay = new Date(task.createdAt.getFullYear(), task.createdAt.getMonth(), task.createdAt.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return createdDay.getTime() === today.getTime();
  }

  // Helper function to check if due date is today
  private static isDueDateToday(dueDate: Date): boolean {
    const now = new Date();
    const dueDay = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return dueDay.getTime() === today.getTime();
  }

  // Public helper function to check if a task is overdue (for use in components)
  static isTaskOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    
    // Caso especial: Tarea creada hoy con fecha de vencimiento hoy
    if (task.createdAt) {
      const now = new Date();
      const createdDay = new Date(task.createdAt.getFullYear(), task.createdAt.getMonth(), task.createdAt.getDate());
      const dueDay = new Date(task.dueDate.getFullYear(), task.dueDate.getMonth(), task.dueDate.getDate());
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (createdDay.getTime() === today.getTime() && dueDay.getTime() === today.getTime()) {
        return false; // No mostrar como vencida si fue creada hoy y vence hoy
      }
    }
    
    // Comparar solo días (ignorar horas/minutos)
    return this.isDateOverdue(task.dueDate);
  }

  // Cleanup expired tasks
  static async cleanupExpiredTasks(): Promise<{ expiredCount: number; overdueCount: number; overdueExpiredCount: number }> {
    const tasks = await this.getTasks();
    const expiredTasks = await this.getExpiredTasks();
    const settings = await this.getSettings();
    
    const now = new Date();
    let expiredCount = 0;
    let overdueCount = 0;
    let overdueExpiredCount = 0;

    // Marcar tareas vencidas automáticamente con lógica inteligente
    let updatedTasks = tasks.map(task => {
      if (task.status === 'pending' && task.dueDate) {
        // Caso especial: Tarea creada hoy con fecha de vencimiento hoy
        if (this.isTaskCreatedToday(task) && this.isDueDateToday(task.dueDate)) {
          // No marcar como vencida si fue creada hoy y vence hoy
          return task;
        }
        
        // Verificar si está vencida (comparando solo días)
        if (this.isDateOverdue(task.dueDate)) {
          overdueCount++;
          return { ...task, status: 'overdue' as const };
        }
      }
      return task;
    });

    // Limpiar tareas vencidas expiradas
    if (settings.overdueTaskExpirationDays > 0) {
      const overdueExpirationDate = new Date(now.getTime() - settings.overdueTaskExpirationDays * 24 * 60 * 60 * 1000);
      
      const overdueTasksToExpire = updatedTasks.filter(task => 
        task.status === 'overdue' && 
        task.dueDate && 
        task.dueDate < overdueExpirationDate
      );

      if (overdueTasksToExpire.length > 0) {
        overdueExpiredCount = overdueTasksToExpire.length;
        updatedTasks = updatedTasks.filter(task => 
          !(task.status === 'overdue' && 
            task.dueDate && 
            task.dueDate < overdueExpirationDate)
        );
        
        await this.saveExpiredTasks([...expiredTasks, ...overdueTasksToExpire]);
        console.log(`Overdue cleanup: ${overdueExpiredCount} overdue tasks expired and moved to history`);
      }
    }

    // Limpiar tareas completadas expiradas
    if (settings.completedTaskExpirationDays > 0) {
      const completedExpirationDate = new Date(now.getTime() - settings.completedTaskExpirationDays * 24 * 60 * 60 * 1000);
      
      const completedTasksToExpire = updatedTasks.filter(task => 
        task.status === 'completed' && 
        task.completedDate && 
        task.completedDate < completedExpirationDate
      );

      if (completedTasksToExpire.length > 0) {
        expiredCount = completedTasksToExpire.length;
        updatedTasks = updatedTasks.filter(task => 
          !(task.status === 'completed' && 
            task.completedDate && 
            task.completedDate < completedExpirationDate)
        );
        
        await this.saveExpiredTasks([...expiredTasks, ...completedTasksToExpire]);
        console.log(`Completed cleanup: ${expiredCount} completed tasks expired and moved to history`);
      }
    }

    // Guardar tareas actualizadas
    if (overdueCount > 0 || expiredCount > 0 || overdueExpiredCount > 0) {
      await this.saveTasks(updatedTasks);
      
      // Actualizar configuración
      await this.saveSettings({
        ...settings,
        lastCleanup: now,
      });
    }

    console.log(`Cleanup completed: ${expiredCount} completed tasks, ${overdueCount} overdue tasks marked, ${overdueExpiredCount} overdue tasks expired`);
    return { expiredCount, overdueCount, overdueExpiredCount };
  }

  // Check if cleanup is needed
  static async shouldRunCleanup(): Promise<boolean> {
    const settings = await this.getSettings();
    const now = new Date();
    const daysSinceLastCleanup = (now.getTime() - settings.lastCleanup.getTime()) / (1000 * 60 * 60 * 24);
    
    // Ejecutar limpieza según la frecuencia configurada o si nunca se ha ejecutado
    return daysSinceLastCleanup >= settings.cleanupFrequencyDays || settings.lastCleanup.getTime() === 0;
  }
}