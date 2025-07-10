# 🍎 MeiList - Gestor de Tareas Móvil

Una aplicación móvil moderna y elegante para gestionar listas de tareas, desarrollada con React Native y Expo.

## ✨ Características

- 📝 **Gestión completa de tareas** con subtareas
- 🏷️ **Categorías personalizables** con colores únicos
- ⚡ **Niveles de urgencia** configurables
- 📅 **Fechas de vencimiento** con recordatorios
- 🔍 **Búsqueda y filtros** avanzados
- 📊 **Estadísticas dinámicas** en tiempo real
- 🎨 **Interfaz moderna** con gradientes y animaciones
- 💾 **Almacenamiento local** persistente
- 🧹 **Limpieza automática** de tareas completadas
- ⚙️ **Configuración personalizable** de expiración

## 🚀 Tecnologías

- **React Native** - Framework móvil
- **Expo** - Plataforma de desarrollo
- **TypeScript** - Tipado estático
- **AsyncStorage** - Almacenamiento local
- **Lucide React Native** - Iconografía
- **Expo Linear Gradient** - Efectos visuales

## 📱 Plataformas

- ✅ **iOS** (Configurado con EAS Build)
- ✅ **Android** (Configurado con EAS Build)
- ✅ **Web** (Soporte básico)

## 🛠️ Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Expo CLI
- EAS CLI (para builds)

### Pasos de instalación

```bash
# Clonar el repositorio
git clone https://github.com/zyronsky/MeiList.git
cd MeiList

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Para iOS
npm run ios

# Para Android
npm run android
```

## 🏗️ Builds

### Desarrollo
```bash
# Build de desarrollo para iOS
eas build --platform ios --profile development

# Build de desarrollo para Android
eas build --platform android --profile development
```

### Producción
```bash
# Build de producción para iOS
eas build --platform ios --profile production

# Build de producción para Android
eas build --platform android --profile production
```

## 📁 Estructura del Proyecto

```
MeiList/
├── app/                    # Pantallas principales (Expo Router)
│   ├── (tabs)/            # Navegación por tabs
│   └── _layout.tsx        # Layout principal
├── components/            # Componentes reutilizables
│   ├── TaskCard.tsx       # Tarjeta de tarea
│   ├── AddTaskModal.tsx   # Modal de añadir tarea
│   ├── FilterModal.tsx    # Modal de filtros
│   └── ...
├── hooks/                 # Hooks personalizados
│   ├── useTasks.ts        # Gestión de tareas
│   └── useFrameworkReady.ts
├── services/              # Servicios
│   └── StorageService.ts  # Almacenamiento local
├── types/                 # Definiciones de tipos
│   └── Task.ts           # Tipos de tareas
└── assets/               # Recursos estáticos
```

## 🎯 Funcionalidades Principales

### Gestión de Tareas
- Crear, editar y eliminar tareas
- Subtareas con progreso visual
- Estados: pendiente, en progreso, completada
- Fechas de vencimiento con alertas

### Categorías y Urgencia
- Categorías personalizables con colores
- Niveles de urgencia configurables
- Filtros por categoría y urgencia
- Vista organizada por prioridad

### Búsqueda y Filtros
- Búsqueda en tiempo real
- Filtros múltiples combinables
- Vista de tareas completadas
- Vista de tareas pendientes

### Estadísticas
- Progreso general de tareas
- Distribución por categorías
- Tareas vencidas vs completadas
- Gráficos dinámicos

## ⚙️ Configuración

### Almacenamiento
- AsyncStorage para persistencia local
- Backup automático de datos
- Limpieza configurable de tareas antiguas

### Personalización
- Temas de colores
- Configuración de expiración
- Gestión de categorías
- Configuración de urgencia

## 🧪 Testing

```bash
# Verificar configuración
node check-ios-setup.js

# Verificar tipos TypeScript
npx tsc --noEmit

# Verificar con Expo Doctor
npx expo-doctor
```

## 📊 Métricas de Rendimiento

- **Tiempo de carga inicial**: < 2s
- **Tiempo de respuesta UI**: < 100ms
- **Uso de memoria**: Optimizado
- **Tamaño de app**: < 50MB

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**zyronsky** - [GitHub](https://github.com/zyronsky)

## 🙏 Agradecimientos

- Expo por la excelente plataforma de desarrollo
- React Native por el framework móvil
- La comunidad de desarrolladores móviles

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub! 