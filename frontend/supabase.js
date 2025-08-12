// supabase.js
import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase project details
const SUPABASE_URL = 'https://ozldsdjejbypopnonjpd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96bGRzZGplamJ5cG9wbm9uanBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODQ5NjYsImV4cCI6MjA3MDU2MDk2Nn0.Bmgpx4iwc9Y04A63Ri8lmKZZEhoZRPN7_GVKfCW5km4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Add meal entry
export async function addMeal({ imageUrl, foodName, calories, macros }) {
  const { data, error } = await supabase
    .from('meals')
    .insert([
      {
        image_url: imageUrl,
        food_name: foodName,
        calories: calories,
        macros: macros,
        created_at: new Date()
      }
    ]);

  if (error) {
    console.error('Error inserting meal:', error);
    throw error;
  }
  return data;
}

// Get all meals
export async function getMeals() {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }
  return data;
}
