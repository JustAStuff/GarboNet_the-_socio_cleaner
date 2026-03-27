import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { AIService } from '../services/AIService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [apiToken, setApiToken] = useState('');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    try {
      const token = await AsyncStorage.getItem('hf_api_token');
      const enabled = await AsyncStorage.getItem('ai_enabled');
      if (token) setApiToken(token);
      if (enabled !== null) setAiEnabled(enabled === 'true');
    } catch (e) {
      console.warn('Failed to load settings');
    }
  };

  React.useEffect(() => {
    loadSettings();
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    try {
      await AsyncStorage.setItem('hf_api_token', apiToken);
      await AsyncStorage.setItem('ai_enabled', aiEnabled.toString());
      AIService.setApiToken(apiToken);
      Alert.alert('✅ Saved', 'Settings updated successfully!');
    } catch (e) {
      Alert.alert('Error', 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.emoji}>⚙️</Text>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure AI and app preferences</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Configuration</Text>

        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingLabel}>Enable AI Validation</Text>
            <Text style={styles.settingDesc}>
              Validate waste images using AI before submission
            </Text>
          </View>
          <Switch
            value={aiEnabled}
            onValueChange={setAiEnabled}
            trackColor={{ false: COLORS.background, true: COLORS.primary + '50' }}
            thumbColor={aiEnabled ? COLORS.primary : COLORS.textSecondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>HuggingFace API Token</Text>
          <Text style={styles.inputHint}>
            Get your free token from: huggingface.co/settings/tokens
          </Text>
          <TextInput
            style={styles.input}
            value={apiToken}
            onChangeText={setApiToken}
            placeholder="hf_xxxxxxxxxxxxxxxxxxxxx"
            placeholderTextColor={COLORS.textSecondary}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About AI Model</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoEmoji}>🧠</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.infoTitle}>ResNet50 Garbage Classifier</Text>
            <Text style={styles.infoText}>
              Model: kendrickfff/my_resnet50_garbage_classification{'\n'}
              Requires 60% confidence to accept images.{'\n'}
              Paste your Hugging Face token above to enable.
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, { opacity: saving ? 0.6 : 1 }]}
        onPress={saveSettings}
        disabled={saving}
      >
        <Text style={styles.saveBtnText}>
          {saving ? '⏳ Saving...' : '💾 Save Settings'}
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>GarboNet v1.0.0</Text>
        <Text style={styles.footerText}>The Socio Cleaner 🌱</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 32 },
  emoji: { fontSize: 52 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.text, marginTop: 12 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  settingLabel: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  settingDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, lineHeight: 16 },
  inputContainer: { marginTop: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  inputHint: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 8 },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 14,
    fontSize: 13,
    color: COLORS.text,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.secondary + '08',
    padding: 14,
    borderRadius: 12,
  },
  infoEmoji: { fontSize: 24 },
  infoTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  infoText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  saveBtn: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  saveBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  footer: { alignItems: 'center', marginTop: 32 },
  footerText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
});
