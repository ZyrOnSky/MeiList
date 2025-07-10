import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { X, Plus, Trash2, Calendar, Clock, Settings, Tag, AlertTriangle, CheckCircle, List } from 'lucide-react-native';
import { Task, Category, Subtask, UrgencyLevel } from '@/types/Task';
import DateTimePicker from '@react-native-community/datetimepicker';

// Función para generar IDs únicos
const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete?: (taskId: string) => void;
  categories: Category[];
  urgencyLevels: UrgencyLevel[];
  onAddCategory?: (category: Omit<Category, 'id' | 'createdAt'>) => void;
  onAddUrgencyLevel?: (urgencyLevel: Omit<UrgencyLevel, 'id' | 'createdAt'>) => void;
  editingTask?: Task;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onSave,
  onDelete,
  categories,
  urgencyLevels,
  onAddCategory,
  onAddUrgencyLevel,
  editingTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  
  // Estados para crear nuevas categorías y niveles de urgencia
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddUrgency, setShowAddUrgency] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#8B5CF6');
  const [newUrgencyName, setNewUrgencyName] = useState('');
  const [newUrgencyColor, setNewUrgencyColor] = useState('#10B981');

  // Actualizar estados cuando cambie editingTask
  useEffect(() => {
    console.log('AddTaskModal - editingTask changed:', editingTask);
    if (editingTask) {
      console.log('Loading task data for editing:', {
        title: editingTask.title,
        description: editingTask.description,
        categoryId: editingTask.categoryId,
        urgency: editingTask.urgency,
        startDate: editingTask.startDate,
        dueDate: editingTask.dueDate,
        subtasks: editingTask.subtasks?.length || 0
      });
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setSelectedCategory(editingTask.categoryId || '');
      setSelectedUrgency(editingTask.urgency);
      setStartDate(editingTask.startDate);
      setDueDate(editingTask.dueDate);
      setSubtasks(editingTask.subtasks || []);
    } else {
      console.log('Resetting form for new task');
      // Si no hay tarea para editar, usar valores por defecto
      setTitle('');
      setDescription('');
      setSelectedCategory(categories[0]?.id || '');
      setSelectedUrgency(urgencyLevels[0]?.id || 'media');
      setStartDate(undefined);
      setDueDate(undefined);
      setSubtasks([]);
    }
    setNewSubtask('');
  }, [editingTask]); // Removidas las dependencias categories y urgencyLevels

  // Inicializar valores por defecto solo cuando se abre el modal para nueva tarea
  useEffect(() => {
    if (visible && !editingTask) {
      // Solo inicializar si no hay tarea para editar y el modal está abierto
      if (!title && categories.length > 0) {
        setSelectedCategory(categories[0]?.id || '');
      }
      if (!selectedUrgency && urgencyLevels.length > 0) {
        setSelectedUrgency(urgencyLevels[0]?.id || 'media');
      }
    }
  }, [visible, editingTask, categories, urgencyLevels]);

  // Resetear formulario cuando se cierre el modal
  useEffect(() => {
    if (!visible) {
      setShowAddCategory(false);
      setShowAddUrgency(false);
      setNewCategoryName('');
      setNewCategoryColor('#8B5CF6');
      setNewUrgencyName('');
      setNewUrgencyColor('#10B981');
    }
  }, [visible]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedCategory(categories[0]?.id || '');
    setSelectedUrgency(urgencyLevels[0]?.id || 'media');
    setStartDate(undefined);
    setDueDate(undefined);
    setSubtasks([]);
    setNewSubtask('');
  };

  const handleDelete = () => {
    if (!editingTask || !onDelete) return;

    Alert.alert(
      'Eliminar Tarea',
      `¿Estás seguro de que quieres eliminar la tarea "${editingTask.title}"?\n\nEsta acción eliminará la tarea y todas sus subtareas de forma permanente.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            onDelete(editingTask.id);
            onClose();
          },
        },
      ]
    );
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título para la tarea');
      return;
    }

    // La categoría es opcional, no necesitamos validar que esté seleccionada

    if (!selectedUrgency) {
      Alert.alert('Error', 'Por favor selecciona un nivel de urgencia');
      return;
    }

    if (startDate && dueDate && startDate > dueDate) {
      Alert.alert('Error', 'La fecha de inicio no puede ser posterior a la fecha de finalización');
      return;
    }

    const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      categoryId: selectedCategory || undefined,
      urgency: selectedUrgency,
      status: editingTask?.status || 'pending',
      startDate,
      dueDate,
      completedDate: editingTask?.completedDate,
      subtasks,
    };

    console.log('Saving task data:', {
      isEditing: !!editingTask,
      taskId: editingTask?.id,
      taskData
    });

    onSave(taskData);
    resetForm();
    onClose();
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;

    const subtask: Subtask = {
      id: generateUniqueId(),
      title: newSubtask.trim(),
      completed: false,
      createdAt: new Date(),
    };

    setSubtasks(prev => [...prev, subtask]);
    setNewSubtask('');
  };

  const removeSubtask = (subtaskId: string) => {
    setSubtasks(prev => prev.filter(st => st.id !== subtaskId));
  };

  const toggleSubtask = (subtaskId: string) => {
    setSubtasks(prev => prev.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    ));
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para la categoría');
      return;
    }

    if (onAddCategory) {
      // Crear la categoría
      const newCategory = {
        name: newCategoryName.trim(),
        color: newCategoryColor,
      };
      
      onAddCategory(newCategory);
      
      // Limpiar el formulario de nueva categoría
      setNewCategoryName('');
      setNewCategoryColor('#8B5CF6');
      setShowAddCategory(false);
      
      // Seleccionar automáticamente la nueva categoría
      // Buscar la categoría recién creada en la lista actualizada
      const newlyCreatedCategory = categories.find(cat => 
        cat.name.toLowerCase() === newCategory.name.toLowerCase() &&
        cat.color === newCategory.color
      );
      
      if (newlyCreatedCategory) {
        setSelectedCategory(newlyCreatedCategory.id);
      }
    }
  };

  const handleAddUrgencyLevel = () => {
    if (!newUrgencyName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para el nivel de urgencia');
      return;
    }

    if (onAddUrgencyLevel) {
      onAddUrgencyLevel({
        name: newUrgencyName.trim(),
        color: newUrgencyColor,
        priority: urgencyLevels.length + 1,
      });
      setNewUrgencyName('');
      setNewUrgencyColor('#10B981');
      setShowAddUrgency(false);
    }
  };

  const categoryColors = [
    '#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#06B6D4', '#8B5A2B', '#9CA3AF', '#84CC16', '#F97316', '#A855F7'
  ];

  const urgencyColors = [
    '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#8B5CF6', '#EC4899',
    '#3B82F6', '#84CC16', '#F97316', '#A855F7', '#9CA3AF', '#8B5A2B'
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header mejorado */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              {editingTask ? (
                <Settings size={24} color="#8B5CF6" />
              ) : (
                <Plus size={24} color="#8B5CF6" />
              )}
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>
                {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
              </Text>
              <Text style={styles.subtitle}>
                {editingTask ? 'Modifica los detalles de la tarea' : 'Crea una nueva tarea para tu lista'}
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            {editingTask && onDelete && (
              <TouchableOpacity 
                onPress={handleDelete} 
                style={styles.deleteButton}
              >
                <Trash2 size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Información básica */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📝</Text>
              <Text style={styles.sectionTitle}>Información Básica</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Título *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="¿Qué necesitas hacer?"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Agrega detalles adicionales..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Categorización */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🏷️</Text>
              <Text style={styles.sectionTitle}>Categorización</Text>
            </View>
            
            {showAddCategory ? (
              <View style={styles.addForm}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nombre de la categoría</Text>
                  <TextInput
                    style={styles.input}
                    value={newCategoryName}
                    onChangeText={setNewCategoryName}
                    placeholder="Ej: Trabajo, Personal, Salud..."
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Color</Text>
                  <View style={styles.colorPicker}>
                    {categoryColors.map(color => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorOption,
                          { backgroundColor: color },
                          newCategoryColor === color && styles.selectedColor,
                        ]}
                        onPress={() => setNewCategoryColor(color)}
                      />
                    ))}
                  </View>
                </View>
                
                <View style={styles.addFormButtons}>
                  <TouchableOpacity 
                    style={styles.cancelAddButton}
                    onPress={() => setShowAddCategory(false)}
                  >
                    <Text style={styles.cancelAddButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.confirmAddButton}
                    onPress={handleAddCategory}
                  >
                    <Text style={styles.confirmAddButtonText}>Crear Categoría</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Categoría *</Text>
                  {onAddCategory && (
                    <TouchableOpacity 
                      style={styles.addButton}
                      onPress={() => setShowAddCategory(true)}
                    >
                      <Plus size={16} color="#8B5CF6" />
                      <Text style={styles.addButtonText}>Nueva</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.categoryContainer}>
                  {categories.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryOption,
                        { backgroundColor: category.color },
                        selectedCategory === category.id && styles.selectedCategory,
                      ]}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <Text style={styles.categoryText}>{category.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Prioridad y Urgencia */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>⚡</Text>
              <Text style={styles.sectionTitle}>Prioridad y Urgencia</Text>
            </View>
            
            {showAddUrgency ? (
              <View style={styles.addForm}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nombre del nivel</Text>
                  <TextInput
                    style={styles.input}
                    value={newUrgencyName}
                    onChangeText={setNewUrgencyName}
                    placeholder="Ej: Crítica, Normal, Baja..."
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Color</Text>
                  <View style={styles.colorPicker}>
                    {urgencyColors.map(color => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorOption,
                          { backgroundColor: color },
                          newUrgencyColor === color && styles.selectedColor,
                        ]}
                        onPress={() => setNewUrgencyColor(color)}
                      />
                    ))}
                  </View>
                </View>
                
                <View style={styles.addFormButtons}>
                  <TouchableOpacity 
                    style={styles.cancelAddButton}
                    onPress={() => setShowAddUrgency(false)}
                  >
                    <Text style={styles.cancelAddButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.confirmAddButton}
                    onPress={handleAddUrgencyLevel}
                  >
                    <Text style={styles.confirmAddButtonText}>Crear Nivel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Nivel de Urgencia</Text>
                  {onAddUrgencyLevel && (
                    <TouchableOpacity 
                      style={styles.addButton}
                      onPress={() => setShowAddUrgency(true)}
                    >
                      <Plus size={16} color="#8B5CF6" />
                      <Text style={styles.addButtonText}>Nuevo</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.urgencyContainer}>
                  {urgencyLevels.map(urgency => (
                    <TouchableOpacity
                      key={urgency.id}
                      style={[
                        styles.urgencyOption,
                        { backgroundColor: urgency.color },
                        selectedUrgency === urgency.id && styles.selectedUrgency,
                      ]}
                      onPress={() => setSelectedUrgency(urgency.id)}
                    >
                      <Text style={styles.urgencyText}>{urgency.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Fechas y Tiempo */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📅</Text>
              <Text style={styles.sectionTitle}>Fechas y Tiempo</Text>
            </View>
            
            <View style={styles.dateRow}>
              <View style={styles.dateColumn}>
                <Text style={styles.label}>Fecha de Inicio</Text>
                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Clock size={18} color="#6B7280" />
                  <Text style={styles.dateText}>
                    {startDate ? formatDate(startDate) : 'Seleccionar'}
                  </Text>
                </TouchableOpacity>
                {startDate && (
                  <TouchableOpacity 
                    style={styles.clearDateButton}
                    onPress={() => setStartDate(undefined)}
                  >
                    <Text style={styles.clearDateText}>Limpiar</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.dateColumn}>
                <Text style={styles.label}>Fecha de Finalización</Text>
                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => setShowDueDatePicker(true)}
                >
                  <Calendar size={18} color="#6B7280" />
                  <Text style={styles.dateText}>
                    {dueDate ? formatDate(dueDate) : 'Seleccionar'}
                  </Text>
                </TouchableOpacity>
                {dueDate && (
                  <TouchableOpacity 
                    style={styles.clearDateButton}
                    onPress={() => setDueDate(undefined)}
                  >
                    <Text style={styles.clearDateText}>Limpiar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Subtareas */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📋</Text>
              <Text style={styles.sectionTitle}>Subtareas</Text>
              {subtasks.length > 0 && (
                <View style={styles.subtaskCounter}>
                  <Text style={styles.subtaskCounterText}>
                    {subtasks.filter(st => st.completed).length}/{subtasks.length}
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <View style={styles.subtaskInput}>
                <TextInput
                  style={styles.subtaskTextInput}
                  value={newSubtask}
                  onChangeText={setNewSubtask}
                  placeholder="Agregar una subtarea..."
                  placeholderTextColor="#9CA3AF"
                  onSubmitEditing={addSubtask}
                />
                <TouchableOpacity onPress={addSubtask} style={styles.addSubtaskButton}>
                  <Plus size={20} color="#8B5CF6" />
                </TouchableOpacity>
              </View>
            </View>
            
            {subtasks.length > 0 && (
              <View style={styles.subtasksList}>
                {subtasks.map((subtask, index) => (
                  <View key={subtask.id} style={styles.subtaskItem}>
                    <TouchableOpacity
                      onPress={() => toggleSubtask(subtask.id)}
                      style={styles.subtaskCheckbox}
                    >
                      {subtask.completed ? (
                        <CheckCircle size={18} color="#10B981" />
                      ) : (
                        <List size={18} color="#D1D5DB" />
                      )}
                    </TouchableOpacity>
                    <Text style={[
                      styles.subtaskText,
                      subtask.completed && styles.completedSubtaskText
                    ]}>
                      {subtask.title}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeSubtask(subtask.id)}
                      style={styles.removeSubtaskButton}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer mejorado */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => {
            resetForm();
            onClose();
          }}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {editingTask ? 'Actualizar' : 'Crear'} Tarea
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Pickers */}
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(false);
              if (selectedDate) {
                setStartDate(selectedDate);
              }
            }}
          />
        )}

        {showDueDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={startDate || new Date()}
            onChange={(event, selectedDate) => {
              setShowDueDatePicker(false);
              if (selectedDate) {
                setDueDate(selectedDate);
              }
            }}
          />
        )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  subtaskCounter: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  subtaskCounterText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#1F2937',
    transform: [{ scale: 1.2 }],
  },
  addFormButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  cancelAddButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelAddButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  confirmAddButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
  },
  confirmAddButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedCategory: {
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
  urgencyContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  urgencyOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedUrgency: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  urgencyText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateColumn: {
    flex: 1,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    marginLeft: 8,
  },
  clearDateButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  clearDateText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
  subtaskInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  subtaskTextInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  addSubtaskButton: {
    padding: 16,
  },
  subtasksList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  subtaskCheckbox: {
    marginRight: 12,
  },
  subtaskText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    flex: 1,
  },
  completedSubtaskText: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  removeSubtaskButton: {
    padding: 4,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
});