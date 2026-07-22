import React from 'react';
import { QrCode, Printer, Smartphone, Sparkles, Utensils } from 'lucide-react';

interface TableQRGeneratorProps {
  onSelectTableAndLaunch: (tableNum: number) => void;
}

export const TableQRGenerator: React.FC<TableQRGeneratorProps> = ({ onSelectTableAndLaunch }) => {
  const tables = Array.from({ length: 12 }, (_, i) => i + 1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-24">
      
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-stone-100">Table QR Code Stand Generator</h1>
            <p className="text-xs text-stone-400">Print table QR cards for customer contactless ordering & instant payment</p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs rounded-2xl shadow-lg flex items-center space-x-2 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print All Table Stands</span>
        </button>
      </div>

      {/* QR Code Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {tables.map((tbl) => (
          <div
            key={tbl}
            className="bg-stone-950 border-2 border-stone-800 hover:border-amber-500/50 rounded-3xl p-5 shadow-xl flex flex-col items-center justify-between space-y-4 text-center transition-all group hover:scale-102"
          >
            {/* Table Badge */}
            <div className="flex items-center space-x-2">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span className="text-lg font-black text-stone-100">Table #{tbl}</span>
            </div>

            {/* Simulated Vector QR Graphic */}
            <div className="relative p-3 bg-white rounded-2xl shadow-inner border border-stone-300 w-36 h-36 flex flex-col items-center justify-center">
              {/* QR Pattern SVG */}
              <svg className="w-full h-full text-stone-950" viewBox="0 0 100 100" fill="currentColor">
                {/* Corner Position Detection Squares */}
                <rect x="5" y="5" width="25" height="25" rx="3" />
                <rect x="9" y="9" width="17" height="17" fill="white" rx="2" />
                <rect x="13" y="13" width="9" height="9" fill="black" rx="1" />

                <rect x="70" y="5" width="25" height="25" rx="3" />
                <rect x="74" y="9" width="17" height="17" fill="white" rx="2" />
                <rect x="78" y="13" width="9" height="9" fill="black" rx="1" />

                <rect x="5" y="70" width="25" height="25" rx="3" />
                <rect x="9" y="74" width="17" height="17" fill="white" rx="2" />
                <rect x="13" y="78" width="9" height="9" fill="black" rx="1" />

                {/* Random QR Data Dots */}
                <rect x="35" y="10" width="6" height="6" />
                <rect x="45" y="10" width="6" height="6" />
                <rect x="55" y="10" width="6" height="6" />
                <rect x="35" y="20" width="6" height="6" />
                <rect x="50" y="20" width="6" height="6" />
                <rect x="10" y="35" width="6" height="6" />
                <rect x="20" y="35" width="6" height="6" />
                <rect x="35" y="35" width="10" height="10" />
                <rect x="50" y="35" width="6" height="6" />
                <rect x="65" y="35" width="6" height="6" />
                <rect x="80" y="35" width="6" height="6" />
                <rect x="10" y="45" width="6" height="6" />
                <rect x="25" y="45" width="6" height="6" />
                <rect x="45" y="45" width="6" height="6" />
                <rect x="60" y="45" width="6" height="6" />
                <rect x="75" y="45" width="6" height="6" />
                <rect x="35" y="60" width="6" height="6" />
                <rect x="50" y="60" width="6" height="6" />
                <rect x="65" y="60" width="6" height="6" />
                <rect x="80" y="60" width="6" height="6" />
                <rect x="35" y="75" width="6" height="6" />
                <rect x="50" y="75" width="6" height="6" />
                <rect x="65" y="75" width="6" height="6" />
                <rect x="80" y="75" width="6" height="6" />
                <rect x="40" y="85" width="6" height="6" />
                <rect x="55" y="85" width="6" height="6" />
                <rect x="70" y="85" width="6" height="6" />
                <rect x="85" y="85" width="6" height="6" />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-amber-500 text-stone-950 p-1 rounded-md shadow-md border border-white">
                  <Utensils className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Scan with Phone Camera
              </p>
              <p className="text-[10px] text-stone-400">Order, Customize & Pay from Table #{tbl}</p>
            </div>

            {/* Simulate Scan Button */}
            <button
              onClick={() => onSelectTableAndLaunch(tbl)}
              className="w-full py-2 bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-200 font-bold text-xs rounded-xl transition-all border border-stone-700 flex items-center justify-center space-x-1.5"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Simulate Scan Table #{tbl}</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
