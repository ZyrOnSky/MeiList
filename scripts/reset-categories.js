#!/usr/bin/env node

const AsyncStorage = require('@react-native-async-storage/async-storage');

const STORAGE_KEYS = {
  TASKS: 'tasks',
  CATEGORIES: 'categories',
  URGENCY_LEVELS: 'urgency_levels',
  SETTINGS: 'settings',
  EXPIRED_TASKS: 'expired_tasks',
};

// Categorías por defecto
const defaultCategories = [
  {
    id: 'trabajo',
    name: 'Trabajo',
    color: '#3B82F6',
    createdAt: new Date(),
  },
  {
    id: 'personal',
    name: 'Personal',
    color: '#10B981',
    createdAt: new Date(),
  },
  {
    id: 'salud',
    name: 'Salud',
    color: '#EF4444',
    createdAt: new Date(),
  },
  {
    id: 'finanzas',
    name: 'Finanzas',
    color: '#F59E0B',
    createdAt: new Date(),
  },
];

// Niveles de urgencia por defecto
const defaultUrgencyLevels = [
  {
    id: 'alta',
    name: 'Alta',
    color: '#EF4444',
    priority: 1,
    createdAt: new Date(),
  },
  {
    id: 'media',
    name: 'Media',
    color: '#F59E0B',
    priority: 2,
    createdAt: new Date(),
  },
  {
    id: 'baja',
    name: 'Baja',
    color: '#10B981',
    priority: 3,
    createdAt: new Date(),
  },
];

async function resetCategories() {
  console.log('🔄 Reseteando categorías y niveles de urgencia...\n');
  
  try {
    // Backup de datos actuales
    console.log('📦 Creando backup de datos actuales...');
    const currentCategories = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const currentUrgencyLevels = await AsyncStorage.getItem(STORAGE_KEYS.URGENCY_LEVELS);
    const currentTasks = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    
    if (currentCategories) {
      console.log('📋 Categorías actuales encontradas:', JSON.parse(currentCategories).length);
    }
    if (currentUrgencyLevels) {
      console.log('⚡ Niveles de urgencia actuales encontrados:', JSON.parse(currentUrgencyLevels).length);
    }
    if (currentTasks) {
      console.log('📝 Tareas actuales encontradas:', JSON.parse(currentTasks).length);
    }
    
    // Resetear categorías
    console.log('\n🔄 Reseteando categorías...');
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories));
    console.log('✅ Categorías reseteadas');
    
    // Resetear niveles de urgencia
    console.log('🔄 Reseteando niveles de urgencia...');
    await AsyncStorage.setItem(STORAGE_KEYS.URGENCY_LEVELS, JSON.stringify(defaultUrgencyLevels));
    console.log('✅ Niveles de urgencia reseteados');
    
    // Verificar que se guardaron correctamente
    console.log('\n🔍 Verificando datos reseteados...');
    const newCategories = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const newUrgencyLevels = await AsyncStorage.getItem(STORAGE_KEYS.URGENCY_LEVELS);
    
    if (newCategories) {
      const categories = JSON.parse(newCategories);
      console.log('📋 Categorías después del reset:', categories.length);
      categories.forEach((cat, index) => {
        console.log(`  ${index + 1}. ${cat.name} (${cat.id})`);
      });
    }
    
    if (newUrgencyLevels) {
      const urgencyLevels = JSON.parse(newUrgencyLevels);
      console.log('⚡ Niveles de urgencia después del reset:', urgencyLevels.length);
      urgencyLevels.forEach((level, index) => {
        console.log(`  ${index + 1}. ${level.name} (${level.id}) - Prioridad: ${level.priority}`);
      });
    }
    
    console.log('\n✅ Reset completado exitosamente!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Reinicia la aplicación');
    console.log('2. Verifica que las categorías aparezcan en todas las pantallas');
    console.log('3. Crea nuevas categorías y verifica que se sincronicen');
    
  } catch (error) {
    console.error('❌ Error durante el reset:', error);
  }
}

// Ejecutar el reset
resetCategories().then(() => {
  console.log('\n🎉 Proceso completado');
}).catch(error => {
  console.error('❌ Error fatal:', error);
}); 