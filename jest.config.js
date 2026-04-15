module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
        plugins: [],
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-navigation|@react-native|react-native-reanimated|react-native-gesture-handler|react-native-safe-area-context|react-native-screens|lucide-react-native|@ishubhamx/panchangam-js)/)',
  ],
};
