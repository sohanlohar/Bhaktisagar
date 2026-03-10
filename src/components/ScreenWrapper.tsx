import React from 'react';
import { View, StatusBar, StyleSheet, StatusBarStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

interface ScreenWrapperProps {
    children: React.ReactNode;
    backgroundColor?: string;
    statusBarColor?: string;
    barStyle?: StatusBarStyle;
    edges?: Edge[];
}

/**
 * Universal ScreenWrapper to handle SafeArea and StatusBar consistently.
 * Now simplified to rely on root SafeAreaProvider.
 */
const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
    children,
    backgroundColor,
    statusBarColor,
    barStyle,
    edges = ['top']
}) => {
    const { colors, isDarkMode } = useTheme();

    const finalBgColor = backgroundColor || colors.statusBarBg;
    const finalStatusBarColor = statusBarColor || colors.statusBarBg;
    const finalBarStyle = barStyle || (isDarkMode ? 'light-content' : 'dark-content');

    return (
        <View style={[styles.container, { backgroundColor: finalBgColor }]}>
            <StatusBar
                barStyle={finalBarStyle}
                backgroundColor={finalStatusBarColor}
                translucent={true}
            />
            <SafeAreaView style={{ flex: 1 }} edges={edges}>
                <View style={[styles.innerContainer, { backgroundColor: colors.background }]}>
                    {children}
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
    },
});

export default ScreenWrapper;
