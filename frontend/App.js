import React, { useState, useRef } from 'react';
import { View, Button, StyleSheet, SafeAreaView } from 'react-native';
import MealsScreen from './screens/MealsScreen';
import PhotoPicker from './screens/PhotoPicker';

export default function App() {
  const [showPicker, setShowPicker] = useState(false);
  const mealsScreenRef = useRef(null);

  // Called when a new meal is successfully added
  function handleMealAdded(newMeal) {
    setShowPicker(false);
    // Optionally: refresh MealsScreen by calling a method on ref if you implement it
    // mealsScreenRef.current?.refreshMeals();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {showPicker ? (
          <PhotoPicker onMealAdded={handleMealAdded} />
        ) : (
          <MealsScreen ref={mealsScreenRef} />
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={showPicker ? 'View Meals' : 'Add Meal'}
          onPress={() => setShowPicker(!showPicker)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
});
