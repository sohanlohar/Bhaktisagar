# Add project specific ProGuard rules here.

# React Native Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# React Native Gesture Handler
-keep class com.swmansion.gesturehandler.react.** { *; }

# React Native Screens
-keep class com.swmansion.rnscreens.** { *; }

# General React Native Safe Rules
-keep class com.facebook.react.bridge.JSIModulePackage { *; }
-keep class com.facebook.react.bridge.JavaScriptExecutorFactory { *; }
-keep class com.facebook.react.bridge.ReactApplicationContext { *; }
-keep class com.facebook.react.bridge.ReactContextBaseJavaModule { *; }
-keep class com.facebook.react.bridge.ReactMethod { *; }
-keep class com.facebook.react.bridge.ReadableArray { *; }
-keep class com.facebook.react.bridge.ReadableMap { *; }
-keep class com.facebook.react.bridge.ReadableNativeArray { *; }
-keep class com.facebook.react.bridge.ReadableNativeMap { *; }
-keep class com.facebook.react.bridge.ReadableType { *; }
-keep class com.facebook.react.bridge.WritableArray { *; }
-keep class com.facebook.react.bridge.WritableMap { *; }
-keep class com.facebook.react.bridge.WritableNativeArray { *; }
-keep class com.facebook.react.bridge.WritableNativeMap { *; }
-keep class com.facebook.react.common.MapBuilder { *; }
-keep class com.facebook.react.uimanager.ReactStylesDiffMap { *; }
-keep class com.facebook.react.uimanager.annotations.ReactProp { *; }
-keep class com.facebook.react.uimanager.annotations.ReactPropGroup { *; }
-keep class com.facebook.react.uimanager.annotations.ReactPropertyBag { *; }

# Prevent okhttp3 from being stripped
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**

# Okio
-dontwarn okio.**
