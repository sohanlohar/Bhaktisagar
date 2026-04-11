import React, { Component } from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service like Sentry or Crashlytics here
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4444', marginBottom: 10 }}>Oops!</Text>
            <Text style={{ fontSize: 16, color: '#333', textAlign: 'center', marginBottom: 20 }}>
              Something went wrong. We apologize for the inconvenience.
            </Text>
            <Pressable
              onPress={this.handleReset}
              style={{
                backgroundColor: '#FF6F00', // Saffron color
                paddingHorizontal: 30,
                paddingVertical: 12,
                borderRadius: 25,
                elevation: 2,
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Try Again</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
