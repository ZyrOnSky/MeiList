#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🍎 Verificando configuración para iOS...\n');

// Verificar archivos críticos
const criticalFiles = [
  'app.json',
  'package.json',
  'eas.json',
  'tsconfig.json',
  'types/Task.ts',
  'services/StorageService.ts',
  'hooks/useTasks.ts'
];

console.log('📁 Verificando archivos críticos:');
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FALTANTE`);
  }
});

// Verificar configuración de iOS en app.json
console.log('\n📱 Verificando configuración de iOS:');
try {
  const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  const iosConfig = appJson.expo.ios;
  
  if (iosConfig.bundleIdentifier) {
    console.log(`✅ Bundle Identifier: ${iosConfig.bundleIdentifier}`);
  } else {
    console.log('❌ Bundle Identifier no configurado');
  }
  
  if (iosConfig.buildNumber) {
    console.log(`✅ Build Number: ${iosConfig.buildNumber}`);
  } else {
    console.log('❌ Build Number no configurado');
  }
  
  if (iosConfig.infoPlist) {
    console.log('✅ Info.plist configurado');
  } else {
    console.log('❌ Info.plist no configurado');
  }
} catch (error) {
  console.log('❌ Error leyendo app.json');
}

// Verificar scripts de iOS en package.json
console.log('\n🔧 Verificando scripts de iOS:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const scripts = packageJson.scripts;
  
  if (scripts.ios) {
    console.log('✅ Script iOS configurado');
  } else {
    console.log('❌ Script iOS no configurado');
  }
  
  if (scripts['build:ios']) {
    console.log('✅ Script build:ios configurado');
  } else {
    console.log('❌ Script build:ios no configurado');
  }
} catch (error) {
  console.log('❌ Error leyendo package.json');
}

// Verificar configuración de EAS
console.log('\n🏗️ Verificando configuración de EAS:');
if (fs.existsSync('eas.json')) {
  try {
    const easJson = JSON.parse(fs.readFileSync('eas.json', 'utf8'));
    if (easJson.build && easJson.build.production && easJson.build.production.ios) {
      console.log('✅ Configuración de EAS para iOS');
    } else {
      console.log('❌ Configuración de EAS incompleta');
    }
  } catch (error) {
    console.log('❌ Error leyendo eas.json');
  }
} else {
  console.log('❌ eas.json no encontrado');
}

// Verificar dependencias críticas
console.log('\n📦 Verificando dependencias críticas:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const criticalDeps = [
    'expo',
    'react-native',
    '@react-native-async-storage/async-storage',
    'expo-linear-gradient',
    'lucide-react-native'
  ];
  
  criticalDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} - FALTANTE`);
    }
  });
} catch (error) {
  console.log('❌ Error verificando dependencias');
}

// Verificar componentes principales
console.log('\n🧩 Verificando componentes principales:');
const components = [
  'components/TaskCard.tsx',
  'components/AddTaskModal.tsx',
  'components/FilterModal.tsx',
  'components/SearchBar.tsx',
  'components/SettingsModal.tsx',
  'components/CategoryManagerModal.tsx',
  'components/UrgencyManagerModal.tsx'
];

components.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(`✅ ${component}`);
  } else {
    console.log(`❌ ${component} - FALTANTE`);
  }
});

// Verificar pantallas principales
console.log('\n📱 Verificando pantallas principales:');
const screens = [
  'app/(tabs)/index.tsx',
  'app/(tabs)/incomplete.tsx',
  'app/(tabs)/completed.tsx',
  'app/(tabs)/statistics.tsx'
];

screens.forEach(screen => {
  if (fs.existsSync(screen)) {
    console.log(`✅ ${screen}`);
  } else {
    console.log(`❌ ${screen} - FALTANTE`);
  }
});

console.log('\n🎉 Verificación completada!');
console.log('\n📋 Próximos pasos para iOS:');
console.log('1. Ejecutar: npm install');
console.log('2. Ejecutar: npx expo start --ios');
console.log('3. O usar: npm run ios');
console.log('\n🏗️ Para build:');
console.log('1. Configurar EAS: eas build:configure');
console.log('2. Build de desarrollo: eas build --platform ios --profile development');
console.log('3. Build de producción: eas build --platform ios --profile production'); 