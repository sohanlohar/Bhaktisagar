import React, { Component } from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
          <View className="p-5 items-center">
            <Text className="text-2xl font-pbold mb-2.5 text-red-500">क्षमा करें</Text>
            <Text className="text-base text-gray-800 text-center mb-5">
              कुछ तकनीकी समस्या आ गई है। कृपया पुनः प्रयास करें।
            </Text>
            <Pressable
              onPress={this.handleReset}
              className="px-7 py-3 rounded-full elevation-sm"
              style={{ backgroundColor: '#FF6F00' }}
            >
              <Text className="text-white font-pbold text-base">फिर से प्रयास करें</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
