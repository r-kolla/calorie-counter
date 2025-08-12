import React, { useState } from 'react';
import { Button, Image, View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const BACKEND_URL = 'https://calorie-counter-edsj.onrender.com'; // Replace with your backend URL

export default function PhotoPicker({ onMealAdded }) {
  const [selectedImage, setSelectedImage] = useState(null);

  async function pickImage() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== 'granted') {
      Alert.alert('Permission required', 'Camera roll permission is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: false,
    });

    if (!pickerResult.cancelled) {
      setSelectedImage(pickerResult.uri);
      uploadImage(pickerResult);
    }
  }

  async function uploadImage(pickerResult) {
    try {
      const formData = new FormData();

      // For iOS, the uri needs to start with 'file://'
      const uri = pickerResult.uri.startsWith('file://') ? pickerResult.uri : 'file://' + pickerResult.uri;

      formData.append('image', {
        uri,
        name: 'meal.jpg',
        type: 'image/jpeg',
      });

      const response = await fetch(`${BACKEND_URL}/api/meals/upload/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // 'Content-Type' should NOT be set explicitly when sending FormData with fetch in React Native / Expo
        },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Meal added!');
        onMealAdded && onMealAdded(data);
      } else {
        Alert.alert('Error', data.error || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  return (
    <View style={{ marginVertical: 20 }}>
      <Button title="Pick an image" onPress={pickImage} />
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={{ width: 200, height: 200, marginTop: 10, borderRadius: 10 }}
        />
      )}
    </View>
  );
}
