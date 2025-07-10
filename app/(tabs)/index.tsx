import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Filter, Search } from 'lucide-react-native';
import { TaskCard } from '@/components/TaskCard';
import { AddTaskModal } from '@/components/AddTaskModal';
import { FilterModal } from '@/components/FilterModal';
import { SearchBar } from '@/components/SearchBar';
import { useTasks } from '@/hooks/useTasks';
import { Task, Category, UrgencyLevel } from '@/types/Task';

export default function MyListScreen() {
  const {
    activeTasks,
    categories,
    urgencyLevels,
    loading,
    filters,
    setFilters,
    addTask,
    updateTask,
    addCategory,
    addUrgencyLevel,
    refreshData,
    deleteTask,
  } = useTasks();

  // Validar que los arrays existan antes de usarlos
  const tasks = activeTasks || [];
  const categoriesList = categories || [];
  const urgencyLevelsList = urgencyLevels || [];

  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const handleToggleComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, {
        status: task.status === 'completed' ? 'pending' : 'completed',
        completedDate: task.status === 'completed' ? undefined : new Date(),
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
    console.log('Opening task for editing:', task.title, task.id);
    setEditingTask(task);
    setShowAddModal(true);
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('Saving task from index screen:', {
      isEditing: !!editingTask,
      taskId: editingTask?.id,
      taskData
    });
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
    } else {
      await addTask(taskData);
    }
    setEditingTask(undefined);
  };

  const handleDeleteTask = async (taskId: string) => {
    console.log('Deleting task:', taskId);
    await deleteTask(taskId);
    setEditingTask(undefined);
  };

  const handleAddCategory = async (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    await addCategory(categoryData);
  };

  const handleAddUrgencyLevel = async (urgencyData: Omit<UrgencyLevel, 'id' | 'createdAt'>) => {
    await addUrgencyLevel(urgencyData);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={['#8B5CF6', '#EC4899']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Search size={28} color="#FFFFFF" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Mis Tareas</Text>
            <Text style={styles.headerSubtitle}>
              {tasks.length} {tasks.length === 1 ? 'tarea activa' : 'tareas activas'}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Plus size={48} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyTitle}>¡Aún no hay tareas!</Text>
      <Text style={styles.emptySubtitle}>
        Crea tu primera tarea para comenzar a organizar tu día
      </Text>
      <TouchableOpacity
        style={styles.createFirstTaskButton}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.createFirstTaskText}>Crear Primera Tarea</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        value={filters.searchQuery}
        onChangeText={(text) => setFilters(prev => ({ ...prev, searchQuery: text }))}
        placeholder="Buscar en mis tareas..."
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
            colors={['#8B5CF6']}
            tintColor="#8B5CF6"
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
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#8B5CF6', '#EC4899']}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Plus size={28} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

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
    fontSize: 32,
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
    marginBottom: 32,
  },
  createFirstTaskButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createFirstTaskText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});