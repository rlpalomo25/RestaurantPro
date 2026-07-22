import React, { useState } from 'react';
import { MenuItem, SelectedCustomization, CartItem } from '../../types';
import { X, Plus, Minus, Check, Flame, AlertCircle } from 'lucide-react';

interface ItemCustomizerModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const ItemCustomizerModal: React.FC<ItemCustomizerModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  if (!isOpen || !item) return null;

  // Calculate unit price including extra charges for selected options
  let extrasTotal = 0;
  item.customizationOptions?.forEach((opt) => {
    const selIds = selectedChoices[opt.id] || [];
    opt.choices.forEach((choice) => {
      if (selIds.includes(choice.id)) {
        extrasTotal += choice.priceExtra;
      }
    });
  });

  const unitPrice = item.price + extrasTotal;
  const totalPrice = unitPrice * quantity;

  // Validate required options
  let missingRequired = false;
  item.customizationOptions?.forEach((opt) => {
    if (opt.required) {
      const selectedForOpt = selectedChoices[opt.id] || [];
      if (selectedForOpt.length === 0) {
        missingRequired = true;
      }
    }
  });

  const handleToggleChoice = (optionId: string, choiceId: string, type: 'single' | 'multiple') => {
    setSelectedChoices((prev) => {
      const current = prev[optionId] || [];
      if (type === 'single') {
        return { ...prev, [optionId]: [choiceId] };
      } else {
        if (current.includes(choiceId)) {
          return { ...prev, [optionId]: current.filter((id) => id !== choiceId) };
        } else {
          return { ...prev, [optionId]: [...current, choiceId] };
        }
      }
    });
  };

  const handleAdd = () => {
    if (missingRequired) return;

    // Convert selections to struct
    const customizations: SelectedCustomization[] = [];
    item.customizationOptions?.forEach((opt) => {
      const choiceIds = selectedChoices[opt.id] || [];
      if (choiceIds.length > 0) {
        const choices = opt.choices
          .filter((c) => choiceIds.includes(c.id))
          .map((c) => ({ name: c.name, priceExtra: c.priceExtra }));
        customizations.push({
          optionId: opt.id,
          optionTitle: opt.title,
          selectedChoices: choices,
        });
      }
    });

    const cartItem: CartItem = {
      cartItemId: `ci-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      menuItem: item,
      quantity,
      selectedCustomizations: customizations,
      specialInstructions: specialInstructions.trim() || undefined,
      unitPrice,
    };

    onAddToCart(cartItem);
    onClose();
    // Reset state
    setQuantity(1);
    setSelectedChoices({});
    setSpecialInstructions('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4">
      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Image & Info */}
        <div className="relative h-48 sm:h-56 w-full bg-stone-950 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-stone-900/80 hover:bg-stone-900 text-stone-300 hover:text-white rounded-full backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-xl font-bold text-stone-100">{item.name}</h2>
            <div className="flex items-center space-x-3 mt-1 text-xs text-stone-300">
              <span className="font-extrabold text-amber-400 text-base">${item.price.toFixed(2)}</span>
              {item.prepTimeMinutes && <span>• {item.prepTimeMinutes} mins prep</span>}
              {item.calories && <span>• {item.calories} kcal</span>}
            </div>
          </div>
        </div>

        {/* Scrollable Customization Form */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          <p className="text-xs text-stone-300 leading-relaxed">{item.description}</p>

          {/* Dynamic Options */}
          {item.customizationOptions?.map((opt) => {
            const currentSel = selectedChoices[opt.id] || [];

            return (
              <div key={opt.id} className="space-y-3 border-t border-stone-800/80 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-200">{opt.title}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    opt.required
                      ? currentSel.length > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                      : 'bg-stone-800 text-stone-400'
                  }`}>
                    {opt.required ? (currentSel.length > 0 ? 'Completed' : 'Required') : 'Optional'}
                  </span>
                </div>

                <div className="space-y-2">
                  {opt.choices.map((choice) => {
                    const isSelected = currentSel.includes(choice.id);

                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => handleToggleChoice(opt.id, choice.id, opt.type)}
                        className={`w-full p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500/60 text-stone-100 font-medium'
                            : 'bg-stone-800/40 border-stone-800 text-stone-300 hover:bg-stone-800/80'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-4 h-4 rounded-${opt.type === 'single' ? 'full' : 'md'} border flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-amber-500 border-amber-400 text-stone-950' : 'border-stone-600'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{choice.name}</span>
                        </div>
                        {choice.priceExtra > 0 && (
                          <span className="text-amber-400 font-semibold">+${choice.priceExtra.toFixed(2)}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Special Instructions */}
          <div className="border-t border-stone-800/80 pt-4 space-y-2">
            <label className="block text-xs font-bold text-stone-300">
              Special Instructions / Dietary Requests
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra crispy, dressing on the side, severe allergies..."
              rows={2}
              className="w-full bg-stone-800/60 border border-stone-700/80 rounded-xl p-3 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

        </div>

        {/* Footer Add To Order Bar */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-3">
          
          {/* Quantity Controls */}
          <div className="flex items-center space-x-2 bg-stone-800 p-1.5 rounded-2xl border border-stone-700">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1.5 text-stone-300 hover:text-white rounded-xl hover:bg-stone-700 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-extrabold text-sm text-stone-100 w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1.5 text-stone-300 hover:text-white rounded-xl hover:bg-stone-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAdd}
            disabled={missingRequired || !item.isAvailable || item.stockQuantity <= 0}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-between transition-all shadow-lg ${
              missingRequired
                ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                : !item.isAvailable || item.stockQuantity <= 0
                ? 'bg-rose-500/20 text-rose-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-amber-500/10'
            }`}
          >
            <span>{missingRequired ? 'Select Required Options' : 'Add to Order'}</span>
            <span className="font-extrabold text-stone-950">${totalPrice.toFixed(2)}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
