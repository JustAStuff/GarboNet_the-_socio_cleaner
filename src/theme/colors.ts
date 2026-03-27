export const COLORS = {
    primary: '#0b9a6a', // Eco Green
    secondary: '#2196F3', // Civic Blue
    accent: '#FF9800', // Warning/Pending Orange
    danger: '#F44336', // Error Red
    background: '#F9FBFC', // Clean light blue-grey
    card: '#FFFFFF',
    text: '#1A1C1E', // Dark Onyx
    textSecondary: '#6C757D', // Muted Grey
    border: '#E9ECEF',
    white: '#FFFFFF',
    shadow: '#000000',
    success: '#4CAF50',
};

export const SHADOWS = {
    soft: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    medium: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
};
