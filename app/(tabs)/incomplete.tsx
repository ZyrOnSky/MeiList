import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, AlertTriangle, Filter } from 'lucide-react-native';
import { TaskCard } from '@/components/TaskCard';
import { AddTaskModal } from '@/components/AddTaskModal';
import { FilterModal } from '@/components/FilterModal';
import { SearchBar } from '@/components/SearchBar';
import { useTasks } from '@/hooks/useTasks';
import { Task, Category, UrgencyLevel } from '@/types/Task';
import { StorageService } from '@/services/StorageService';

export default function IncompleteScreen() {
  const {
    incompleteTasks,
    categories,
    urgencyLevels,
    loading,
    filters,
    setFilters,
    updateTask,
    deleteTask,
    addCategory,
    addUrgencyLevel,
    refreshData,
  } = useTasks();

  // Validar que los arrays existan antes de usarlos
  const tasks = incompleteTasks || [];
  const categoriesList = categories || [];
  const urgencyLevelsList = urgencyLevels || [];

  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | undefined>();
  
  const handleToggleComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, {
        status: 'completed',
        completedDate: new Date(),
      });
    }
  };

  const handleToggleSubtask = async (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updatedSubtasks = task.subtasks.map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      await updateTask(taskId, { subtasks: updatedSubtasks });
    }
  };
  
  const handleTaskPress = (task: Task) => {
    setEditingTask(task);
    setShowAddModal(true);
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
    }
    setEditingTask(undefined);
  };

  const handleDeleteTask = async (taskId: string) => {
    console.log('Deleting incomplete task:', taskId);
    await deleteTask(taskId);
    setEditingTask(undefined);
  };

  const handleAddCategory = async (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory = await addCategory(categoryData);
    // La nueva categoría se seleccionará automáticamente en el modal
    console.log('Nueva categoría creada:', newCategory.name);
  };

  const handleAddUrgencyLevel = async (urgencyData: Omit<UrgencyLevel, 'id' | 'createdAt'>) => {
    await addUrgencyLevel(urgencyData);
  };

  const overdueTasks = tasks.filter(task => StorageService.isTaskOverdue(task));

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={['#F59E0B', '#D97706']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Clock size={28} color="#FFFFFF" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Tareas Pendientes</Text>
            <Text style={styles.headerSubtitle}>
              {tasks.length} {tasks.length === 1 ? 'tarea pendiente' : 'tareas pendientes'}
            </Text>
          </View>
        </View>
      </LinearGradient>
      
      {overdueTasks.length > 0 && (
        <View style={styles.overdueCard}>
          <AlertTriangle size={24} color="#EF4444" />
          <View style={styles.overdueText}>
            <Text style={styles.overdueTitle}>¡Atención!</Text>
            <Text style={styles.overdueSubtitle}>
              {overdueTasks.length} {overdueTasks.length === 1 ? 'tarea vencida' : 'tareas vencidas'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Clock size={48} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyTitle}>¡No hay tareas pendientes!</Text>
      <Text style={styles.emptySubtitle}>
        ¡Excelente! Has completado todas tus tareas pendientes
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        value={filters.searchQuery}
        onChangeText={(text) => setFilters(prev => ({ ...prev, searchQuery: text }))}
        placeholder="Buscar tareas pendientes..."
        showFilterButton={true}
        onFilterPress={() => setShowFilterModal(true)}
      />
      
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            categories={categoriesList}
            urgencyLevels={urgencyLevelsList}
            onToggleComplete={handleToggleComplete}
            onToggleSubtask={handleToggleSubtask}
            onPress={handleTaskPress}
            onDelete={handleDeleteTask}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={refreshData}
            colors={['#F59E0B']}
            tintColor="#F59E0B"
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={setFilters}
        categories={categoriesList}
        urgencyLevels={urgencyLevelsList}
      />

      <AddTaskModal
        visible={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingTask(undefined);
        }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        categories={categoriesList}
        urgencyLevels={urgencyLevelsList}
        onAddCategory={handleAddCategory}
        onAddUrgencyLevel={handleAddUrgencyLevel}
        editingTask={editingTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContent: {
    paddingBottom: 100,
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  overdueCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  overdueText: {
    marginLeft: 12,
    flex: 1,
  },
  overdueTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#DC2626',
    marginBottom: 2,
  },
  overdueSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});