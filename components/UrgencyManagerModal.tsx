import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { X, Plus, Edit3, Trash2, AlertTriangle } from 'lucide-react-native';
import { UrgencyLevel } from '@/types/Task';

const { width } = Dimensions.get('window');

interface UrgencyManagerModalProps {
  visible: boolean;
  onClose: () => void;
  urgencyLevels: UrgencyLevel[];
  onAddUrgencyLevel: (urgencyLevel: Omit<UrgencyLevel, 'id' | 'createdAt'>) => void;
  onUpdateUrgencyLevel: (urgencyLevelId: string, updates: Partial<UrgencyLevel>) => void;
  onDeleteUrgencyLevel: (urgencyLevelId: string) => void;
}

export const UrgencyManagerModal: React.FC<UrgencyManagerModalProps> = ({
  visible,
  onClose,
  urgencyLevels,
  onAddUrgencyLevel,
  onUpdateUrgencyLevel,
  onDeleteUrgencyLevel,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUrgency, setEditingUrgency] = useState<UrgencyLevel | null>(null);
  const [newUrgencyName, setNewUrgencyName] = useState('');
  const [newUrgencyColor, setNewUrgencyColor] = useState('#10B981');

  const predefinedColors = [
    '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#3B82F6',
    '#6366F1', '#8B5A2B', '#059669', '#DC2626', '#7C3AED', '#F97316'
  ];

  const resetForm = () => {
    setNewUrgencyName('');
    setNewUrgencyColor('#10B981');
    setEditingUrgency(null);
    setShowAddForm(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddUrgencyLevel = () => {
    if (!newUrgencyName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para el nivel de urgencia');
      return;
    }

    if (urgencyLevels.some(urgency => urgency.name.toLowerCase() === newUrgencyName.trim().toLowerCase())) {
      Alert.alert('Error', 'Ya existe un nivel de urgencia con ese nombre');
      return;
    }

    onAddUrgencyLevel({
      name: newUrgencyName.trim(),
      color: newUrgencyColor,
      priority: urgencyLevels.length + 1, // Prioridad automática
    });

    resetForm();
  };

  const handleUpdateUrgencyLevel = () => {
    if (!editingUrgency || !newUrgencyName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para el nivel de urgencia');
      return;
    }

    const otherUrgencyLevels = urgencyLevels.filter(urgency => urgency.id !== editingUrgency.id);
    if (otherUrgencyLevels.some(urgency => urgency.name.toLowerCase() === newUrgencyName.trim().toLowerCase())) {
      Alert.alert('Error', 'Ya existe un nivel de urgencia con ese nombre');
      return;
    }

    onUpdateUrgencyLevel(editingUrgency.id, {
      name: newUrgencyName.trim(),
      color: newUrgencyColor,
    });

    resetForm();
  };

  const handleDeleteUrgencyLevel = (urgencyLevel: UrgencyLevel) => {
    // Verificar si el nivel de urgencia está en uso
    // Esta validación se puede hacer en el hook useTasks

    Alert.alert(
      'Eliminar Nivel de Urgencia',
      `¿Estás seguro de que quieres eliminar el nivel "${urgencyLevel.name}"?\n\nEsta acción no se puede deshacer.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDeleteUrgencyLevel(urgencyLevel.id),
        },
      ]
    );
  };

  const startEditing = (urgencyLevel: UrgencyLevel) => {
    setEditingUrgency(urgencyLevel);
    setNewUrgencyName(urgencyLevel.name);
    setNewUrgencyColor(urgencyLevel.color);
    setShowAddForm(true);
  };

  const renderColorPicker = () => (
    <View style={styles.colorPicker}>
      <Text style={styles.colorPickerTitle}>Color:</Text>
      <View style={styles.colorGrid}>
        {predefinedColors.map((color) => (
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
  );

  const renderForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>
        {editingUrgency ? 'Editar Nivel de Urgencia' : 'Nuevo Nivel de Urgencia'}
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nombre del nivel de urgencia"
        value={newUrgencyName}
        onChangeText={setNewUrgencyName}
        maxLength={30}
      />

      {renderColorPicker()}

      <View style={styles.formButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={resetForm}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.saveButton}
          onPress={editingUrgency ? handleUpdateUrgencyLevel : handleAddUrgencyLevel}
        >
          <Text style={styles.saveButtonText}>
            {editingUrgency ? 'Actualizar' : 'Crear'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderUrgencyList = () => (
    <ScrollView style={styles.urgencyList}>
      {urgencyLevels.map((urgencyLevel) => (
        <View key={urgencyLevel.id} style={styles.urgencyItem}>
          <View style={styles.urgencyInfo}>
            <View style={[styles.urgencyColor, { backgroundColor: urgencyLevel.color }]} />
            <View style={styles.urgencyDetails}>
              <Text style={styles.urgencyName}>{urgencyLevel.name}</Text>
              <Text style={styles.priorityLabel}>Prioridad: {urgencyLevel.priority}</Text>
            </View>
          </View>
          
          <View style={styles.urgencyActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => startEditing(urgencyLevel)}
            >
              <Edit3 size={16} color="#6B7280" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteUrgencyLevel(urgencyLevel)}
            >
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <AlertTriangle size={24} color="#EF4444" />
            <Text style={styles.headerTitle}>Gestionar Urgencias</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {!showAddForm && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Nuevo Nivel de Urgencia</Text>
          </TouchableOpacity>
        )}

        {showAddForm ? renderForm() : renderUrgencyList()}
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
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginLeft: 12,
  },
  closeButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  urgencyList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  urgencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  urgencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  urgencyColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  urgencyDetails: {
    flex: 1,
  },
  urgencyName: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
  },
  priorityLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  urgencyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  formContainer: {
    padding: 20,
  },
  formTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    marginBottom: 20,
  },
  colorPicker: {
    marginBottom: 24,
  },
  colorPickerTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
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
    borderWidth: 3,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
  },
}); 