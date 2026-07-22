import React, { useState } from 'react';
import { ManagerTab, MenuItem, Order, OrderStatus } from '../../types';
import { MenuManager } from './MenuManager';
import { KitchenKDS } from '../KitchenView/KitchenKDS';
import { InventoryManager } from '../InventoryView/InventoryManager';
import { AnalyticsDashboard } from '../AnalyticsView/AnalyticsDashboard';
import { TableQRGenerator } from '../QRGenerator/TableQRGenerator';
import { TableView } from './TableView';
import { BroadcastManagerModal } from './BroadcastManagerModal';
import { 
  Utensils, 
  ChefHat, 
  Package, 
  BarChart3, 
  QrCode, 
  ShieldCheck, 
  LayoutGrid,
  Radio
} from 'lucide-react';

interface ManagerDashboardProps {
  menu: MenuItem[];
  onUpdateMenu: (newMenu: MenuItem[]) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onPlaySound: (type: 'new_order' | 'ready' | 'bell') => void;
  onUpdateStock: (itemId: string, newStock: number) => void;
  onToggleAvailability: (itemId: string, isAvailable: boolean) => void;
  onRestockAll: () => void;
  onLaunchTableCustomerView: (tableNum: number) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  menu,
  onUpdateMenu,
  orders,
  onUpdateOrderStatus,
  onPlaySound,
  onUpdateStock,
  onToggleAvailability,
  onRestockAll,
  onLaunchTableCustomerView,
}) => {
  const [activeTab, setActiveTab] = useState<ManagerTab>('tables');
  const [isBroadcastOpen, setIsBroadcastOpen] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      
      {/* Manager Control Navigation Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-3.5 shadow-xl flex flex-col xl:flex-row items-center justify-between gap-4">
        
        {/* Title & Broadcast Action */}
        <div className="flex items-center justify-between w-full xl:w-auto space-x-4 px-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-stone-950 font-black shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-extrabold text-stone-100 text-sm tracking-tight">Manager Command Center</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  Full Privileges
                </span>
              </div>
              <p className="text-[11px] text-stone-400">Complete control over floor plan, menu, KDS & announcements</p>
            </div>
          </div>

          {/* Broadcast Announcement Button */}
          <button
            onClick={() => setIsBroadcastOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs rounded-2xl shadow-lg transition-all transform active:scale-95 shrink-0"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">Broadcast Channel</span>
            <span className="sm:hidden">Broadcast</span>
          </button>
        </div>

        {/* Manager Sub-Tab Buttons */}
        <div className="flex items-center bg-stone-950 p-1.5 rounded-2xl border border-stone-800 overflow-x-auto w-full xl:w-auto no-scrollbar">
          
          <button
            onClick={() => setActiveTab('tables')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'tables'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Floor Plan & Tables</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'menu'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Update Menu</span>
          </button>

          <button
            onClick={() => setActiveTab('kitchen')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'kitchen'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Kitchen Live</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Stock & Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Staff Sales Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('qr-gen')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'qr-gen'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Table QR Cards</span>
          </button>

        </div>

      </div>

      {/* Render Active Manager Tab */}
      <div>
        {activeTab === 'tables' && (
          <TableView
            orders={orders}
            onUpdateOrderStatus={onUpdateOrderStatus}
            onLaunchTableCustomerView={onLaunchTableCustomerView}
          />
        )}

        {activeTab === 'menu' && (
          <MenuManager menu={menu} onUpdateMenu={onUpdateMenu} />
        )}

        {activeTab === 'kitchen' && (
          <KitchenKDS
            orders={orders}
            onUpdateOrderStatus={onUpdateOrderStatus}
            onPlaySound={onPlaySound}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryManager
            menu={menu}
            onUpdateStock={onUpdateStock}
            onToggleAvailability={onToggleAvailability}
            onRestockAll={onRestockAll}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard orders={orders} menu={menu} />
        )}

        {activeTab === 'qr-gen' && (
          <TableQRGenerator onSelectTableAndLaunch={onLaunchTableCustomerView} />
        )}
      </div>

      {/* Broadcast Manager Announcement Modal */}
      <BroadcastManagerModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        onPlaySound={onPlaySound}
      />

    </div>
  );
};

