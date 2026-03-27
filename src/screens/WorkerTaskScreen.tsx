import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Image,
    Linking,
    Platform,
    Alert,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
    PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FirebaseService, Complaint } from '../services/FirebaseService';
import { Card, PrimaryButton, StatusBadge } from '../components/UI';
import { COLORS } from '../theme/colors';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function WorkerTaskScreen() {
    const [tasks, setTasks] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<Complaint | null>(null);
    const [afterImage, setAfterImage] = useState<string | null>(null);
    const [afterBase64, setAfterBase64] = useState<string | null>(null);
    const [aiResult, setAiResult] = useState<any>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const unsubscribe = FirebaseService.listenComplaints(
            (newTasks) => {
                setTasks(newTasks);
                setLoading(false);
            },
            'worker'
        );
        return () => unsubscribe();
    }, []);

    const openInMaps = (lat: number, lng: number) => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const label = 'Garbage Location';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        if (url) Linking.openURL(url);
    };

    const handleResolve = (task: Complaint) => {
        setSelectedTask(task);
        setAfterImage(null);
        setAfterBase64(null);
        setAiResult(null);
    };

    const captureAfterPhoto = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert('Permission Denied', 'Camera access is required.');
                    return;
                }
            }
            const { launchCamera } = require('react-native-image-picker');
            // FIX: includeBase64: true for AI processing
            launchCamera({ mediaType: 'photo', quality: 0.5, includeBase64: true }, async (res: any) => {
                if (res.didCancel || res.errorCode || !res.assets?.[0]?.uri) return;

                const uri = res.assets[0].uri;
                const b64 = res.assets[0].base64;

                setAfterImage(uri);
                setAfterBase64(b64);

                // Run AI Validation on the cleanup!
                try {
                    const { AIService } = require('../services/AIService');
                    const prediction = await AIService.classifyWaste(uri, b64);
                    setAiResult(prediction);
                } catch (err) {
                    console.warn('Worker AI error', err);
                }
            });
        } catch (e) {
            Alert.alert('Error', 'Could not open camera.');
        }
    };

    const submitResolution = async () => {
        if (!afterImage || !selectedTask || !afterBase64) return;
        setUploading(true);
        try {
            const afterUrl = await FirebaseService.uploadImage(afterBase64);
            await updateDoc(doc(db, 'complaints', selectedTask.id!), {
                status: 'Resolved',
                after_image_url: afterUrl,
                after_ai_result: aiResult, // Proof that it's clean (or what it is now)
                resolved_at: new Date(),
            });
            Alert.alert('✅ Success', 'Task marked as resolved!');
            setSelectedTask(null);
            setAfterImage(null);
            setAfterBase64(null);
            setAiResult(null);
        } catch (e) {
            Alert.alert('Error', 'Failed to submit. Try again.');
        } finally {
            setUploading(false);
        }
    };

    const renderTask = ({ item }: { item: Complaint }) => (
        <Card style={styles.taskCard}>
            <View style={styles.cardHeader}>
                <StatusBadge status={item.status} />
                {item.is_hotspot && (
                    <View style={styles.hotspotBadge}>
                        <Icon name="fire" size={12} color={COLORS.danger} />
                        <Text style={styles.hotspotLabel}>HOTSPOT</Text>
                    </View>
                )}
            </View>

            <Image source={{ uri: item.image_url }} style={styles.taskImage} />

            <Text style={styles.wasteType}>{item.waste_types.join(', ')}</Text>

            <View style={styles.locationContainer}>
                <Icon name="map-marker" size={16} color={COLORS.textSecondary} />
                <Text style={styles.locationText}>
                    {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
                </Text>
            </View>

            <View style={styles.actionRow}>
                <PrimaryButton
                    title="Navigate"
                    onPress={() => openInMaps(item.latitude, item.longitude)}
                    type="outline"
                    style={{ flex: 1, marginRight: 8 }}
                />
                <PrimaryButton
                    title="Mark Resolved"
                    onPress={() => handleResolve(item)}
                    style={{ flex: 1.5 }}
                />
            </View>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Assigned Tasks 👷</Text>
            {tasks.length === 0 ? (
                <View style={styles.emptyState}>
                    <Icon name="check-all" size={80} color={COLORS.textSecondary} />
                    <Text style={styles.emptyText}>No pending tasks. Great job!</Text>
                </View>
            ) : (
                <FlatList
                    data={tasks}
                    renderItem={renderTask}
                    keyExtractor={(item) => item.id!}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                />
            )}

            {/* RESOLUTION MODAL */}
            <Modal visible={!!selectedTask} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Complete Task</Text>
                        <Text style={styles.modalSubtitle}>
                            Take an "after" photo to verify cleanup
                        </Text>

                        {!afterImage ? (
                            <TouchableOpacity
                                style={styles.captureBox}
                                onPress={captureAfterPhoto}
                            >
                                <Icon name="camera" size={48} color={COLORS.primary} />
                                <Text style={styles.captureText}>Tap to Capture</Text>
                            </TouchableOpacity>
                        ) : (
                            <View>
                                <Image source={{ uri: afterImage }} style={styles.afterPreview} />
                                <TouchableOpacity
                                    style={styles.retakeBtn}
                                    onPress={() => setAfterImage(null)}
                                >
                                    <Text style={styles.retakeText}>🔄 Retake</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.cancelBtn]}
                                onPress={() => {
                                    setSelectedTask(null);
                                    setAfterImage(null);
                                }}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.modalBtn,
                                    styles.submitBtn,
                                    { opacity: !afterImage || uploading ? 0.5 : 1 },
                                ]}
                                onPress={submitResolution}
                                disabled={!afterImage || uploading}
                            >
                                {uploading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.submitText}>✓ Submit</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { fontSize: 24, fontWeight: '800', margin: 20, marginBottom: 10, color: COLORS.text },
    taskCard: { marginBottom: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    hotspotBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.danger + '15',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    hotspotLabel: { color: COLORS.danger, fontWeight: '900', fontSize: 10, marginLeft: 4 },
    taskImage: { width: '100%', height: 180, borderRadius: 12, marginBottom: 12 },
    wasteType: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
    locationContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    locationText: { fontSize: 12, color: COLORS.textSecondary, marginLeft: 4 },
    actionRow: { flexDirection: 'row' },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '600', marginTop: 16 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        minHeight: 400,
    },
    modalTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text },
    modalSubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 4,
        marginBottom: 24,
    },
    captureBox: {
        height: 200,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: COLORS.primary,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary + '08',
        marginBottom: 20,
    },
    captureText: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.primary,
    },
    afterPreview: { width: '100%', height: 220, borderRadius: 16, marginBottom: 12 },
    retakeBtn: {
        backgroundColor: COLORS.danger + '15',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    retakeText: { color: COLORS.danger, fontWeight: '700' },
    modalActions: { flexDirection: 'row', gap: 12 },
    modalBtn: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
    cancelBtn: { backgroundColor: COLORS.background },
    cancelText: { fontWeight: '700', color: COLORS.text },
    submitBtn: { backgroundColor: COLORS.primary },
    submitText: { fontWeight: '700', color: 'white' },
});
