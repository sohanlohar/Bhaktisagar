import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

/**
 * Universal ScreenWrapper to handle SafeArea and StatusBar consistently.
 * 
 * @param children - Screen content
 * @param backgroundColor - Custom background color for SafeAreaView (falls back to theme background)
 * @param statusBarColor - Custom background color for StatusBar (falls back to theme gold or primary)
 * @param barStyle - Status bar icons style (dark-content or light-content)
 * @param edges - SafeArea edges to respect (default: ['top'])
 */
const ScreenWrapper = ({
    children,
    backgroundColor,
    statusBarColor,
    barStyle,
    edges = ['top']
}) => {
    const { colors, isDarkMode } = useTheme();

    const finalBgColor = backgroundColor || colors.headerBg;
    const finalStatusBarColor = statusBarColor || colors.statusBarBg;
    const finalBarStyle = barStyle || (isDarkMode ? 'light-content' : 'dark-content');

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: finalBgColor }]}
            edges={edges}
        >
            <StatusBar
                barStyle={finalBarStyle}
                backgroundColor="transparent"
                translucent={true}
            />
            <View style={[styles.innerContainer, { backgroundColor: colors.background }]}>
                {children}
            </View>
        </SafeAreaView>
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
