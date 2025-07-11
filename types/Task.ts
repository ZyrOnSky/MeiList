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

export interface TaskHistory {
  id: string;
  task: Task;
  deletedAt: Date;
  deletionReason: 'completed_expired' | 'overdue_expired' | 'manual_deletion' | 'cleanup';
  retentionUntil: Date; // Fecha hasta la cual se mantiene en historial
}

export interface AppSettings {
  // Retención de tareas activas
  completedTaskRetentionDays: number; // Días para mantener tareas completadas en lista activa
  overdueTaskRetentionDays: number; // Días para mantener tareas vencidas en lista activa
  
  // Historial
  historyRetentionMonths: number; // Meses para mantener en historial
  historyCleanupFrequencyDays: number; // Frecuencia de limpieza del historial
  
  // Limpieza general
  cleanupFrequencyDays: number; // Frecuencia de limpieza automática
  lastCleanup: Date;
  lastHistoryCleanup: Date;
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