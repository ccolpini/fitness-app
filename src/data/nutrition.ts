import type { NutritionPlan, Meal } from './types';

const trainingMeals: Meal[] = [
  { time: '7:00 AM', name: 'Breakfast', calories: 300, protein: 28, carbs: 32, fats: 8, foods: ['Oats (40g) with protein powder', 'Banana (1/2)', 'Almond butter (1 tsp)'] },
  { time: '10:00 AM', name: 'Snack 1', calories: 200, protein: 25, carbs: 15, fats: 5, foods: ['Greek yogurt (150g)', 'Mixed berries', 'Small handful almonds'] },
  { time: '12:30 PM', name: 'Lunch', calories: 400, protein: 38, carbs: 38, fats: 10, foods: ['Chicken breast (150g)', 'Brown rice (100g cooked)', 'Mixed vegetables', 'Olive oil drizzle'] },
  { time: '3:30 PM', name: 'Pre-Workout', calories: 220, protein: 20, carbs: 30, fats: 4, foods: ['Rice cakes (2)', 'Protein shake', 'Honey (1 tsp)'] },
  { time: '6:30 PM', name: 'Post-Workout Dinner', calories: 420, protein: 38, carbs: 40, fats: 12, foods: ['Salmon fillet (140g)', 'Sweet potato (150g)', 'Steamed broccoli', 'Avocado (1/4)'] },
  { time: '9:00 PM', name: 'Evening Snack', calories: 180, protein: 22, carbs: 8, fats: 6, foods: ['Casein protein shake', 'Cottage cheese (80g)', 'Walnuts (small handful)'] },
];

const restMeals: Meal[] = [
  { time: '8:00 AM', name: 'Breakfast', calories: 300, protein: 28, carbs: 18, fats: 14, foods: ['Eggs (2) scrambled', 'Avocado (1/4)', 'Spinach', 'Whole grain toast (1 slice)'] },
  { time: '10:30 AM', name: 'Snack 1', calories: 160, protein: 22, carbs: 8, fats: 5, foods: ['Protein shake', 'Small apple'] },
  { time: '1:00 PM', name: 'Lunch', calories: 380, protein: 34, carbs: 24, fats: 14, foods: ['Turkey mince (140g)', 'Quinoa (80g cooked)', 'Large mixed salad', 'Feta cheese (20g)'] },
  { time: '4:00 PM', name: 'Snack 2', calories: 170, protein: 22, carbs: 8, fats: 6, foods: ['Greek yogurt (150g)', 'Protein bar (half)', 'Cucumber slices'] },
  { time: '7:00 PM', name: 'Dinner', calories: 420, protein: 34, carbs: 22, fats: 16, foods: ['Beef stir-fry (130g)', 'Mixed vegetables', 'Coconut aminos', 'Small portion rice (60g)'] },
  { time: '9:00 PM', name: 'Evening Snack', calories: 150, protein: 20, carbs: 5, fats: 5, foods: ['Casein protein or cottage cheese', 'Cinnamon', 'Small handful berries'] },
];

const dietBreakMeals: Meal[] = [
  { time: '8:00 AM', name: 'Breakfast', calories: 380, protein: 25, carbs: 45, fats: 12, foods: ['Pancakes (2) with maple syrup', 'Eggs (2)', 'Fruit salad'] },
  { time: '10:30 AM', name: 'Snack 1', calories: 220, protein: 15, carbs: 28, fats: 7, foods: ['Trail mix', 'Banana', 'Protein bar (half)'] },
  { time: '1:00 PM', name: 'Lunch', calories: 480, protein: 32, carbs: 52, fats: 14, foods: ['Chicken wrap with rice', 'Sweet potato fries (small)', 'Side salad'] },
  { time: '4:00 PM', name: 'Snack 2', calories: 220, protein: 12, carbs: 30, fats: 7, foods: ['Smoothie bowl (small)', 'Granola topping', 'Peanut butter drizzle'] },
  { time: '7:00 PM', name: 'Dinner', calories: 500, protein: 35, carbs: 50, fats: 16, foods: ['Pasta with meat sauce', 'Garlic bread (1 slice)', 'Side vegetables'] },
  { time: '9:00 PM', name: 'Evening Snack', calories: 150, protein: 12, carbs: 18, fats: 5, foods: ['Dark chocolate (20g)', 'Greek yogurt (small)', 'Berries'] },
];

const deloadMeals: Meal[] = [
  { time: '8:00 AM', name: 'Breakfast', calories: 340, protein: 28, carbs: 34, fats: 10, foods: ['Oats (40g) with protein powder', 'Mixed berries', 'Seeds (1 tbsp)'] },
  { time: '10:30 AM', name: 'Snack 1', calories: 180, protein: 22, carbs: 12, fats: 6, foods: ['Greek yogurt (150g)', 'Small banana', 'Almonds (8)'] },
  { time: '1:00 PM', name: 'Lunch', calories: 400, protein: 35, carbs: 38, fats: 12, foods: ['Chicken breast (140g)', 'Sweet potato (120g)', 'Steamed veg', 'Olive oil'] },
  { time: '4:00 PM', name: 'Snack 2', calories: 170, protein: 18, carbs: 18, fats: 5, foods: ['Rice cakes (2)', 'Nut butter (1 tsp)', 'Protein shake'] },
  { time: '7:00 PM', name: 'Dinner', calories: 440, protein: 35, carbs: 38, fats: 14, foods: ['White fish (150g)', 'Brown rice (100g)', 'Mixed vegetables', 'Lemon dressing'] },
  { time: '9:00 PM', name: 'Evening Snack', calories: 190, protein: 24, carbs: 10, fats: 6, foods: ['Casein shake', 'Small handful walnuts'] },
];

export const NUTRITION: NutritionPlan = {
  trainingDay: {
    calories: 1720, protein: 171, carbs: 163, fats: 45,
    meals: trainingMeals,
  },
  restDay: {
    calories: 1580, protein: 160, carbs: 85, fats: 60,
    meals: restMeals,
  },
  dietBreak: {
    calories: 1950, protein: 131, carbs: 223, fats: 61,
    meals: dietBreakMeals,
  },
  deload: {
    calories: 1720, protein: 162, carbs: 150, fats: 53,
    meals: deloadMeals,
  },
};
