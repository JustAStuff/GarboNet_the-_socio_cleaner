/**
 * ReportWasteScreen - All external imports are lazy (require inside functions)
 * to prevent top-level import crashes on Android 11.
 */
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    Alert,
    TouchableOpacity,
    PermissionsAndroid,
    Platform,
    ActivityIndicator,
} from 'react-native';

// ⚠️ ONLY React Native core imported at top level.
// All other modules loaded lazily inside functions to prevent Android crash.

export default function ReportWasteScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [base64Value, setBase64Value] = useState<string | null>(null);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [prediction, setPrediction] = useState<{ label: string; confidence: number } | null>(null);
    const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
    const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading'>('idle');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Lazy color loader
    const C = () => require('../theme/colors').COLORS;

    useEffect(() => {
        // Small delay to let the screen fully mount before triggering native GPS
        const timer = setTimeout(() => {
            fetchLocation();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const fetchLocation = async () => {
        setGpsStatus('loading');
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'GarboNet needs your location to tag waste reports.',
                        buttonPositive: 'OK',
                    }
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    setGpsStatus('error');
                    return;
                }
            }
            // Use the high-performance geolocation service
            const Geolocation = require('react-native-geolocation-service').default;
            Geolocation.getCurrentPosition(
                (pos: any) => {
                    setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                    setGpsStatus('done');
                },
                () => setGpsStatus('error'),
                { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
            );
        } catch (e: any) {
            console.warn('GPS error', e);
            setGpsStatus('error');
        }
    };

    const handleCapture = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    { title: 'Camera', message: 'GarboNet needs camera access.', buttonPositive: 'OK' }
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert('Permission Denied', 'Camera permission is required.');
                    return;
                }
            }
            const { launchCamera } = require('react-native-image-picker');
            launchCamera({
                mediaType: 'photo',
                quality: 0.5,
                maxWidth: 1000, // Reduced size to prevent memory crash on Oppo
                maxHeight: 1000,
                saveToPhotos: false,
                includeBase64: true
            }, (res: any) => {
                if (res.didCancel || res.errorCode || !res.assets?.[0]?.uri) return;
                const uri = res.assets[0].uri;
                const b64 = res.assets[0].base64;
                console.log('Capture success, b64 length:', b64?.length || 0);

                setImage(uri);
                setBase64Value(b64);
                validateWithAI(uri, b64);
            });
        } catch (e: any) {
            console.warn('Camera error', e);
            Alert.alert('Error', 'Could not open camera.');
        }
    };

    const validateWithAI = async (uri: string, base64?: string) => {
        setAiStatus('loading');
        setPrediction(null);
        setErrorMsg(null);
        try {
            const { AIService } = require('../services/AIService');
            const result = await AIService.classifyWaste(uri, base64);
            setPrediction(result);
            setAiStatus('done');
        } catch (e: any) {
            setAiStatus('error');
            setErrorMsg('⚠️ AI validation skipped. You can still submit the report.');
        }
    };

    const handleSubmit = async () => {
        if (!image || !location || !base64Value) {
            Alert.alert('Missing Info', 'Please take a photo and wait for GPS.');
            return;
        }
        setSubmitStatus('loading');
        try {
            const { FirebaseService } = require('../services/FirebaseService');
            // USE BASE64 directly – fixed the file-access bug (100% stable)
            const imageUrl = await FirebaseService.uploadImage(base64Value);
            await FirebaseService.createComplaint({
                image_url: imageUrl,
                latitude: location.latitude,
                longitude: location.longitude,
                waste_types: [prediction?.label ?? 'General Waste'],
                confidence: prediction?.confidence ?? 1.0,
            });
            Alert.alert('✅ Submitted!', 'Authorities have been notified.', [
                {
                    text: 'OK', onPress: () => {
                        setImage(null); setPrediction(null);
                        setAiStatus('idle'); setSubmitStatus('idle');
                    }
                }
            ]);
        } catch {
            Alert.alert('Error', 'Failed to submit. Check internet connection.');
            setSubmitStatus('idle');
        }
    };

    const colors = C();
    const gpsColor = gpsStatus === 'done' ? colors.primary : gpsStatus === 'error' ? colors.danger : colors.accent;

    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.content}>
            <Text style={[styles.header, { color: colors.text }]}>Report Waste 🗑️</Text>

            {/* GPS CARD */}
            <View style={[styles.card, styles.statusRow]}>
                <Text style={styles.dot}>📍</Text>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>GPS LOCATION</Text>
                    <Text style={[styles.value, { color: gpsColor }]}>
                        {gpsStatus === 'loading' ? 'Acquiring...' :
                            gpsStatus === 'done' ? `${location?.latitude?.toFixed(5)}, ${location?.longitude?.toFixed(5)}` :
                                gpsStatus === 'error' ? 'Failed — tap Retry' : 'Waiting...'}
                    </Text>
                </View>
                {gpsStatus === 'loading' && <ActivityIndicator color={colors.primary} />}
                {(gpsStatus === 'error' || gpsStatus === 'idle') && (
                    <TouchableOpacity onPress={fetchLocation} style={[styles.chip, { backgroundColor: colors.secondary + '22' }]}>
                        <Text style={[styles.chipText, { color: colors.secondary }]}>Retry</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* AI STATUS */}
            {image && (
                <View style={[styles.card, styles.statusRow]}>
                    <Text style={styles.dot}>🤖</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>AI VALIDATION</Text>
                        <Text style={[styles.value, {
                            color: aiStatus === 'done' ? colors.primary : aiStatus === 'error' ? colors.danger : colors.accent
                        }]}>
                            {aiStatus === 'loading' ? 'Analyzing image...' :
                                aiStatus === 'done' ? `${prediction?.label} (${Math.round((prediction?.confidence ?? 0) * 100)}%)` :
                                    aiStatus === 'error' ? 'Skipped (no API key)' : 'Waiting...'}
                        </Text>
                    </View>
                    {aiStatus === 'loading' && <ActivityIndicator color={colors.secondary} />}
                </View>
            )}

            {/* ERROR */}
            {errorMsg && (
                <View style={[styles.card, { borderLeftWidth: 3, borderLeftColor: colors.danger }]}>
                    <Text style={{ color: colors.danger, fontWeight: '600', fontSize: 13 }}>{errorMsg}</Text>
                </View>
            )}

            {/* CAMERA */}
            {!image ? (
                <TouchableOpacity
                    style={[styles.cameraBox, { borderColor: colors.primary }]}
                    onPress={handleCapture}
                >
                    <Text style={{ fontSize: 52 }}>📷</Text>
                    <Text style={[styles.cameraLabel, { color: colors.primary }]}>Tap to Snap a Waste Photo</Text>
                </TouchableOpacity>
            ) : (
                <View style={{ marginBottom: 16 }}>
                    <Image source={{ uri: image }} style={styles.preview} resizeMode="cover" />
                    <TouchableOpacity
                        style={[styles.retakeBtn, { backgroundColor: colors.danger + '18' }]}
                        onPress={() => { setImage(null); setPrediction(null); setAiStatus('idle'); setErrorMsg(null); }}
                    >
                        <Text style={{ color: colors.danger, fontWeight: '700' }}>🔄 Retake Photo</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* SUBMIT */}
            {image && (
                <TouchableOpacity
                    style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: (!location || submitStatus === 'loading') ? 0.5 : 1 }]}
                    onPress={handleSubmit}
                    disabled={!location || submitStatus === 'loading'}
                >
                    {submitStatus === 'loading'
                        ? <ActivityIndicator color="white" />
                        : <Text style={styles.submitTxt}>🚀 Submit to Authorities</Text>}
                </TouchableOpacity>
            )}

            {!image && (
                <Text style={[styles.hint, { color: colors.textSecondary }]}>
                    {'Take a clear photo of the waste.\nGPS location will be attached automatically.'}
                </Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: { padding: 20, paddingBottom: 60 },
    header: { fontSize: 26, fontWeight: '800', marginBottom: 16 },
    card: { backgroundColor: 'white', borderRadius: 14, padding: 14, marginBottom: 12, elevation: 2 },
    statusRow: { flexDirection: 'row', alignItems: 'center' },
    dot: { fontSize: 18, marginRight: 10 },
    label: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    value: { fontSize: 13, fontWeight: '700', marginTop: 2 },
    chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
    chipText: { fontWeight: '700', fontSize: 12 },
    cameraBox: { height: 220, borderWidth: 2, borderStyle: 'dashed', borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', marginBottom: 16 },
    cameraLabel: { marginTop: 14, fontWeight: '700', fontSize: 15 },
    preview: { width: '100%', height: 280, borderRadius: 16 },
    retakeBtn: { marginTop: 10, padding: 12, borderRadius: 10, alignItems: 'center' },
    submitBtn: { padding: 18, borderRadius: 14, alignItems: 'center', marginTop: 4 },
    submitTxt: { color: 'white', fontSize: 16, fontWeight: '800' },
    hint: { textAlign: 'center', marginTop: 30, lineHeight: 24, fontSize: 14 },
});
