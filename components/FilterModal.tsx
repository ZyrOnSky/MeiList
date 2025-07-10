import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { X, Filter } from 'lucide-react-native';
import { TaskFilters, Category, UrgencyLevel } from '@/types/Task';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: TaskFilters;
  onApplyFilters: (filters: TaskFilters) => void;
  categories: Category[];
  urgencyLevels: UrgencyLevel[];
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApplyFilters,
  categories,
  urgencyLevels,
}) => {
  const [localFilters, setLocalFilters] = useState<TaskFilters>(filters);

  const statusOptions = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'completed', label: 'Completada' },
    { value: 'overdue', label: 'Vencida' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Más reciente' },
    { value: 'oldest', label: 'Más antigua' },
    { value: 'dueDate', label: 'Fecha de vencimiento' },
    { value: 'urgency', label: 'Urgencia' },
    { value: 'title', label: 'Título' },
  ];

  const toggleCategory = (categoryId: string) => {
    setLocalFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const toggleUrgency = (urgencyId: string) => {
    setLocalFilters(prev => ({
      ...prev,
      urgency: prev.urgency.includes(urgencyId)
        ? prev.urgency.filter(u => u !== urgencyId)
        : [...prev.urgency, urgencyId],
    }));
  };

  const toggleStatus = (status: string) => {
    setLocalFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status],
    }));
  };

  const clearFilters = () => {
    setLocalFilters({
      categories: [],
      urgency: [],
      status: [],
      searchQuery: '',
      sortBy: 'newest',
    });
  };

  const applyFilters = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filtros</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categorías</Text>
            <View style={styles.optionsContainer}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryOption,
                    { backgroundColor: category.color },
                    localFilters.categories.includes(category.id) && styles.selectedOption,
                  ]}
                  onPress={() => toggleCategory(category.id)}
                >
                  <Text style={styles.categoryText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Urgency */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Urgencia</Text>
            <View style={styles.optionsContainer}>
              {urgencyLevels.map(urgency => (
                <TouchableOpacity
                  key={urgency.id}
                  style={[
                    styles.urgencyOption,
                    { backgroundColor: urgency.color },
                    localFilters.urgency.includes(urgency.id) && styles.selectedOption,
                  ]}
                  onPress={() => toggleUrgency(urgency.id)}
                >
                  <Text style={styles.urgencyText}>{urgency.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estado</Text>
            <View style={styles.optionsContainer}>
              {statusOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.statusOption,
                    localFilters.status.includes(option.value) && styles.selectedStatusOption,
                  ]}
                  onPress={() => toggleStatus(option.value)}
                >
                  <Text style={[
                    styles.statusText,
                    localFilters.status.includes(option.value) && styles.selectedStatusText,
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sort By */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ordenar por</Text>
            <View style={styles.sortContainer}>
              {sortOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.sortOption,
                    localFilters.sortBy === option.value && styles.selectedSortOption,
                  ]}
                  onPress={() => setLocalFilters(prev => ({ ...prev, sortBy: option.value as any }))}
                >
                  <Text style={[
                    styles.sortText,
                    localFilters.sortBy === option.value && styles.selectedSortText,
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
            <Text style={styles.applyButtonText}>Aplicar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  urgencyOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedOption: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  urgencyText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  statusOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedStatusOption: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  selectedStatusText: {
    color: '#FFFFFF',
  },
  sortContainer: {
    gap: 8,
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedSortOption: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  sortText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  selectedSortText: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#6B7280',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
});