import React, { useState } from 'react';
import { CartItem } from '../../types';
import { X, Trash2, Plus, Minus, CreditCard, ShoppingBag, Receipt, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  tableNumber: number;
  onProceedToPayment: (subtotal: number, tax: number, tip: number, total: number, notes: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  tableNumber,
  onProceedToPayment,
}) => {
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [customTip, setCustomTip] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState<string>('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tax = subtotal * 0.09; // 9% tax rate

  let tipAmount = 0;
  if (customTip !== '') {
    tipAmount = parseFloat(customTip) || 0;
  } else {
    tipAmount = subtotal * (tipPercent / 100);
  }

  const grandTotal = subtotal + tax + tipAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-stone-900 border-l border-stone-800 text-stone-100 w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-slide-left">
        
        {/* Cart Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-stone-100">Table #{tableNumber} Order Cart</h2>
              <p className="text-[11px] text-stone-400">{cartItems.length} unique items selected</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-200 rounded-xl bg-stone-800/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 text-stone-500 space-y-3">
              <Receipt className="w-12 h-12 mx-auto text-stone-700" />
              <p className="text-sm font-semibold text-stone-400">Your table order cart is empty</p>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">Browse our artisan menu and add your favorite dishes to start your order.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Selected Dishes</span>
                <button
                  onClick={onClearCart}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3.5 bg-stone-800/50 border border-stone-800 rounded-2xl space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-12 h-12 rounded-xl object-cover bg-stone-900 border border-stone-700"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-stone-100">{item.menuItem.name}</h4>
                        <span className="text-xs font-extrabold text-amber-400">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.cartItemId)}
                      className="text-stone-500 hover:text-rose-400 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Selected Customization Badges */}
                  {item.selectedCustomizations.length > 0 && (
                    <div className="text-[11px] text-stone-300 space-y-0.5 bg-stone-950/60 p-2 rounded-xl border border-stone-800">
                      {item.selectedCustomizations.map((c) => (
                        <div key={c.optionId} className="flex justify-between">
                          <span className="text-stone-400">{c.optionTitle}:</span>
                          <span className="text-amber-300 font-medium">
                            {c.selectedChoices.map((choice) => choice.name).join(', ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Special Instructions */}
                  {item.specialInstructions && (
                    <p className="text-[11px] text-amber-300/80 italic">
                      Note: "{item.specialInstructions}"
                    </p>
                  )}

                  {/* Quantity adjustment */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-stone-500">${item.unitPrice.toFixed(2)} / unit</span>
                    <div className="flex items-center space-x-2 bg-stone-900 px-2 py-1 rounded-xl border border-stone-700">
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                        className="p-1 text-stone-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-stone-100 w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-1 text-stone-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}

              {/* Order Notes */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  Overall Order / Kitchen Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please bring water first, combine dishes..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Tip Selection */}
              <div className="border-t border-stone-800 pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-300">Staff Gratuitiy / Tip</span>
                  <span className="text-xs font-bold text-amber-400">${tipAmount.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[10, 15, 18, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => {
                        setTipPercent(pct);
                        setCustomTip('');
                      }}
                      className={`py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        tipPercent === pct && customTip === ''
                          ? 'bg-amber-500 text-stone-950 border-amber-400'
                          : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

            </>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <div className="p-5 bg-stone-950 border-t border-stone-800 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-stone-200 font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (9%)</span>
                <span className="text-stone-200 font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tip</span>
                <span className="text-stone-200 font-semibold">${tipAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-stone-100 pt-2 border-t border-stone-800">
                <span>Total Amount</span>
                <span className="text-amber-400 text-base">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => onProceedToPayment(subtotal, tax, tipAmount, grandTotal, orderNotes)}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/10 flex items-center justify-center space-x-2 transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Payment (${grandTotal.toFixed(2)})</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
