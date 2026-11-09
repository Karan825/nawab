import { useState } from 'react';
import { ArrowLeft, ShieldAlert, Check, X, Search, ChefHat } from 'lucide-react';
import { Drink, OUTLETS, DRINKS } from '../data';

export default function AdminPage() {
  const [items, setItems] = useState<Drink[]>(DRINKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOutletId, setSelectedOutletId] = useState(OUTLETS[0].id);

  const toggleAvailability = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, isAvailable: !it.isAvailable } : it))
    );
  };

  const handlePriceChange = (id: string, newPrice: number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, price: newPrice } : it))
    );
  };

  const filtered = items.filter(
    (it) =>
      it.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      it.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cream text-cocoa font-body flex flex-col">
      
      {/* Top Header */}
      <header className="p-4 sm:p-6 border-b-[3px] border-cocoa bg-lemon flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="h-10 w-10 rounded-full bg-white text-cocoa border-2 border-cocoa flex items-center justify-center shadow-pop-sm hover:bg-cream transition-colors shrink-0"
            title="Return to Storefront"
          >
            <ArrowLeft size={20} />
          </a>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-aqua text-cocoa px-2.5 py-0.5 rounded-full border border-cocoa">
                Admin Central CMS
              </span>
              <span className="text-xs font-bold text-cocoa-fade">17 Locations Network</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-cherry outline-text [text-stroke-width:0.5px] mt-0.5">
              Menu &amp; Operations Console
            </h1>
          </div>
        </div>

        {/* Actions & Station Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-2xl border-2 border-cocoa px-3 py-1.5 shadow-pop-sm">
            <span className="text-xs font-bold text-cocoa-fade">Scope:</span>
            <select
              value={selectedOutletId}
              onChange={(e) => setSelectedOutletId(e.target.value)}
              className="bg-transparent font-black text-xs text-cocoa outline-none cursor-pointer"
            >
              {OUTLETS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          <a
            href="/kds"
            className="pill-btn bg-tangerine text-cocoa text-xs !py-2 !px-4 flex items-center gap-1.5"
          >
            <ChefHat size={15} />
            <span>Open KDS</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Search & Overview Stats */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-fade" />
            <input
              type="text"
              placeholder="Search dishes, categories, ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border-2 border-cocoa text-xs font-bold bg-white outline-none focus:ring-2 focus:ring-lemon shadow-pop-sm"
            />
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="bg-white border-2 border-cocoa px-3.5 py-1.5 rounded-full shadow-pop-sm">
              Total Catalog: <strong>{items.length} items</strong>
            </span>
            <span className="bg-emerald-100 border-2 border-emerald-400 text-emerald-900 px-3.5 py-1.5 rounded-full shadow-pop-sm">
              In Stock: <strong>{items.filter((i) => i.isAvailable !== false).length}</strong>
            </span>
          </div>
        </div>

        {/* Menu Catalog Table */}
        <div className="card-pop bg-white overflow-hidden border-[3px] border-cocoa shadow-pop-lg rounded-3xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-lemon border-b-[3px] border-cocoa font-display text-sm text-cocoa">
                  <th className="p-4">Dish &amp; Description</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price (Incl. 5% GST)</th>
                  <th className="p-4">Ingredients</th>
                  <th className="p-4">Stock Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-cocoa/10 font-bold text-cocoa">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-cream/40 transition-colors">
                    
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="h-12 w-12 rounded-xl border-2 border-cocoa object-cover shrink-0"
                      />
                      <div>
                        <p className="font-black text-sm text-cocoa">{item.name}</p>
                        <p className="text-[10px] text-cocoa-fade mt-0.5">{item.tagline}</p>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="bg-cream-dark px-3 py-1 rounded-full border border-cocoa/30 text-[10px] font-extrabold">
                        {item.category}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 font-display text-base text-cherry">
                        <span>₹</span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handlePriceChange(item.id, Number(e.target.value))}
                          className="w-20 p-1 rounded-lg border-2 border-cocoa font-black text-xs bg-cream focus:bg-white outline-none"
                        />
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="text-[11px] font-semibold text-cocoa">
                        {item.ingredients.join(', ')}
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => toggleAvailability(item.id)}
                        className={`pill-btn !py-1.5 !px-3.5 text-[11px] flex items-center gap-1.5 ${
                          item.isAvailable !== false
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'bg-rose-500 text-white hover:bg-rose-600'
                        }`}
                      >
                        {item.isAvailable !== false ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                        <span>{item.isAvailable !== false ? 'In Stock' : 'Out of Stock'}</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operational Delay Alert & AI Prep Time Audit */}
        <div className="card-pop p-6 bg-white border-[3px] border-cocoa space-y-4 rounded-3xl shadow-pop-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert size={22} className="text-cherry" />
              <h3 className="font-display text-lg text-cocoa">Operational Alert Log &amp; Prep Discrepancies</h3>
            </div>
            <span className="text-xs font-bold text-cocoa-fade">Rule: Alert when order is &gt;10m past promise</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 flex items-center justify-between text-xs">
            <div>
              <p className="font-black text-rose-900 text-sm">
                ⚠️ ORDER WEB-778146 DELAY ALERT &bull; Kukatpally Express Kitchen
              </p>
              <p className="text-xs text-rose-700 font-semibold mt-1">
                Promised at 21:16 (Elapsed +4 mins). AI predicted 40m prep duration based on kitchen load.
              </p>
            </div>
            <span className="pill-btn bg-cherry text-white text-[11px] !py-1.5 !px-4 shrink-0">
              Manager Overriding
            </span>
          </div>
        </div>

      </main>

    </div>
  );
}
