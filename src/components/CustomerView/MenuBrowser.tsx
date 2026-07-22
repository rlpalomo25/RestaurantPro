import React, { useState } from 'react';
import { MenuItem, Category, DietaryTag } from '../../types';
import { CATEGORIES } from '../../data/mockData';
import { MenuItemCard } from './MenuItemCard';
import { 
  Search, 
  WifiOff, 
  Sparkles, 
  Filter, 
  BellRing, 
  Utensils, 
  Soup, 
  Beef, 
  Pizza, 
  Cake, 
  Coffee 
} from 'lucide-react';

interface MenuBrowserProps {
  menu: MenuItem[];
  tableNumber: number;
  isOffline: boolean;
  onOpenCustomizer: (item: MenuItem) => void;
  onRequestWaiter: () => void;
  waiterRequested: boolean;
}

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Utensils,
  Soup,
  Beef,
  Pizza,
  Cake,
  Coffee,
};

export const MenuBrowser: React.FC<MenuBrowserProps> = ({
  menu,
  tableNumber,
  isOffline,
  onOpenCustomizer,
  onRequestWaiter,
  waiterRequested,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryTag | 'all'>('all');

  // Filter menu items based on category, search, and dietary tags
  const filteredItems = menu.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDietary =
      dietaryFilter === 'all' || item.dietaryTags.includes(dietaryFilter as DietaryTag);

    return matchesCat && matchesSearch && matchesDietary;
  });

  return (
    <div className="space-y-6 pb-24">
      
      {/* Offline Banner Notification if client is offline */}
      {isOffline && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between text-amber-300 text-xs shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2.5">
            <WifiOff className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div>
              <span className="font-bold text-amber-200">Offline Menu Browsing Active.</span>
              <p className="text-[11px] text-amber-400/80">
                You can browse dishes and customize cart items offline. Orders auto-sync when back online.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950/60 via-stone-900 to-amber-900/40 border border-stone-800 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[11px] font-bold">
                Table #{tableNumber} Active
              </span>
              <span className="text-stone-400 text-xs">Direct Digital Service</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-100 tracking-tight">
              Artisan Menu & Table Service
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-xl">
              Order directly from your table. Freshly prepared by our chefs and routed in real-time to the kitchen.
            </p>
          </div>

          <button
            onClick={onRequestWaiter}
            disabled={waiterRequested}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-lg whitespace-nowrap ${
              waiterRequested
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 hover:border-amber-400'
            }`}
          >
            <BellRing className={`w-4 h-4 ${waiterRequested ? 'text-amber-400' : 'text-stone-400'}`} />
            <span>{waiterRequested ? 'Waiter Notified!' : 'Call Waiter to Table'}</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const IconComp = CATEGORY_ICONS[cat.iconName] || Utensils;
          const isSel = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
                isSel
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md shadow-amber-500/10 scale-102'
                  : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <IconComp className={`w-4 h-4 ${isSel ? 'text-stone-950' : 'text-amber-400'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Dietary Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-900 p-3 rounded-2xl border border-stone-800">
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Search dishes, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Dietary Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          <span className="text-[11px] text-stone-400 font-medium flex items-center space-x-1 pr-1">
            <Filter className="w-3 h-3 text-stone-500" />
            <span>Filter:</span>
          </span>

          {[
            { id: 'all', label: 'All' },
            { id: 'chef-special', label: '★ Chef Special' },
            { id: 'vegetarian', label: 'Vegetarian' },
            { id: 'vegan', label: 'Vegan' },
            { id: 'gluten-free', label: 'Gluten-Free' },
          ].map((df) => (
            <button
              key={df.id}
              onClick={() => setDietaryFilter(df.id as DietaryTag | 'all')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap border ${
                dietaryFilter === df.id
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              {df.label}
            </button>
          ))}
        </div>

      </div>

      {/* Menu Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-stone-900/50 border border-stone-800/80 rounded-3xl p-8">
          <Utensils className="w-12 h-12 text-stone-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-300">No dishes match your filter</h3>
          <p className="text-xs text-stone-500 mt-1">Try clearing your search or choosing a different category</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setDietaryFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-stone-800 text-amber-400 rounded-xl text-xs font-bold hover:bg-stone-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onOpenCustomizer={onOpenCustomizer}
            />
          ))}
        </div>
      )}

    </div>
  );
};
