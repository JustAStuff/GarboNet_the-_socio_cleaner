import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ViewStyle,
    TextStyle
} from 'react-native';
import { COLORS, SHADOWS } from '../theme/colors';

// --- PREMIUM CARD ---
export const Card: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({ children, style }) => (
    <View style={[styles.card, SHADOWS.soft, style]}>{children}</View>
);

// --- PREMIUM BUTTON ---
interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    type?: 'primary' | 'secondary' | 'danger' | 'outline';
    style?: ViewStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    title,
    onPress,
    loading,
    type = 'primary',
    style
}) => {
    const isOutline = type === 'outline';
    const bgColor = type === 'primary' ? COLORS.primary : type === 'secondary' ? COLORS.secondary : type === 'danger' ? COLORS.danger : 'transparent';

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: bgColor, borderColor: isOutline ? COLORS.primary : 'transparent', borderWidth: isOutline ? 1.5 : 0 },
                style
            ]}
            onPress={onPress}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color={isOutline ? COLORS.primary : COLORS.white} />
            ) : (
                <Text style={[styles.buttonText, { color: isOutline ? COLORS.primary : COLORS.white }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

// --- STATUS BADGE ---
export const StatusBadge: React.FC<{ status: string; confidence?: number }> = ({ status, confidence }) => {
    const getStatusColor = () => {
        switch (status.toLowerCase()) {
            case 'pending': return COLORS.accent;
            case 'resolved': return COLORS.success;
            case 'escalated': return COLORS.danger;
            default: return COLORS.secondary;
        }
    };

    return (
        <View style={[styles.badge, { backgroundColor: getStatusColor() + '20' }]}>
            <View style={[styles.dot, { backgroundColor: getStatusColor() }]} />
            <Text style={[styles.badgeText, { color: getStatusColor() }]}>
                {status} {confidence ? `(${Math.round(confidence * 100)}%)` : ''}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 20,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    button: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
        width: '100%',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
});
