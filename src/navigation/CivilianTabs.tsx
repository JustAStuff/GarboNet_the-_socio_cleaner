import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { logout } from '../store/authSlice';
import ReportWasteScreen from '../screens/ReportWasteScreen';
import MyReportsScreen from '../screens/MyReportsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { COLORS } from '../theme/colors';

const Tab = createBottomTabNavigator();

// Using emoji instead of vector icons to avoid native font crash on tab load
const TabIcon = ({ emoji, color }: { emoji: string; color: string }) => (
  <Text style={{ fontSize: 20, opacity: color === COLORS.primary ? 1 : 0.5 }}>{emoji}</Text>
);

function ProfileSimple() {
  const dispatch = useAppDispatch();
  const { role } = useAppSelector(s => s.auth);
  return (
    <View style={styles.center}>
      <Text style={styles.profileEmoji}>👤</Text>
      <Text style={styles.title}>Account Info</Text>
      <Text style={styles.roleLabel}>Logged in as: {role}</Text>
      <TouchableOpacity style={styles.logoutBtn} onPress={() => dispatch(logout())}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
      <Text style={styles.hint}>Configure AI settings in the Settings tab</Text>
    </View>
  );
}

export default function CivilianTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Report"
        component={ReportWasteScreen}
        options={{
          tabBarIcon: ({ color }) => <TabIcon emoji="📷" color={color} />,
          title: 'Report',
        }}
      />
      <Tab.Screen
        name="MyReports"
        component={MyReportsScreen}
        options={{
          tabBarIcon: ({ color }) => <TabIcon emoji="📋" color={color} />,
          title: 'My Reports',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileSimple}
        options={{
          tabBarIcon: ({ color }) => <TabIcon emoji="👤" color={color} />,
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white',
    elevation: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  profileEmoji: { fontSize: 72, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 8, color: COLORS.text },
  roleLabel: { color: COLORS.textSecondary, marginBottom: 32, fontSize: 14 },
  logoutBtn: {
    backgroundColor: COLORS.danger,
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoutText: { color: 'white', fontWeight: '700', fontSize: 16 },
  hint: { fontSize: 12, color: COLORS.textSecondary, marginTop: 20, textAlign: 'center' },
});
