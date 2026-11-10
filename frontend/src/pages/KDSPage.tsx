import React, { useState, useEffect, useRef } from 'react';
import {
  ChefHat,
  AlertTriangle,
  CheckCircle2,
  Bike,
  MapPin,
  ArrowLeft,
  RefreshCw,
  Volume2,
  VolumeX,
  Sparkles,
  PackageX,
  PackageCheck,
  Clock,
  Flame,
  Layers,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { Order, OrderStatus, OUTLETS, INITIAL_ORDERS, MENU_ITEMS } from '../data';
import { apiUrl, wsUrl } from '../config';

interface KDSPageProps {
  orders?: Order[];
  onAdvanceOrder?: (orderId: string, nextStatus: OrderStatus) => void;
}

export default function KDSPage({ orders: propOrders, onAdvanceOrder }: KDSPageProps = {}) {
  const [selectedOutletId, setSelectedOutletId] = useState<string>(OUTLETS[0].id);
  const [internalOrders, setInternalOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [loading, setLoading] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [advancingNumber, setAdvancingNumber] = useState<string | null>(null);

  // Tabs: Orders Queue vs Station Stock (86 Control) vs Surge Prep Buffer
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'INVENTORY' | 'SURGE'>('ORDERS');
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'PLACED' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'HANDED_TO_RIDER'>('ALL');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [surgeBufferMinutes, setSurgeBufferMinutes] = useState(0);

  // Station Inventory & 86 state
  const [stationMenuItems, setStationMenuItems] = useState<any[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [togglingItemId, setTogglingItemId] = useState<number | string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const currentOutlet = OUTLETS.find((o) => o.id === selectedOutletId) || OUTLETS[0];

  // Map outlet slug to numeric ID for WebSocket (e.g. out-kondapur -> 1)
  const outletIndex = OUTLETS.findIndex((o) => o.id === selectedOutletId) + 1;
  const numericOutletId = outletIndex > 0 ? outletIndex : 1;

  // Web Audio Synthesizer Chime for noisy kitchen environments
  const playKitchenChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    } catch {
      // Audio autoplay policy
    }
  };

  // Fetch live orders for this station from backend
  const fetchLiveOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl(`/api/orders?outlet_id=${selectedOutletId}`));
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped: Order[] = data.map((o: any) => ({
            id: String(o.id),
            orderNumber: o.order_number,
            outletId: selectedOutletId,
            outletName: o.outlet_name || currentOutlet.name,
            customerName: 'Customer',
            customerPhone: '+91 98765 43210',
            deliveryAddress: o.special_instructions || `${currentOutlet.area}, Hyderabad`,
            items: (o.items || []).map((it: any) => ({
              id: String(it.id),
              itemName: it.item_name,
              portionName: it.portion_name,
              addonDetails:
                Array.isArray(it.addon_details) && it.addon_details.length > 0
                  ? it.addon_details.map((a: any) => a.name).join(', ')
                  : 'None',
              unitPrice: it.unit_price,
              quantity: it.quantity,
              totalPrice: it.total_price,
            })),
            itemTotal: o.subtotal,
            gstAmount: o.gst_amount,
            deliveryFee: o.delivery_fee,
            totalAmount: o.grand_total,
            paymentMethod: 'UPI',
            paymentStatus: 'SUCCESS',
            status: o.status as OrderStatus,
            placedAt: o.created_at,
            promisedReadyTime:
              o.promised_delivery_time ||
              new Date(Date.now() + (o.ai_estimated_prep_minutes || 35) * 60000).toISOString(),
            estimatedPrepMinutes: o.ai_estimated_prep_minutes || 35,
            isLate: false,
          }));

          if (mapped.length > 0) {
            setInternalOrders(mapped);
          } else {
            setInternalOrders(INITIAL_ORDERS.filter((io) => io.outletId === selectedOutletId));
          }
          setLastSynced(new Date());
        }
      }
    } catch (err) {
      console.warn('KDS backend fetch note:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch live outlet menu with stock availability overrides
  const fetchStationMenu = async () => {
    try {
      setInventoryLoading(true);
      const res = await fetch(apiUrl(`/api/menu/outlet/${selectedOutletId}`));
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setStationMenuItems(data);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not fetch station menu from backend, fallback to local:', e);
    } finally {
      setInventoryLoading(false);
    }

    // Fallback based on MENU_ITEMS and outlet override
    const fallback = MENU_ITEMS.map((item, idx) => {
      const override = item.outletAvailability?.[selectedOutletId];
      return {
        id: idx + 1,
        slug: item.id,
        name: item.name,
        category: item.category,
        base_price: override?.priceOverride ?? item.price,
        image_url: item.photo,
        is_available: override !== undefined ? override.isAvailable : item.isAvailable,
        custom_status_label: override?.statusLabel || null,
      };
    });
    setStationMenuItems(fallback);
  };

  // 1-Tap Toggle Item Availability (Item 86 / Restock)
  const handleToggleItemAvailability = async (item: any, makeAvailable: boolean, reasonText?: string) => {
    setTogglingItemId(item.id);
    setActionNotice(null);

    const customLabel = makeAvailable ? null : (reasonText || 'Sold Out for Tonight');

    // Optimistic UI update
    setStationMenuItems((prev) =>
      prev.map((m) =>
        m.id === item.id
          ? { ...m, is_available: makeAvailable, custom_status_label: customLabel }
          : m
      )
    );

    try {
      const res = await fetch(apiUrl(`/api/menu/outlet/${selectedOutletId}/item/${item.id}/override`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_available: makeAvailable,
          custom_status_label: customLabel,
        }),
      });

      if (res.ok) {
        setActionNotice(
          makeAvailable
            ? `RESTOCKED: "${item.name}" is now IN STOCK at ${currentOutlet.name}. Customer storefront updated!`
            : `ITEM 86'd: "${item.name}" marked OUT OF STOCK at ${currentOutlet.name}. Customer orders blocked for this dish!`
        );
        playKitchenChime();
      }
    } catch (err) {
      console.error('Failed to update outlet item stock:', err);
    } finally {
      setTogglingItemId(null);
    }
  };

  // Continuous polling every 3 seconds for live reconciliation
  useEffect(() => {
    fetchLiveOrders();
    fetchStationMenu();
    const interval = setInterval(() => {
      fetchLiveOrders();
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedOutletId]);

  // WebSocket Connection for instant event push
  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(wsUrl(`/ws/kds/${numericOutletId}`));

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.event === 'ORDER_STATUS_CHANGED' || msg.event === 'NEW_ORDER_DISPATCHED') {
            fetchLiveOrders();
            playKitchenChime();
          }
        } catch {
          // ignore
        }
      };
    } catch {
      // ignore
    }

    return () => {
      if (ws) ws.close();
    };
  }, [numericOutletId]);

  // Advance Order Lifecycle (Invariant 6: Strict KDS transitions)
  const handleAdvance = async (order: Order) => {
    let next: OrderStatus = 'ACCEPTED';
    if (order.status === 'PLACED') next = 'ACCEPTED';
    else if (order.status === 'ACCEPTED') next = 'PREPARING';
    else if (order.status === 'PREPARING') next = 'READY';
    else if (order.status === 'READY') next = 'HANDED_TO_RIDER';
    else return;

    setAdvancingNumber(order.orderNumber);
    playKitchenChime();

    // 1. Optimistic update in UI
    setInternalOrders((prev) =>
      prev.map((o) => (o.orderNumber === order.orderNumber ? { ...o, status: next } : o))
    );

    if (onAdvanceOrder) {
      onAdvanceOrder(order.id, next);
    }

    // 2. Real API Call to PostgreSQL
    try {
      const res = await fetch(apiUrl(`/api/orders/${order.orderNumber}/status`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next, note: `Station advance to ${next}` }),
      });
      if (res.ok) {
        fetchLiveOrders();
      }
    } catch (err) {
      console.error('KDS status advance error:', err);
    } finally {
      setAdvancingNumber(null);
    }
  };

  const orders = internalOrders;
  const outletOrders = orders.filter((o) => o.outletId === selectedOutletId || !o.outletId);

  // Filter orders by selected stage
  const filteredOrders = outletOrders.filter((o) => {
    if (orderFilter === 'ALL') return true;
    return o.status === orderFilter;
  });

  const countPlaced = outletOrders.filter((o) => o.status === 'PLACED').length;
  const countAccepted = outletOrders.filter((o) => o.status === 'ACCEPTED').length;
  const countPreparing = outletOrders.filter((o) => o.status === 'PREPARING').length;
  const countReady = outletOrders.filter((o) => o.status === 'READY').length;
  const countDispatched = outletOrders.filter((o) => o.status === 'HANDED_TO_RIDER').length;
  const outOfStockCount = stationMenuItems.filter((m) => m.is_available === false).length;

  return (
    <div className="min-h-screen bg-cocoa text-cream flex flex-col font-body">
      {/* Top Station Bar */}
      <header className="p-4 sm:p-5 border-b-[3px] border-cream/30 bg-cocoa-soft flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3.5">
          <a
            href="/"
            className="h-10 w-10 rounded-full bg-cream text-cocoa border-2 border-cream flex items-center justify-center shadow-pop-sm hover:bg-lemon transition-colors shrink-0"
            title="Return to Storefront"
          >
            <ArrowLeft size={18} />
          </a>

          <div className="h-11 w-11 rounded-2xl bg-lemon text-cocoa border-2 border-cream flex items-center justify-center shadow-pop-sm shrink-0">
            <ChefHat size={24} className="text-cocoa" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl sm:text-2xl text-lemon tracking-wide leading-tight">
                Kitchen Display System (KDS)
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/40">
                Live (3s)
              </span>
            </div>
            <p className="text-xs font-bold text-cream/70 flex items-center gap-1.5 mt-0.5">
              <MapPin size={13} className="text-cherry shrink-0" />
              <span>{currentOutlet.name}</span> &bull;
              <span>Min Prep: {currentOutlet.minPrepTimeMinutes + surgeBufferMinutes}m</span> &bull;
              <span className="text-lemon">FSSAI: {currentOutlet.fssaiLicense}</span>
            </p>
          </div>
        </div>

        {/* Station Switcher & Audio Controls */}
        <div className="flex items-center gap-2.5">
          {/* Audio Chime Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`h-10 px-3 rounded-2xl border-2 flex items-center gap-1.5 text-xs font-black shadow-pop-sm transition-all ${
              soundEnabled
                ? 'bg-lemon text-cocoa border-cream'
                : 'bg-cocoa border-cream/40 text-cream/50'
            }`}
            title="Toggle kitchen chime sound"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="hidden sm:inline">{soundEnabled ? 'Chime ON' : 'Muted'}</span>
          </button>

          {/* Sync Button */}
          <button
            onClick={() => {
              fetchLiveOrders();
              fetchStationMenu();
              playKitchenChime();
            }}
            className="h-10 w-10 rounded-2xl bg-cocoa border-2 border-cream/40 flex items-center justify-center text-lemon hover:bg-cocoa-soft shadow-pop-sm transition-colors"
            title="Sync Orders & Inventory"
          >
            <RefreshCw size={15} className={loading || inventoryLoading ? 'animate-spin' : ''} />
          </button>

          {/* Station Selector Dropdown */}
          <div className="flex items-center gap-2 bg-cocoa border-2 border-cream/40 rounded-2xl p-1.5 shadow-pop-sm">
            <span className="text-xs font-bold text-cream/70 hidden sm:inline pl-1">Station:</span>
            <select
              value={selectedOutletId}
              onChange={(e) => setSelectedOutletId(e.target.value)}
              className="bg-cocoa-soft font-black text-xs text-lemon rounded-xl px-2.5 py-1.5 border border-cream/30 outline-none cursor-pointer"
            >
              {OUTLETS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main KDS Mode Switcher (Orders Queue vs Station Stock 86 vs Surge Buffer) */}
      <div className="bg-cocoa-soft/80 border-b-2 border-cream/20 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-[73px] z-20 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {/* Tab 1: Orders Queue */}
          <button
            type="button"
            onClick={() => setActiveTab('ORDERS')}
            className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 border-2 transition-all ${
              activeTab === 'ORDERS'
                ? 'bg-lemon text-cocoa border-cream shadow-pop-sm'
                : 'bg-cocoa text-cream/80 border-cream/30 hover:bg-cocoa-soft'
            }`}
          >
            <Layers size={14} />
            <span>Live Order Queue</span>
            <span className="px-1.5 py-0.2 rounded-full bg-cherry text-white text-[10px] font-black">
              {outletOrders.filter((o) => o.status !== 'HANDED_TO_RIDER').length}
            </span>
          </button>

          {/* Tab 2: Station Stock & 86 Control */}
          <button
            type="button"
            onClick={() => setActiveTab('INVENTORY')}
            className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 border-2 transition-all ${
              activeTab === 'INVENTORY'
                ? 'bg-lemon text-cocoa border-cream shadow-pop-sm'
                : 'bg-cocoa text-cream/80 border-cream/30 hover:bg-cocoa-soft'
            }`}
          >
            <PackageX size={14} />
            <span>Station Stock (Item 86)</span>
            {outOfStockCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-black">
                {outOfStockCount} Out
              </span>
            )}
          </button>

          {/* Tab 3: Surge Mode */}
          <button
            type="button"
            onClick={() => setActiveTab('SURGE')}
            className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 border-2 transition-all ${
              activeTab === 'SURGE'
                ? 'bg-lemon text-cocoa border-cream shadow-pop-sm'
                : 'bg-cocoa text-cream/80 border-cream/30 hover:bg-cocoa-soft'
            }`}
          >
            <Flame size={14} />
            <span>Rush Surge Mode</span>
            {surgeBufferMinutes > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-tangerine text-cocoa text-[10px] font-black">
                +{surgeBufferMinutes}m
              </span>
            )}
          </button>
        </div>

        {/* Live sync timestamp */}
        <span className="text-[11px] font-mono text-cream/50">
          Sync: {lastSynced.toLocaleTimeString()}
        </span>
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className="bg-lemon text-cocoa border-b-2 border-cream p-3 text-xs font-black flex items-center justify-between px-6 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-cherry" />
            <span>{actionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-cocoa/60 hover:text-cocoa text-xs uppercase underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* VIEW 1: LIVE ORDERS QUEUE */}
      {activeTab === 'ORDERS' && (
        <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* Order Stage Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: `All Tickets (${outletOrders.length})` },
              { id: 'PLACED', label: `1. Needs Accept (${countPlaced})` },
              { id: 'ACCEPTED', label: `2. Accepted (${countAccepted})` },
              { id: 'PREPARING', label: `3. On Dum (${countPreparing})` },
              { id: 'READY', label: `4. Ready for Pickup (${countReady})` },
              { id: 'HANDED_TO_RIDER', label: `5. Dispatched (${countDispatched})` },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setOrderFilter(chip.id as any)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all ${
                  orderFilter === chip.id
                    ? 'bg-lemon text-cocoa border-cream shadow-pop-sm'
                    : 'bg-cocoa-soft text-cream/70 border-cream/20 hover:bg-cream/10'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-28 bg-cocoa-soft/40 rounded-3xl border-2 border-dashed border-cream/20 space-y-2">
              <CheckCircle2 className="w-14 h-14 text-lemon/80 mx-auto" />
              <h3 className="font-display text-2xl text-lemon">No Orders in this Stage</h3>
              <p className="text-xs font-bold text-cream/60">
                All station tickets for {currentOutlet.name} in this filter are cleared.
              </p>
              <button
                onClick={() => setOrderFilter('ALL')}
                className="mt-3 pill-btn bg-lemon text-cocoa text-xs font-black !py-2 !px-4 inline-flex items-center gap-1.5"
              >
                <span>View All Station Tickets</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => {
                const isLate = order.isLate;

                return (
                  <div
                    key={order.id || order.orderNumber}
                    className={`card-pop rounded-3xl overflow-hidden border-[4px] transition-all flex flex-col justify-between ${
                      isLate
                        ? 'border-cherry bg-cherry/10 ring-4 ring-cherry/40 shadow-[6px_6px_0_0_#E8333A]'
                        : 'border-cream bg-cocoa-soft shadow-pop-lg'
                    }`}
                  >
                    <div>
                      {/* Card Header */}
                      <div
                        className={`p-4 flex items-center justify-between border-b-[3px] ${
                          isLate ? 'bg-cherry text-white border-cherry' : 'bg-lemon text-cocoa border-cream'
                        }`}
                      >
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider block opacity-80">
                            Token #
                          </span>
                          <h3 className="font-display text-2xl tracking-wide">{order.orderNumber}</h3>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-black uppercase tracking-wider block opacity-80">
                            Promised Time
                          </span>
                          <span className="font-mono font-black text-sm">
                            {new Date(order.promisedReadyTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Late Flashing Banner */}
                      {isLate && (
                        <div className="bg-cherry text-white px-4 py-2 flex items-center justify-between text-xs font-black ring-2 ring-white/40">
                          <span className="flex items-center gap-1.5">
                            <AlertTriangle size={16} /> KITCHEN ALERT: LATE BY {order.lateMinutes || 4} MINS!
                          </span>
                          <span>PRIORITY #1</span>
                        </div>
                      )}

                      {/* Customer & Items Ticket */}
                      <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between text-xs pb-3 border-b border-cream/15 text-cream/80">
                          <div>
                            <span className="font-black text-white text-sm">{order.customerName}</span>
                            <span className="text-[11px] block text-cream/60">{order.customerPhone}</span>
                          </div>
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-cream/15 border border-cream/30 text-lemon">
                            {order.status}
                          </span>
                        </div>

                        {/* Items List */}
                        <div className="space-y-2.5">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="bg-cocoa p-3 rounded-2xl border-2 border-cream/20">
                              <span className="font-black text-sm text-lemon">
                                {it.quantity}x {it.itemName}
                              </span>
                              <p className="text-xs font-bold text-cherry mt-0.5">
                                Portion: {it.portionName}
                              </p>
                              {it.addonDetails !== 'None' && it.addonDetails && (
                                <p className="text-[11px] text-cream/70 mt-1 bg-cream/5 px-2 py-0.5 rounded border border-cream/10">
                                  + {it.addonDetails}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 1-Tap Action Button at Bottom */}
                    <div className="p-5 pt-0">
                      {order.status === 'PLACED' && (
                        <button
                          onClick={() => handleAdvance(order)}
                          disabled={advancingNumber === order.orderNumber}
                          className="pill-btn w-full bg-lemon text-cocoa text-sm !py-3.5 border-cream flex items-center justify-center gap-2 hover:bg-lemon-deep active:scale-95 transition-transform"
                        >
                          <CheckCircle2 size={18} />
                          <span>
                            {advancingNumber === order.orderNumber ? 'Updating...' : 'Accept Order'}
                          </span>
                        </button>
                      )}

                      {order.status === 'ACCEPTED' && (
                        <button
                          onClick={() => handleAdvance(order)}
                          disabled={advancingNumber === order.orderNumber}
                          className="pill-btn w-full bg-tangerine text-cocoa text-sm !py-3.5 border-cream flex items-center justify-center gap-2 hover:bg-tangerine-deep active:scale-95 transition-transform"
                        >
                          <ChefHat size={18} />
                          <span>
                            {advancingNumber === order.orderNumber
                              ? 'Updating...'
                              : 'Put on Dum (Start Cooking)'}
                          </span>
                        </button>
                      )}

                      {order.status === 'PREPARING' && (
                        <button
                          onClick={() => handleAdvance(order)}
                          disabled={advancingNumber === order.orderNumber}
                          className="pill-btn w-full bg-emerald-500 text-white text-sm !py-3.5 border-cream flex items-center justify-center gap-2 hover:bg-emerald-600 active:scale-95 transition-transform"
                        >
                          <CheckCircle2 size={18} />
                          <span>
                            {advancingNumber === order.orderNumber
                              ? 'Updating...'
                              : 'Mark Ready for Pickup'}
                          </span>
                        </button>
                      )}

                      {order.status === 'READY' && (
                        <button
                          onClick={() => handleAdvance(order)}
                          disabled={advancingNumber === order.orderNumber}
                          className="pill-btn w-full bg-aqua text-cocoa text-sm !py-3.5 border-cream flex items-center justify-center gap-2 hover:bg-aqua-deep active:scale-95 transition-transform"
                        >
                          <Bike size={18} />
                          <span>
                            {advancingNumber === order.orderNumber
                              ? 'Updating...'
                              : 'Hand to Delivery Rider'}
                          </span>
                        </button>
                      )}

                      {order.status === 'HANDED_TO_RIDER' && (
                        <div className="text-center py-3 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl text-xs font-black text-emerald-300 flex items-center justify-center gap-1.5">
                          <CheckCircle2 size={14} className="text-emerald-400" />
                          <span>Handed to Rider (Dispatched)</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* VIEW 2: STATION STOCK & ITEM 86 CONTROL */}
      {activeTab === 'INVENTORY' && (
        <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
          <div className="bg-cocoa-soft border-2 border-cream/30 rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-pop-md">
            <div>
              <div className="flex items-center gap-2">
                <PackageX className="text-cherry" size={24} />
                <h2 className="font-display text-2xl text-lemon">
                  Station Stock &amp; 86 Control ({currentOutlet.name})
                </h2>
              </div>
              <p className="text-xs font-bold text-cream/70 mt-1 max-w-2xl">
                When a degh runs out, mark the dish <strong>OUT OF STOCK (86)</strong>. It immediately disables the dish on the customer ordering portal for <strong>{currentOutlet.name}</strong> while keeping it available at other stations.
              </p>
            </div>

            <div className="bg-cocoa border border-cream/20 px-4 py-2 rounded-2xl text-right shrink-0">
              <span className="text-[10px] font-black uppercase text-cream/60 block">86'd Dishes</span>
              <span className="font-display text-xl text-cherry">{outOfStockCount} Out of Stock</span>
            </div>
          </div>

          {/* Dishes List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stationMenuItems.map((item) => {
              const isAvailable = item.is_available !== false;
              const isBusy = togglingItemId === item.id;

              return (
                <div
                  key={item.id}
                  className={`card-pop rounded-3xl overflow-hidden border-[3px] transition-all flex flex-col justify-between ${
                    isAvailable
                      ? 'bg-cocoa-soft border-cream/40 shadow-pop-sm'
                      : 'bg-cherry/10 border-cherry/80 ring-2 ring-cherry/30'
                  }`}
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className={`h-16 w-16 rounded-2xl object-cover border-2 border-cream/30 shrink-0 ${
                          !isAvailable ? 'grayscale opacity-60' : ''
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-lemon block truncate">
                            {item.category}
                          </span>
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                              isAvailable
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-red-500/20 text-red-300 border-red-500/40'
                            }`}
                          >
                            {isAvailable ? 'IN STOCK' : "86'D (OUT)"}
                          </span>
                        </div>
                        <h3 className="font-display text-base text-cream truncate leading-tight mt-0.5">
                          {item.name}
                        </h3>
                        <p className="text-xs font-bold text-lemon mt-0.5">
                          ₹{item.base_price} <span className="text-[10px] text-cream/50">(GST Incl.)</span>
                        </p>
                      </div>
                    </div>

                    {/* Out of Stock Reason Notice */}
                    {!isAvailable && (
                      <div className="bg-cherry/20 border border-cherry/40 rounded-xl p-2 text-[11px] font-bold text-cherry-light flex items-center gap-1.5">
                        <AlertTriangle size={13} className="shrink-0" />
                        <span>Status: {item.custom_status_label || 'Sold Out for Tonight'}</span>
                      </div>
                    )}
                  </div>

                  {/* 86 Toggle Controls */}
                  <div className="p-4 pt-0 space-y-2">
                    {isAvailable ? (
                      <div className="space-y-1.5">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleToggleItemAvailability(item, false, 'Sold Out for Tonight')}
                          className="pill-btn w-full bg-cherry text-white text-xs font-black !py-2.5 flex items-center justify-center gap-1.5 border border-cherry/80 shadow-pop-sm hover:scale-102 active:scale-95"
                        >
                          <PackageX size={14} />
                          <span>{isBusy ? 'Updating...' : "86 Dish (Mark Out of Stock)"}</span>
                        </button>

                        <div className="flex gap-1.5 text-[9px] font-bold">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleToggleItemAvailability(item, false, 'Next Handi in 45m')}
                            className="flex-1 py-1 px-1.5 rounded-lg bg-cocoa border border-cream/20 text-cream/70 hover:bg-cocoa-soft text-center truncate"
                            title="Set status: Next Handi in 45m"
                          >
                            Next Handi 45m
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleToggleItemAvailability(item, false, 'Chef Cut Finished')}
                            className="flex-1 py-1 px-1.5 rounded-lg bg-cocoa border border-cream/20 text-cream/70 hover:bg-cocoa-soft text-center truncate"
                            title="Set status: Chef Cut Finished"
                          >
                            Cut Finished
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleToggleItemAvailability(item, true)}
                        className="pill-btn w-full bg-emerald-500 text-white text-xs font-black !py-2.5 flex items-center justify-center gap-1.5 border border-emerald-400 shadow-pop-sm hover:scale-102 active:scale-95"
                      >
                        <PackageCheck size={14} />
                        <span>{isBusy ? 'Restocking...' : 'Restock (Make Available)'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* VIEW 3: SURGE MODE & PREP TIME BUFFER */}
      {activeTab === 'SURGE' && (
        <main className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-6">
          <div className="bg-cocoa-soft border-2 border-cream/30 rounded-3xl p-6 space-y-4 shadow-pop-md">
            <div className="flex items-center gap-2.5">
              <Flame size={26} className="text-tangerine" />
              <div>
                <h2 className="font-display text-2xl text-lemon">
                  Rush Surge Prep Time Buffer ({currentOutlet.name})
                </h2>
                <p className="text-xs font-bold text-cream/70 mt-0.5">
                  During extreme evening rushes or charcoal degh transitions, add an automatic prep buffer so promised delivery times stay 100% honest.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 pt-3">
              {[
                {
                  buffer: 0,
                  label: 'Normal Pace (+0m)',
                  desc: 'Standard AI regression prediction based on live queue load.',
                },
                {
                  buffer: 10,
                  label: 'Heavy Rush (+10m)',
                  desc: 'Recommended for Friday dinner rushes between 8:00 PM and 10:30 PM.',
                },
                {
                  buffer: 20,
                  label: 'Extreme Surge (+20m)',
                  desc: 'Festival / catering surge when charcoal deghs are at full capacity.',
                },
              ].map((surge) => {
                const isSelected = surgeBufferMinutes === surge.buffer;
                return (
                  <button
                    key={surge.buffer}
                    type="button"
                    onClick={() => {
                      setSurgeBufferMinutes(surge.buffer);
                      setActionNotice(`Surge pace set to ${surge.label} for ${currentOutlet.name}`);
                      playKitchenChime();
                    }}
                    className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-lemon text-cocoa border-cream shadow-pop-sm -translate-y-1'
                        : 'bg-cocoa text-cream/80 border-cream/30 hover:bg-cocoa-soft'
                    }`}
                  >
                    <div>
                      <span className="font-display text-base block">{surge.label}</span>
                      <p className="text-xs font-semibold opacity-75 mt-1 leading-relaxed">
                        {surge.desc}
                      </p>
                    </div>
                    <span className="text-[10px] font-black uppercase mt-3 tracking-wider">
                      {isSelected ? '✓ Active Pace' : 'Select Pace'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
