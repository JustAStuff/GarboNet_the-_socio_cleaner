import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Circle } from 'react-native-maps';

const MOCK_HOTSPOTS = [
  { id: 1, lat: 12.9716, lng: 77.5946, intensity: 50 },
  { id: 2, lat: 12.9730, lng: 77.5920, intensity: 100 },
];

export default function AdminHeatmap() {
  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: 12.9716,
          longitude: 77.5946,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {MOCK_HOTSPOTS.map((spot) => (
          <Circle
            key={spot.id}
            center={{ latitude: spot.lat, longitude: spot.lng }}
            radius={spot.intensity * 2}
            fillColor="rgba(255, 0, 0, 0.3)"
            strokeColor="rgba(255, 0, 0, 0.5)"
          />
        ))}
      </MapView>

      <View style={styles.overlay}>
        <Text style={styles.title}>Waste Density Heatmap</Text>
        <Text style={styles.subtitle}>Red zones indicate frequent dumping</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute', top: 50, left: 20, right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)', padding: 15, borderRadius: 10,
    shadowColor: '#000', shadowOpacity: 0.2, elevation: 5
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { color: 'gray', marginTop: 4 }
});
