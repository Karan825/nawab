import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldAlert,
  Check,
  X,
  Search,
  ChefHat,
  AlertTriangle,
  Plus,
  Trash2,
  RefreshCw,
  Sparkles,
  UtensilsCrossed,
  DollarSign
} from 'lucide-react';
import { OUTLETS, type Outlet } from '../data';

interface MenuItemAPI {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  dietary: 'VEG' | 'NON_VEG';
  spice_level: 'MILD' | 'MEDIUM' | 'HOT' | 'EXTRA_HOT';
  base_price: number;
  image_url: string;
  preparation_time_minutes: number;
  rating: number;
  rating_count: number;
  bestseller: boolean;
  is_active: boolean;
  is_available: boolean;
  custom_status_label?: string | null;
}

export default function AdminPage() {
  const [items, setItems] = useState<MenuItemAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOutletId, setSelectedOutletId] = useState<string>(OUTLETS[0].id);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [overridden, setOverridden] = useState(false);

  // New Dish Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newCategory, setNewCategory] = useState('Biryani');
  const [newPrice, setNewPrice] = useState('350');
  const [newDietary, setNewDietary] = useState<'VEG' | 'NON_VEG'>('NON_VEG');
  const [newSpice, setNewSpice] = useState<'MILD' | 'MEDIUM' | 'HOT' | 'EXTRA_HOT'>('MEDIUM');
  const [newPrepTime, setNewPrepTime] = useState('25');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch menu for the selected outlet from real backend
  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/menu/outlet/${selectedOutletId}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      } else {
        // Fallback to global menu
        const fallbackRes = await fetch('/api/menu');
        if (fallbackRes.ok) {
          const fbData = await fallbackRes.json();
          setItems(fbData);
        }
      }
    } catch (err) {
      console.error('Error fetching menu in Admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [selectedOutletId]);

  // Update item price directly in PostgreSQL
  const handlePriceUpdate = async (item: MenuItemAPI, newPriceVal: number) => {
    if (isNaN(newPriceVal) || newPriceVal <= 0) return;
    setSavingId(item.id);
    try {
      const res = await fetch(`/api/menu/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base_price: newPriceVal }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, base_price: newPriceVal } : it))
        );
        showToast(`Price for "${item.name}" updated to ₹${newPriceVal} across all 17 outlets!`);
      } else {
        alert('Failed to update price. Please try again.');
      }
    } catch (err) {
      console.error('Price update error:', err);
    } finally {
      setSavingId(null);
    }
  };

  // Toggle Stock Availability for selected outlet
  const handleToggleStock = async (item: MenuItemAPI) => {
    const nextAvailability = !item.is_available;
    setSavingId(item.id);
    try {
      const res = await fetch(`/api/menu/outlet/${selectedOutletId}/item/${item.id}/override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_available: nextAvailability,
          custom_status_label: nextAvailability ? null : 'Station Sold Out',
        }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? {
                  ...it,
                  is_available: nextAvailability,
                  custom_status_label: nextAvailability ? null : 'Station Sold Out',
                }
              : it
          )
        );
        const outletName = OUTLETS.find((o) => o.id === selectedOutletId)?.name || 'Station';
        showToast(
          `"${item.name}" is now marked ${nextAvailability ? 'IN STOCK' : 'PAUSED / OUT OF STOCK'} at ${outletName}!`
        );
      }
    } catch (err) {
      console.error('Toggle stock error:', err);
    } finally {
      setSavingId(null);
    }
  };

  // Delete / Remove Dish from Catalog
  const handleDeleteItem = async (item: MenuItemAPI) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove "${item.name}" from the central catalog across all 17 outlets?`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/menu/${item.id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((it) => it.id !== item.id));
        showToast(`"${item.name}" successfully removed from central catalog.`);
      }
    } catch (err) {
      console.error('Delete item error:', err);
    }
  };

  // Create New Dish
  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || isNaN(Number(newPrice))) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          tagline: newTagline.trim() || 'Signature Nizami preparation',
          category: newCategory,
          dietary: newDietary,
          spice_level: newSpice,
          base_price: Number(newPrice),
          preparation_time_minutes: Number(newPrepTime) || 25,
          image_url:
            newDietary === 'VEG'
              ? 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
              : 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setItems((prev) => [created, ...prev]);
        setIsAddModalOpen(false);
        setNewName('');
        setNewTagline('');
        setNewPrice('350');
        showToast(`New dish "${created.name}" created and synced to all 17 outlets!`);
      } else {
        alert('Failed to create new dish. Please check your inputs.');
      }
    } catch (err) {
      console.error('Create dish error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = items.filter(
    (it) =>
      it.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      it.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cream text-cocoa font-body flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl border-2 border-cocoa shadow-pop-lg flex items-center gap-2 text-xs font-black animate-in slide-in-from-top-4 duration-200">
          <Check size={16} strokeWidth={3} />
          <span>{toastMessage}</span>
        </div>
      )}

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
              <span className="text-xs font-bold text-cocoa-fade">17 Locations Synchronized</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-cherry outline-text [text-stroke-width:0.5px] mt-0.5">
              Menu &amp; Operations Console
            </h1>
          </div>
        </div>

        {/* Actions & Station Filter */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="pill-btn bg-cherry text-white text-xs !py-2 !px-4 flex items-center gap-1.5 shadow-pop-sm hover:scale-105 transition-all"
          >
            <Plus size={16} strokeWidth={3} />
            <span>Add New Dish</span>
          </button>

          <div className="flex items-center gap-2 bg-white rounded-2xl border-2 border-cocoa px-3 py-1.5 shadow-pop-sm">
            <span className="text-xs font-bold text-cocoa-fade">Outlet Scope:</span>
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
            className="pill-btn bg-tangerine text-cocoa text-xs !py-2 !px-4 flex items-center gap-1.5 shadow-pop-sm"
          >
            <ChefHat size={15} />
            <span>Open KDS</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Search, Stats & Sync Status */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex items-center w-full max-w-md">
            <Search size={16} className="absolute left-4 text-cocoa-fade pointer-events-none" />
            <input
              type="text"
              placeholder="Search dishes, categories, ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 rounded-full border-2 border-cocoa text-xs font-bold bg-white outline-none focus:ring-2 focus:ring-lemon shadow-pop-sm"
            />
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <button
              onClick={fetchMenu}
              disabled={loading}
              className="bg-white border-2 border-cocoa px-3 py-1.5 rounded-full shadow-pop-sm hover:bg-lemon flex items-center gap-1.5 transition-colors"
              title="Refresh catalog from database"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>Refresh DB</span>
            </button>
            <span className="bg-white border-2 border-cocoa px-3.5 py-1.5 rounded-full shadow-pop-sm">
              Total Catalog: <strong>{items.length} items</strong>
            </span>
            <span className="bg-emerald-100 border-2 border-emerald-400 text-emerald-900 px-3.5 py-1.5 rounded-full shadow-pop-sm">
              In Stock: <strong>{items.filter((i) => i.is_available !== false).length}</strong>
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
                  <th className="p-4">Dietary &amp; Spice</th>
                  <th className="p-4">Price (5% GST Incl.)</th>
                  <th className="p-4">Station Stock Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-cocoa/10 font-bold text-cocoa">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-cream/40 transition-colors">
                    {/* Dish & Description */}
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-12 w-12 rounded-xl border-2 border-cocoa object-cover shrink-0"
                      />
                      <div>
                        <p className="font-black text-sm text-cocoa">{item.name}</p>
                        <p className="text-[10px] text-cocoa-fade mt-0.5 max-w-xs truncate">
                          {item.tagline}
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="bg-cream-dark px-3 py-1 rounded-full border border-cocoa/30 text-[10px] font-extrabold">
                        {item.category}
                      </span>
                    </td>

                    {/* Dietary & Spice */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full border border-cocoa ${
                            item.dietary === 'VEG' ? 'bg-emerald-600' : 'bg-cherry'
                          }`}
                        />
                        <span className="text-[10px] font-black uppercase text-cocoa-fade">
                          {item.dietary} &bull; {item.spice_level}
                        </span>
                      </div>
                    </td>

                    {/* Price Editor (Immediate PostgreSQL Sync) */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-display text-base text-cherry">
                        <span>₹</span>
                        <input
                          type="number"
                          defaultValue={item.base_price}
                          key={`${item.id}-${item.base_price}`}
                          onBlur={(e) => {
                            const val = Number(e.target.value);
                            if (val !== item.base_price) {
                              handlePriceUpdate(item, val);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          className="w-20 p-1.5 rounded-xl border-2 border-cocoa font-black text-xs bg-cream focus:bg-white outline-none focus:ring-2 focus:ring-lemon shadow-sm"
                          title="Edit price (includes 5% GST) and click outside to save"
                        />
                        {savingId === item.id && (
                          <span className="text-[10px] font-black text-emerald-700">
                            Saving...
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Station Stock Status Override Toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStock(item)}
                        disabled={savingId === item.id}
                        className={`pill-btn !py-1.5 !px-3.5 text-[11px] flex items-center gap-1.5 ${
                          item.is_available !== false
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'bg-rose-500 text-white hover:bg-rose-600'
                        }`}
                        title="Click to pause or resume stock for selected station"
                      >
                        {item.is_available !== false ? (
                          <Check size={12} strokeWidth={3} />
                        ) : (
                          <X size={12} strokeWidth={3} />
                        )}
                        <span>{item.is_available !== false ? 'In Stock' : 'Out of Stock'}</span>
                      </button>
                    </td>

                    {/* Actions: Delete */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="h-8 w-8 rounded-full bg-white border-2 border-cocoa flex items-center justify-center text-cherry hover:bg-rose-100 shadow-pop-sm mx-auto transition-transform active:scale-90"
                        title="Delete dish from catalog"
                      >
                        <Trash2 size={14} />
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

          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-black text-rose-900 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>ORDER WEB-778146 DELAY ALERT &bull; Kukatpally Express Kitchen</span>
              </p>
              <p className="text-xs text-rose-700 font-semibold mt-1">
                {overridden
                  ? 'Overridden: Promised time extended by 10 mins (21:26). Automated WhatsApp alert dispatched to Syed Faheem.'
                  : 'Promised at 21:16 (Elapsed +4 mins). AI predicted 40m prep duration based on kitchen load.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOverridden(!overridden)}
              className={`pill-btn text-white text-[11px] !py-1.5 !px-4 shrink-0 transition-all ${
                overridden ? 'bg-emerald-600' : 'bg-cherry'
              }`}
            >
              {overridden ? 'Estimate Overridden (Resolved)' : 'Override Estimate (+10m)'}
            </button>
          </div>
        </div>
      </main>

      {/* Add New Dish Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cocoa/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="card-pop relative w-full max-w-lg bg-cream border-[4px] border-cocoa shadow-pop-lg rounded-3xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b-[3px] border-cocoa bg-lemon flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cocoa-fade block">
                  Central Catalog CMS
                </span>
                <h3 className="font-display text-xl text-cherry">Add New Menu Dish</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white border-2 border-cocoa flex items-center justify-center shadow-pop-sm hover:bg-cream"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateDish} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-cocoa block mb-1">
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shahi Gosht Dum Biryani"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-cocoa text-xs font-bold bg-white outline-none focus:ring-2 focus:ring-lemon"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-cocoa block mb-1">
                  Tagline / Brief Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Slow cooked with 100% pure desi ghee &amp; saffron"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-cocoa text-xs font-bold bg-white outline-none focus:ring-2 focus:ring-lemon"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-cocoa block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-cocoa text-xs font-bold bg-white outline-none"
                  >
                    <option value="Biryani">Biryani</option>
                    <option value="Starters">Starters</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-cocoa block mb-1">
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="350"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border-2 border-cocoa text-xs font-bold bg-white outline-none"
                  />
                  <span className="text-[10px] text-cocoa-fade font-bold mt-0.5 block">
                    Strictly inclusive of 5% GST
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-cocoa block mb-1">
                    Dietary Type
                  </label>
                  <select
                    value={newDietary}
                    onChange={(e) => setNewDietary(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-cocoa text-xs font-bold bg-white outline-none"
                  >
                    <option value="NON_VEG">Non-Vegetarian</option>
                    <option value="VEG">Vegetarian</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-cocoa block mb-1">
                    Spice Level
                  </label>
                  <select
                    value={newSpice}
                    onChange={(e) => setNewSpice(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-cocoa text-xs font-bold bg-white outline-none"
                  >
                    <option value="MILD">Mild</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HOT">Hot</option>
                    <option value="EXTRA_HOT">Extra Hot</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-cocoa/20">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="pill-btn bg-white text-cocoa text-xs !py-2 !px-4 border-2 border-cocoa"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="pill-btn bg-cherry text-white text-xs !py-2 !px-5 shadow-pop-sm flex items-center gap-1.5"
                >
                  <Plus size={16} strokeWidth={3} />
                  <span>{isSubmitting ? 'Saving to DB...' : 'Create &amp; Publish'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
