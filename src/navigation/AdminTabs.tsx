import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppDispatch } from '../hooks/useRedux';
import { logout } from '../store/authSlice';
import AdminDashboard from '../screens/AdminDashboard';
import { COLORS } from '../theme/colors';

const Tab = createBottomTabNavigator();

function AdminSettings() {
  const dispatch = useAppDispatch();
  return (
    <View style={styles.center}>
      <Icon name="shield-account" size={80} color={COLORS.primary} style={{ marginBottom: 16 }} />
      <Text style={styles.title}>System Settings</Text>
      <TouchableOpacity style={styles.logoutBtn} onPress={() => dispatch(logout())}>
        <Icon name="logout" size={20} color="white" />
        <Text style={styles.logoutText}>Admin Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: styles.tabBar
      }}
    >
      <Tab.Screen
        name="Stats"
        component={AdminDashboard}
        options={{
          tabBarIcon: ({ color }) => <Icon name="view-dashboard" size={24} color={color} />,
          title: 'Insights'
        }}
      />
      <Tab.Screen
        name="Team"
        component={AdminSettings}
        options={{
          tabBarIcon: ({ color }) => <Icon name="account-group" size={24} color={color} />,
          title: 'Management'
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: { height: 70, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: 'white', elevation: 25 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 20 },
  logoutBtn: { backgroundColor: COLORS.danger, flexDirection: 'row', padding: 15, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: 'white', fontWeight: '700', marginLeft: 8 }
});
