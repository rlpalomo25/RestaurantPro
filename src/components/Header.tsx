import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Role, SystemNotification } from '../types';
import { 
  UtensilsCrossed, 
  ChefHat, 
  ShieldCheck, 
  QrCode, 
  Bell, 
  Wifi, 
  WifiOff, 
  Volume2, 
  VolumeX,
  Smartphone
} from 'lucide-react';

interface HeaderProps {
  activeRole?: Role;
  setActiveRole?: (role: Role) => void;
  tableNumber: number;
  openQRScanner: () => void;
  isOffline: boolean;
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  notifications: SystemNotification[];
  openNotifications: () => void;
  cartCount: number;
  openCart: () => void;
  activeOrderCount: number;
  openActiveOrders: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tableNumber,
  openQRScanner,
  isOffline,
  soundEnabled,
  setSoundEnabled,
  notifications,
  openNotifications,
  cartCount,
  openCart,
  activeOrderCount,
  openActiveOrders,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const currentRole: Role = location.pathname.startsWith('/kitchen')
    ? 'kitchen'
    : location.pathname.startsWith('/manager')
    ? 'manager'
    : 'customer';

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md text-stone-100 border-b border-stone-800 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/customer')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-stone-900 font-bold shadow-inner">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
                  DineFlow
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                  POS & KDS
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">Smart QR Restaurant Command</p>
            </div>
          </div>

          {/* Center Role Navigation Switcher */}
          <nav className="flex items-center bg-stone-800/80 p-1 rounded-xl border border-stone-700/60 overflow-x-auto max-w-[280px] sm:max-w-none no-scrollbar">
            <button
              onClick={() => navigate('/customer')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                currentRole === 'customer'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Customer (/customer)</span>
            </button>

            <button
              onClick={() => navigate('/kitchen')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                currentRole === 'kitchen'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Kitchen (/kitchen)</span>
            </button>

            <button
              onClick={() => navigate('/manager')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                currentRole === 'manager'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Manager (/manager)</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2">
            
            {/* Table Selector pill for customer view */}
            {currentRole === 'customer' && (
              <button
                onClick={openQRScanner}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-lg transition-colors shadow-sm"
                title="Change Table via QR Scanner"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-400" />
                <span>Table #{tableNumber}</span>
              </button>
            )}

            {/* Customer Active Orders button */}
            {currentRole === 'customer' && activeOrderCount > 0 && (
              <button
                onClick={openActiveOrders}
                className="relative flex items-center space-x-1 px-2.5 py-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-semibold rounded-lg transition-all"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span>Order Live</span>
              </button>
            )}

            {/* Offline status indicator */}
            <div 
              className={`flex items-center space-x-1 px-2 py-1 rounded-md text-[11px] font-medium ${
                isOffline 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
              title={isOffline ? 'Offline Mode Active' : 'Online & Synchronized'}
            >
              {isOffline ? <WifiOff className="w-3 h-3 text-rose-400" /> : <Wifi className="w-3 h-3 text-emerald-400" />}
              <span className="hidden lg:inline">{isOffline ? 'Offline' : 'Online'}</span>
            </div>

            {/* Sound toggle */}
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
              title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Notifications Bell */}
            <button
              onClick={openNotifications}
              className="relative p-1.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-stone-950 text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {/* Cart Button (For Customer Mode) */}
            {currentRole === 'customer' && (
              <button
                onClick={openCart}
                className="relative flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold rounded-xl shadow-md transition-all transform active:scale-95"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="bg-stone-950 text-amber-400 text-[11px] px-1.5 py-0.2 rounded-full font-extrabold">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

