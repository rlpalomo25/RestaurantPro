import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types';
import { 
  ChefHat, 
  Clock, 
  Check, 
  AlertTriangle, 
  Play, 
  CheckCircle2, 
  Flame, 
  Volume2, 
  Filter, 
  Sparkles,
  UtensilsCrossed,
  BellRing
} from 'lucide-react';

interface KitchenKDSProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onPlaySound: (type: 'new_order' | 'ready' | 'bell') => void;
}

export const KitchenKDS: React.FC<KitchenKDSProps> = ({
  orders,
  onUpdateOrderStatus,
  onPlaySound,
}) => {
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [rushMode, setRushMode] = useState<boolean>(false);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  // Calculate elapsed minutes from ISO timestamp
  const getElapsedMinutes = (isoString: string): number => {
    const created = new Date(isoString).getTime();
    const now = Date.now();
    return Math.floor((now - created) / 60000);
  };

  // Sort orders FIFO: oldest orders first
  const activeOrders = orders
    .filter((o) => o.status !== 'delivered' && o.status !== 'cancelled')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const filteredOrders = activeOrders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  const toggleItemDone = (cartItemId: string) => {
    setCompletedItems((prev) => ({
      ...prev,
      [cartItemId]: !prev[cartItemId],
    }));
  };

  const pendingCount = activeOrders.filter((o) => o.status === 'pending').length;
  const preparingCount = activeOrders.filter((o) => o.status === 'preparing').length;
  const readyCount = activeOrders.filter((o) => o.status === 'ready').length;

  return (
    <div className="space-y-6 pb-24">
      
      {/* KDS Header & Analytics Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ChefHat className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-stone-100">Kitchen Display System (KDS)</h1>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  FIFO Queue
                </span>
              </div>
              <p className="text-xs text-stone-400">Real-time order command & preparation workflow</p>
            </div>
          </div>

          {/* Quick Metrics & Rush Mode Switch */}
          <div className="flex items-center space-x-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
            
            <div className="bg-stone-950 border border-stone-800 px-3 py-2 rounded-2xl text-center min-w-[80px]">
              <span className="text-[10px] text-stone-500 font-bold uppercase">Pending</span>
              <p className="text-lg font-black text-amber-400">{pendingCount}</p>
            </div>

            <div className="bg-stone-950 border border-stone-800 px-3 py-2 rounded-2xl text-center min-w-[80px]">
              <span className="text-[10px] text-stone-500 font-bold uppercase">Preparing</span>
              <p className="text-lg font-black text-blue-400">{preparingCount}</p>
            </div>

            <div className="bg-stone-950 border border-stone-800 px-3 py-2 rounded-2xl text-center min-w-[80px]">
              <span className="text-[10px] text-stone-500 font-bold uppercase">Ready</span>
              <p className="text-lg font-black text-emerald-400">{readyCount}</p>
            </div>

            {/* Rush Mode Toggle */}
            <button
              onClick={() => {
                setRushMode((prev) => !prev);
                if (!rushMode) onPlaySound('bell');
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all border shadow-md whitespace-nowrap ${
                rushMode
                  ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
              }`}
            >
              <Flame className={`w-4 h-4 ${rushMode ? 'text-amber-300' : 'text-stone-400'}`} />
              <span>{rushMode ? 'Rush Mode ACTIVE' : 'Toggle Rush Mode'}</span>
            </button>

          </div>

        </div>

        {/* Filter Tabs Bar */}
        <div className="mt-5 pt-4 border-t border-stone-800/80 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-2">
            {[
              { id: 'all', label: `All Orders (${activeOrders.length})` },
              { id: 'pending', label: `Pending (${pendingCount})` },
              { id: 'preparing', label: `In Prep (${preparingCount})` },
              { id: 'ready', label: `Ready (${readyCount})` },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterStatus(st.id as OrderStatus | 'all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  filterStatus === st.id
                    ? 'bg-amber-500 text-stone-950 border-amber-400'
                    : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPlaySound('bell')}
            className="text-xs text-stone-400 hover:text-amber-400 flex items-center space-x-1.5 px-3 py-1 bg-stone-950 rounded-xl border border-stone-800"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Test Bell</span>
          </button>
        </div>

      </div>

      {/* FIFO Order Grid */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-stone-900/40 border border-stone-800 rounded-3xl p-8">
          <CheckCircle2 className="w-12 h-12 text-emerald-500/60 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-stone-200">Kitchen Queue Clean & Clear!</h3>
          <p className="text-xs text-stone-500 mt-1">All customer orders have been prepared and delivered.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((order, index) => {
            const elapsed = getElapsedMinutes(order.createdAt);

            // Elapsed time urgency color: Green (< 10m), Yellow (10-20m), Red (> 20m)
            let urgencyColor = 'border-emerald-500/50 bg-stone-900';
            let badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

            if (elapsed >= 20 || rushMode) {
              urgencyColor = 'border-rose-500 bg-stone-900 shadow-lg shadow-rose-500/10';
              badgeBg = 'bg-rose-500 text-white font-extrabold animate-pulse';
            } else if (elapsed >= 10) {
              urgencyColor = 'border-amber-500/80 bg-stone-900';
              badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
            }

            return (
              <div
                key={order.id}
                className={`border-2 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all ${urgencyColor}`}
              >
                
                {/* Order Top Bar */}
                <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xl font-black text-stone-100">
                      #{order.orderNumber}
                    </span>
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold">
                      Table #{order.tableNumber}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center space-x-1 border ${badgeBg}`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{elapsed}m waiting</span>
                    </span>
                  </div>
                </div>

                {/* Special Instructions / Allergy Alert Banner */}
                {order.specialInstructions && (
                  <div className="bg-amber-500/15 border-b border-amber-500/30 p-3 text-xs text-amber-300 flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-200 uppercase">Special Instructions:</span>
                      <p className="font-medium text-amber-100 mt-0.5">{order.specialInstructions}</p>
                    </div>
                  </div>
                )}

                {/* Items Checklist */}
                <div className="p-4 space-y-3 flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    Dishes ({order.items.length}) • Click to mark prepped
                  </span>

                  <div className="space-y-2">
                    {order.items.map((item) => {
                      const isItemDone = completedItems[item.cartItemId];

                      return (
                        <div
                          key={item.cartItemId}
                          onClick={() => toggleItemDone(item.cartItemId)}
                          className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-2 ${
                            isItemDone
                              ? 'bg-stone-950/80 border-stone-800/80 line-through text-stone-500 opacity-60'
                              : 'bg-stone-800/60 border-stone-700/80 text-stone-100 hover:bg-stone-800'
                          }`}
                        >
                          <div className="flex items-start space-x-2.5">
                            <span className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center text-xs ${
                              isItemDone ? 'bg-stone-800 text-stone-500' : 'bg-amber-500 text-stone-950'
                            }`}>
                              {item.quantity}x
                            </span>
                            <div>
                              <p className="font-bold text-sm leading-tight">{item.menuItem.name}</p>
                              {item.selectedCustomizations.length > 0 && (
                                <div className="mt-1 space-y-0.5">
                                  {item.selectedCustomizations.map((c) => (
                                    <p key={c.optionId} className="text-[11px] text-amber-300/90 font-medium">
                                      • {c.selectedChoices.map((ch) => ch.name).join(', ')}
                                    </p>
                                  ))}
                                </div>
                              )}
                              {item.specialInstructions && (
                                <p className="text-[11px] text-rose-300 font-bold mt-0.5">
                                  Note: {item.specialInstructions}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                            isItemDone ? 'bg-emerald-500 border-emerald-400 text-stone-950' : 'border-stone-600'
                          }`}>
                            {isItemDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* KDS Status Advancement Actions */}
                <div className="p-4 bg-stone-950 border-t border-stone-800">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(order.id, 'preparing');
                        onPlaySound('new_order');
                      }}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-2xl shadow-lg flex items-center justify-center space-x-2 transition-all"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Cooking (Mark Preparing)</span>
                    </button>
                  )}

                  {order.status === 'preparing' && (
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(order.id, 'ready');
                        onPlaySound('ready');
                      }}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs rounded-2xl shadow-lg flex items-center justify-center space-x-2 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Ready for Table</span>
                    </button>
                  )}

                  {order.status === 'ready' && (
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(order.id, 'delivered');
                      }}
                      className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-black text-xs rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-all border border-stone-700"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Mark Delivered to Table</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
