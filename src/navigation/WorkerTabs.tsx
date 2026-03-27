import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppDispatch } from '../hooks/useRedux';
import { logout } from '../store/authSlice';
import WorkerTaskScreen from '../screens/WorkerTaskScreen';
import { COLORS } from '../theme/colors';

const Tab = createBottomTabNavigator();

function WorkerProfile() {
  const dispatch = useAppDispatch();
  return (
    <View style={styles.center}>
      <Icon name="account-hard-hat" size={80} color={COLORS.secondary} style={{ marginBottom: 16 }} />
      <Text style={styles.title}>Worker Session</Text>
      <TouchableOpacity style={styles.logoutBtn} onPress={() => dispatch(logout())}>
        <Icon name="logout" size={20} color="white" />
        <Text style={styles.logoutText}>End Shift & Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function WorkerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.secondary, // Workers have blue theme
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: styles.tabBar
      }}
    >
      <Tab.Screen
        name="Tasks"
        component={WorkerTaskScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="clipboard-list" size={24} color={color} />,
          title: 'My Tasks'
        }}
      />
      <Tab.Screen
        name="Profile"
        component={WorkerProfile}
        options={{
          tabBarIcon: ({ color }) => <Icon name="account" size={24} color={color} />,
          title: 'Logout'
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: { height: 70, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: 'white', elevation: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 20 },
  logoutBtn: { backgroundColor: COLORS.danger, flexDirection: 'row', padding: 15, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: 'white', fontWeight: '700', marginLeft: 8 }
});
