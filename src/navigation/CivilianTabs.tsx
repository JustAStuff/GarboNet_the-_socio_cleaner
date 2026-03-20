import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import CivilianHome from '../features/civilian/CivilianHome';
import ReportFlow from '../features/civilian/ReportFlow';
import { View, Text, Button } from 'react-native';
import { useAppDispatch } from '../hooks/useRedux';
import { logout } from '../store/authSlice';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CivilianHome" component={CivilianHome} />
      <Stack.Screen name="Report" component={ReportFlow} />
    </Stack.Navigator>
  );
}

function MyReports() {
  const dispatch = useAppDispatch();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20, fontWeight: 'bold' }}>My Reports Timeline</Text>
      <Text style={{ color: 'gray', marginBottom: 40 }}>- Waste reported at MS Road (Pending)</Text>
      <Button title="Logout" onPress={() => dispatch(logout())} color="red" />
    </View>
  );
}

export default function CivilianTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="My Reports" component={MyReports} />
    </Tab.Navigator>
  );
}
