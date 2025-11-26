import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Main Screens
import HomeScreen from '../screens/HomeScreen';
import LessonsScreen from '../screens/LessonsScreen';
import LessonDetailScreen from '../screens/LessonDetailScreen';
import EditorScreen from '../screens/EditorScreen';
import RoomsScreen from '../screens/RoomsScreen';
import CodeRoomScreen from '../screens/CodeRoomScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack - for non-authenticated users
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Main Tabs - for authenticated users
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#667eea',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Strona główna',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <TabIcon icon="🏠" color={color} />,
        }}
      />
      <Tab.Screen
        name="Lessons"
        component={LessonsScreen}
        options={{
          title: 'Lekcje',
          tabBarLabel: 'Lekcje',
          tabBarIcon: ({ color }) => <TabIcon icon="📚" color={color} />,
        }}
      />
      <Tab.Screen
        name="Rooms"
        component={RoomsScreen}
        options={{
          title: 'Pokoje',
          tabBarLabel: 'Pokoje',
          tabBarIcon: ({ color }) => <TabIcon icon="🚪" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color }) => <TabIcon icon="👤" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Simple Tab Icon Component
function TabIcon({ icon, color }) {
  return (
    <Text style={{ fontSize: 24, color }}>{icon}</Text>
  );
}

// Main Stack - wraps tabs with detail screens
function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#667eea' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LessonDetail"
        component={LessonDetailScreen}
        options={{ title: 'Szczegóły lekcji' }}
      />
      <Stack.Screen
        name="Editor"
        component={EditorScreen}
        options={{ title: 'Edytor kodu' }}
      />
      <Stack.Screen
        name="CodeRoom"
        component={CodeRoomScreen}
        options={{ title: 'Pokój współpracy' }}
      />
    </Stack.Navigator>
  );
}

// Main App Navigator
export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // or a loading screen
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
