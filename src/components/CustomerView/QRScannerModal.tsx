import React, { useState } from 'react';
import { QrCode, X, CheckCircle2, Smartphone, Sparkles } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTable: number;
  onSelectTable: (tableNum: number) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  currentTable,
  onSelectTable,
}) => {
  const [selected, setSelected] = useState<number>(currentTable);
  const [customInput, setCustomInput] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleConfirm = (tableNum: number) => {
    onSelectTable(tableNum);
    onClose();
  };

  const tables = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg text-stone-100">Scan Table QR Code</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-200 rounded-xl bg-stone-800/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          
          {/* Simulated Viewfinder Camera */}
          <div className="relative w-full h-48 bg-stone-950 rounded-2xl border-2 border-dashed border-amber-500/40 flex flex-col items-center justify-center overflow-hidden group">
            {/* Animated Scanning Laser Line */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#f59e0b] animate-[bounce_2s_infinite]" />

            <div className="text-center p-4 z-10 space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <Smartphone className="w-6 h-6 animate-pulse" />
              </div>
              <p className="text-xs text-stone-300 font-medium">
                Simulated Camera Viewfinder
              </p>
              <p className="text-[11px] text-stone-500">
                Point camera at table QR stand to auto-detect
              </p>
            </div>

            {/* Corner Bracket Accents */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-amber-400" />
          </div>

          {/* Quick Select Table Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Or Select Table Manually
              </span>
              <span className="text-xs text-amber-400 flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Instant Switch</span>
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {tables.map((tbl) => {
                const isCurrent = tbl === currentTable;
                const isSel = tbl === selected;

                return (
                  <button
                    key={tbl}
                    onClick={() => {
                      setSelected(tbl);
                      handleConfirm(tbl);
                    }}
                    className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center space-y-1 ${
                      isSel
                        ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md scale-105'
                        : isCurrent
                        ? 'bg-stone-800 text-amber-300 border-amber-500/50'
                        : 'bg-stone-800/60 text-stone-300 border-stone-700/50 hover:bg-stone-800'
                    }`}
                  >
                    <span>Table {tbl}</span>
                    {isCurrent && <span className="text-[9px] font-normal opacity-80">(Active)</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom table number input */}
          <div className="pt-2 border-t border-stone-800 flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max="99"
              placeholder="Enter Table #"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={() => {
                const num = parseInt(customInput, 10);
                if (num > 0) handleConfirm(num);
              }}
              disabled={!customInput}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-bold text-xs rounded-xl transition-all"
            >
              Set Table
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
