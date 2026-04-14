module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: process.env.NODE_ENV !== 'test' ? ['react-native-reanimated/plugin'] : [],
};

