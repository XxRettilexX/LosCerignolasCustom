import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { Colors } from '../constants/Colors';

interface GradientButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    style?: ViewStyle;
    variant?: 'primary' | 'secondary' | 'danger';
}

const GradientButton: React.FC<GradientButtonProps> = ({
    title,
    onPress,
    loading = false,
    style,
    variant = 'primary',
}) => {
    const getGradientColors = (): [string, string] => {
        switch (variant) {
            case 'secondary':
                return [Colors.secondary, '#003080']; // blu scuro
            case 'danger':
                return ['#FF6B6B', '#FF3B3B']; // rosso logout
            default:
                return [Colors.primary, '#FFB800']; // giallo oro
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={!loading ? onPress : undefined}
            style={[styles.buttonWrapper, style]}
        >
            <LinearGradient colors={getGradientColors()} style={styles.gradient}>
                {loading ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.text}>{title}</Text>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonWrapper: {
        borderRadius: 25,
        overflow: 'hidden',
        width: '100%',
    },
    gradient: {
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 25,
    },
    text: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});

export default GradientButton;
