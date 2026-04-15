import React, { memo, useCallback } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

const SPRING_IN = {
  damping: 15,
  stiffness: 200,
};

const SPRING_OUT = {
  damping: 15,
  stiffness: 150,
};

function AnimatedPressable({ children, onPress, style, className }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, SPRING_IN);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_OUT);
  }, [scale]);

  return (
    <AnimatedPressableBase
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
      className={className}
    >
      {children}
    </AnimatedPressableBase>
  );
}

export default memo(AnimatedPressable);
