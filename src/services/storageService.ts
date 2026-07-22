import { MenuItem, Order, SystemNotification, OrderStatus } from '../types';
import { INITIAL_MENU, INITIAL_ORDERS } from '../data/mockData';

const MENU_STORAGE_KEY = 'dineflow_menu_v1';
const ORDERS_STORAGE_KEY = 'dineflow_orders_v1';
const NOTIFS_STORAGE_KEY = 'dineflow_notifs_v1';
const TABLE_STORAGE_KEY = 'dineflow_table_num_v1';

// Cross-tab broadcast channel
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  broadcastChannel = new BroadcastChannel('dineflow_sync_channel');
}

export const getStoredMenu = (): MenuItem[] => {
  try {
    const data = localStorage.getItem(MENU_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(INITIAL_MENU));
      return INITIAL_MENU;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to read menu from storage', e);
    return INITIAL_MENU;
  }
};

export const saveMenu = (menu: MenuItem[]) => {
  try {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menu));
    broadcastChannel?.postMessage({ type: 'MENU_UPDATED', payload: menu });
  } catch (e) {
    console.error('Failed to save menu', e);
  }
};

export const getStoredOrders = (): Order[] => {
  try {
    const data = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to read orders from storage', e);
    return INITIAL_ORDERS;
  }
};

export const saveOrders = (orders: Order[]) => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    broadcastChannel?.postMessage({ type: 'ORDERS_UPDATED', payload: orders });
  } catch (e) {
    console.error('Failed to save orders', e);
  }
};

export const getStoredNotifications = (): SystemNotification[] => {
  try {
    const data = localStorage.getItem(NOTIFS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveNotifications = (notifs: SystemNotification[]) => {
  try {
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(notifs));
    broadcastChannel?.postMessage({ type: 'NOTIFS_UPDATED', payload: notifs });
  } catch (e) {
    console.error('Failed to save notifications', e);
  }
};

export const addNotification = (notif: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => {
  const current = getStoredNotifications();
  const newNotif: SystemNotification = {
    ...notif,
    id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    timestamp: new Date().toISOString(),
    read: false,
  };
  const updated = [newNotif, ...current].slice(0, 30);
  saveNotifications(updated);
  return newNotif;
};

export const getStoredTableNumber = (): number => {
  try {
    const val = localStorage.getItem(TABLE_STORAGE_KEY);
    return val ? parseInt(val, 10) : 4; // Default table 4
  } catch (e) {
    return 4;
  }
};

export const saveTableNumber = (tableNum: number) => {
  try {
    localStorage.setItem(TABLE_STORAGE_KEY, tableNum.toString());
    broadcastChannel?.postMessage({ type: 'TABLE_CHANGED', payload: tableNum });
  } catch (e) {
    console.error('Failed to save table number', e);
  }
};

// Play audio alert sounds safely using Web Audio API synthesized tones
export const playSoundAlert = (type: 'new_order' | 'ready' | 'bell') => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    if (type === 'new_order' || type === 'bell') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'ready') {
      // Pleasant double chime
      [0, 0.2].forEach((delay, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(index === 0 ? 523.25 : 659.25, ctx.currentTime + delay); // C5 then E5
        gain.gain.setValueAtTime(0.25, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.4);
      });
    }
  } catch (err) {
    console.log('Audio playback prevented by browser audio policy or unsupported context', err);
  }
};

// Subscribe helper for components
export const subscribeToBroadcast = (callback: (data: { type: string; payload: unknown }) => void) => {
  if (!broadcastChannel) return () => {};
  const handler = (event: MessageEvent) => {
    callback(event.data);
  };
  broadcastChannel.addEventListener('message', handler);
  return () => {
    broadcastChannel?.removeEventListener('message', handler);
  };
};
