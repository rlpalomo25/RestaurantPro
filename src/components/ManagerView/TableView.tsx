import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { 
  Users, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  ChefHat, 
  ExternalLink, 
  Search, 
  Filter, 
  Sparkles, 
  Utensils, 
  BellRing,
  X,
  ChevronRight
} from 'lucide-react';

interface TableViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onLaunchTableCustomerView: (tableNum: number) => void;
}

interface TableInfo {
  number: number;
  seats: number;
  zone: 'Main Dining' | 'Patio' | 'VIP Booth' | 'Bar Section';
}

const RESTAURANT_TABLES: TableInfo[] = [
  { number: 1, seats: 2, zone: 'Main Dining' },
  { number: 2, seats: 2, zone: 'Main Dining' },
  { number: 3, seats: 4, zone: 'Main Dining' },
  { number: 4, seats: 4, zone: 'Main Dining' },
  { number: 5, seats: 6, zone: 'VIP Booth' },
  { number: 6, seats: 6, zone: 'VIP Booth' },
  { number: 7, seats: 4, zone: 'Patio' },
  { number: 8, seats: 4, zone: 'Patio' },
  { number: 9, seats: 2, zone: 'Patio' },
  { number: 10, seats: 2, zone: 'Bar Section' },
  { number: 11, seats: 2, zone: 'Bar Section' },
  { number: 12, seats: 8, zone: 'VIP Booth' },
];

