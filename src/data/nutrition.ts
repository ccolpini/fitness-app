import type { NutritionPlan, Meal } from './types';

const trainingMeals: Meal[] = [
  { time: '7:00 AM', name: 'Breakfast', calories: 450, protein: 35, carbs: 50, fats: 12, foods: ['Oats with protein powder', 'Banana', 'Almond butter (1 tbsp)'] },
  { time: '10:00 AM', name: 'Snack 1', calories: 250, protein: 30, carbs: 20, fats: 8, foods: ['Greek yogurt (200g)', 'Mixed berries', 'Handful of almonds'] },
  { time: '12:30 PM', name: 'Lunch', calories: 550, protein: 45, carbs: 55, fats: 14, foods: ['Chicken breast (180g)', 'Brown rice (150g cooked)', 'Mixed vegetables', 'Olive oil drizzle'] },
  { time: '3:30 PM', name: 'Pre-Workout', calories: 300, protein: 25, carbs: 40, fats: 5, foods: ['Rice cakes (2)', 'Protein shake', 'Honey (1 tsp)'] },
  { time: '6:30 PM', name: 'Post-Workout Dinner', calories: 600, protein: 45, carbs: 60, fats: 16, foods: ['Salmon fillet (180g)', 'Sweet potato (200g)', 'Steamed broccoli', 'Avocado (1/4)'] },
  { time: '9:00 PM', name: 'Evening Snack', calories: 250, protein: 30, carbs: 10, fats: 10, foods: ['Casein protein shake', 'Cottage cheese (100g)', 'Walnuts (small handful)'] },
];

const restMeals: Meal[] = [
  { time: '8:00 AM', name: 'Breakfast', calories: 400, protein: 35, carbs: 30, fats: 18, foods: ['Eggs (3) scrambled', 'Avocado (1/2)', 'Spinach', 'Whole grain toast (1 slice)'] },
  { time: '10:30 AM', name: 'Snack 1', calories: 200, protein: 25, carbs: 10, fats: 8, foods: ['Protein shake', 'Small apple'] },
  { time: '1:00 PM', name: 'Lunch', calories: 500, protein: 42, carbs: 35, fats: 18, foods: ['Turkey mince (180g)', 'Quinoa (100g cooked)', 'Large mixed salad', 'Feta cheese (30g)'] },
  { time: '4:00 PM', name: 'Snack 2', calories: 220, protein: 28, carbs: 12, fats: 8, foods: ['Greek yogurt (200g)', 'Protein bar (half)', 'Cucumber slices'] },
  { time: '7:00 PM', name: 'Dinner', calories: 550, protein: 40, carbs: 30, fats: 22, foods: ['Beef stir-fry (170g)', 'Mixed vegetables', 'Coconut aminos', 'Small portion rice (80g)'] },
  { time: '9:00 PM', name: 'Evening Snack', calories: 180, protein: 25, carbs: 5, fats: 6, foods: ['Casein protein or cottage cheese', 'Cinnamon', 'Small handful berries'] },
];

const dietBreakMeals: Meal[] = [
  { time: '8:00 AM', name: 'Breakfast', calories: 500, protein: 30, carbs: 60, fats: 16, foods: ['Pancakes (2) with maple syrup', 'Eggs (2)', 'Fruit salad'] },
  { time: '10:30 AM', name: 'Snack 1', calories: 300, protein: 20, carbs: 35, fats: 10, foods: ['Trail mix', 'Banana', 'Protein bar'] },
  { time: '1:00 PM', name: 'Lunch', calories: 650, protein: 40, carbs: 70, fats: 20, foods: ['Chicken wrap with rice', 'Sweet potato fries', 'Side salad'] },
  { time: '4:00 PM', name: 'Snack 2', calories: 300, protein: 15, carbs: 40, fats: 10, foods: ['Smoothie bowl', 'Granola topping', 'Peanut butter drizzle'] },
  { time: '7:00 PM', name: 'Dinner', calories: 700, protein: 40, carbs: 70, fats: 22, foods: ['Pasta with meat sauce', 'Garlic bread (1 slice)', 'Side vegetables'] },
  { time: '9:00 PM', name: 'Evening Snack', calories: 250, protein: 15, carbs: 30, fats: 8, foods: ['Dark chocolate (30g)', 'Greek yogurt', 'Berries'] },
];

const deloadMeals: Meal[] = [
  { time: '8:00 AM', name: 'Breakfast', calories: 420, protein: 32, carbs: 45, fats: 14, foods: ['Oats with protein powder', 'Mixed berries', 'Seeds (1 tbsp)'] },
  { time: '10:30 AM', name: 'Snack 1', calories: 220, protein: 25, carbs: 15, fats: 8, foods: ['Greek yogurt', 'Small banana', 'Almonds (10)'] },
  { time: '1:00 PM', name: 'Lunch', calories: 500, protein: 40, carbs: 45, fats: 16, foods: ['Chicken breast (160g)', 'Sweet potato (150g)', 'Steamed veg', 'Olive oil'] },
  { time: '4:00 PM', name: 'Snack 2', calories: 200, protein: 20, carbs: 20, fats: 6, foods: ['Rice cakes (2)', 'Nut butter (1 tbsp)', 'Protein shake'] },
  { time: '7:00 PM', name: 'Dinner', calories: 520, protein: 38, carbs: 45, fats: 18, foods: ['White fish (170g)', 'Brown rice (120g)', 'Mixed vegetables', 'Lemon dressing'] },
  { time: '9:00 PM', name: 'Evening Snack', calories: 190, protein: 25, carbs: 8, fats: 6, foods: ['Casein shake', 'Small handful walnuts'] },
];

export const NUTRITION: NutritionPlan = {
  trainingDay: {
    calories: 2400, protein: 210, carbs: 235, fats: 65,
    meals: trainingMeals,
  },
  restDay: {
    calories: 2050, protein: 195, carbs: 122, fats: 80,
    meals: restMeals,
  },
  dietBreak: {
    calories: 2700, protein: 160, carbs: 305, fats: 86,
    meals: dietBreakMeals,
  },
  deload: {
    calories: 2050, protein: 180, carbs: 178, fats: 68,
    meals: deloadMeals,
  },
};
