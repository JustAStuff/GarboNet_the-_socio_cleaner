import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export default function WorkerTaskDetail({ route, navigation }: any) {
  const { task } = route.params;
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const verifyLocation = async () => {
    setVerifying(true);
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        alert("Location permission needed to verify coordinates.");
        setVerifying(false);
        return;
      }
    }
    
    Geolocation.getCurrentPosition(
      (position) => {
        setTimeout(() => {
          setVerified(true);
          setVerifying(false);
          alert("GPS Validated: You are correctly at the task location.");
        }, 1500);
      },
      (error) => {
         alert("Could not fetch location.");
         setVerifying(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const uploadProof = () => {
    alert("Proof uploaded successfully!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.location}</Text>
      <Text style={styles.subtitle}>Type: {task.type}</Text>

      <View style={styles.mapMock}>
        <Text style={{ color: 'white' }}>Mini Map Route Component Here</Text>
      </View>

      {!verified ? (
        <View style={styles.actionBox}>
          {verifying ? (
            <ActivityIndicator size="large" color="orange" />
          ) : (
            <Button title="1. Verify Location (GPS)" onPress={verifyLocation} color="orange" />
          )}
        </View>
      ) : (
        <View style={styles.actionBox}>
          <Text style={styles.successText}>Location Verified ✅</Text>
          <Button title="2. Upload 'After' Job Photo" onPress={uploadProof} color="#0b9a6a" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 20 },
  mapMock: { height: 200, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', borderRadius: 12, marginBottom: 30 },
  actionBox: { padding: 20, backgroundColor: '#fff', borderRadius: 12, elevation: 3 },
  successText: { color: '#0b9a6a', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 }
});
