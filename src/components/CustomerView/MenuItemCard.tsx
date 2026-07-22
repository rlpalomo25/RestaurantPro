import React from 'react';
import { MenuItem, DietaryTag } from '../../types';
import { Plus, Flame, Clock, Sparkles, AlertCircle } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onOpenCustomizer: (item: MenuItem) => void;
}

const DIETARY_LABELS: Record<DietaryTag, { label: string; color: string }> = {
  vegetarian: { label: 'Veg', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  vegan: { label: 'Vegan', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
  'gluten-free': { label: 'GF', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  'contains-nuts': { label: 'Nuts', color: 'bg-amber-700/20 text-amber-300 border-amber-600/30' },
  'chef-special': { label: '★ Chef Special', color: 'bg-amber-400/20 text-amber-300 border-amber-400/40 font-bold' },
  spicy: { label: '🌶️ Spicy', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
};

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onOpenCustomizer }) => {
  const isSoldOut = !item.isAvailable || item.stockQuantity <= 0;
  const isLowStock = item.stockQuantity > 0 && item.stockQuantity <= item.lowStockThreshold;

  return (
    <div className={`group bg-stone-900 border rounded-2xl overflow-hidden transition-all duration-200 flex flex-col ${
      isSoldOut
        ? 'border-stone-800 opacity-60 grayscale-[40%]'
        : 'border-stone-800/80 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5'
    }`}>
      
      {/* Image Container */}
      <div className="relative h-44 w-full bg-stone-950 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-black/30" />

        {/* Dietary Tag Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 max-w-[80%]">
          {item.dietaryTags.map((tag) => {
            const config = DIETARY_LABELS[tag];
            if (!config) return null;
            return (
              <span
                key={tag}
                className={`text-[10px] px-2 py-0.5 rounded-md border backdrop-blur-md ${config.color}`}
              >
                {config.label}
              </span>
            );
          })}
        </div>

        {/* Stock Badges */}
        <div className="absolute top-2.5 right-2.5">
          {isSoldOut ? (
            <span className="bg-rose-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-2 py-1 rounded-md shadow-md">
              86'd / Sold Out
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-500 text-stone-950 font-bold text-[10px] px-2 py-0.5 rounded-md shadow-sm animate-pulse flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>Only {item.stockQuantity} Left</span>
            </span>
          ) : null}
        </div>

        {/* Prep time badge */}
        <div className="absolute bottom-2 left-2.5 text-[11px] text-stone-300 font-medium flex items-center space-x-1 bg-stone-950/70 px-2 py-0.5 rounded-md backdrop-blur-sm border border-stone-800">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>{item.prepTimeMinutes}m</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <h3 className="font-bold text-stone-100 text-sm group-hover:text-amber-300 transition-colors line-clamp-1">
            {item.name}
          </h3>
          <p className="text-stone-400 text-xs line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-800/60">
          <div className="flex items-baseline space-x-1">
            <span className="font-extrabold text-base text-amber-400">${item.price.toFixed(2)}</span>
            {item.calories && <span className="text-[10px] text-stone-500">/ {item.calories} cal</span>}
          </div>

          <button
            onClick={() => !isSoldOut && onOpenCustomizer(item)}
            disabled={isSoldOut}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              isSoldOut
                ? 'bg-stone-800 text-stone-600 cursor-not-allowed'
                : 'bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-stone-950 border border-amber-500/30'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{item.customizationOptions?.length ? 'Customize' : 'Add'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
