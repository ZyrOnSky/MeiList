import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { CircleCheck as CheckCircle, Circle, Calendar, Clock, TriangleAlert as AlertTriangle, ChevronDown, ChevronRight, MoreHorizontal, Trash2 } from 'lucide-react-native';
import { Task, Category, UrgencyLevel } from '@/types/Task';
import { StorageService } from '@/services/StorageService';

const { width } = Dimensions.get('window');

interface TaskCardProps {
  task: Task;
  categories: Category[];
  urgencyLevels: UrgencyLevel[];
  onToggleComplete: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onPress: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  categories, 
  urgencyLevels,
  onToggleComplete, 
  onToggleSubtask,
  onPress,
  onDelete,
}) => {
  const [showSubtasks, setShowSubtasks] = React.useState(true); // Mostrar subtareas por defecto
  const category = categories.find(c => c.id === task.categoryId);
  const urgencyLevel = urgencyLevels.find(u => u.id === task.urgency);
  const isOverdue = task.status !== 'completed' && StorageService.isTaskOverdue(task);
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const totalSubtasks = task.subtasks.length;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const getUrgencyColor = (urgencyId: string) => {
    const urgency = urgencyLevels.find(u => u.id === urgencyId);
    if (urgency) return urgency.color;
    
    // Fallback para urgencias por defecto
    switch (urgencyId) {
      case 'alta': return '#EF4444';
      case 'media': return '#F59E0B';
      case 'baja': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getUrgencyLabel = (urgencyId: string) => {
    const urgency = urgencyLevels.find(u => u.id === urgencyId);
    if (urgency) return urgency.name;
    
    // Fallback para urgencias por defecto
    switch (urgencyId) {
      case 'alta': return 'Alta';
      case 'media': return 'Media';
      case 'baja': return 'Baja';
      default: return urgencyId;
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date | undefined) => {
    if (!date) return '';
    // Solo mostrar hora si no es 00:00 (medianoche)
    const hours = date.getHours();
    const minutes = date.getMinutes();
    if (hours === 0 && minutes === 0) {
      return '';
    }
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = () => {
    if (task.status === 'completed') return '#10B981';
    if (isOverdue) return '#EF4444';
    return '#6B7280';
  };

  const getStatusText = () => {
    if (task.status === 'completed') return 'Completada';
    if (isOverdue) return 'Vencida';
    return 'Pendiente';
  };

  const handleDelete = () => {
    if (!onDelete) return;

    // Para web, usar confirm nativo
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        `¿Estás seguro de que quieres eliminar la tarea "${task.title}"?\n\nEsta acción eliminará la tarea y todas sus subtareas de forma permanente.`
      );
      if (confirmed) {
        onDelete(task.id);
      }
    } else {
      // Para móvil, usar Alert nativo
      Alert.alert(
        'Eliminar Tarea',
        `¿Estás seguro de que quieres eliminar la tarea "${task.title}"?\n\nEsta acción eliminará la tarea y todas sus subtareas de forma permanente.`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => onDelete(task.id),
          },
        ]
      );
    }
  };

  return (
    <View style={[
      styles.container,
      isOverdue && styles.overdueContainer,
      task.status === 'completed' && styles.completedContainer,
    ]}>
      {/* Header de la tarea principal */}
      <TouchableOpacity
        style={styles.mainTaskHeader}
        onPress={() => onPress(task)}
        activeOpacity={0.7}
      >
        <View style={styles.mainTaskContent}>
          <TouchableOpacity 
            onPress={() => onToggleComplete(task.id)}
            style={styles.checkButton}
          >
            {task.status === 'completed' ? (
              <CheckCircle size={24} color="#10B981" />
            ) : (
              <Circle size={24} color={getStatusColor()} />
            )}
          </TouchableOpacity>
          
          <View style={styles.taskInfo}>
            <Text style={[
              styles.mainTaskTitle,
              task.status === 'completed' && styles.completedTitle,
            ]}>
              {task.title}
            </Text>
            
            {task.description && (
              <Text style={styles.description} numberOfLines={2}>
                {task.description}
              </Text>
            )}
            
            <View style={styles.taskMeta}>
              <View style={styles.leftMeta}>
                {category && (
                  <View style={[styles.categoryTag, { backgroundColor: category.color }]}>
                    <Text style={styles.categoryText}>{category.name}</Text>
                  </View>
                )}
                
                <View style={[styles.urgencyTag, { backgroundColor: getUrgencyColor(task.urgency) }]}>
                  <Text style={styles.urgencyText}>{getUrgencyLabel(task.urgency)}</Text>
                </View>

                <View style={[styles.statusTag, { backgroundColor: getStatusColor() + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor() }]}>
                    {getStatusText()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.rightMeta}>
                {task.dueDate && (
                  <View style={styles.dateContainer}>
                    {isOverdue ? (
                      <AlertTriangle size={14} color="#EF4444" />
                    ) : (
                      <Calendar size={14} color="#6B7280" />
                    )}
                    <Text style={[
                      styles.dateText,
                      isOverdue && styles.overdueText,
                    ]}>
                      {formatDate(task.dueDate)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          {/* Botón de expandir/contraer subtareas */}
          {totalSubtasks > 0 && (
            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => setShowSubtasks(!showSubtasks)}
            >
              {showSubtasks ? (
                <ChevronDown size={20} color="#6B7280" />
              ) : (
                <ChevronRight size={20} color="#6B7280" />
              )}
            </TouchableOpacity>
          )}

          {/* Botón de eliminación rápida */}
          {onDelete && (
            <TouchableOpacity
              style={styles.quickDeleteButton}
              onPress={handleDelete}
            >
              <Trash2 size={18} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      {/* Barra de progreso de subtareas */}
      {totalSubtasks > 0 && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              Subtareas: {completedSubtasks}/{totalSubtasks}
            </Text>
            <Text style={styles.progressPercentage}>
              {progress.toFixed(0)}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progress}%`, backgroundColor: category?.color || '#8B5CF6' }
              ]} 
            />
          </View>
        </View>
      )}

      {/* Lista de subtareas */}
      {showSubtasks && totalSubtasks > 0 && (
        <View style={styles.subtasksContainer}>
          {task.subtasks.map((subtask, index) => (
            <TouchableOpacity
              key={subtask.id}
              style={[
                styles.subtaskItem,
                index === task.subtasks.length - 1 && styles.lastSubtaskItem
              ]}
              onPress={() => onToggleSubtask(task.id, subtask.id)}
              activeOpacity={0.7}
            >
              <View style={styles.subtaskContent}>
                <TouchableOpacity 
                  onPress={() => onToggleSubtask(task.id, subtask.id)}
                  style={styles.subtaskCheckbox}
                >
                  {subtask.completed ? (
                    <CheckCircle size={18} color="#10B981" />
                  ) : (
                    <Circle size={18} color="#D1D5DB" />
                  )}
                </TouchableOpacity>
                
                <Text style={[
                  styles.subtaskText,
                  subtask.completed && styles.completedSubtaskText
                ]}>
                  {subtask.title}
                </Text>
              </View>
              
              {subtask.completed && (
                <View style={styles.completedIndicator}>
                  <Text style={styles.completedIndicatorText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Información adicional */}
      <View style={styles.additionalInfo}>
        <View style={styles.infoRow}>
          {task.startDate && (
            <View style={styles.infoItem}>
              <Clock size={12} color="#6B7280" />
              <Text style={styles.infoText}>
                Inicio: {formatDate(task.startDate)}
                {formatTime(task.startDate) && ` ${formatTime(task.startDate)}`}
              </Text>
            </View>
          )}
          
          {task.completedDate && (
            <View style={styles.infoItem}>
              <CheckCircle size={12} color="#10B981" />
              <Text style={styles.infoText}>
                Completada: {formatDate(task.completedDate)}
                {formatTime(task.completedDate) && ` ${formatTime(task.completedDate)}`}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.taskDates}>
          <Text style={styles.dateLabel}>
            Creada: {task.createdAt ? formatDate(task.createdAt) : 'N/A'}
          </Text>
          {task.updatedAt && task.createdAt && task.updatedAt.getTime() !== task.createdAt.getTime() && (
            <Text style={styles.dateLabel}>
              Actualizada: {formatDate(task.updatedAt)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  overdueContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  completedContainer: {
    opacity: 0.8,
    backgroundColor: '#F9FAFB',
  },
  mainTaskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  mainTaskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkButton: {
    marginRight: 12,
    marginTop: 2,
  },
  taskInfo: {
    flex: 1,
  },
  mainTaskTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 24,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  leftMeta: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  rightMeta: {
    alignItems: 'flex-end',
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  urgencyTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  overdueText: {
    color: '#EF4444',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expandButton: {
    padding: 8,
  },
  quickDeleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  progressSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  progressPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  subtasksContainer: {
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  lastSubtaskItem: {
    borderBottomWidth: 0,
  },
  subtaskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtaskCheckbox: {
    marginRight: 12,
  },
  subtaskText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    flex: 1,
    lineHeight: 20,
  },
  completedSubtaskText: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  completedIndicator: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedIndicatorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  additionalInfo: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  taskDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
});