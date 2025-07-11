import { Tabs } from 'expo-router';
import { Platform, TouchableOpacity, Text, View } from 'react-native';
import { List, Clock, CircleCheck as CheckCircle, ChartBar as BarChart3 } from 'lucide-react-native';
import React, { useState } from 'react';

// Componente para icono con tooltip
const TabIconWithTooltip = ({ 
  icon: Icon, 
  size, 
  color, 
  title, 
  isActive 
}: { 
  icon: any; 
  size: number; 
  color: string; 
  title: string; 
  isActive: boolean;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (Platform.OS === 'web') {
    return (
      <View style={{ position: 'relative', alignItems: 'center' }}>
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            cursor: 'pointer',
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Icon size={size} color={color} />
          {showTooltip && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#1F2937',
                color: '#FFFFFF',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'Poppins-Medium',
                whiteSpace: 'nowrap',
                zIndex: 1000,
                marginBottom: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              {title}
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  border: '4px solid transparent',
                  borderTopColor: '#1F2937',
                }}
              />
            </div>
          )}
        </div>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPressIn={() => setShowTooltip(true)}
      onPressOut={() => setShowTooltip(false)}
      style={{ alignItems: 'center' }}
    >
      <Icon size={size} color={color} />
      {showTooltip && (
        <View
          style={{
            position: 'absolute',
            bottom: '100%',
            backgroundColor: '#1F2937',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            marginBottom: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 12,
              fontFamily: 'Poppins-Medium',
            }}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1F2937',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarShowLabel: false, // Ocultar las etiquetas
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mi Lista',
          tabBarIcon: ({ size, color, focused }) => (
            <TabIconWithTooltip 
              icon={List} 
              size={size} 
              color={color} 
              title="Mi Lista"
              isActive={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="incomplete"
        options={{
          title: 'Incompletas',
          tabBarIcon: ({ size, color, focused }) => (
            <TabIconWithTooltip 
              icon={Clock} 
              size={size} 
              color={color} 
              title="Incompletas"
              isActive={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="completed"
        options={{
          title: 'Completadas',
          tabBarIcon: ({ size, color, focused }) => (
            <TabIconWithTooltip 
              icon={CheckCircle} 
              size={size} 
              color={color} 
              title="Completadas"
              isActive={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ size, color, focused }) => (
            <TabIconWithTooltip 
              icon={BarChart3} 
              size={size} 
              color={color} 
              title="Estadísticas"
              isActive={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}