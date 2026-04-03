import { useStore } from '../store/useStore';
import { NUTRITION } from '../data/nutrition';
import { ProgressRing } from './ui';

type NutritionMode = 'trainingDay' | 'restDay' | 'dietBreak' | 'deload';

const MODE_CONFIG: Record<NutritionMode, { label: string; color: string; icon: string }> = {
  trainingDay: { label: 'Training', color: '#FF2D78', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
  restDay: { label: 'Rest Day', color: '#00D4FF', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
  dietBreak: { label: 'Diet Break', color: '#FFB800', icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
  deload: { label: 'Deload', color: '#A855F7', icon: 'M19 9l-7 7-7-7' },
};

export function NutritionTab() {
  const { nutritionMode, setNutritionMode, currentWeek } = useStore();
  const macros = NUTRITION[nutritionMode];
  const cfg = MODE_CONFIG[nutritionMode];

  const macroItems = [
    { label: 'Protein', value: macros.protein, max: 250, unit: 'g', color: '#00D4FF' },
    { label: 'Carbs', value: macros.carbs, max: 350, unit: 'g', color: '#FFB800' },
    { label: 'Fats', value: macros.fats, max: 120, unit: 'g', color: '#00FF88' },
  ];

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="relative overflow-hidden px-4 pt-6 pb-4">
        <div className="absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(ellipse at top center, ${cfg.color}25, transparent 60%)` }} />
        <div className="relative">
          <h1 className="text-3xl font-bold tracking-tight mb-1">NUTRITION</h1>
          <p className="text-secondary text-sm">Fuel your recomposition</p>
        </div>
      </div>

      <div className="px-4">
        {/* Mode Toggle — pill style */}
        <div className="flex gap-1.5 p-1 bg-white/3 rounded-2xl mb-5">
          {(Object.keys(MODE_CONFIG) as NutritionMode[]).map(mode => {
            const m = MODE_CONFIG[mode];
            const active = nutritionMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setNutritionMode(mode)}
                className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all duration-300 active:scale-95 ${
                  active ? 'text-white shadow-lg' : 'text-secondary'
                }`}
                style={active ? {
                  background: `linear-gradient(135deg, ${m.color}, ${m.color}CC)`,
                  boxShadow: `0 2px 12px ${m.color}30`,
                } : undefined}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Calorie Hero */}
        <div className="flex justify-center mb-5">
          <ProgressRing radius={60} stroke={6} progress={(macros.calories / 3000) * 100} color={cfg.color}>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: cfg.color }}>{macros.calories}</div>
              <div className="text-[9px] text-secondary font-semibold tracking-wider">KCAL</div>
            </div>
          </ProgressRing>
        </div>

        {/* Macro Bars */}
        <div className="glass-card p-4 mb-4">
          <div className="grid gap-4">
            {macroItems.map(m => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-white">{m.label}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold" style={{ color: m.color }}>{m.value}</span>
                    <span className="text-[10px] text-secondary">{m.unit}</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min((m.value / m.max) * 100, 100)}%`,
                      background: `linear-gradient(90deg, ${m.color}, ${m.color}99)`,
                      boxShadow: `0 0 8px ${m.color}40`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Diet Break / Deload Callout */}
        {(currentWeek === 6 || nutritionMode === 'dietBreak') && (
          <div className="relative overflow-hidden glass-card p-4 mb-4 animate-scale-in"
            style={{ border: '1px solid rgba(255,184,0,0.2)' }}>
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20 bg-amber" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="pill bg-amber/15 text-amber">WEEK 6</span>
                <h3 className="text-sm font-bold">Diet Break</h3>
              </div>
              <ul className="space-y-1 text-xs text-secondary">
                <li className="flex items-start gap-1.5"><span className="text-amber">•</span>Raise to maintenance ~2700 kcal</li>
                <li className="flex items-start gap-1.5"><span className="text-amber">•</span>Increase carbs for hormonal reset</li>
                <li className="flex items-start gap-1.5"><span className="text-amber">•</span>Keep protein at minimum 160g</li>
                <li className="flex items-start gap-1.5"><span className="text-amber">•</span>5-7 days to reverse metabolic adaptation</li>
              </ul>
            </div>
          </div>
        )}

        {(currentWeek === 9 || nutritionMode === 'deload') && (
          <div className="relative overflow-hidden glass-card p-4 mb-4 animate-scale-in"
            style={{ border: '1px solid rgba(168,85,247,0.2)' }}>
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20 bg-purple" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="pill bg-purple/15 text-purple">DELOAD</span>
                <h3 className="text-sm font-bold">Recovery Nutrition</h3>
              </div>
              <ul className="space-y-1 text-xs text-secondary">
                <li className="flex items-start gap-1.5"><span className="text-purple">•</span>Moderate calories at maintenance</li>
                <li className="flex items-start gap-1.5"><span className="text-purple">•</span>High protein for recovery</li>
                <li className="flex items-start gap-1.5"><span className="text-purple">•</span>Focus on whole foods + micronutrients</li>
                <li className="flex items-start gap-1.5"><span className="text-purple">•</span>Prioritize sleep and hydration</li>
              </ul>
            </div>
          </div>
        )}

        {/* Meal Plan */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold">Meal Plan</h2>
          <span className="text-xs text-secondary">{macros.meals.length} meals</span>
        </div>

        <div className="stagger-children">
          {macros.meals.map((meal, i) => (
            <div key={i} className="relative overflow-hidden glass-card p-4 mb-2">
              {/* Time indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ backgroundColor: cfg.color }} />

              <div className="flex items-start justify-between mb-2 pl-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white">{meal.name}</h4>
                    <span className="text-[10px] text-secondary bg-white/5 rounded-full px-2 py-0.5">{meal.time}</span>
                  </div>
                  <div className="flex gap-3 mt-1">
                    <span className="text-[10px]" style={{ color: '#00D4FF' }}>P {meal.protein}g</span>
                    <span className="text-[10px]" style={{ color: '#FFB800' }}>C {meal.carbs}g</span>
                    <span className="text-[10px]" style={{ color: '#00FF88' }}>F {meal.fats}g</span>
                  </div>
                </div>
                <span className="text-xs font-bold" style={{ color: cfg.color }}>{meal.calories}</span>
              </div>

              <div className="pl-2">
                {meal.foods.map((food, j) => (
                  <p key={j} className="text-[11px] text-secondary leading-relaxed">
                    <span className="text-white/20 mr-1.5">·</span>{food}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
