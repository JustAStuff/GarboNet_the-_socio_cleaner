import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    FlatList,
    Dimensions,
    Image,
} from 'react-native';
import { FirebaseService, Complaint } from '../services/FirebaseService';
import { COLORS } from '../theme/colors';

export default function AdminDashboard() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, escalated: 0 });

    useEffect(() => {
        // Dashboard loads complaints in real-time
        const unsub = FirebaseService.listenComplaints((list: Complaint[]) => {
            setComplaints(list);
            setStats({
                total: list.length,
                pending: list.filter(c => c.status === 'Pending').length,
                resolved: list.filter(c => c.status === 'Resolved').length,
                escalated: list.filter(c => c.escalation_level > 0).length,
            });
        }, 'admin');

        return () => unsub();
    }, []);

    const renderItem = ({ item }: { item: Complaint }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={[styles.badge, { backgroundColor: item.status === 'Resolved' ? COLORS.primary + '20' : COLORS.accent + '20' }]}>
                    <Text style={[styles.badgeText, { color: item.status === 'Resolved' ? COLORS.primary : COLORS.accent }]}>
                        {item.status}
                    </Text>
                </View>
                {item.is_hotspot && <Text style={styles.hotspot}>🔥 HOTSPOT</Text>}
            </View>

            <View style={styles.imageRow}>
                <View style={styles.imageContainer}>
                    <Text style={styles.imageLabel}>Reported 📸</Text>
                    <Image source={{ uri: item.image_url }} style={styles.taskImage} />
                </View>
                {item.after_image_url && (
                    <View style={styles.imageContainer}>
                        <View style={styles.row}>
                            <Text style={styles.imageLabel}>Resolved ✅</Text>
                            {item.after_ai_result && (
                                <Text style={styles.aiBadge}>AI Verified</Text>
                            )}
                        </View>
                        <Image source={{ uri: item.after_image_url }} style={styles.taskImage} />
                    </View>
                )}
            </View>

            <Text style={styles.wasteType}>{item.waste_types?.join(', ') || 'Unknown'}</Text>
            <Text style={styles.coords}>📍 {item.latitude?.toFixed(4)}, {item.longitude?.toFixed(4)}</Text>
            {item.escalation_level > 0 && (
                <Text style={styles.escalated}>⚠️ Escalation Level {item.escalation_level}</Text>
            )}
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Admin Overview 📊</Text>

            <View style={styles.grid}>
                <StatBox label="Total" value={stats.total} color={COLORS.secondary} emoji="📋" />
                <StatBox label="Pending" value={stats.pending} color={COLORS.accent} emoji="⏳" />
                <StatBox label="Resolved" value={stats.resolved} color={COLORS.primary} emoji="✅" />
                <StatBox label="Escalated" value={stats.escalated} color={COLORS.danger} emoji="🚨" />
            </View>

            <Text style={styles.subHeader}>All Reports ({complaints.length})</Text>
            {complaints.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>No complaints yet. The city is clean! 🌿</Text>
                </View>
            ) : (
                <FlatList
                    data={complaints}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id || Math.random().toString()}
                    scrollEnabled={false}
                />
            )}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const StatBox = ({ label, value, color, emoji }: any) => (
    <View style={[styles.statBox, { borderLeftColor: color }]}>
        <Text style={styles.statEmoji}>{emoji}</Text>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const W = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { fontSize: 24, fontWeight: '800', margin: 20, marginBottom: 10, color: COLORS.text },
    subHeader: { fontSize: 17, fontWeight: '700', marginHorizontal: 20, marginTop: 10, marginBottom: 10, color: COLORS.text },
    grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, gap: 10 },
    statBox: {
        backgroundColor: 'white',
        borderRadius: 14,
        padding: 16,
        width: (W / 2) - 22,
        borderLeftWidth: 4,
        elevation: 3,
        alignItems: 'flex-start',
    },
    statEmoji: { fontSize: 22, marginBottom: 6 },
    statValue: { fontSize: 28, fontWeight: '900' },
    statLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600', marginTop: 2 },
    card: { backgroundColor: 'white', marginHorizontal: 20, marginBottom: 12, borderRadius: 14, padding: 16, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    badgeText: { fontWeight: '800', fontSize: 11, textTransform: 'uppercase' },
    hotspot: { color: COLORS.danger, fontWeight: '900', fontSize: 11 },
    wasteType: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
    coords: { fontSize: 12, color: COLORS.textSecondary },
    escalated: { color: COLORS.danger, fontWeight: '700', marginTop: 6, fontSize: 13 },
    empty: { margin: 20, alignItems: 'center', padding: 40 },
    emptyText: { color: COLORS.textSecondary, fontSize: 15, textAlign: 'center' },
    imageRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
    imageContainer: { flex: 1 },
    imageLabel: { fontSize: 10, fontWeight: '800', color: COLORS.textSecondary, marginBottom: 4, textTransform: 'uppercase' },
    taskImage: { width: '100%', height: 120, borderRadius: 10, backgroundColor: COLORS.background },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    aiBadge: { fontSize: 9, fontWeight: '900', color: COLORS.primary, backgroundColor: COLORS.primary + '15', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
});
