import React, { useState } from 'react';
import { X, ShieldAlert, Check, Search, SlidersHorizontal, Edit2 } from 'lucide-react';
import { MenuItem, OUTLETS, Outlet } from '../data';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  onUpdateItem: (id: string, patch: Partial<MenuItem>) => void;
  selectedOutlet: Outlet;
}

export default function AdminModal({
  isOpen,
  onClose,
  menuItems,
  onUpdateItem,
  selectedOutlet,
}: AdminModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeOutletId, setActiveOutletId] = useState(selectedOutlet.id);

  if (!isOpen) return null;

  const currentOutlet = OUTLETS.find((o) => o.id === activeOutletId) || OUTLETS[0];

  const filtered = menuItems.filter(
    (it) =>
      it.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      it.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-cocoa/80 backdrop-blur-md">
      <div className="card-pop relative w-full max-w-5xl h-[90vh] bg-cream text-cocoa flex flex-col overflow-hidden border-[4px] border-cocoa shadow-pop-lg">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-[3px] border-cocoa bg-lemon flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-aqua text-cocoa px-2.5 py-0.5 rounded-full border border-cocoa">
              Admin Operations Center
            </span>
            <h2 className="font-display text-2xl text-cherry outline-text [text-stroke-width:0.5px] mt-1">
              Central Menu &amp; Outlets CMS
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cocoa-fade">Scope:</span>
            <select
              value={activeOutletId}
              onChange={(e) => setActiveOutletId(e.target.value)}
              className="bg-white font-black text-xs text-cocoa rounded-xl px-3 py-1.5 border border-cocoa outline-none cursor-pointer"
            >
              {OUTLETS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>

            <button
              onClick={onClose}
              className="h-10 w-10 ml-2 rounded-full bg-white text-cocoa border-2 border-cocoa flex items-center justify-center shadow-pop-sm hover:bg-cream transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b-2 border-cocoa/20 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-fade" />
            <input
              type="text"
              placeholder="Search items, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-full border-2 border-cocoa text-xs font-bold bg-cream outline-none"
            />
          </div>

          <div className="text-xs font-bold text-cocoa">
            Viewing: <span className="font-black text-cherry">{filtered.length} menu items</span> &bull; 
            <span className="text-emerald-700 ml-1">5% GST Auto-Calculated</span>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="card-pop bg-white overflow-hidden border-[3px] border-cocoa">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-lemon border-b-[3px] border-cocoa font-display text-sm text-cocoa">
                  <th className="p-3.5">Item</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Base Price (Incl. 5% GST)</th>
                  <th className="p-3.5">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-cocoa/10 font-bold text-cocoa">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-cream/40 transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="h-11 w-11 rounded-xl border-2 border-cocoa object-cover"
                      />
                      <div>
                        <p className="font-black text-sm">{item.name}</p>
                        <p className="text-[10px] text-cocoa-fade">{item.dietary === 'VEG' ? '🟢 Veg' : '🔴 Non-Veg'}</p>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="bg-cream-dark px-2.5 py-1 rounded-full border border-cocoa/30 text-[10px] font-extrabold">
                        {item.category}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1 font-display text-sm text-cherry">
                        <span>₹</span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => onUpdateItem(item.id, { price: Number(e.target.value) })}
                          className="w-20 p-1 rounded-lg border-2 border-cocoa font-black text-xs bg-cream focus:bg-white outline-none"
                        />
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="pill-btn bg-emerald-500 text-white text-[10px] !py-1 !px-3 shadow-pop-sm">
                        ✓ In Stock
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Operational Alert Box */}
          <div className="card-pop p-4 mt-6 bg-white border-[3px] border-cocoa space-y-2">
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-cherry" />
              <h4 className="font-display text-sm text-cocoa">Active Operational Delay Log</h4>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 flex items-center justify-between text-xs">
              <div>
                <p className="font-black text-rose-900">
                  ⚠️ Ticket WEB-778146 DELAY ALERT — Kukatpally Express Kitchen
                </p>
                <p className="text-[11px] text-rose-700 font-semibold mt-0.5">
                  Promised at 21:16 (Elapsed +4 mins). AI predicted 40m prep time.
                </p>
              </div>
              <span className="pill-btn bg-cherry text-white text-[10px] !py-1 !px-3">
                Manager Alerted
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
