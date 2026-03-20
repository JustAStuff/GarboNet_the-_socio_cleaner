import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { launchCamera } from 'react-native-image-picker';

export default function ReportFlow({ navigation }: any) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const takePic = async () => {
    const result = await launchCamera({ mediaType: 'photo', quality: 0.7 });
    if (result.assets && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri || null);
    }
  };

  const uploadPic = () => {
    alert("Waste Reported Successfully! Assigning to workers.");
    navigation.goBack();
  };

  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photoUri }} style={styles.camera} />
        <View style={styles.previewControls}>
           <Button title="Retake" onPress={() => setPhotoUri(null)} color="red" />
           <Button title="Submit AI Tagged Report" onPress={uploadPic} color="#0b9a6a" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Text style={styles.instruction}>Center the waste in frame using your camera</Text>
        <View style={styles.buttonRow}>
          <Button title="📷 Open Camera" onPress={takePic} />
          <Button title="Cancel" onPress={() => navigation.goBack()} color="#cc0000" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  camera: { flex: 1 },
  controls: { padding: 20, paddingBottom: 40, gap: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 10 },
  previewControls: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#000' },
  instruction: { textAlign: 'center', color: '#fff', fontSize: 16, marginBottom: 10, fontWeight: 'bold' }
});
