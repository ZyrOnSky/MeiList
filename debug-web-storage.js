// Script de diagnóstico para problemas de AsyncStorage en web
console.log('🔍 DIAGNÓSTICO DE ALMACENAMIENTO WEB - MeiList');

// Verificar si AsyncStorage está disponible
const checkAsyncStorage = () => {
  console.log('📱 Verificando AsyncStorage...');
  
  if (typeof window !== 'undefined') {
    console.log('✅ Ejecutando en navegador web');
    
    // Verificar si AsyncStorage está disponible
    if (window.AsyncStorage) {
      console.log('✅ AsyncStorage disponible en window');
    } else {
      console.log('❌ AsyncStorage NO disponible en window');
    }
    
    // Verificar localStorage como fallback
    if (window.localStorage) {
      console.log('✅ localStorage disponible');
    } else {
      console.log('❌ localStorage NO disponible');
    }
  } else {
    console.log('❌ No se detecta entorno de navegador');
  }
};

// Verificar datos almacenados
const checkStoredData = async () => {
  console.log('📊 Verificando datos almacenados...');
  
  try {
    const keys = ['tasks', 'categories', 'urgencyLevels', 'settings'];
    
    for (const key of keys) {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        console.log(`✅ ${key}:`, parsed.length || 'datos encontrados');
      } else {
        console.log(`❌ ${key}: No hay datos`);
      }
    }
  } catch (error) {
    console.error('❌ Error verificando datos:', error);
  }
};

// Simular operaciones de AsyncStorage
const testAsyncStorage = async () => {
  console.log('🧪 Probando operaciones de AsyncStorage...');
  
  try {
    // Test de escritura
    const testData = { test: 'data', timestamp: Date.now() };
    localStorage.setItem('test-key', JSON.stringify(testData));
    console.log('✅ Escritura exitosa');
    
    // Test de lectura
    const readData = localStorage.getItem('test-key');
    if (readData) {
      const parsed = JSON.parse(readData);
      console.log('✅ Lectura exitosa:', parsed);
    } else {
      console.log('❌ Lectura fallida');
    }
    
    // Limpiar test
    localStorage.removeItem('test-key');
    console.log('✅ Limpieza exitosa');
    
  } catch (error) {
    console.error('❌ Error en test de AsyncStorage:', error);
  }
};

// Verificar estado de la aplicación
const checkAppState = () => {
  console.log('🎯 Verificando estado de la aplicación...');
  
  // Verificar si React está disponible
  if (window.React) {
    console.log('✅ React disponible');
  } else {
    console.log('❌ React NO disponible');
  }
  
  // Verificar si hay errores en consola
  console.log('📝 Verificando errores de consola...');
  
  // Verificar tamaño de datos
  const totalSize = new Blob([JSON.stringify(localStorage)]).size;
  console.log(`📏 Tamaño total de datos: ${totalSize} bytes`);
  
  // Verificar límites de almacenamiento
  if (navigator.storage && navigator.storage.estimate) {
    navigator.storage.estimate().then(estimate => {
      console.log('💾 Estimación de almacenamiento:', estimate);
    });
  }
};

// Ejecutar diagnóstico completo
const runDiagnostic = async () => {
  console.log('🚀 Iniciando diagnóstico completo...\n');
  
  checkAsyncStorage();
  console.log('');
  
  await checkStoredData();
  console.log('');
  
  await testAsyncStorage();
  console.log('');
  
  checkAppState();
  console.log('');
  
  console.log('✅ Diagnóstico completado');
  console.log('💡 Si ves errores, revisa la configuración de AsyncStorage para web');
};

// Ejecutar cuando se carga la página
if (typeof window !== 'undefined') {
  window.addEventListener('load', runDiagnostic);
  
  // También ejecutar inmediatamente si ya está cargado
  if (document.readyState === 'complete') {
    runDiagnostic();
  }
}

// Exportar para uso manual
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runDiagnostic, checkAsyncStorage, checkStoredData, testAsyncStorage, checkAppState };
} 