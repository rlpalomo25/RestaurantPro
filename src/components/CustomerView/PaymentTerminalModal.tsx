import React, { useState } from 'react';
import { PaymentMethod, PaymentDetails } from '../../types';
import { 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Sparkles, 
  Printer, 
  Receipt 
} from 'lucide-react';

interface PaymentTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: number;
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  onPaymentComplete: (payment: PaymentDetails) => void;
}

export const PaymentTerminalModal: React.FC<PaymentTerminalModalProps> = ({
  isOpen,
  onClose,
  tableNumber,
  subtotal,
  tax,
  tip,
  total,
  onPaymentComplete,
}) => {
  const [method, setMethod] = useState<PaymentMethod>('credit_card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [txnDetails, setTxnDetails] = useState<PaymentDetails | null>(null);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);

    // Simulate realistic terminal authorization delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsApproved(true);

      const completedPayment: PaymentDetails = {
        method,
        subtotal,
        tax,
        tip,
        total,
        paidAt: new Date().toISOString(),
        transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      };

      setTxnDetails(completedPayment);
      onPaymentComplete(completedPayment);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        
        {/* Terminal Header */}
        <div className="px-6 py-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm text-stone-100">DineFlow Pay Terminal</h3>
              <p className="text-[10px] text-stone-400">Encrypted Table #{tableNumber} Checkout</p>
            </div>
          </div>
          {!isProcessing && !isApproved && (
            <button onClick={onClose} className="p-1 text-stone-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">
          
          {!isApproved ? (
            <>
              {/* Amount Display */}
              <div className="text-center bg-stone-950 border border-stone-800 rounded-2xl p-5 space-y-1">
                <span className="text-xs uppercase font-semibold text-stone-400 tracking-wider">Total Due</span>
                <div className="text-3xl font-black text-amber-400">${total.toFixed(2)}</div>
                <div className="flex items-center justify-center space-x-2 text-[11px] text-stone-500 pt-1">
                  <span>Sub: ${subtotal.toFixed(2)}</span>
                  <span>•</span>
                  <span>Tax: ${tax.toFixed(2)}</span>
                  <span>•</span>
                  <span>Tip: ${tip.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Methods Selection */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Select Payment Method</span>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'credit_card', label: 'Credit / Debit', icon: CreditCard, subtitle: 'Tap / Chip Card' },
                    { id: 'apple_pay', label: 'Apple Pay', icon: Smartphone, subtitle: 'Tap iPhone / Watch' },
                    { id: 'google_pay', label: 'Google Pay', icon: Smartphone, subtitle: 'Tap Android Device' },
                    { id: 'cash', label: 'Cash at Table', icon: DollarSign, subtitle: 'Pay Server Directly' },
                  ].map((item) => {
                    const IconComp = item.icon;
                    const isSel = method === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setMethod(item.id as PaymentMethod)}
                        className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all ${
                          isSel
                            ? 'bg-amber-500/15 border-amber-400 text-stone-100 shadow-md'
                            : 'bg-stone-800/40 border-stone-800 text-stone-300 hover:bg-stone-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <IconComp className={`w-5 h-5 ${isSel ? 'text-amber-400' : 'text-stone-400'}`} />
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSel ? 'bg-amber-400 border-amber-300' : 'border-stone-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-bold text-xs">{item.label}</p>
                          <p className="text-[10px] text-stone-400">{item.subtitle}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Terminal Contactless Animation */}
              {method !== 'cash' && (
                <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 text-center space-y-2">
                  <div className="flex justify-center items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-semibold text-stone-300">Terminal Ready for Contactless Tap</span>
                  </div>
                  <p className="text-[11px] text-stone-500">Hold card or device near screen, or press Pay below</p>
                </div>
              )}

              {/* Pay Action Button */}
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition-all"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing Payment...</span>
                  </div>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Authorize & Pay ${total.toFixed(2)}</span>
                  </>
                )}
              </button>
            </>
          ) : (
            /* Approved & Receipt Screen */
            <div className="text-center py-4 space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-black text-stone-100">Payment Approved!</h3>
                <p className="text-xs text-stone-400 mt-1">Order successfully sent to kitchen for preparation.</p>
              </div>

              {/* Digital Receipt Card */}
              {txnDetails && (
                <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 text-left space-y-2 text-xs">
                  <div className="flex justify-between text-stone-400 font-medium">
                    <span>Transaction ID:</span>
                    <span className="font-mono text-stone-200">{txnDetails.transactionId}</span>
                  </div>
                  <div className="flex justify-between text-stone-400 font-medium">
                    <span>Method:</span>
                    <span className="uppercase text-amber-400 font-bold">{txnDetails.method.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between text-stone-400 font-medium">
                    <span>Date / Time:</span>
                    <span className="text-stone-200">{new Date(txnDetails.paidAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="pt-2 border-t border-stone-800 flex justify-between font-bold text-stone-100 text-sm">
                    <span>Amount Charged:</span>
                    <span className="text-emerald-400">${txnDetails.total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => alert('Digital Receipt sent to kitchen printer and saved in session!')}
                  className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs rounded-xl transition-colors"
                >
                  Track Order Live
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
