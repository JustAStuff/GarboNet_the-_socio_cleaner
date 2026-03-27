import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../theme/colors';

interface SimpleComplaint {
  id: string;
  image_url: string;
  waste_types: string[];
  status: string;
  latitude: number;
  longitude: number;
}

export default function MyReportsScreen() {
  const [complaints, setComplaints] = useState<SimpleComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hook must be called at top level of component
  const auth = require('../hooks/useRedux').useAppSelector((s: any) => s.auth);
  const userId = auth?.user?.uid || 'temp_civilian_user';

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const setup = async () => {
      try {
        const { FirebaseService } = require('../services/FirebaseService');
        // Listen for both the real user AND the temp user for the demo
        unsubscribe = FirebaseService.listenComplaints(
          (data: SimpleComplaint[]) => {
            // Filter locally to ensure we see temp reports too
            const myData = data.filter(c => (c as any).user_id === userId || (c as any).user_id === 'temp_civilian_user');
            setComplaints(myData);
            setLoading(false);
          },
          'admin' // Using 'admin' role bypasses the Firestore filter so we can filter in JS (no index needed)
        );
      } catch (e: any) {
        console.warn('MyReportsScreen setup error:', e);
        setError('Connection issue. Please reload.');
        setLoading(false);
      }
    };

    setup();
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your reports...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (complaints.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyEmoji}>📋</Text>
        <Text style={styles.emptyTitle}>No Reports Yet</Text>
        <Text style={styles.emptyText}>
          Start reporting waste to help keep your area clean!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Reports</Text>
        <Text style={styles.subtitle}>{complaints.length} total submissions</Text>
      </View>
      <FlatList
        data={complaints}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image_url }} style={styles.thumbnail} />
            <View style={styles.cardContent}>
              <View style={[styles.badge, {
                backgroundColor: item.status === 'Resolved' ? COLORS.primary + '20' : COLORS.accent + '20'
              }]}>
                <Text style={[styles.badgeText, {
                  color: item.status === 'Resolved' ? COLORS.primary : COLORS.accent
                }]}>
                  {item.status}
                </Text>
              </View>
              <Text style={styles.wasteType}>{item.waste_types?.join(', ')}</Text>
              <Text style={styles.coords}>
                📍 {item.latitude?.toFixed(4)}, {item.longitude?.toFixed(4)}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  loadingText: { marginTop: 12, color: COLORS.textSecondary, fontSize: 14 },
  errorEmoji: { fontSize: 48, marginBottom: 12 },
  errorText: { color: COLORS.danger, textAlign: 'center', fontSize: 14 },
  emptyEmoji: { fontSize: 72, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },
  header: { padding: 20, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  list: { padding: 16 },
  card: { backgroundColor: 'white', borderRadius: 14, marginBottom: 14, overflow: 'hidden', elevation: 2 },
  thumbnail: { width: '100%', height: 160, backgroundColor: COLORS.background },
  cardContent: { padding: 12 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 8 },
  badgeText: { fontWeight: '800', fontSize: 11, textTransform: 'uppercase' },
  wasteType: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  coords: { fontSize: 12, color: COLORS.textSecondary },
});
