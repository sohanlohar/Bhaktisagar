module.exports = {
    assets: ['./assets/fonts'],
    dependencies: {
        'react-native-worklets': {
            platforms: {
                android: null, // disable Android autolinking
            },
        },
    },
};
