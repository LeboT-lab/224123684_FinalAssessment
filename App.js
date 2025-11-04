import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { auth, db } from './src/services/firebaseConfig';

import { AuthProvider } from './src/context/AuthContext';

import OnboardingScreen from './src/screens/onboarding/onboardingScreen';
import SignInScreen from './src/screens/auth/SignInScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import ExploreScreen from './src/screens/main/ExploreScreen';
import HotelDetailsScreen from './src/screens/main/HotelDetailsScreen';
import BookingScreen from './src/screens/booking/BookingScreen';
import MyBookingsScreen from './src/screens/booking/MyBookingsScreen';
import ReviewsScreen from './src/screens/reviews/ReviewsScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.tabIconContainer}>
              <Text style={[styles.tabIcon, { color }]}>🏨</Text>
            </View>
          ),
          tabBarLabel: 'Explore',
        }}
      />
      <Tab.Screen 
        name="MyBookings" 
        component={MyBookingsScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.tabIconContainer}>
              <Text style={[styles.tabIcon, { color }]}>📅</Text>
            </View>
          ),
          tabBarLabel: 'My Bookings',
        }}
      />
      <Tab.Screen 
        name="Reviews" 
        component={ReviewsScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.tabIconContainer}>
              <Text style={[styles.tabIcon, { color }]}>⭐</Text>
            </View>
          ),
          tabBarLabel: 'Reviews',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.tabIconContainer}>
              <Text style={[styles.tabIcon, { color }]}>👤</Text>
            </View>
          ),
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = {
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 24,
  },
};

export default function App() {
  console.log('Firebase Auth:', auth ? 'Connected' : 'Not connected');
  console.log('Firestore:', db ? 'Connected' : 'Not connected');

  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            cardStyle: { backgroundColor: '#fff' }
          }}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="HotelDetails" component={HotelDetailsScreen} />
          <Stack.Screen name="Booking" component={BookingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}