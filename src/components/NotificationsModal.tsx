import React from 'react';
import { SystemNotification } from '../types';
import { Bell, Check, X, Info, AlertTriangle, Clock } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SystemNotification[];
  onMarkAllRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/80">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-stone-100">Live Activity & Alerts</h3>
          </div>
          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center space-x-1 underline"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-200 rounded-lg bg-stone-800/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-stone-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-stone-400" />
              <p className="text-sm">No new notifications</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const formattedTime = new Date(notif.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-xl border text-sm transition-all ${
                    notif.read
                      ? 'bg-stone-800/40 border-stone-800 text-stone-300'
                      : 'bg-amber-500/10 border-amber-500/30 text-stone-100'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {notif.type === 'order_status' && (
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    {notif.type === 'low_stock' && (
                      <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    )}
                    {notif.type === 'waiter_call' && (
                      <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                        <Bell className="w-4 h-4" />
                      </div>
                    )}
                    {notif.type === 'payment_success' && (
                      <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                        <Info className="w-4 h-4" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-stone-100">{notif.title}</span>
                        <span className="text-[11px] text-stone-400 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formattedTime}</span>
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
