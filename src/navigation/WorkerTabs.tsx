import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import WorkerTasks from '../features/worker/WorkerTasks';
import WorkerTaskDetail from '../features/worker/WorkerTaskDetail';
import { View, Text, Button } from 'react-native';
import { useAppDispatch } from '../hooks/useRedux';
import { logout } from '../store/authSlice';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TaskStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="WorkerTasks" component={WorkerTasks} options={{ headerShown: false }} />
      <Stack.Screen name="TaskDetail" component={WorkerTaskDetail} options={{ title: 'Task Details' }} />
    </Stack.Navigator>
  );
}

function History() {
  const dispatch = useAppDispatch();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Completion History</Text>
      <Button title="Logout" onPress={() => dispatch(logout())} color="red" />
    </View>
  );
}

export default function WorkerTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Tasks Stack" component={TaskStack} options={{ title: 'Assigned Tasks' }} />
      <Tab.Screen name="History" component={History} />
    </Tab.Navigator>
  );
}
