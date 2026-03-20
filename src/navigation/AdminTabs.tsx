import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminDashboard from '../features/admin/AdminDashboard';
import AdminHeatmap from '../features/admin/AdminHeatmap';
import { View, Text, Button } from 'react-native';
import { useAppDispatch } from '../hooks/useRedux';
import { logout } from '../store/authSlice';

const Tab = createBottomTabNavigator();

function AdminSettings() {
  const dispatch = useAppDispatch();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>System Settings</Text>
      <Button title="Logout" onPress={() => dispatch(logout())} color="red" />
    </View>
  );
}

export default function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard" component={AdminDashboard} />
      <Tab.Screen name="Heatmap" component={AdminHeatmap} />
      <Tab.Screen name="Settings" component={AdminSettings} />
    </Tab.Navigator>
  );
}
