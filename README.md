# 🌍 GarboNet: The Socio-Cleaner

> **Empowering Communities to Clean the World, One Report at a Time.**

GarboNet is a modern, AI-powered React Native application designed to streamline waste management and urban cleaning. By connecting citizens, sanitation workers, and city administrators in real-time, GarboNet ensures that every report is heard, every task is tracked, and every issue is resolved.

---

## 🚀 Key Features

### 👤 For Civilians (The Reporters)
- **AI-Powered Reporting:** Snap a photo of waste, and our integrated Hugging Face AI model automatically classifies the type of garbage (plastic, organic, etc.) and validates the report.
- **Precision Location:** Automatically captures GPS coordinates to ensure workers find the exact spot.
- **Real-Time Tracking:** Watch your report move from "Pending" to "In Progress" and finally "Resolved."
- **Hotspot Detection:** Automatically identifies and marks recurring waste zones to alert administrators.

### 👷 For Workers (The Resolvers)
- **Task Management:** Real-time list of assigned tasks with priority indicators.
- **Integrated Navigation:** One-tap navigation to the waste location using Google Maps.
- **Proof of Work:** Upload an "after" photo to verify the cleanup, which is then sent to the admin for final closure.
- **Status Updates:** Instant UI updates when tasks are accepted or completed.

### 👑 For Admins (The Managers)
- **Comprehensive Dashboard:** High-level statistics on total reports, pending issues, and resolution rates.
- **Escalation System:** Automatically flags reports older than 24 hours as "Escalated" to ensure accountability.
- **Hotspot Monitoring:** Visual tracking of high-density waste areas for better resource allocation.
- **Global Overview:** Manage all complaints across the city from a single interface.

---

## 🛠️ Tech Stack

- **Frontend:** React Native (Cross-platform iOS/Android)
- **Backend:** Firebase (Firestore, Storage, Auth)
- **AI/ML:** Hugging Face Inference API (ResNet-50 / ViT models)
- **Navigation:** React Navigation (Tab & Stack)
- **Icons:** Material Community Icons
- **Storage:** AsyncStorage for local configuration

---

## 📦 Installation & Setup

### Prerequisites
- Node.js & npm/yarn
- Android Studio / Xcode
- A Firebase Project ([Setup Guide](https://firebase.google.com/docs/android/setup))
- Hugging Face API Token ([Get one here](https://huggingface.co/settings/tokens))

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/JustAStuff/GarboNet_the-_socio_cleaner.git
   cd garbonet
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Add your `google-services.json` to `android/app/`.
   - Update `src/config/firebase.ts` with your project credentials.

4. **Run the App:**
   ```bash
   # Start Metro Bundler
   npm start

   # Run on Android
   npm run android
   ```

5. **AI Configuration:**
   - Open the app, go to the **Settings** tab, and enter your Hugging Face API token.

---

## 🏗️ Project Structure

```text
src/
├── components/     # Reusable UI elements (Buttons, Cards, Badges)
├── config/         # Firebase and API configurations
├── navigation/     # Role-based Tab & Stack navigators
├── screens/        # Dashboard, Reporting, and Settings screens
├── services/       # AI, Firebase, and Location logic
└── theme/          # Color palettes and global styles
```

---

## 🛡️ Escalation Logic
GarboNet uses a built-in escalation engine:
- **Level 0 (Pending):** Fresh report (< 24 hrs).
- **Level 1 (Delayed):** Report is 24-48 hours old.
- **Level 2 (Critical):** Report is > 48 hours old.
The system automatically updates the status on the Admin Dashboard to ensure no report is forgotten.

---

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact
**JustAStuff** - [ravipriyadarshini1605@gmail.com](mailto:ravipriyadarshini1605@gmail.com)

Project Link: [https://github.com/JustAStuff/GarboNet_the-_socio_cleaner](https://github.com/JustAStuff/GarboNet_the-_socio_cleaner)
