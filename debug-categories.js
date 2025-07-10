#!/usr/bin/env node

const AsyncStorage = require('@react-native-async-storage/async-storage');

const STORAGE_KEYS = {
  TASKS: 'tasks',
  CATEGORIES: 'categories',
  URGENCY_LEVELS: 'urgency_levels',
  SETTINGS: 'settings',
  EXPIRED_TASKS: 'expired_tasks',
};

async function debugCategories() {
  console.log('🔍 Diagnóstico de Categorías\n');
  
  try {
    // Verificar si AsyncStorage está disponible
    console.log('📱 Verificando AsyncStorage...');
    
    // Intentar leer las categorías
    const categoriesData = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
    console.log('📦 Datos de categorías en AsyncStorage:', categoriesData ? 'ENCONTRADO' : 'NO ENCONTRADO');
    
    if (categoriesData) {
      const categories = JSON.parse(categoriesData);
      console.log('📋 Categorías almacenadas:');
      categories.forEach((cat, index) => {
        console.log(`  ${index + 1}. ID: ${cat.id} | Nombre: ${cat.name} | Color: ${cat.color}`);
      });
    } else {
      console.log('❌ No hay categorías almacenadas');
    }
    
    // Verificar tareas para ver qué categorías están en uso
    const tasksData = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    if (tasksData) {
      const tasks = JSON.parse(tasksData);
      console.log('\n📝 Tareas encontradas:', tasks.length);
      
      const usedCategoryIds = new Set();
      tasks.forEach(task => {
        if (task.categoryId) {
          usedCategoryIds.add(task.categoryId);
        }
      });
      
      console.log('🏷️ Categorías en uso por tareas:');
      usedCategoryIds.forEach(categoryId => {
        console.log(`  - ${categoryId}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error);
  }
}

// Ejecutar el diagnóstico
debugCategories().then(() => {
  console.log('\n✅ Diagnóstico completado');
}).catch(error => {
  console.error('❌ Error fatal:', error);
}); 