import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const METRICS = [
  { label: 'Total Complaints', value: '1,245', color: '#333' },
  { label: 'Resolved Today', value: '38', color: '#0b9a6a' },
  { label: 'SLA Breaches', value: '12', color: 'red' },
  { label: 'Active Workers', value: '45', color: '#007bff' },
];

export default function AdminDashboard({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Overview</Text>

      <View style={styles.grid}>
        {METRICS.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={[styles.value, { color: item.color }]}>{item.value}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.header, { marginTop: 30, fontSize: 22 }]}>Quick Actions</Text>
      <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Heatmap')}>
        <Text style={styles.actionText}>🗺️ View Pollution Heatmap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#f5f5f5' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { 
    width: '47%', backgroundColor: '#fff', padding: 20, marginBottom: 15, 
    borderRadius: 12, alignItems: 'center', shadowColor: '#000', 
    shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, elevation: 3 
  },
  value: { fontSize: 32, fontWeight: 'bold' },
  label: { fontSize: 14, color: 'gray', marginTop: 5, textAlign: 'center' },
  actionBtn: { backgroundColor: '#333', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  actionText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
