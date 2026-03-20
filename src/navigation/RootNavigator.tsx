import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { View, ActivityIndicator } from 'react-native';
import { setLoading } from '../store/authSlice';

import AuthStack from './AuthStack';
import CivilianTabs from './CivilianTabs';
import WorkerTabs from './WorkerTabs';
import AdminTabs from './AdminTabs';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { user, role, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 500);
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0b9a6a" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : role === 'civilian' ? (
          <Stack.Screen name="CivilianApp" component={CivilianTabs} />
        ) : role === 'worker' ? (
          <Stack.Screen name="WorkerApp" component={WorkerTabs} />
        ) : (
          <Stack.Screen name="AdminApp" component={AdminTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
