# GarboNet - Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js >= 22.11.0
- Android SDK (for Android development)
- Physical Android device or emulator
- Firebase account
- HuggingFace account (for AI model)

---

## 1. Install Dependencies

```bash
cd /home/justastuff/Documents/Paapal/Projects/GarboNet/garbonet
npm install
```

---

## 2. Configure Firebase

Your Firebase is already configured in `src/config/firebase.ts`. Ensure your Firebase project has:

### Firestore Database
Create a collection called `complaints` with the following structure:

```javascript
{
  image_url: string,
  latitude: number,
  longitude: number,
  waste_types: string[],
  confidence: number,
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Escalated',
  created_at: Timestamp,
  user_id: string,
  escalation_level: number,
  is_hotspot: boolean,
  after_image_url?: string,  // Added by workers
  resolved_at?: Timestamp
}
```

### Firestore Rules (Development)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /complaints/{document=**} {
      allow read, write: if true;  // For development only
    }
  }
}
```

### Storage Rules (Development)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /reports/{allPaths=**} {
      allow read, write: if true;  // For development only
    }
  }
}
```

**⚠️ IMPORTANT:** Change these rules for production to include proper authentication checks.

---

## 3. Configure AI Model

### Get HuggingFace API Token
1. Go to https://huggingface.co/settings/tokens
2. Create a new token with "Read" access
3. Copy the token

### Add Token to App
Open `src/services/AIService.ts` and replace:

```typescript
private static API_TOKEN = ''; // Replace with your token
```

With:

```typescript
private static API_TOKEN = 'hf_xxxxxxxxxxxxxxxxxxxxx'; // Your actual token
```

**Alternative:** Create a settings screen where users can input their API key dynamically.

---

## 4. Android Setup

### Permissions
Already configured in `android/app/src/main/AndroidManifest.xml`:
- ACCESS_FINE_LOCATION
- ACCESS_COARSE_LOCATION
- CAMERA
- READ_EXTERNAL_STORAGE
- WRITE_EXTERNAL_STORAGE

### Vector Icons
Already configured in `android/app/build.gradle`:
```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

---

## 5. Build & Run

### Terminal 1 - Start Metro
```bash
npm start
```

### Terminal 2 - Build & Install
```bash
export ANDROID_HOME=$HOME/Android/Sdk
cd android && ./gradlew clean
./gradlew installDebug
cd ..
```

### Connect Device
```bash
$ANDROID_HOME/platform-tools/adb devices
$ANDROID_HOME/platform-tools/adb reverse tcp:8081 tcp:8081
```

---

## 6. Testing the App

### Test Flow 1: Civilian Report
1. Login as "Civilian"
2. Tap "Report" tab
3. Wait for GPS to acquire (green status)
4. Tap camera icon to capture waste photo
5. AI will validate (if token configured)
6. Submit report
7. Check "My Reports" tab to see submission

### Test Flow 2: Worker Resolution
1. Login as "Worker"
2. View assigned tasks
3. Tap "Navigate" to open in Google Maps
4. Tap "Mark Resolved"
5. Capture "after" photo
6. Submit resolution

### Test Flow 3: Admin Monitoring
1. Login as "Admin"
2. View dashboard statistics
3. See real-time complaint list
4. Check escalation levels

---

## 7. Troubleshooting

### GPS Stuck on "Acquiring..."
- Ensure location services are enabled on device
- Grant location permissions when prompted
- Try outdoors for better GPS signal
- Check `adb logcat` for permission errors

### Camera Not Working
- Grant camera permission when prompted
- Check `AndroidManifest.xml` has CAMERA permission
- Verify `react-native-image-picker` is installed

### AI Validation Fails
- Ensure HuggingFace API token is set
- Check internet connection
- Model may be loading (first request takes ~20s)
- Check console for API errors

### Firebase Upload Fails
- Verify Firebase config in `src/config/firebase.ts`
- Check Firebase Storage rules allow writes
- Ensure internet connection is active

### App Crashes on Civilian Login
- **FIXED:** Replaced lucide-react-native with react-native-vector-icons
- If still crashes, run: `adb logcat | grep -E "FATAL|ReactNativeJS"`

---

## 8. Production Checklist

### Security
- [ ] Update Firestore rules to require authentication
- [ ] Update Storage rules to require authentication
- [ ] Implement Firebase Authentication (currently mock)
- [ ] Store API keys securely (not in code)
- [ ] Add rate limiting for API calls

### Features
- [ ] Add push notifications for escalations
- [ ] Implement worker assignment logic
- [ ] Add admin approval workflow
- [ ] Create analytics dashboard
- [ ] Add offline support with local caching

### Performance
- [ ] Optimize image compression
- [ ] Implement pagination for complaint lists
- [ ] Add image caching
- [ ] Reduce bundle size

### Testing
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Test on multiple devices
- [ ] Test with poor network conditions

---

## 9. Architecture Overview

```
src/
├── components/
│   └── UI.tsx                 # Reusable UI components
├── config/
│   └── firebase.ts            # Firebase initialization
├── features/                  # Feature-specific components (legacy)
├── hooks/
│   └── useRedux.ts           # Redux hooks
├── navigation/
│   ├── RootNavigator.tsx     # Main navigation
│   ├── AuthStack.tsx         # Login screen
│   ├── CivilianTabs.tsx      # Civilian navigation
│   ├── WorkerTabs.tsx        # Worker navigation
│   └── AdminTabs.tsx         # Admin navigation
├── screens/
│   ├── ReportWasteScreen.tsx # Civilian report flow
│   ├── MyReportsScreen.tsx   # Civilian report history
│   ├── WorkerTaskScreen.tsx  # Worker task management
│   └── AdminDashboard.tsx    # Admin monitoring
├── services/
│   ├── AIService.ts          # HuggingFace AI integration
│   ├── FirebaseService.ts    # Firestore & Storage
│   └── LocationService.ts    # GPS handling
├── store/
│   ├── index.ts              # Redux store
│   └── authSlice.ts          # Auth state
└── theme/
    └── colors.ts             # Color palette
