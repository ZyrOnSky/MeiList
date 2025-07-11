import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useTaskContext } from '@/contexts/TaskContext';
import { TaskHistory } from '@/types/Task';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function HistoryScreen() {
  const { taskHistory, categories, urgencyLevels, getHistoricalStats, runManualCleanup } = useTaskContext();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'overdue' | 'manual'>('all');
  const [sortBy, setSortBy] = useState<'deletedAt' | 'createdAt' | 'title'>('deletedAt');

  const stats = getHistoricalStats();

  const filteredHistory = useMemo(() => {
    let filtered = [...taskHistory];

    // Aplicar filtro por tipo de eliminación
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(item => {
        switch (selectedFilter) {
          case 'completed':
            return item.deletionReason === 'completed_expired';
          case 'overdue':
            return item.deletionReason === 'overdue_expired';
          case 'manual':
            return item.deletionReason === 'manual_deletion';
          default:
            return true;
        }
      });
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'deletedAt':
          return b.deletedAt.getTime() - a.deletedAt.getTime();
        case 'createdAt':
          return b.task.createdAt.getTime() - a.task.createdAt.getTime();
        case 'title':
          return a.task.title.localeCompare(b.task.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [taskHistory, selectedFilter, sortBy]);

  const getDeletionReasonText = (reason: TaskHistory['deletionReason']) => {
    switch (reason) {
      case 'completed_expired':
        return 'Completada (expirada)';
      case 'overdue_expired':
        return 'Vencida (expirada)';
      case 'manual_deletion':
        return 'Eliminación manual';
      case 'cleanup':
        return 'Limpieza automática';
      default:
        return 'Desconocido';
    }
  };

  const getDeletionReasonColor = (reason: TaskHistory['deletionReason']) => {
    switch (reason) {
      case 'completed_expired':
        return '#10B981';
      case 'overdue_expired':
        return '#EF4444';
      case 'manual_deletion':
        return '#6B7280';
      case 'cleanup':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getCategoryColor = (categoryId?: string) => {
    if (!categoryId) return '#6B7280';
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#6B7280';
  };

  const getUrgencyColor = (urgency: string) => {
    const urgencyLevel = urgencyLevels.find(u => u.id === urgency);
    return urgencyLevel?.color || '#6B7280';
  };

  const handleCleanup = () => {
    const confirmMessage = Platform.OS === 'web' 
      ? '¿Estás seguro de que quieres ejecutar la limpieza manual? Esto moverá las tareas expiradas al historial.'
      : '¿Ejecutar limpieza manual?';

    if (Platform.OS === 'web') {
      if (confirm(confirmMessage)) {
        runManualCleanup();
      }
    } else {
      Alert.alert(
        'Limpieza Manual',
        '¿Estás seguro de que quieres ejecutar la limpieza manual? Esto moverá las tareas expiradas al historial.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ejecutar', onPress: runManualCleanup },
        ]
      );
    }
  };

  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header con estadísticas */}
      <View style={styles.header}>
        <Text style={styles.title}>Historial de Tareas</Text>
        <Text style={styles.subtitle}>
          {taskHistory.length} tareas en el historial
        </Text>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalHistorical}</Text>
          <Text style={styles.statLabel}>Total Histórico</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.completedHistorical}</Text>
          <Text style={styles.statLabel}>Completadas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.monthlyCompleted}</Text>
          <Text style={styles.statLabel}>Este Mes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.completionRate.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>Tasa de Éxito</Text>
        </View>
      </View>

      {/* Controles */}
      <View style={styles.controls}>
        <View style={styles.filterContainer}>
          <Text style={styles.sectionTitle}>Filtrar por:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {[
              { key: 'all', label: 'Todas' },
              { key: 'completed', label: 'Completadas' },
              { key: 'overdue', label: 'Vencidas' },
              { key: 'manual', label: 'Manual' },
            ].map(filter => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.key && styles.filterButtonActive
                ]}
                onPress={() => setSelectedFilter(filter.key as any)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedFilter === filter.key && styles.filterButtonTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.sortContainer}>
          <Text style={styles.sectionTitle}>Ordenar por:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {[
              { key: 'deletedAt', label: 'Fecha Eliminación' },
              { key: 'createdAt', label: 'Fecha Creación' },
              { key: 'title', label: 'Título' },
            ].map(sort => (
              <TouchableOpacity
                key={sort.key}
                style={[
                  styles.filterButton,
                  sortBy === sort.key && styles.filterButtonActive
                ]}
                onPress={() => setSortBy(sort.key as any)}
              >
                <Text style={[
                  styles.filterButtonText,
                  sortBy === sort.key && styles.filterButtonTextActive
                ]}>
                  {sort.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.cleanupButton} onPress={handleCleanup}>
          <Ionicons name="refresh" size={20} color="#FFFFFF" />
          <Text style={styles.cleanupButtonText}>Limpieza Manual</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de historial */}
      <View style={styles.historyList}>
        <Text style={styles.sectionTitle}>
          {filteredHistory.length} tareas encontradas
        </Text>
        
        {filteredHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="archive-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No hay tareas en el historial</Text>
            <Text style={styles.emptyStateSubtext}>
              Las tareas eliminadas aparecerán aquí
            </Text>
          </View>
        ) : (
          filteredHistory.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle}>{item.task.title}</Text>
                  <View style={styles.taskMeta}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: item.task.status === 'completed' ? '#10B981' : '#EF4444' }
                    ]}>
                      <Text style={styles.statusText}>
                        {item.task.status === 'completed' ? 'Completada' : 'Vencida'}
                      </Text>
                    </View>
                    <View style={[
                      styles.reasonBadge,
                      { backgroundColor: getDeletionReasonColor(item.deletionReason) }
                    ]}>
                      <Text style={styles.reasonText}>
                        {getDeletionReasonText(item.deletionReason)}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.taskDetails}>
                  {item.task.categoryId && (
                    <View style={[
                      styles.categoryBadge,
                      { backgroundColor: getCategoryColor(item.task.categoryId) }
                    ]}>
                      <Text style={styles.categoryText}>
                        {categories.find(c => c.id === item.task.categoryId)?.name}
                      </Text>
                    </View>
                  )}
                  <View style={[
                    styles.urgencyBadge,
                    { backgroundColor: getUrgencyColor(item.task.urgency) }
                  ]}>
                    <Text style={styles.urgencyText}>
                      {urgencyLevels.find(u => u.id === item.task.urgency)?.name || item.task.urgency}
                    </Text>
                  </View>
                </View>
              </View>

              {item.task.description && (
                <Text style={styles.taskDescription} numberOfLines={2}>
                  {item.task.description}
                </Text>
              )}

              <View style={styles.taskDates}>
                <View style={styles.dateItem}>
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text style={styles.dateText}>
                    Creada: {formatDate(item.task.createdAt)}
                  </Text>
                </View>
                {item.task.completedDate && (
                  <View style={styles.dateItem}>
                    <Ionicons name="checkmark-circle-outline" size={16} color="#10B981" />
                    <Text style={styles.dateText}>
                      Completada: {formatDate(item.task.completedDate)}
                    </Text>
                  </View>
                )}
                <View style={styles.dateItem}>
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  <Text style={styles.dateText}>
                    Eliminada: {formatDate(item.deletedAt)}
                  </Text>
                </View>
              </View>

              {item.task.subtasks.length > 0 && (
                <View style={styles.subtasksInfo}>
                  <Text style={styles.subtasksText}>
                    {item.task.subtasks.filter(s => s.completed).length} de {item.task.subtasks.length} subtareas completadas
                  </Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  controls: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  filterContainer: {
    marginBottom: 16,
  },
  sortContainer: {
    marginBottom: 16,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  cleanupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  cleanupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  historyList: {
    padding: 20,
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  reasonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reasonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  taskDetails: {
    alignItems: 'flex-end',
    gap: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  taskDates: {
    gap: 6,
    marginBottom: 8,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  subtasksInfo: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  subtasksText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
}); 