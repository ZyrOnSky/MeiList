import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { X, Trash2, Clock, Settings, Info, AlertTriangle } from 'lucide-react-native';
import { AppSettings } from '@/types/Task';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  settings: AppSettings | null;
  onUpdateSettings: (settings: AppSettings) => void;
  onManualCleanup: () => Promise<{ 
    completedMovedToHistory: number; 
    overdueMovedToHistory: number; 
    historyCleaned: number;
    overdueMarked: number;
  }>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  settings,
  onUpdateSettings,
  onManualCleanup,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!settings) return null;

  const handleCompletedRetentionChange = (value: number) => {
    const newSettings: AppSettings = {
      ...settings,
      completedTaskRetentionDays: value,
    };
    onUpdateSettings(newSettings);
  };

  const handleOverdueRetentionChange = (value: number) => {
    const newSettings: AppSettings = {
      ...settings,
      overdueTaskRetentionDays: value,
    };
    onUpdateSettings(newSettings);
  };

  const handleHistoryRetentionChange = (value: number) => {
    const newSettings: AppSettings = {
      ...settings,
      historyRetentionMonths: value,
    };
    onUpdateSettings(newSettings);
  };

  const handleHistoryCleanupFrequencyChange = (value: number) => {
    const newSettings: AppSettings = {
      ...settings,
      historyCleanupFrequencyDays: value,
    };
    onUpdateSettings(newSettings);
  };

  const handleFrequencyChange = (value: number) => {
    const newSettings: AppSettings = {
      ...settings,
      cleanupFrequencyDays: value,
    };
    onUpdateSettings(newSettings);
  };

  const handleManualCleanup = async () => {
    Alert.alert(
      'Limpieza Manual',
      '¿Estás seguro de que quieres ejecutar la limpieza manual ahora?\n\nEsto moverá las tareas expiradas al historial según tu configuración.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Ejecutar',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const result = await onManualCleanup();
              Alert.alert(
                'Limpieza Completada',
                `Se han procesado:\n• ${result.completedMovedToHistory} tareas completadas movidas al historial\n• ${result.overdueMovedToHistory} tareas vencidas movidas al historial\n• ${result.overdueMarked} tareas marcadas como vencidas\n• ${result.historyCleaned} elementos limpiados del historial`,
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert('Error', 'No se pudo completar la limpieza');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const getExpirationText = (days: number) => {
    if (days === 0) return 'Nunca';
    if (days === 1) return '1 día';
    if (days < 30) return `${days} días`;
    if (days === 30) return '1 mes';
    if (days < 365) return `${Math.round(days / 30)} meses`;
    return `${Math.round(days / 365)} años`;
  };

  const getRetentionText = (months: number) => {
    if (months === 0) return 'Nunca';
    if (months === 1) return '1 mes';
    if (months < 12) return `${months} meses`;
    if (months === 12) return '1 año';
    return `${Math.round(months / 12)} años`;
  };

  const getFrequencyText = (days: number) => {
    if (days === 0) return 'Manual';
    if (days === 1) return 'Diario';
    if (days < 7) return `${days} días`;
    if (days === 7) return 'Semanal';
    if (days === 14) return 'Quincenal';
    if (days === 30) return 'Mensual';
    return `${days} días`;
  };

  const renderCompletedRetentionSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Clock size={20} color="#10B981" />
        <Text style={styles.sectionTitle}>Retención de Tareas Completadas</Text>
      </View>
      
      <Text style={styles.sectionDescription}>
        Las tareas completadas se moverán automáticamente al historial después del tiempo especificado. 
        Esto mantiene tus listas limpias y enfocadas en tareas pendientes.
      </Text>

      <View style={styles.optionsContainer}>
        {[1, 3, 7, 14, 30, 90].map((days) => (
          <TouchableOpacity
            key={days}
            style={[
              styles.option,
              settings.completedTaskRetentionDays === days && styles.selectedOption,
            ]}
            onPress={() => handleCompletedRetentionChange(days)}
          >
            <Text style={[
              styles.optionText,
              settings.completedTaskRetentionDays === days && styles.selectedOptionText,
            ]}>
              {getExpirationText(days)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderOverdueRetentionSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <AlertTriangle size={20} color="#EF4444" />
        <Text style={styles.sectionTitle}>Retención de Tareas Vencidas</Text>
      </View>
      
      <Text style={styles.sectionDescription}>
        Las tareas vencidas se moverán automáticamente al historial después del tiempo especificado. 
        Esto evita que las listas se llenen de tareas antiguas no completadas.
      </Text>

      <View style={styles.optionsContainer}>
        {[1, 3, 7, 14, 30, 60].map((days) => (
          <TouchableOpacity
            key={days}
            style={[
              styles.option,
              settings.overdueTaskRetentionDays === days && styles.selectedOption,
            ]}
            onPress={() => handleOverdueRetentionChange(days)}
          >
            <Text style={[
              styles.optionText,
              settings.overdueTaskRetentionDays === days && styles.selectedOptionText,
            ]}>
              {getExpirationText(days)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderHistoryRetentionSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Trash2 size={20} color="#6B7280" />
        <Text style={styles.sectionTitle}>Retención de Historial</Text>
      </View>
      
      <Text style={styles.sectionDescription}>
        Las tareas eliminadas se conservarán en el historial durante este tiempo para alimentar las estadísticas. 
        Después se eliminarán permanentemente para liberar espacio.
      </Text>

      <View style={styles.optionsContainer}>
        {[1, 3, 6, 12, 24, 36].map((months) => (
          <TouchableOpacity
            key={months}
            style={[
              styles.option,
              settings.historyRetentionMonths === months && styles.selectedOption,
            ]}
            onPress={() => handleHistoryRetentionChange(months)}
          >
            <Text style={[
              styles.optionText,
              settings.historyRetentionMonths === months && styles.selectedOptionText,
            ]}>
              {getRetentionText(months)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderHistoryCleanupFrequencySection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Clock size={20} color="#6B7280" />
        <Text style={styles.sectionTitle}>Limpieza del Historial</Text>
      </View>
      
      <Text style={styles.sectionDescription}>
        Con qué frecuencia se eliminarán permanentemente los elementos del historial que han expirado. 
        Esto libera espacio y mantiene solo los datos relevantes para las estadísticas.
      </Text>

      <View style={styles.optionsContainer}>
        {[7, 15, 30, 60, 90].map((days) => (
          <TouchableOpacity
            key={days}
            style={[
              styles.option,
              settings.historyCleanupFrequencyDays === days && styles.selectedOption,
            ]}
            onPress={() => handleHistoryCleanupFrequencyChange(days)}
          >
            <Text style={[
              styles.optionText,
              settings.historyCleanupFrequencyDays === days && styles.selectedOptionText,
            ]}>
              {getFrequencyText(days)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFrequencySection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Clock size={20} color="#10B981" />
        <Text style={styles.sectionTitle}>Limpieza Automática</Text>
      </View>
      
      <Text style={styles.sectionDescription}>
        Define cuándo la app moverá automáticamente las tareas expiradas al historial. 
        Esto mantiene tus listas limpias sin que tengas que hacerlo manualmente.
      </Text>

      <View style={styles.optionsContainer}>
        {[0, 1, 3, 7, 14, 30].map((days) => (
          <TouchableOpacity
            key={days}
            style={[
              styles.option,
              settings.cleanupFrequencyDays === days && styles.selectedOption,
            ]}
            onPress={() => handleFrequencyChange(days)}
          >
            <Text style={[
              styles.optionText,
              settings.cleanupFrequencyDays === days && styles.selectedOptionText,
            ]}>
              {getFrequencyText(days)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.frequencyInfo}>
        <Text style={styles.frequencyInfoText}>
          💡 <Text style={styles.frequencyInfoBold}>Manual:</Text> Solo limpieza cuando presiones el botón
        </Text>
        <Text style={styles.frequencyInfoText}>
          💡 <Text style={styles.frequencyInfoBold}>Automática:</Text> La app limpia según tu configuración de retención
        </Text>
      </View>
    </View>
  );

  const renderInfoSection = () => (
    <View style={styles.infoSection}>
      <View style={styles.infoHeader}>
        <Info size={16} color="#6B7280" />
        <Text style={styles.infoTitle}>Información</Text>
      </View>
      
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>• Limpieza automática:</Text>
        <Text style={styles.infoText}>
          {settings.cleanupFrequencyDays === 0 ? 'Manual' : `Cada ${getFrequencyText(settings.cleanupFrequencyDays).toLowerCase()}`}
        </Text>
      </View>
      
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>• Tareas completadas:</Text>
        <Text style={styles.infoText}>Se mueven al historial automáticamente</Text>
      </View>
      
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>• Tareas vencidas:</Text>
        <Text style={styles.infoText}>Se marcan y mueven al historial automáticamente</Text>
      </View>
      
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>• Historial:</Text>
        <Text style={styles.infoText}>Mantiene estadísticas a largo plazo</Text>
      </View>
      
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>• Última limpieza:</Text>
        <Text style={styles.infoText}>
          {settings.lastCleanup.toLocaleDateString('es-ES')}
        </Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Settings size={24} color="#8B5CF6" />
            <Text style={styles.headerTitle}>Configuración</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderCompletedRetentionSection()}
          {renderOverdueRetentionSection()}
          {renderHistoryRetentionSection()}
          {renderHistoryCleanupFrequencySection()}
          {renderFrequencySection()}
          {renderInfoSection()}

          <TouchableOpacity
            style={[styles.cleanupButton, isLoading && styles.cleanupButtonDisabled]}
            onPress={handleManualCleanup}
            disabled={isLoading}
          >
            <Trash2 size={20} color="#FFFFFF" />
            <Text style={styles.cleanupButtonText}>
              {isLoading ? 'Ejecutando...' : 'Limpieza Manual'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  cleanupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  cleanupButtonDisabled: {
    opacity: 0.6,
  },
  cleanupButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  frequencyInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#0EA5E9',
  },
  frequencyInfoText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#0C4A6E',
    lineHeight: 18,
    marginBottom: 4,
  },
  frequencyInfoBold: {
    fontFamily: 'Inter-SemiBold',
  },
}); 