```

---

## 10. Key Features Implemented

### ✅ GPS Location
- Real-time location acquisition
- Permission handling
- Timeout fallback
- Manual retry option

### ✅ Camera Integration
- Image capture with compression
- Preview before upload
- Retake functionality

### ✅ AI Validation
- HuggingFace ResNet50 model
- 60% confidence threshold
- Waste type classification
- Graceful fallback if API fails

### ✅ Firebase Integration
- Real-time Firestore listeners
- Image upload to Storage
- Duplicate detection (50m radius)
- Hotspot marking

### ✅ Role-Based Dashboards
- Civilian: Report + View history
- Worker: Task list + Resolution flow
- Admin: Statistics + Monitoring

### ✅ Escalation System
- Client-side escalation checks
- 24h → Level 1
- 48h → Level 2
- No Cloud Functions required (free tier)

### ✅ Worker Resolution
- After photo capture
- GPS verification
- Status updates

### ✅ Modern UI
- Card-based layout
- Material icons
- Status badges
- Loading states
- Empty states
- Error handling

---

## 11. Environment Variables (Optional)

Create `.env` file:

```bash
HUGGINGFACE_API_TOKEN=hf_xxxxxxxxxxxxx
FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
```

Then use `react-native-config` to load them.

---

## 12. Deployment

### Android APK
```bash
cd android
./gradlew assembleRelease
```

APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### Google Play Store
1. Generate signing key
2. Configure `android/app/build.gradle`
3. Build release bundle: `./gradlew bundleRelease`
4. Upload to Play Console

---

## 13. Support & Maintenance

### Logs
```bash
# View all logs
adb logcat

# Filter React Native logs
adb logcat | grep ReactNativeJS

# Filter app-specific logs
adb logcat | grep garbonetapp
```

### Clear Cache
```bash
cd android && ./gradlew clean
cd .. && rm -rf node_modules
npm install
```

### Reset Metro
```bash
npm start -- --reset-cache
```

---

## 14. Credits

- **AI Model:** [kendrickfff/my_resnet50_garbage_classification](https://huggingface.co/kendrickfff/my_resnet50_garbage_classification)
- **Maps:** OpenStreetMap (free alternative to Google Maps)
- **Icons:** react-native-vector-icons (MaterialCommunityIcons)
- **Backend:** Firebase (Firestore + Storage)

---

## 🎉 You're All Set!

The app is now fully functional with:
- ✅ Working GPS
- ✅ Camera capture
- ✅ AI validation
- ✅ Firebase integration
- ✅ Real-time updates
- ✅ Role-based workflows
- ✅ Modern UI

Happy coding! 🚀
