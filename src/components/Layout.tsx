import { useStore } from '../store/useStore';
import { BottomNav } from './BottomNav';
import { TodayTab } from './TodayTab';
import { ProgrammeTab } from './ProgrammeTab';
import { PrehabTab } from './PrehabTab';
import { NutritionTab } from './NutritionTab';
import { ProgressTab } from './ProgressTab';

const tabComponents = {
  today: TodayTab,
  programme: ProgrammeTab,
  prehab: PrehabTab,
  nutrition: NutritionTab,
  progress: ProgressTab,
};

export function Layout() {
  const { activeTab } = useStore();
  const TabComponent = tabComponents[activeTab];

  return (
    <div className="flex flex-col h-full bg-bg">
      <div key={activeTab} className="flex-1 overflow-y-auto scrollbar-hide animate-fade-in">
        <TabComponent />
      </div>
      <BottomNav />
    </div>
  );
}
