# 🍎 Guía de Configuración para iOS - MeiList

## 📋 Prerrequisitos

### **Requisitos del Sistema:**
- **macOS**: Versión 12.0 o superior
- **Xcode**: Versión 14.0 o superior
- **Node.js**: Versión 18.0 o superior
- **Expo CLI**: Versión 7.0 o superior

### **Cuentas Necesarias:**
- **Apple Developer Account** (para distribución)
- **Expo Account** (para EAS Build)

## 🚀 Configuración Inicial

### **1. Instalar Dependencias**
```bash
# Instalar dependencias del proyecto
npm install

# Instalar Expo CLI globalmente (si no está instalado)
npm install -g @expo/cli

# Instalar EAS CLI
npm install -g eas-cli
```

### **2. Configurar EAS**
```bash
# Iniciar sesión en Expo
expo login

# Configurar EAS Build
eas build:configure
```

### **3. Verificar Configuración**
```bash
# Verificar que todo esté configurado correctamente
npx expo doctor

# Verificar tipos TypeScript
npx tsc --noEmit
```

## 📱 Desarrollo Local

### **1. Simulador de iOS**
```bash
# Iniciar el simulador de iOS
npx expo start --ios

# O usar el script personalizado
npm run ios
```

### **2. Dispositivo Físico**
```bash
# Instalar Expo Go en tu iPhone desde App Store
# Luego escanear el código QR que aparece al ejecutar:
npx expo start
```

## 🏗️ Build para iOS

### **1. Build de Desarrollo**
```bash
# Crear build de desarrollo
eas build --platform ios --profile development
```

### **2. Build de Preview**
```bash
# Crear build de preview para testing
eas build --platform ios --profile preview
```

### **3. Build de Producción**
```bash
# Crear build de producción
eas build --platform ios --profile production
```

## 🧪 Testing en iOS

### **Checklist de Testing:**

#### **Funcionalidades Básicas:**
- [ ] **Creación de Tareas**: Crear tarea con todos los campos
- [ ] **Edición de Tareas**: Modificar tarea existente
- [ ] **Eliminación de Tareas**: Eliminar con confirmación
- [ ] **Marcado como Completada**: Toggle de estado
- [ ] **Subtareas**: Añadir, completar, eliminar subtareas

#### **Gestión de Datos:**
- [ ] **Categorías**: Crear, editar, eliminar categorías
- [ ] **Niveles de Urgencia**: Gestionar con prioridades
- [ ] **Filtros**: Aplicar filtros por categoría, urgencia, estado
- [ ] **Búsqueda**: Buscar por texto en tareas
- [ ] **Ordenamiento**: Ordenar por diferentes criterios

#### **Configuración:**
- [ ] **Expiración de Tareas**: Configurar días de expiración
- [ ] **Limpieza Automática**: Configurar frecuencia
- [ ] **Limpieza Manual**: Ejecutar limpieza manual
- [ ] **Retención de Historial**: Configurar meses de retención

#### **Gestión de Fechas:**
- [ ] **Tareas Sin Fecha**: Crear tareas sin fecha de vencimiento
- [ ] **Tareas del Mismo Día**: Crear tarea hoy con vencimiento hoy
- [ ] **Tareas Vencidas**: Verificar marcado automático
- [ ] **Comparación por Días**: Verificar lógica inteligente

#### **Estadísticas:**
- [ ] **Resumen General**: Verificar conteos correctos
- [ ] **Estadísticas por Categoría**: Verificar cálculos
- [ ] **Estadísticas por Urgencia**: Verificar cálculos
- [ ] **Tareas Recientes**: Verificar lista de completadas

#### **UI/UX:**
- [ ] **Navegación**: Navegar entre todas las pantallas
- [ ] **Modales**: Abrir y cerrar todos los modales
- [ ] **Responsive**: Verificar en diferentes tamaños de pantalla
- [ ] **Accesibilidad**: Verificar con VoiceOver
- [ ] **Orientación**: Verificar en portrait y landscape

#### **Rendimiento:**
- [ ] **Carga Inicial**: Tiempo de carga de la aplicación
- [ ] **Transiciones**: Fluidez de navegación
- [ ] **Memoria**: Uso de memoria con muchas tareas
- [ ] **Batería**: Consumo de batería

## 🐛 Problemas Comunes y Soluciones

### **1. Error de Certificados**
```bash
# Regenerar certificados
eas credentials

# O limpiar cache
expo r -c
```

### **2. Error de Build**
```bash
# Limpiar cache de Metro
npx expo start --clear

# Limpiar cache de npm
npm cache clean --force
```

### **3. Error de Dependencias**
```bash
# Reinstalar node_modules
rm -rf node_modules
npm install

# Verificar versiones
npx expo install --fix
```

### **4. Error de TypeScript**
```bash
# Verificar tipos
npx tsc --noEmit

# Regenerar tipos de Expo
npx expo install --fix
```

## 📊 Métricas de Rendimiento

### **Objetivos de Rendimiento:**
- **Tiempo de Carga**: < 3 segundos
- **Transiciones**: 60 FPS
- **Memoria**: < 100MB en uso
- **Batería**: < 5% por hora de uso activo

### **Herramientas de Monitoreo:**
- **Xcode Instruments**: Para profiling
- **Expo DevTools**: Para debugging
- **React Native Debugger**: Para desarrollo

## 🚀 Distribución

### **1. TestFlight**
```bash
# Subir a TestFlight
eas submit --platform ios --profile production
```

### **2. App Store**
```bash
# Subir a App Store Connect
eas submit --platform ios --profile production --latest
```

## 📝 Notas de iOS

### **Consideraciones Específicas:**
1. **Safe Area**: La aplicación respeta las safe areas de iOS
2. **Gestos**: Compatible con gestos nativos de iOS
3. **Haptic Feedback**: Implementado para acciones importantes
4. **Dark Mode**: Soporte automático para modo oscuro
5. **Accessibility**: Compatible con VoiceOver y otras herramientas

### **Optimizaciones:**
1. **Imágenes**: Optimizadas para retina displays
2. **Fuentes**: Cargadas eficientemente con expo-font
3. **Animaciones**: Usando react-native-reanimated
4. **Almacenamiento**: AsyncStorage optimizado para iOS

## 🔧 Configuración Avanzada

### **1. Configurar Signing**
```bash
# Configurar certificados de desarrollo
eas credentials --platform ios
```

### **2. Configurar Notificaciones**
```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ]
  }
}
```

### **3. Configurar Deep Links**
```json
{
  "expo": {
    "scheme": "meilist",
    "ios": {
      "bundleIdentifier": "com.meilist.app"
    }
  }
}
```

## 📞 Soporte

### **Recursos Útiles:**
- [Expo iOS Documentation](https://docs.expo.dev/versions/latest/sdk/ios/)
- [React Native iOS Guide](https://reactnative.dev/docs/running-on-device#running-on-ios)
- [Apple Developer Documentation](https://developer.apple.com/ios/)

### **Comandos de Emergencia:**
```bash
# Reset completo
rm -rf node_modules
rm -rf .expo
npm install
npx expo start --clear

# Verificar estado
npx expo doctor
npx tsc --noEmit
```

---

*Esta guía debe mantenerse actualizada con cada nueva versión de la aplicación.* 