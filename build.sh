#!/bin/bash

# GarboNet Build Script
# Quick commands for building and running the app

set -e

export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools

echo "🚀 GarboNet Build Script"
echo "========================"
echo ""

case "$1" in
  clean)
    echo "🧹 Cleaning build..."
    cd android
    ./gradlew clean
    cd ..
    rm -rf node_modules
    npm install
    echo "✅ Clean complete!"
    ;;
    
  build)
    echo "🔨 Building debug APK..."
    cd android
    ./gradlew assembleDebug
    cd ..
    echo "✅ Build complete!"
    echo "📦 APK location: android/app/build/outputs/apk/debug/app-debug.apk"
    ;;
    
  install)
    echo "📱 Installing on device..."
    cd android
    ./gradlew installDebug
    cd ..
    echo "✅ App installed!"
    ;;
    
  run)
    echo "🏃 Running app..."
    adb reverse tcp:8081 tcp:8081
    echo "✅ Port forwarding set up"
    echo "📱 Starting Metro bundler..."
    npm start
    ;;
    
  logs)
    echo "📋 Viewing logs..."
    adb logcat | grep -E "ReactNativeJS|garbonetapp|FATAL"
    ;;
    
  device)
    echo "📱 Connected devices:"
    adb devices
    ;;
    
  full)
    echo "🔄 Full rebuild and install..."
    cd android
    ./gradlew clean
    ./gradlew installDebug
    cd ..
    adb reverse tcp:8081 tcp:8081
    echo "✅ Ready! Run 'npm start' in another terminal"
    ;;
    
  release)
    echo "🚀 Building release APK..."
    cd android
    ./gradlew assembleRelease
    cd ..
    echo "✅ Release build complete!"
    echo "📦 APK location: android/app/build/outputs/apk/release/app-release.apk"
    ;;
    
  *)
    echo "Usage: ./build.sh [command]"
    echo ""
    echo "Commands:"
    echo "  clean     - Clean build and reinstall dependencies"
    echo "  build     - Build debug APK"
    echo "  install   - Install app on connected device"
    echo "  run       - Set up port forwarding and start Metro"
    echo "  logs      - View app logs"
    echo "  device    - List connected devices"
    echo "  full      - Clean, build, and install (recommended)"
    echo "  release   - Build release APK"
    echo ""
    echo "Example workflow:"
    echo "  Terminal 1: ./build.sh full"
    echo "  Terminal 2: npm start"
    ;;
esac
