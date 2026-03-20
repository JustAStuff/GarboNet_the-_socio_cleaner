import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAppDispatch } from '../hooks/useRedux';
import { setUser } from '../store/authSlice';

function LoginScreen() {
  const dispatch = useAppDispatch();

  const mockLogin = (role: 'civilian' | 'worker' | 'admin') => {
    dispatch(setUser({ user: { uid: 'mock123' }, role }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GarboNet Auth (CLI)</Text>
      <View style={styles.buttonContainer}>
        <Button title="Login as Civilian" onPress={() => mockLogin('civilian')} />
        <Button title="Login as Worker" onPress={() => mockLogin('worker')} color="orange" />
        <Button title="Login as Admin" onPress={() => mockLogin('admin')} color="purple" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40 },
  buttonContainer: { gap: 16, width: '100%', paddingHorizontal: 40 },
});

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
