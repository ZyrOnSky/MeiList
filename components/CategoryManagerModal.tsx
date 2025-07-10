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
import { X, Plus, Edit3, Trash2, Tag } from 'lucide-react-native';
import { Category } from '@/types/Task';

const { width } = Dimensions.get('window');

interface CategoryManagerModalProps {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void;
  onUpdateCategory: (categoryId: string, updates: Partial<Category>) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  visible,
  onClose,
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#8B5CF6');

  const predefinedColors = [
    // Colores vibrantes y modernos
    '#8B5CF6', // Violeta
    '#EC4899', // Rosa
    '#3B82F6', // Azul
    '#10B981', // Verde esmeralda
    '#F59E0B', // Ámbar
    '#EF4444', // Rojo
    '#06B6D4', // Cian
    '#84CC16', // Verde lima
    '#F97316', // Naranja
    '#7C2D12', // Vino
    '#14B8A6', // Verde azulado
    '#F43F5E', // Rosa coral
    '#6366F1', // Índigo
    '#22C55E', // Verde
    '#EAB308', // Amarillo
    '#6B7280', // Gris
    '#0EA5E9', // Azul cielo
    '#8B5A2B'  // Marrón
  ];

  const resetForm = () => {
    setNewCategoryName('');
    setNewCategoryColor('#8B5CF6');
    setEditingCategory(null);
    setShowAddForm(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para la categoría');
      return;
    }

    if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      Alert.alert('Error', 'Ya existe una categoría con ese nombre');
      return;
    }

    onAddCategory({
      name: newCategoryName.trim(),
      color: newCategoryColor,
    });

    resetForm();
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !newCategoryName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para la categoría');
      return;
    }

    const otherCategories = categories.filter(cat => cat.id !== editingCategory.id);
    if (otherCategories.some(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      Alert.alert('Error', 'Ya existe una categoría con ese nombre');
      return;
    }

    onUpdateCategory(editingCategory.id, {
      name: newCategoryName.trim(),
      color: newCategoryColor,
    });

    resetForm();
  };

  const handleDeleteCategory = (category: Category) => {
    // Verificar si la categoría está en uso
    // Esta validación se puede hacer en el hook useTasks

    Alert.alert(
      'Eliminar Categoría',
      `¿Estás seguro de que quieres eliminar la categoría "${category.name}"?\n\nEsta acción no se puede deshacer.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDeleteCategory(category.id),
        },
      ]
    );
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryColor(category.color);
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
              newCategoryColor === color && styles.selectedColor,
            ]}
            onPress={() => setNewCategoryColor(color)}
          />
        ))}
      </View>
    </View>
  );

  const renderForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>
        {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nombre de la categoría"
        value={newCategoryName}
        onChangeText={setNewCategoryName}
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
          onPress={editingCategory ? handleUpdateCategory : handleAddCategory}
        >
          <Text style={styles.saveButtonText}>
            {editingCategory ? 'Actualizar' : 'Crear'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategoryList = () => (
    <ScrollView style={styles.categoryList}>
      {categories.map((category) => (
        <View key={category.id} style={styles.categoryItem}>
          <View style={styles.categoryInfo}>
            <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
            <View style={styles.categoryDetails}>
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
          </View>
          
          <View style={styles.categoryActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => startEditing(category)}
            >
              <Edit3 size={16} color="#6B7280" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteCategory(category)}
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
            <Tag size={24} color="#8B5CF6" />
            <Text style={styles.headerTitle}>Gestionar Categorías</Text>
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
            <Text style={styles.addButtonText}>Nueva Categoría</Text>
          </TouchableOpacity>
        )}

        {showAddForm ? renderForm() : renderCategoryList()}
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
    backgroundColor: '#8B5CF6',
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
  categoryList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  categoryItem: {
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
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
  },

  categoryActions: {
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
    backgroundColor: '#8B5CF6',
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