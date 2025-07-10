#!/usr/bin/env node

const AsyncStorage = require('@react-native-async-storage/async-storage');

const STORAGE_KEYS = {
  TASKS: 'tasks',
  CATEGORIES: 'categories',
  URGENCY_LEVELS: 'urgency_levels',
  SETTINGS: 'settings',
  EXPIRED_TASKS: 'expired_tasks',
};

// Función para generar IDs únicos (igual que en la app)
const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

async function testCategories() {
  console.log('🧪 Probando sincronización de categorías...\n');
  
  try {
    // Simular creación de categorías desde diferentes lugares
    console.log('📝 Simulando creación de categorías...');
    
    // Leer categorías actuales
    const currentData = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
    let categories = currentData ? JSON.parse(currentData) : [];
    
    console.log('📋 Categorías actuales:', categories.length);
    
    // Simular creación desde AddTaskModal
    const newCategory1 = {
      id: generateUniqueId(),
      name: 'Test desde AddTaskModal',
      color: '#8B5CF6',
      createdAt: new Date(),
    };
    
    categories.push(newCategory1);
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    console.log('✅ Categoría creada desde AddTaskModal:', newCategory1.name);
    
    // Simular creación desde CategoryManagerModal
    const newCategory2 = {
      id: generateUniqueId(),
      name: 'Test desde CategoryManager',
      color: '#EC4899',
      createdAt: new Date(),
    };
    
    categories.push(newCategory2);
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    console.log('✅ Categoría creada desde CategoryManager:', newCategory2.name);
    
    // Verificar que todas las categorías estén presentes
    const finalData = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const finalCategories = JSON.parse(finalData);
    
    console.log('\n📋 Categorías finales:', finalCategories.length);
    finalCategories.forEach((cat, index) => {
      console.log(`  ${index + 1}. ${cat.name} (${cat.id}) - Color: ${cat.color}`);
    });
    
    // Verificar que no hay IDs duplicados
    const ids = finalCategories.map(cat => cat.id);
    const uniqueIds = new Set(ids);
    
    if (ids.length === uniqueIds.size) {
      console.log('\n✅ No hay IDs duplicados');
    } else {
      console.log('\n❌ Se encontraron IDs duplicados');
    }
    
    // Verificar que no hay nombres duplicados
    const names = finalCategories.map(cat => cat.name.toLowerCase());
    const uniqueNames = new Set(names);
    
    if (names.length === uniqueNames.size) {
      console.log('✅ No hay nombres duplicados');
    } else {
      console.log('❌ Se encontraron nombres duplicados');
    }
    
    console.log('\n🎉 Prueba completada exitosamente!');
    console.log('\n📋 Para probar en la app:');
    console.log('1. Reinicia la aplicación');
    console.log('2. Ve a Estadísticas > Gestionar Categorías');
    console.log('3. Ve a Crear Tarea y verifica las categorías');
    console.log('4. Crea categorías desde ambos lugares y verifica sincronización');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
}

// Ejecutar la prueba
testCategories().then(() => {
  console.log('\n✅ Prueba finalizada');
}).catch(error => {
  console.error('❌ Error fatal:', error);
}); 