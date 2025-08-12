import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Image, StyleSheet } from 'react-native';

const BACKEND_URL = 'https://calorie-counter-edsj.onrender.com'; // Replace with your deployed backend URL

export default function MealsScreen() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    fetchMeals();
  }, []);

  async function fetchMeals() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/meals/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMeals(data);
    } catch (error) {
      console.error('Failed to fetch meals:', error);
    }
  }

  function renderMeal({ item }) {
    // Construct image URL carefully
    const imageUrl = item.image
      ? item.image.startsWith('http')
        ? item.image
        : `${BACKEND_URL}${item.image}`
      : null;

    // Format date safely
    let addedDate = '-';
    if (item.created_at) {
      const dateObj = new Date(item.created_at);
      addedDate = isNaN(dateObj) ? '-' : dateObj.toLocaleString();
    }

    return (
      <View style={styles.mealContainer}>
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.foodName}>{item.food_name || 'Unnamed Meal'}</Text>
          <Text>Calories: {item.calories ?? '-'}</Text>
          <Text>Protein: {item.protein ?? '-'}</Text>
          <Text>Carbs: {item.carbs ?? '-'}</Text>
          <Text>Fat: {item.fat ?? '-'}</Text>
          <Text>Added: {addedDate}</Text>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      data={meals}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderMeal}
      contentContainerStyle={{ padding: 10 }}
      ListEmptyComponent={<Text>No meals found.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  mealContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 10,
  },
  image: { width: 80, height: 80, borderRadius: 10 },
  foodName: { fontWeight: 'bold', fontSize: 16 },
});
