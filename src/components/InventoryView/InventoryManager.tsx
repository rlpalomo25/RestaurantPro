import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { 
  Package, 
  Search, 
  AlertTriangle, 
  Plus, 
  Minus, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface InventoryManagerProps {
  menu: MenuItem[];
  onUpdateStock: (itemId: string, newStock: number) => void;
  onToggleAvailability: (itemId: string, isAvailable: boolean) => void;
  onRestockAll: () => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  menu,
  onUpdateStock,
  onToggleAvailability,
  onRestockAll,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [onlyLowStock, setOnlyLowStock] = useState<boolean>(false);

  const filteredItems = menu.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const isLow = item.stockQuantity <= item.lowStockThreshold || !item.isAvailable;
    const matchesLowFilter = !onlyLowStock || isLow;

    return matchesSearch && matchesCategory && matchesLowFilter;
  });

  const lowStockCount = menu.filter(
    (item) => item.stockQuantity <= item.lowStockThreshold || !item.isAvailable
  ).length;

  return (
    <div className="space-y-6 pb-24">
      
      {/* Top Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-stone-100">Real-Time Inventory Control</h1>
            <p className="text-xs text-stone-400">Automatic stock tracking with 86'd kitchen toggles</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {lowStockCount > 0 && (
            <div className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{lowStockCount} Items Low / Sold Out</span>
            </div>
          )}

          <button
            onClick={onRestockAll}
            className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-bold text-xs rounded-2xl flex items-center space-x-2 transition-all"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>Reset / Restock All</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-900 p-4 rounded-2xl border border-stone-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Filter inventory item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={() => setOnlyLowStock((prev) => !prev)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              onlyLowStock
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-stone-950 text-stone-400 border-stone-800'
            }`}
          >
            Low Stock Only ({lowStockCount})
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950 text-stone-400 font-bold uppercase tracking-wider text-[10px] border-b border-stone-800">
              <tr>
                <th className="p-4">Dish</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Quick Adjust</th>
                <th className="p-4 text-right">86'd Kitchen Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {filteredItems.map((item) => {
                const isOut = !item.isAvailable || item.stockQuantity <= 0;
                const isLow = item.stockQuantity > 0 && item.stockQuantity <= item.lowStockThreshold;

                return (
                  <tr key={item.id} className="hover:bg-stone-800/40 transition-colors">
                    
                    {/* Item info */}
                    <td className="p-4 font-bold text-stone-100">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover bg-stone-950 border border-stone-800"
                        />
                        <div>
                          <p className="text-xs font-bold text-stone-100">{item.name}</p>
                          <p className="text-[10px] text-stone-500">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 capitalize text-stone-400 font-medium">
                      {item.category}
                    </td>

                    {/* Status badge */}
                    <td className="p-4">
                      {isOut ? (
                        <span className="px-2.5 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-[10px] font-extrabold uppercase">
                          86'd / Sold Out
                        </span>
                      ) : isLow ? (
                        <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-[10px] font-bold">
                          Low Stock ({item.stockQuantity})
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-bold">
                          In Stock ({item.stockQuantity})
                        </span>
                      )}
                    </td>

                    {/* Stock level progress */}
                    <td className="p-4">
                      <div className="w-28 space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>{item.stockQuantity} units</span>
                          <span className="text-stone-500">Min: {item.lowStockThreshold}</span>
                        </div>
                        <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isOut ? 'bg-rose-500' : isLow ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${Math.min(100, (item.stockQuantity / 30) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Quick Adjust +/- Buttons */}
                    <td className="p-4">
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => onUpdateStock(item.id, Math.max(0, item.stockQuantity - 1))}
                          className="p-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg border border-stone-700"
                          title="Decrease 1"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onUpdateStock(item.id, item.stockQuantity + 10)}
                          className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30 text-[10px] font-bold"
                          title="Add 10"
                        >
                          +10
                        </button>

                        <button
                          onClick={() => onUpdateStock(item.id, item.stockQuantity + 1)}
                          className="p-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg border border-stone-700"
                          title="Increase 1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* 86'd Kitchen Availability Toggle */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onToggleAvailability(item.id, !item.isAvailable)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all border inline-flex items-center space-x-1.5 ${
                          item.isAvailable
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-rose-500/10 hover:text-rose-400'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-emerald-500/10 hover:text-emerald-400'
                        }`}
                      >
                        {item.isAvailable ? (
                          <>
                            <ToggleRight className="w-4 h-4 text-emerald-400" />
                            <span>Active (Available)</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 text-rose-400" />
                            <span>86'd (Sold Out)</span>
                          </>
                        )}
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
