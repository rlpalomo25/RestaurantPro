import React, { useState } from 'react';
import { addNotification, playSoundAlert } from '../../services/storageService';
import { 
  Radio, 
  Send, 
  X, 
  RotateCw, 
  Megaphone, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  BellRing,
  Clock,
  Layers
} from 'lucide-react';

interface BroadcastManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaySound: (type: 'new_order' | 'ready' | 'bell') => void;
}

const BROADCAST_PRESETS = [
  {
    id: 'shift_change',
    type: 'Shift Change',
    icon: RotateCw,
    color: 'amber',
    title: '🔄 Shift Rotation Active',
    message: 'Night Shift Team is now on duty! Kitchen Lead: Chef Carlos. Floor Lead: Sarah.',
  },
  {
    id: 'kitchen_rush',
    type: 'Kitchen Rush',
    icon: AlertTriangle,
    color: 'rose',
    title: '⚡ Kitchen Line Rush Alert',
    message: 'High ticket volume in kitchen line. Estimated prep times increased by +10 minutes.',
  },
  {
    id: 'special_promo',
    type: 'Flash Promo',
    icon: Sparkles,
    color: 'emerald',
    title: '🌟 Flash Special Offer!',
    message: 'Enjoy 20% off all Chef Special Desserts & House Cocktails for the next 30 minutes!',
  },
  {
    id: 'staff_notice',
    type: 'Staff Notice',
    icon: Megaphone,
    color: 'cyan',
    title: '📢 General Staff Announcement',
    message: 'All floor staff please check station restocks and assist Table 5 with large party setup.',
  },
];

export const BroadcastManagerModal: React.FC<BroadcastManagerModalProps> = ({
  isOpen,
  onClose,
  onPlaySound,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('shift_change');
  const [customTitle, setCustomTitle] = useState<string>(BROADCAST_PRESETS[0].title);
  const [customMessage, setCustomMessage] = useState<string>(BROADCAST_PRESETS[0].message);
  const [playSound, setPlaySound] = useState<boolean>(true);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<{ title: string; message: string; time: string }>>([]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof BROADCAST_PRESETS[0]) => {
    setSelectedPresetId(preset.id);
    setCustomTitle(preset.title);
    setCustomMessage(preset.message);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customMessage.trim()) return;

    // 1. Add notification which uses BroadcastChannel in storageService
    addNotification({
      title: customTitle.trim(),
      message: customMessage.trim(),
      type: 'order_status',
    });

    // 2. Optional audio chime
    if (playSound) {
      onPlaySound('bell');
    }

    // 3. Add to local modal history log
    setHistory((prev) => [
      {
        title: customTitle.trim(),
        message: customMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      },
      ...prev,
    ]);

    // 4. Show success banner
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-stone-950 font-black shadow-lg">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-stone-100">Live Broadcast & Shift Channel</h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                  Cross-Client Sync
                </span>
              </div>
              <p className="text-xs text-stone-400">Broadcast shift changes and alerts to all active customer & staff screens</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleBroadcast} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Sent Success Feedback Banner */}
          {sentSuccess && (
            <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl flex items-center space-x-3 text-emerald-300 animate-in fade-in slide-in-from-top duration-300">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-black">Broadcast Dispatched Successfully!</p>
                <p className="text-[11px] text-emerald-400/80">
                  Notification pushed via Broadcast Channel to all open customer, kitchen, and staff views.
                </p>
              </div>
            </div>
          )}

          {/* Quick Preset Selector Cards */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5">
              Select Announcement Template
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BROADCAST_PRESETS.map((preset) => {
                const IconComponent = preset.icon;
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-stone-100 ring-1 ring-amber-500/50'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${
                      isSelected ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-900 text-stone-300'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-200">{preset.type}</p>
                      <p className="text-[11px] text-stone-400 line-clamp-1">{preset.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Title & Details Editor */}
          <div className="space-y-4 bg-stone-950 p-4 rounded-2xl border border-stone-800">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Broadcast Title
              </label>
              <input
                type="text"
                required
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. 🔄 Shift Rotation Active"
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Message Content
              </label>
              <textarea
                rows={3}
                required
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Type your announcement or shift details..."
                className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
              />
            </div>

            {/* Chime audio toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-800/80">
              <div className="flex items-center space-x-2">
                <BellRing className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-stone-300 font-medium">Trigger Chime Sound on Connected Devices</span>
              </div>
              <input
                type="checkbox"
                checked={playSound}
                onChange={(e) => setPlaySound(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* History of Broadcasts */}
          {history.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold uppercase text-stone-400">Broadcast Log (This Session)</p>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {history.map((h, i) => (
                  <div key={i} className="p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-amber-300">{h.title}</span>
                      <span className="text-[10px] text-stone-500">{h.time}</span>
                    </div>
                    <p className="text-[11px] text-stone-400 line-clamp-1">{h.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl transition-colors"
            >
              Close
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center space-x-2 transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Now</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
