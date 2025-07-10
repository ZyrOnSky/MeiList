# 🛠️ Guía de Mantenimiento - MeiList

## 📋 Índice

1. [Descripción General](#-descripción-general)
2. [Arquitectura del Sistema](#-arquitectura-del-sistema)
3. [Requerimientos Funcionales](#-requerimientos-funcionales)
4. [Estructura de Datos](#-estructura-de-datos)
5. [Componentes Principales](#-componentes-principales)
6. [Servicios y Hooks](#-servicios-y-hooks)
7. [Flujos de Datos](#-flujos-de-datos)
8. [Configuración y Personalización](#-configuración-y-personalización)
9. [Manejo de Errores](#-manejo-de-errores)
10. [Testing y Debugging](#-testing-y-debugging)
11. [Deployment y Distribución](#-deployment-y-distribución)
12. [Mantenimiento Rutinario](#-mantenimiento-rutinario)

---

## 🎯 Descripción General

**MeiList** es una aplicación móvil de gestión de tareas desarrollada en React Native con Expo, que permite a los usuarios crear, organizar y gestionar sus tareas con funcionalidades avanzadas como categorización, niveles de urgencia, subtareas, filtros, búsqueda y estadísticas.

### **Características Principales:**
- ✅ Gestión completa de tareas (CRUD)
- ✅ Sistema de categorías personalizables
- ✅ Niveles de urgencia configurables
- ✅ Subtareas con progreso
- ✅ Filtros y búsqueda avanzada
- ✅ Estadísticas dinámicas
- ✅ Almacenamiento local persistente
- ✅ Limpieza automática configurable
- ✅ Gestión inteligente de fechas

---

## 🏗️ Arquitectura del Sistema

### **Stack Tecnológico:**
- **Framework**: React Native con Expo
- **Lenguaje**: TypeScript
- **Navegación**: Expo Router
- **Almacenamiento**: AsyncStorage
- **UI Components**: React Native + Lucide React Native
- **Gradientes**: Expo Linear Gradient

### **Estructura de Directorios:**
```
MeiList/
├── app/                    # Pantallas principales (Expo Router)
│   ├── (tabs)/            # Navegación por tabs
│   │   ├── index.tsx      # Pantalla principal
│   │   ├── incomplete.tsx # Tareas pendientes
│   │   ├── completed.tsx  # Tareas completadas
│   │   └── statistics.tsx # Estadísticas
│   └── _layout.tsx        # Layout principal
├── components/            # Componentes reutilizables
├── hooks/                 # Hooks personalizados
├── services/              # Servicios de datos
├── types/                 # Definiciones TypeScript
└── assets/               # Recursos estáticos
```

### **Patrones de Diseño:**
- **MVVM**: Separación de lógica de negocio y presentación
- **Repository Pattern**: Abstracción del almacenamiento
- **Custom Hooks**: Lógica reutilizable
- **Component Composition**: Componentes modulares

---

## 📋 Requerimientos Funcionales

### **RF-001: Gestión de Tareas**
- **Descripción**: Los usuarios pueden crear, editar, eliminar y marcar tareas como completadas
- **Prioridad**: Alta
- **Criterios de Aceptación**:
  - Crear tarea con título, descripción, fecha de vencimiento
  - Editar todos los campos de una tarea existente
  - Eliminar tarea con confirmación
  - Marcar/desmarcar como completada
  - Validación de campos obligatorios

### **RF-002: Sistema de Categorías**
- **Descripción**: Los usuarios pueden crear y gestionar categorías personalizadas
- **Prioridad**: Alta
- **Criterios de Aceptación**:
  - Crear categoría con nombre y color
  - Editar categoría existente
  - Eliminar categoría (solo si no está en uso)
  - Asignar categoría a tareas
  - Validación de nombres únicos

### **RF-003: Niveles de Urgencia**
- **Descripción**: Los usuarios pueden definir niveles de urgencia personalizados
- **Prioridad**: Alta
- **Criterios de Aceptación**:
  - Crear nivel con nombre, color y prioridad
  - Editar nivel existente
  - Eliminar nivel (solo si no está en uso)
  - Asignar urgencia a tareas
  - Ordenamiento por prioridad

### **RF-004: Subtareas**
- **Descripción**: Las tareas pueden contener subtareas con progreso
- **Prioridad**: Media
- **Criterios de Aceptación**:
  - Añadir/eliminar subtareas
  - Marcar subtareas como completadas
  - Mostrar progreso de completado
  - Validación de subtareas únicas

### **RF-005: Filtros y Búsqueda**
- **Descripción**: Los usuarios pueden filtrar y buscar tareas
- **Prioridad**: Media
- **Criterios de Aceptación**:
  - Búsqueda por texto en título/descripción
  - Filtro por categoría
  - Filtro por nivel de urgencia
  - Filtro por estado (pendiente/completada/vencida)
  - Combinación de filtros

### **RF-006: Estadísticas**
- **Descripción**: Los usuarios pueden ver estadísticas de productividad
- **Prioridad**: Media
- **Criterios de Aceptación**:
  - Resumen general (total, completadas, pendientes, vencidas)
  - Estadísticas por categoría
  - Estadísticas por nivel de urgencia
  - Tareas recientes completadas
  - Gráficos de progreso

### **RF-007: Gestión de Fechas**
- **Descripción**: Sistema inteligente de gestión de fechas de vencimiento
- **Prioridad**: Alta
- **Criterios de Aceptación**:
  - Tareas creadas hoy con vencimiento hoy no se marcan como vencidas
  - Tareas se marcan como vencidas al finalizar el día completo
  - Comparación por días completos (no horas/minutos)
  - Comportamiento consistente en toda la aplicación

### **RF-008: Limpieza Automática**
- **Descripción**: Sistema de limpieza automática de tareas expiradas
- **Prioridad**: Baja
- **Criterios de Aceptación**:
  - Configuración de expiración para tareas completadas
  - Configuración de expiración para tareas vencidas
  - Frecuencia de limpieza configurable
  - Limpieza manual disponible
  - Retención de historial configurable

---

## 🗄️ Estructura de Datos

### **Task (Tarea)**
```typescript
interface Task {
  id: string;                    // Identificador único
  title: string;                 // Título de la tarea
  description?: string;          // Descripción opcional
  status: 'pending' | 'completed' | 'overdue'; // Estado
  categoryId?: string;           // ID de categoría (opcional)
  urgency: string;               // ID de nivel de urgencia
  dueDate?: Date;                // Fecha de vencimiento (opcional)
  startDate?: Date;              // Fecha de inicio (opcional)
  subtasks: Subtask[];           // Lista de subtareas
  createdAt: Date;               // Fecha de creación
  updatedAt: Date;               // Fecha de última modificación
  completedDate?: Date;          // Fecha de completado (opcional)
}
```

### **Subtask (Subtarea)**
```typescript
interface Subtask {
  id: string;                    // Identificador único
  title: string;                 // Título de la subtarea
  completed: boolean;            // Estado de completado
}
```

### **Category (Categoría)**
```typescript
interface Category {
  id: string;                    // Identificador único
  name: string;                  // Nombre de la categoría
  color: string;                 // Color en formato hexadecimal
  createdAt: Date;               // Fecha de creación
}
```

### **UrgencyLevel (Nivel de Urgencia)**
```typescript
interface UrgencyLevel {
  id: string;                    // Identificador único
  name: string;                  // Nombre del nivel
  color: string;                 // Color en formato hexadecimal
  priority: number;              // Prioridad numérica
  createdAt: Date;               // Fecha de creación
}
```

### **AppSettings (Configuración)**
```typescript
interface AppSettings {
  completedTaskExpirationDays: number;    // Días para expirar tareas completadas
  overdueTaskExpirationDays: number;      // Días para expirar tareas vencidas
  historyRetentionMonths: number;         // Meses de retención de historial
  cleanupFrequencyDays: number;           // Frecuencia de limpieza automática
  lastCleanup: Date;                      // Última fecha de limpieza
}
```

---

## 🧩 Componentes Principales

### **TaskCard**
- **Propósito**: Mostrar información de una tarea individual
- **Props**: `task`, `categories`, `urgencyLevels`, callbacks
- **Funcionalidades**:
  - Mostrar/ocultar subtareas
  - Barra de progreso de subtareas
  - Etiquetas de estado, categoría y urgencia
  - Botones de acción (completar, editar, eliminar)

### **AddTaskModal**
- **Propósito**: Crear y editar tareas
- **Props**: `visible`, `onClose`, `onSave`, `editingTask`
- **Funcionalidades**:
  - Formulario completo de tarea
  - Gestión de subtareas
  - Selector de categoría y urgencia
  - Validaciones de campos

### **FilterModal**
- **Propósito**: Aplicar filtros a las listas de tareas
- **Props**: `visible`, `onClose`, `filters`, `onApplyFilters`
- **Funcionalidades**:
  - Filtros por texto, categoría, urgencia, estado
  - Combinación de múltiples filtros
  - Reset de filtros

### **CategoryManagerModal**
- **Propósito**: Gestionar categorías personalizadas
- **Props**: `visible`, `onClose`, `categories`, callbacks
- **Funcionalidades**:
  - CRUD completo de categorías
  - Selector de colores
  - Validación de nombres únicos

### **UrgencyManagerModal**
- **Propósito**: Gestionar niveles de urgencia
- **Props**: `visible`, `onClose`, `urgencyLevels`, callbacks
- **Funcionalidades**:
  - CRUD completo de niveles
  - Selector de colores
  - Configuración de prioridad

### **SettingsModal**
- **Propósito**: Configurar comportamiento de la aplicación
- **Props**: `visible`, `onClose`, `settings`, callbacks
- **Funcionalidades**:
  - Configuración de expiración
  - Configuración de retención
  - Frecuencia de limpieza
  - Limpieza manual

---

## 🔧 Servicios y Hooks

### **StorageService**
- **Propósito**: Abstracción del almacenamiento local
- **Métodos Principales**:
  - `getTasks()`: Obtener todas las tareas
  - `saveTasks()`: Guardar tareas
  - `getCategories()`: Obtener categorías
  - `saveCategories()`: Guardar categorías
  - `getUrgencyLevels()`: Obtener niveles de urgencia
  - `saveUrgencyLevels()`: Guardar niveles
  - `getSettings()`: Obtener configuración
  - `saveSettings()`: Guardar configuración
  - `cleanupExpiredTasks()`: Limpieza automática
  - `isTaskOverdue()`: Verificar si tarea está vencida

### **useTasks Hook**
- **Propósito**: Hook principal para gestión de estado
- **Estado Gestionado**:
  - Lista de tareas (todas, completadas, pendientes)
  - Categorías y niveles de urgencia
  - Configuración de la aplicación
  - Filtros y búsqueda
  - Estado de carga

- **Funciones Principales**:
  - `addTask()`: Crear nueva tarea
  - `updateTask()`: Actualizar tarea existente
  - `deleteTask()`: Eliminar tarea
  - `addCategory()`: Crear categoría
  - `updateCategory()`: Actualizar categoría
  - `deleteCategory()`: Eliminar categoría
  - `addUrgencyLevel()`: Crear nivel de urgencia
  - `updateUrgencyLevel()`: Actualizar nivel
  - `deleteUrgencyLevel()`: Eliminar nivel
  - `updateSettings()`: Actualizar configuración
  - `runManualCleanup()`: Ejecutar limpieza manual

### **useFrameworkReady Hook**
- **Propósito**: Verificar que el framework esté listo
- **Funcionalidad**: Esperar a que AsyncStorage esté disponible

---

## 🔄 Flujos de Datos

### **Creación de Tarea**
1. Usuario abre modal de creación
2. Completa formulario con validaciones
3. Hook `useTasks` llama a `addTask()`
4. `StorageService.saveTasks()` persiste datos
5. Estado se actualiza automáticamente
6. UI se refresca con nueva tarea

### **Marcado como Completada**
1. Usuario toca checkbox de tarea
2. `TaskCard` llama a `onToggleComplete()`
3. Hook actualiza estado de tarea
4. `StorageService` persiste cambios
5. Estadísticas se recalculan automáticamente

### **Aplicación de Filtros**
1. Usuario abre modal de filtros
2. Selecciona criterios de filtrado
3. `FilterModal` actualiza estado de filtros
4. Hook recalcula listas filtradas
5. UI muestra solo tareas que coinciden

### **Limpieza Automática**
1. Hook verifica si debe ejecutar limpieza
2. `StorageService.cleanupExpiredTasks()` procesa tareas
3. Tareas expiradas se mueven a historial
4. Estado se actualiza automáticamente
5. UI refleja cambios inmediatamente

---

## ⚙️ Configuración y Personalización

### **Configuración de Expiración**
- **Tareas Completadas**: 0-365 días (0 = nunca)
- **Tareas Vencidas**: 0-365 días (0 = nunca)
- **Por Defecto**: 30 días completadas, 90 días vencidas

### **Configuración de Retención**
- **Historial**: 0-60 meses (0 = nunca)
- **Por Defecto**: 3 meses

### **Frecuencia de Limpieza**
- **Opciones**: Manual, Diario, Semanal, Quincenal, Mensual
- **Por Defecto**: Semanal (7 días)

### **Paleta de Colores (18 colores)**
La aplicación utiliza una paleta de 18 colores vibrantes y modernos para categorías y niveles de urgencia:

1. **Violeta** - `#8B5CF6` - Tecnología, Creatividad
2. **Rosa** - `#EC4899` - Personal, Salud
3. **Azul** - `#3B82F6` - Trabajo, Profesional
4. **Verde Esmeralda** - `#10B981` - Finanzas, Éxito
5. **Ámbar** - `#F59E0B` - Urgente, Importante
6. **Rojo** - `#EF4444` - Crítico, Emergencia
7. **Cian** - `#06B6D4` - Comunicación, Social
8. **Verde Lima** - `#84CC16` - Naturaleza, Bienestar
9. **Naranja** - `#F97316` - Energía, Motivación
10. **Vino** - `#7C2D12` - Lujo, Premium
11. **Verde Azulado** - `#14B8A6` - Calma, Serenidad
12. **Rosa Coral** - `#F43F5E` - Amor, Relaciones
13. **Índigo** - `#6366F1` - Sabiduría, Conocimiento
14. **Verde** - `#22C55E` - Crecimiento, Desarrollo
15. **Amarillo** - `#EAB308` - Optimismo, Alegría
16. **Gris** - `#6B7280` - Neutral, Profesional
17. **Azul Cielo** - `#0EA5E9` - Libertad, Aire
18. **Marrón** - `#8B5A2B` - Estabilidad, Tierra

### **Categorías Predefinidas**
- Trabajo (#3B82F6)
- Personal (#10B981)
- Salud (#EF4444)
- Finanzas (#F59E0B)

### **Niveles de Urgencia Predefinidos**
- Alta (#EF4444, prioridad 1)
- Media (#F59E0B, prioridad 2)
- Baja (#10B981, prioridad 3)

---

## 🚨 Manejo de Errores

### **Estrategias Implementadas**
1. **Validación de Datos**: Campos obligatorios y formatos
2. **Try-Catch**: Manejo de errores en operaciones async
3. **Fallbacks**: Valores por defecto para datos corruptos
4. **Logging**: Console.log para debugging
5. **Alertas**: Notificaciones al usuario para errores críticos

### **Casos de Error Comunes**
- **AsyncStorage no disponible**: Fallback a estado inicial
- **Datos corruptos**: Regeneración de estructura por defecto
- **Validación fallida**: Mensajes de error específicos
- **Operaciones fallidas**: Rollback de cambios

### **Logging y Debugging**
```typescript
// Ejemplo de logging estructurado
console.log('Task operation:', {
  operation: 'create',
  taskId: task.id,
  timestamp: new Date().toISOString(),
  success: true
});
```

---

## 🧪 Testing y Debugging

### **Estrategias de Testing**
1. **Testing Manual**: Verificación de funcionalidades principales
2. **Console Logging**: Debugging de operaciones críticas
3. **Validación de Datos**: Verificación de integridad
4. **Pruebas de Usuario**: Flujos completos de uso

### **Checklist de Testing**
- [ ] Creación de tareas con todos los campos
- [ ] Edición de tareas existentes
- [ ] Eliminación de tareas con confirmación
- [ ] Marcado como completada/descompletada
- [ ] Gestión de subtareas
- [ ] Filtros y búsqueda
- [ ] Gestión de categorías (18 colores disponibles)
- [ ] Gestión de niveles de urgencia (18 colores disponibles)
- [ ] Configuración de expiración
- [ ] Limpieza automática
- [ ] Gestión de fechas (casos especiales)
- [ ] Persistencia de datos
- [ ] Estadísticas dinámicas
- [ ] Sincronización de categorías entre modales
- [ ] Rendimiento con listas grandes
- [ ] Validaciones de formularios

### **Herramientas de Debugging**
- **React Native Debugger**: Para debugging de React Native
- **AsyncStorage Inspector**: Para inspeccionar datos almacenados
- **Console Logs**: Para tracking de operaciones
- **Alert Messages**: Para notificaciones de error
- **Expo Dev Tools**: Para debugging en desarrollo
- **Color Palette Script**: `node show-color-palette.js` para verificar colores

---

## 🚀 Deployment y Distribución

### **Configuración de Expo**
- **SDK Version**: Última versión estable
- **Platforms**: iOS, Android
- **Build Configuration**: Development, Preview, Production

### **Variables de Entorno**
```bash
# .env (ejemplo)
EXPO_PUBLIC_APP_NAME=MeiList
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### **Build Commands**
```bash
# Development
npx expo start

# Preview Build
npx expo build:preview

# Production Build
npx expo build:production
```

### **Distribución**
1. **Expo Go**: Para testing rápido
2. **EAS Build**: Para builds nativos
3. **App Store/Play Store**: Para distribución pública

---

## 🔧 Mantenimiento Rutinario

### **Tareas Semanales**
- [ ] Verificar logs de errores
- [ ] Revisar rendimiento de la aplicación
- [ ] Actualizar dependencias si es necesario
- [ ] Verificar integridad de datos
- [ ] Comprobar sincronización de categorías y urgencias
- [ ] Verificar paleta de colores en todos los modales

### **Tareas Mensuales**
- [ ] Revisar estadísticas de uso
- [ ] Optimizar código si es necesario
- [ ] Actualizar documentación
- [ ] Revisar feedback de usuarios

### **Tareas Trimestrales**
- [ ] Actualizar React Native/Expo
- [ ] Revisar y actualizar dependencias
- [ ] Optimizar rendimiento
- [ ] Implementar nuevas funcionalidades

### **Monitoreo de Salud**
- **Métricas a Monitorear**:
  - Tiempo de carga de pantallas
  - Uso de memoria
  - Errores de AsyncStorage
  - Tiempo de respuesta de operaciones
  - Tasa de crash
  - Rendimiento de filtros y búsqueda
  - Sincronización de estado entre componentes
  - Validación de datos de categorías y urgencias

### **Backup y Recuperación**
- **Estrategia de Backup**: Los datos se almacenan localmente
- **Recuperación**: Regeneración automática de estructura por defecto
- **Migración**: Actualización automática de esquemas de datos

### **Gestión de Colores**
- **Paleta Centralizada**: 18 colores definidos en todos los componentes
- **Archivos de Configuración**:
  - `components/AddTaskModal.tsx` - Colores para categorías y urgencias
  - `components/CategoryManagerModal.tsx` - Colores para categorías
  - `components/UrgencyManagerModal.tsx` - Colores para urgencias
- **Documentación**: `COLOR_PALETTE.md` con detalles completos
- **Script de Verificación**: `show-color-palette.js` para mostrar paleta
- **Sincronización**: Todos los modales usan la misma paleta
- **Validación**: Verificar que no haya colores duplicados o inconsistentes

---

## 📚 Recursos Adicionales

### **Documentación Relacionada**
- [DATE_MANAGEMENT_GUIDE.md](./DATE_MANAGEMENT_GUIDE.md) - Guía de gestión de fechas
- [COLOR_PALETTE.md](./COLOR_PALETTE.md) - Documentación de la paleta de colores
- [README.md](./README.md) - Documentación general del proyecto

### **Enlaces Útiles**
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

### **Contacto y Soporte**
- **Desarrollador**: [Tu información de contacto]
- **Repositorio**: [URL del repositorio]
- **Issues**: [URL para reportar problemas]

---

## 📝 Notas de Mantenimiento

### **Última Actualización**
- **Fecha**: Diciembre 2024
- **Versión**: 1.3.0
- **Cambios Principales**: 
  - Paleta de colores actualizada (18 colores)
  - Mejoras en gestión de categorías y urgencias
  - Correcciones en modales de creación/edición
  - Optimización de rendimiento con React.useMemo
  - Configuración completa para iOS y EAS Build

### **Próximas Mejoras Planificadas**
1. **Sincronización en la nube**
2. **Notificaciones push**
3. **Temas personalizables (claro/oscuro)**
4. **Exportación de datos**
5. **Integración con calendarios**
6. **Colores personalizados (selector RGB)**
7. **Gradientes para categorías premium**

### **Historial de Cambios**
- **v1.0.0**: Implementación inicial con todas las funcionalidades básicas
- **v1.1.0**: Mejoras en gestión de fechas y validaciones
- **v1.2.0**: Sistema de limpieza automática y configuración
- **v1.3.0**: Paleta de colores expandida y optimizaciones de rendimiento

---

*Esta guía debe mantenerse actualizada con cada nueva versión de la aplicación.* 