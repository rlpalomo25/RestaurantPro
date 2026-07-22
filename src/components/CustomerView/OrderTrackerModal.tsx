import React from 'react';
import { Order, OrderStatus } from '../../types';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  UtensilsCrossed, 
  Sparkles, 
  BellRing, 
  AlertCircle,
  Truck
} from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onRequestWaiter: () => void;
  waiterRequested: boolean;
}

const STEPS: { status: OrderStatus; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
  { status: 'pending', label: 'Order Received', desc: 'Routed to kitchen queue', icon: Clock },
  { status: 'preparing', label: 'Chef Preparing', desc: 'Searing & cooking fresh', icon: ChefHat },
  { status: 'ready', label: 'Ready for Table', desc: 'Plated & being served', icon: Truck },
  { status: 'delivered', label: 'Delivered', desc: 'Bon Appétit!', icon: CheckCircle2 },
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  order,
  onRequestWaiter,
  waiterRequested,
}) => {
  if (!isOpen || !order) return null;

  const currentStepIndex = STEPS.findIndex((s) => s.status === order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-amber-400 font-extrabold text-sm">Order #{order.orderNumber}</span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                Table #{order.tableNumber}
              </span>
            </div>
            <p className="text-[11px] text-stone-400">Live Kitchen Tracker</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-white rounded-xl bg-stone-800/80">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Status Progress Bar */}
          <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 space-y-5">
            <div className="flex items-center justify-between text-xs font-bold text-stone-300">
              <span>Status Timeline</span>
              <span className="text-amber-400 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Est. Ready: 10-15 mins</span>
              </span>
            </div>

            {/* Stepper */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-800">
              {STEPS.map((step, idx) => {
                const IconComp = step.icon;
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.status} className="relative flex items-start space-x-3">
                    <div className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-stone-950 font-bold scale-110 shadow-lg shadow-amber-500/30 ring-4 ring-amber-500/20'
                        : isPassed
                        ? 'bg-emerald-500 text-stone-950'
                        : 'bg-stone-800 text-stone-500 border border-stone-700'
                    }`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </div>

                    <div className="pl-3">
                      <p className={`text-xs font-bold ${
                        isCurrent ? 'text-amber-400' : isPassed ? 'text-stone-100' : 'text-stone-500'
                      }`}>
                        {step.label} {isCurrent && <span className="text-[10px] font-normal text-amber-300/80">(In Progress)</span>}
                      </p>
                      <p className="text-[11px] text-stone-400">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ordered Dishes List */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Ordered Dishes</span>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.cartItemId} className="p-3 bg-stone-800/40 border border-stone-800 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-5 h-5 rounded-md bg-stone-700 text-stone-200 font-bold flex items-center justify-center text-[11px]">
                      {item.quantity}x
                    </span>
                    <div>
                      <p className="font-bold text-stone-100">{item.menuItem.name}</p>
                      {item.selectedCustomizations.length > 0 && (
                        <p className="text-[10px] text-amber-300/80">
                          {item.selectedCustomizations.map((c) => c.selectedChoices.map((ch) => ch.name).join(', ')).join(' • ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-stone-300">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Waiter Request Call */}
          <button
            onClick={onRequestWaiter}
            disabled={waiterRequested}
            className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all border ${
              waiterRequested
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
            }`}
          >
            <BellRing className="w-4 h-4 text-amber-400" />
            <span>{waiterRequested ? 'Waiter Notified to Table!' : 'Call Waiter / Request Water Refill'}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
