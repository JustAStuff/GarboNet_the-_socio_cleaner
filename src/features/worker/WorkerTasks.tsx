import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MOCK_TASKS = [
  { id: '1', location: 'Ward 12, Main St.', distance: '1.2 km', priority: 'High', type: 'Plastic' },
  { id: '2', location: 'Park Avenue Bin', distance: '3.4 km', priority: 'Medium', type: 'Organic' },
];

export default function WorkerTasks() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Assigned Tasks</Text>
      <FlatList 
        data={MOCK_TASKS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('TaskDetail', { task: item })}
          >
            <View>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.details}>{item.type} • {item.distance}</Text>
            </View>
            <Text style={styles.priority(item.priority)}>{item.priority}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  card: { 
    backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, elevation: 3 
  },
  location: { fontSize: 18, fontWeight: '600' },
  details: { color: 'gray', marginTop: 5 },
  priority: (p: string) => ({ color: p === 'High' ? 'red' : 'orange', fontWeight: 'bold' })
});