export const TableView: React.FC<TableViewProps> = ({
  orders,
  onUpdateOrderStatus,
  onLaunchTableCustomerView,
}) => {
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedTableNum, setSelectedTableNum] = useState<number | null>(null);

  // Helper to get active orders for a specific table
  const getTableOrders = (tableNum: number) => {
    return orders.filter(
      (o) => o.tableNumber === tableNum && o.status !== 'delivered' && o.status !== 'cancelled'
    );
  };

  // Helper to compute table state
  const getTableState = (tableNum: number) => {
    const tableOrders = getTableOrders(tableNum);
    if (tableOrders.length === 0) {
      return { status: 'idle', label: 'Available', color: 'emerald' };
    }

    // Check if any order requested waiter
    const needsWaiter = tableOrders.some((o) => o.waiterRequested);
    if (needsWaiter) {
      return { status: 'waiter', label: 'Needs Assistance', color: 'rose' };
    }

    // Check if any order is ready
    const hasReady = tableOrders.some((o) => o.status === 'ready');
    if (hasReady) {
      return { status: 'ready', label: 'Food Ready!', color: 'cyan' };
    }

    // Pending or preparing
    return { status: 'occupied', label: 'In Progress', color: 'amber' };
  };

  // Compute overall stats
  const totalTables = RESTAURANT_TABLES.length;
  const occupiedCount = RESTAURANT_TABLES.filter((t) => getTableOrders(t.number).length > 0).length;
  const readyCount = RESTAURANT_TABLES.filter(
    (t) => getTableOrders(t.number).some((o) => o.status === 'ready')
  ).length;
  const waiterCount = RESTAURANT_TABLES.filter(
    (t) => getTableOrders(t.number).some((o) => o.waiterRequested)
  ).length;
  const availableCount = totalTables - occupiedCount;

  const totalActiveRevenue = orders
    .filter((o) => o.status !== 'delivered' && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.payment.total, 0);

  // Filtered table list
  const filteredTables = RESTAURANT_TABLES.filter((table) => {
    const tableState = getTableState(table.number);
    const matchesZone = filterZone === 'all' || table.zone === filterZone;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'available' && tableState.status === 'idle') ||
      (filterStatus === 'active' && tableState.status !== 'idle') ||
      (filterStatus === 'ready' && tableState.status === 'ready') ||
      (filterStatus === 'waiter' && tableState.status === 'waiter');

    return matchesZone && matchesStatus;
  });

  const selectedTableOrders = selectedTableNum ? getTableOrders(selectedTableNum) : [];
  const selectedTableInfo = RESTAURANT_TABLES.find((t) => t.number === selectedTableNum);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Floor Plan Header & Real-Time Stats */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-stone-950 font-black shadow-lg">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-stone-100">Live Table Floor Plan</h1>
              <p className="text-xs text-stone-400">Real-time occupancy, order prep statuses & guest calls</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-stone-950 px-4 py-2.5 rounded-2xl border border-stone-800">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <div className="text-right">
              <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Active Floor Bill</p>
              <p className="text-sm font-black text-emerald-300">${totalActiveRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Status Metrics Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-stone-950/80 p-3.5 rounded-2xl border border-stone-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-stone-400 font-bold uppercase">Available Tables</p>
              <p className="text-xl font-black text-emerald-400">{availableCount}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              {Math.round((availableCount / totalTables) * 100)}%
            </div>
          </div>

          <div className="bg-stone-950/80 p-3.5 rounded-2xl border border-stone-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-stone-400 font-bold uppercase">In Progress</p>
              <p className="text-xl font-black text-amber-400">{occupiedCount}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-stone-950/80 p-3.5 rounded-2xl border border-stone-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-stone-400 font-bold uppercase">Food Ready</p>
              <p className="text-xl font-black text-cyan-400">{readyCount}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-stone-950/80 p-3.5 rounded-2xl border border-stone-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-stone-400 font-bold uppercase">Needs Waiter</p>
              <p className="text-xl font-black text-rose-400">{waiterCount}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs animate-pulse">
              <BellRing className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Legend & Filter Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Color Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="text-stone-400 font-bold text-[11px] uppercase tracking-wider">Legend:</span>
          <div className="flex items-center space-x-1.5 bg-stone-950 px-2.5 py-1 rounded-lg border border-emerald-500/30">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-300 font-semibold text-[11px]">Available</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-stone-950 px-2.5 py-1 rounded-lg border border-amber-500/30">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-amber-300 font-semibold text-[11px]">Preparing</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-stone-950 px-2.5 py-1 rounded-lg border border-cyan-500/30">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-cyan-300 font-semibold text-[11px]">Food Plated / Ready</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-stone-950 px-2.5 py-1 rounded-lg border border-rose-500/30">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="text-rose-300 font-semibold text-[11px]">Waiter Call</span>
          </div>
        </div>

        {/* Filter Pill Selectors */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto no-scrollbar">
          {['all', 'available', 'active', 'ready', 'waiter'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Visual Table Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredTables.map((table) => {
          const tableOrders = getTableOrders(table.number);
          const tableState = getTableState(table.number);

          // Card color styling dynamic mapping
          let cardBg = 'bg-stone-900 border-stone-800 hover:border-stone-700';
          let badgeBg = 'bg-stone-800 text-stone-400 border-stone-700';

          if (tableState.color === 'emerald') {
            cardBg = 'bg-stone-900/90 border-emerald-500/30 hover:border-emerald-400/80 shadow-emerald-950/20';
            badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
          } else if (tableState.color === 'amber') {
            cardBg = 'bg-stone-900/90 border-amber-500/50 hover:border-amber-400 shadow-amber-950/30';
            badgeBg = 'bg-amber-500/10 text-amber-300 border-amber-500/40';
          } else if (tableState.color === 'cyan') {
            cardBg = 'bg-stone-900/90 border-cyan-400/80 hover:border-cyan-300 shadow-cyan-950/40 ring-1 ring-cyan-400/30';
            badgeBg = 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50';
          } else if (tableState.color === 'rose') {
            cardBg = 'bg-rose-950/20 border-rose-500 hover:border-rose-400 shadow-rose-950/50 ring-2 ring-rose-500/50 animate-pulse';
            badgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-black';
          }

          const tableTotal = tableOrders.reduce((sum, o) => sum + o.payment.total, 0);
          const totalItemCount = tableOrders.reduce(
            (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
            0
          );

          return (
            <div
              key={table.number}
              onClick={() => setSelectedTableNum(table.number)}
              className={`border rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-xl flex flex-col justify-between group ${cardBg}`}
            >
              <div>
                {/* Table Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col items-center justify-center text-amber-400 group-hover:border-amber-400/50 transition-colors">
                      <span className="text-[9px] uppercase font-bold text-stone-500">Table</span>
                      <span className="text-lg font-black leading-none">{table.number}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-1 text-xs text-stone-300 font-bold">
                        <Users className="w-3.5 h-3.5 text-stone-400" />
                        <span>{table.seats} Seats</span>
                      </div>
                      <p className="text-[10px] text-stone-500 font-semibold">{table.zone}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border uppercase tracking-wider ${badgeBg}`}>
                    {tableState.label}
                  </span>
                </div>

                {/* Table Active Content */}
                {tableOrders.length > 0 ? (
                  <div className="bg-stone-950/80 rounded-2xl p-3 border border-stone-800/80 space-y-2 mb-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-stone-200">
                        {tableOrders.length} {tableOrders.length === 1 ? 'Order' : 'Orders'} ({totalItemCount} items)
                      </span>
                      <span className="font-black text-amber-300">${tableTotal.toFixed(2)}</span>
                    </div>

                    {/* Show quick item previews */}
                    <div className="text-[11px] text-stone-400 line-clamp-2 space-y-1 pt-1 border-t border-stone-800/60">
                      {tableOrders.map((o) => (
                        <div key={o.id} className="flex items-center justify-between">
                          <span>#{o.orderNumber}: {o.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(', ')}</span>
                          <span className="text-[10px] uppercase font-bold text-stone-500 ml-2">{o.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-stone-950/40 rounded-2xl p-4 border border-dashed border-stone-800/80 text-center space-y-1 mb-4">
                    <p className="text-xs font-bold text-stone-400">Table Ready for Guests</p>
                    <p className="text-[10px] text-stone-500">No open orders at this time</p>
                  </div>
                )}
              </div>

              {/* Bottom Quick Action Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-800/60">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLaunchTableCustomerView(table.number);
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Launch Menu</span>
                </button>

                <div className="flex items-center text-xs font-bold text-stone-400 group-hover:text-stone-200">
                  <span>Inspect</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Selected Table Inspector Modal */}
      {selectedTableNum !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-xl">
                  #{selectedTableNum}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-stone-100">
                    Table #{selectedTableNum} Overview
                  </h2>
                  <p className="text-xs text-stone-400">
                    Zone: {selectedTableInfo?.zone} • Capacity: {selectedTableInfo?.seats} Guests
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTableNum(null)}
                className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {selectedTableOrders.length === 0 ? (
                <div className="text-center py-12 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                  <Utensils className="w-10 h-10 text-stone-600 mx-auto" />
                  <h3 className="text-base font-bold text-stone-300">No Active Orders</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    This table is currently available. You can launch the guest menu view for Table #{selectedTableNum} below.
                  </p>
                  <button
                    onClick={() => {
                      onLaunchTableCustomerView(selectedTableNum);
                      setSelectedTableNum(null);
                    }}
                    className="mt-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl inline-flex items-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Customer View for Table #{selectedTableNum}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider">
                    Active Orders ({selectedTableOrders.length})
                  </h3>

                  {selectedTableOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-stone-950 border border-stone-800 rounded-2xl p-4 space-y-4"
                    >
                      {/* Order Header */}
                      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                        <div>
                          <span className="text-sm font-black text-stone-100">Order #{order.orderNumber}</span>
                          <p className="text-[11px] text-stone-500">
                            Placed {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase ${
                            order.status === 'ready' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                            order.status === 'preparing' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            'bg-stone-800 text-stone-300'
                          }`}>
                            {order.status}
                          </span>
                          <span className="text-sm font-black text-amber-300">${order.payment.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start text-xs">
                            <span className="text-stone-300">
                              <strong className="text-amber-400 font-bold">{item.quantity}x</strong> {item.menuItem.name}
                            </span>
                            <span className="text-stone-400 font-semibold">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Status Update Actions */}
                      <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                        <span className="text-[11px] text-stone-400">Advance Kitchen Status:</span>
                        <div className="flex items-center space-x-2">
                          {order.status !== 'ready' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                              className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-bold"
                            >
                              Mark Ready
                            </button>
                          )}
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                            className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold"
                          >
                            Mark Delivered
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
              <button
                onClick={() => {
                  onLaunchTableCustomerView(selectedTableNum);
                  setSelectedTableNum(null);
                }}
                className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center space-x-2"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Launch Customer Tablet Mode</span>
              </button>

              <button
                onClick={() => setSelectedTableNum(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
