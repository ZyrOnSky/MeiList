export interface Task {
  id: string;
  title: string;
  description?: string;
  categoryId?: string; // Opcional
  urgency: string; // Solo string para urgencias personalizadas
  status: 'pending' | 'completed' | 'overdue';
  startDate?: Date;
  dueDate?: Date;
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  subtasks: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface UrgencyLevel {
  id: string;
  name: string;
  color: string;
  priority: number; // Prioridad numérica para ordenamiento
  createdAt: Date;
}

export interface AppSettings {
  completedTaskExpirationDays: number;
  overdueTaskExpirationDays: number; // Días para eliminar tareas vencidas
  historyRetentionMonths: number;
  cleanupFrequencyDays: number; // Frecuencia de limpieza automática
  lastCleanup: Date;
}

export interface TaskFilters {
  categories: string[];
  urgency: string[];
  status: string[];
  searchQuery: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy: 'newest' | 'oldest' | 'dueDate' | 'urgency' | 'title';
}