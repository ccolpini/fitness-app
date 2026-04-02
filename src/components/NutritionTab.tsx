import { useStore } from '../store/useStore';
import { NUTRITION } from '../data/nutrition';

type NutritionMode = 'trainingDay' | 'restDay' | 'dietBreak' | 'deload';

const MODE_LABELS: Record<NutritionMode, { label: string; color: string }> = {
  trainingDay: { label: 'Training Day', color: '#FF2D78' },
  restDay: { label: 'Rest Day', color: '#00D4FF' },
  dietBreak: { label: 'Diet Break', color: '#FFB800' },
  deload: { label: 'Deload', color: '#A855F7' },
};

export function NutritionTab() {
  const { nutritionMode, setNutritionMode, currentWeek } = useStore();
  const macros = NUTRITION[nutritionMode];

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-2xl font-bold tracking-tight mb-4">NUTRITION</h1>

      {/* Mode Toggle */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {(Object.keys(MODE_LABELS) as NutritionMode[]).map(mode => {
          const { label, color } = MODE_LABELS[mode];
          const active = nutritionMode === mode;
          return (
            <button
              key={mode}
              onClick={() => setNutritionMode(mode)}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                active ? 'text-white' : 'bg-surface text-secondary border border-white/8'
              }`}
              style={active ? { backgroundColor: color } : undefined}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Macro Summary Cards */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: 'Calories', value: macros.calories, unit: 'kcal', color: '#FF2D78' },
          { label: 'Protein', value: macros.protein, unit: 'g', color: '#00D4FF' },
          { label: 'Carbs', value: macros.carbs, unit: 'g', color: '#FFB800' },
          { label: 'Fats', value: macros.fats, unit: 'g', color: '#00FF88' },
        ].map(m => (
          <div key={m.label} className="card text-center py-3">
            <p className="text-[10px] text-secondary font-semibold tracking-wider">{m.label.toUpperCase()}</p>
            <p className="text-lg font-bold mt-0.5" style={{ color: m.color }}>{m.value}</p>
            <p className="text-[10px] text-secondary">{m.unit}</p>
          </div>
        ))}
      </div>

      {/* Diet Break / Deload Callout */}
      {(currentWeek === 6 || nutritionMode === 'dietBreak') && (
        <div className="card border-amber/30 mb-4 animate-scale-in">
          <div className="flex items-center gap-2 mb-1">
            <span className="pill bg-amber/20 text-amber">WEEK 6</span>
            <h3 className="text-sm font-bold">Diet Break Protocol</h3>
          </div>
          <ul className="space-y-1 text-xs text-secondary">
            <li>• Raise calories to maintenance (~2700 kcal)</li>
            <li>• Increase carbs significantly for hormonal reset</li>
            <li>• Maintain protein at minimum 160g</li>
            <li>• Duration: 5-7 days around week 6</li>
            <li>• Helps reverse metabolic adaptation</li>
          </ul>
        </div>
      )}

      {(currentWeek === 9 || nutritionMode === 'deload') && (
        <div className="card border-purple/30 mb-4 animate-scale-in">
          <div className="flex items-center gap-2 mb-1">
            <span className="pill bg-purple/20 text-purple">DELOAD</span>
            <h3 className="text-sm font-bold">Deload Nutrition</h3>
          </div>
          <ul className="space-y-1 text-xs text-secondary">
            <li>• Moderate calorie intake (maintenance or slight deficit)</li>
            <li>• Keep protein high for recovery</li>
            <li>• Moderate carbs — no need for high workout fuel</li>
            <li>• Focus on whole foods and micronutrient density</li>
            <li>• Prioritize sleep and hydration</li>
          </ul>
        </div>
      )}

      {/* Meal Plan */}
      <h2 className="text-base font-bold mb-3">Meal Plan</h2>
      <div className="space-y-2">
        {macros.meals.map((meal, i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-sm font-semibold text-white">{meal.name}</h4>
                <p className="text-[10px] text-secondary">{meal.time}</p>
              </div>
              <span className="text-xs text-accent-pink font-bold">{meal.calories} kcal</span>
            </div>
            <div className="flex gap-3 mb-2 text-[10px]">
              <span className="text-accent-cyan">P: {meal.protein}g</span>
              <span className="text-amber">C: {meal.carbs}g</span>
              <span className="text-success">F: {meal.fats}g</span>
            </div>
            <ul className="space-y-0.5">
              {meal.foods.map((food, j) => (
                <li key={j} className="text-xs text-secondary">• {food}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
