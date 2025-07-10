import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Target,
  Award,
  Activity,
  Tag,
  Settings
} from 'lucide-react-native';
import { useTasks } from '@/hooks/useTasks';
import { CategoryManagerModal } from '@/components/CategoryManagerModal';
import { UrgencyManagerModal } from '@/components/UrgencyManagerModal';
import { SettingsModal } from '@/components/SettingsModal';
import { StorageService } from '@/services/StorageService';

const { width } = Dimensions.get('window');

export default function StatisticsScreen() {
  const {
    allTasks,
    categories,
    urgencyLevels,
    settings,
    loading,
    refreshData,
    addCategory,
    updateCategory,
    deleteCategory,
    addUrgencyLevel,
    updateUrgencyLevel,
    deleteUrgencyLevel,
    updateSettings,
    runManualCleanup,
  } = useTasks();

  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showUrgencyManager, setShowUrgencyManager] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Validar que los arrays existan antes de usarlos
  const tasks = allTasks || [];
  const categoriesList = categories || [];
  const urgencyLevelsList = urgencyLevels || [];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const overdueTasks = tasks.filter(task => 
    task.status !== 'completed' && StorageService.isTaskOverdue(task)
  ).length;

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const overdueRate = totalTasks > 0 ? (overdueTasks / totalTasks) * 100 : 0;

  // Estadísticas por categoría
  const categoryStats = categoriesList.map(category => {
    const categoryTasks = tasks.filter(task => task.categoryId === category.id);
    const completedInCategory = categoryTasks.filter(task => task.status === 'completed').length;
    const categoryCompletionRate = categoryTasks.length > 0 
      ? (completedInCategory / categoryTasks.length) * 100 
      : 0;
    
    return {
      ...category,
      totalTasks: categoryTasks.length,
      completedTasks: completedInCategory,
      completionRate: categoryCompletionRate,
    };
  }).filter(stat => stat.totalTasks > 0);

  // Estadísticas por nivel de urgencia
  const urgencyStats = urgencyLevelsList.map(urgency => {
    const urgencyTasks = tasks.filter(task => task.urgency === urgency.id);
    const completedInUrgency = urgencyTasks.filter(task => task.status === 'completed').length;
    const urgencyCompletionRate = urgencyTasks.length > 0 
      ? (completedInUrgency / urgencyTasks.length) * 100 
      : 0;
    
    return {
      ...urgency,
      totalTasks: urgencyTasks.length,
      completedTasks: completedInUrgency,
      completionRate: urgencyCompletionRate,
    };
  }).filter(stat => stat.totalTasks > 0);

  // Tareas recientes (últimas 5 completadas)
  const recentCompletedTasks = tasks
    .filter(task => task.status === 'completed' && task.completedDate)
    .sort((a, b) => new Date(b.completedDate!).getTime() - new Date(a.completedDate!).getTime())
    .slice(0, 5);

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
            <BarChart3 size={28} color="#FFFFFF" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Estadísticas</Text>
            <Text style={styles.headerSubtitle}>
              Resumen de tu productividad
            </Text>
          </View>
        </View>
        
        <View style={styles.managementButtons}>
          <TouchableOpacity
            style={styles.managementButton}
            onPress={() => setShowCategoryManager(true)}
          >
            <Tag size={16} color="#FFFFFF" />
            <Text style={styles.managementButtonText}>Categorías</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.managementButton}
            onPress={() => setShowUrgencyManager(true)}
          >
            <AlertTriangle size={16} color="#FFFFFF" />
            <Text style={styles.managementButtonText}>Urgencias</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setShowSettings(true)}
          >
            <Settings size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const renderOverviewCards = () => (
    <View style={styles.overviewSection}>
      <Text style={styles.sectionTitle}>Resumen General</Text>
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.cardGradient}
          >
            <View style={styles.cardIcon}>
              <CheckCircle size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.cardNumber}>{completedTasks}</Text>
            <Text style={styles.cardLabel}>Completadas</Text>
          </LinearGradient>
        </View>

        <View style={styles.card}>
          <LinearGradient
            colors={['#F59E0B', '#D97706']}
            style={styles.cardGradient}
          >
            <View style={styles.cardIcon}>
              <Clock size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.cardNumber}>{pendingTasks}</Text>
            <Text style={styles.cardLabel}>Pendientes</Text>
          </LinearGradient>
        </View>

        <View style={styles.card}>
          <LinearGradient
            colors={['#EF4444', '#DC2626']}
            style={styles.cardGradient}
          >
            <View style={styles.cardIcon}>
              <AlertTriangle size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.cardNumber}>{overdueTasks}</Text>
            <Text style={styles.cardLabel}>Vencidas</Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  );

  const renderProgressSection = () => (
    <View style={styles.progressSection}>
      <Text style={styles.sectionTitle}>Progreso</Text>
      
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View style={styles.progressIcon}>
            <Target size={20} color="#8B5CF6" />
          </View>
          <Text style={styles.progressTitle}>Tasa de Completación</Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${completionRate}%`, backgroundColor: '#10B981' }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{completionRate.toFixed(1)}%</Text>
      </View>

      {overdueTasks > 0 && (
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View style={styles.progressIcon}>
              <AlertTriangle size={20} color="#EF4444" />
            </View>
            <Text style={styles.progressTitle}>Tareas Vencidas</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${overdueRate}%`, backgroundColor: '#EF4444' }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{overdueRate.toFixed(1)}%</Text>
        </View>
      )}
    </View>
  );

  const renderCategoryStats = () => (
    <View style={styles.categorySection}>
      <Text style={styles.sectionTitle}>Por Categoría</Text>
      {categoryStats.map((stat) => (
        <View key={stat.id} style={styles.categoryCard}>
          <View style={styles.categoryHeader}>
            <View style={[styles.categoryColor, { backgroundColor: stat.color }]} />
            <Text style={styles.categoryName}>{stat.name}</Text>
            <Text style={styles.categoryCount}>
              {stat.completedTasks}/{stat.totalTasks}
            </Text>
          </View>
          <View style={styles.categoryProgressBar}>
            <View 
              style={[
                styles.categoryProgressFill, 
                { 
                  width: `${stat.completionRate}%`, 
                  backgroundColor: stat.color 
                }
              ]} 
            />
          </View>
          <Text style={styles.categoryRate}>{stat.completionRate.toFixed(0)}%</Text>
        </View>
      ))}
    </View>
  );

  const renderUrgencyStats = () => (
    <View style={styles.urgencySection}>
      <Text style={styles.sectionTitle}>Por Urgencia</Text>
      {urgencyStats.map((stat) => (
        <View key={stat.id} style={styles.urgencyCard}>
          <View style={styles.urgencyHeader}>
            <View style={[styles.urgencyColor, { backgroundColor: stat.color }]} />
            <Text style={styles.urgencyName}>{stat.name}</Text>
            <Text style={styles.urgencyCount}>
              {stat.completedTasks}/{stat.totalTasks}
            </Text>
          </View>
          <View style={styles.urgencyProgressBar}>
            <View 
              style={[
                styles.urgencyProgressFill, 
                { 
                  width: `${stat.completionRate}%`, 
                  backgroundColor: stat.color 
                }
              ]} 
            />
          </View>
          <Text style={styles.urgencyRate}>{stat.completionRate.toFixed(0)}%</Text>
        </View>
      ))}
    </View>
  );

  const renderRecentActivity = () => (
    <View style={styles.recentSection}>
      <Text style={styles.sectionTitle}>Actividad Reciente</Text>
      {recentCompletedTasks.length > 0 ? (
        recentCompletedTasks.map((task) => (
          <View key={task.id} style={styles.recentCard}>
            <View style={styles.recentIcon}>
              <Award size={16} color="#10B981" />
            </View>
            <View style={styles.recentContent}>
              <Text style={styles.recentTitle}>{task.title}</Text>
              <Text style={styles.recentDate}>
                Completada el {task.completedDate?.toLocaleDateString('es-ES')}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyRecent}>
          <Activity size={24} color="#D1D5DB" />
          <Text style={styles.emptyRecentText}>Aún no hay actividad reciente</Text>
        </View>
      )}
    </View>
  );

  // Mostrar estado de carga
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando estadísticas...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={refreshData}
            colors={['#8B5CF6']}
            tintColor="#8B5CF6"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderOverviewCards()}
        {renderProgressSection()}
        {categoryStats.length > 0 && renderCategoryStats()}
        {urgencyStats.length > 0 && renderUrgencyStats()}
        {renderRecentActivity()}
      </ScrollView>

      <CategoryManagerModal
        visible={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
        categories={categoriesList}
        onAddCategory={addCategory}
        onUpdateCategory={updateCategory}
        onDeleteCategory={deleteCategory}
      />

      <UrgencyManagerModal
        visible={showUrgencyManager}
        onClose={() => setShowUrgencyManager(false)}
        urgencyLevels={urgencyLevelsList}
        onAddUrgencyLevel={addUrgencyLevel}
        onUpdateUrgencyLevel={updateUrgencyLevel}
        onDeleteUrgencyLevel={deleteUrgencyLevel}
      />

      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onManualCleanup={runManualCleanup}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 24,
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
  managementButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  managementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  managementButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  settingsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cardGradient: {
    padding: 16,
    alignItems: 'center',
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressIcon: {
    marginRight: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'right',
  },
  categorySection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  categoryCount: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoryProgressBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryRate: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'right',
  },
  urgencySection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  urgencyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  urgencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  urgencyColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  urgencyName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  urgencyCount: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  urgencyProgressBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  urgencyProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  urgencyRate: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'right',
  },
  recentSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  recentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recentIcon: {
    marginRight: 12,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    marginBottom: 2,
  },
  recentDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  emptyRecent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyRecentText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
});