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
  onManualCleanup: () => Promise<{ expiredCount: number; overdueCount: number; overdueExpiredCount: number }>;
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

  const handleExpirationChange = (value: number) => {
    const newSettings: AppSettings = {
      ...settings,
      completedTaskExpirationDays: value,
    };
    onUpdateSettings(newSettings);
  };

  const handleOverdueExpirationChange = (value: number) => {
    const newSettings: AppSettings = {
      ...settings,
      overdueTaskExpirationDays: value,
    };
    onUpdateSettings(newSettings);
  };

  const handleRetentionChange = (value: number) => {
    const newSettings: AppSettings = {
      ...settings,
      historyRetentionMonths: value,
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
      '¿Estás seguro de que quieres ejecutar la limpieza manual ahora?\n\nEsto eliminará las tareas completadas que hayan expirado según tu configuración.',
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
                `Se han procesado:\n• ${result.expiredCount} tareas completadas eliminadas\n• ${result.overdueCount} tareas marcadas como vencidas\n• ${result.overdueExpiredCount} tareas vencidas eliminadas`,
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

  const renderExpirationSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Clock size={20} color="#8B5CF6" />
        <Text style={styles.sectionTitle}>Expiración de Tareas Completadas</Text>
      </View>
      
      <Text style={styles.sectionDescription}>
        Las tareas completadas se eliminarán automáticamente después del tiempo especificado
      </Text>

      <View style={styles.optionsContainer}>
        {[0, 7, 30, 90, 180, 365].map((days) => (
          <TouchableOpacity
            key={days}
            style={[
              styles.option,
              settings.completedTaskExpirationDays === days && styles.selectedOption,
            ]}
            onPress={() => handleExpirationChange(days)}
          >
            <Text style={[
              styles.optionText,
              settings.completedTaskExpirationDays === days && styles.selectedOptionText,
            ]}>
              {getExpirationText(days)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderOverdueExpirationSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <AlertTriangle size={20} color="#EF4444" />
        <Text style={styles.sectionTitle}>Expiración de Tareas Vencidas</Text>
      </View>
      
      <Text style={styles.sectionDescription}>
        Las tareas vencidas se eliminarán automáticamente después del tiempo especificado
      </Text>

      <View style={styles.optionsContainer}>
        {[0, 30, 60, 90, 180, 365].map((days) => (
          <TouchableOpacity
            key={days}
            style={[
              styles.option,
              settings.overdueTaskExpirationDays === days && styles.selectedOption,
            ]}
            onPress={() => handleOverdueExpirationChange(days)}
          >
            <Text style={[
              styles.optionText,
              settings.overdueTaskExpirationDays === days && styles.selectedOptionText,
            ]}>
              {getExpirationText(days)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderRetentionSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Trash2 size={20} color="#EF4444" />
        <Text style={styles.sectionTitle}>Retención de Historial</Text>
      </View>
      
      <Text style={styles.sectionDescription}>
        Las tareas eliminadas se conservarán en el historial durante este tiempo
      </Text>

      <View style={styles.optionsContainer}>
        {[0, 1, 3, 6, 12, 24].map((months) => (
          <TouchableOpacity
            key={months}
            style={[
              styles.option,
              settings.historyRetentionMonths === months && styles.selectedOption,
            ]}
            onPress={() => handleRetentionChange(months)}
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

  const renderFrequencySection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Clock size={20} color="#10B981" />
        <Text style={styles.sectionTitle}>Frecuencia de Limpieza</Text>
      </View>
      
      <Text style={styles.sectionDescription}>
        Con qué frecuencia se ejecutará la limpieza automática
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
        <Text style={styles.infoLabel}>• Tareas vencidas:</Text>
        <Text style={styles.infoText}>Se marcan y eliminan automáticamente</Text>
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
          {renderExpirationSection()}
          {renderOverdueExpirationSection()}
          {renderRetentionSection()}
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
}); 