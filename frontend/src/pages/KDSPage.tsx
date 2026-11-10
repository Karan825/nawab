import React, { useState, useEffect, useRef } from 'react';
import { ChefHat, AlertTriangle, CheckCircle2, Bike, MapPin, ArrowLeft, RefreshCw, Volume2, Sparkles } from 'lucide-react';
import { Order, OrderStatus, OUTLETS, INITIAL_ORDERS } from '../data';

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

  const currentOutlet = OUTLETS.find((o) => o.id === selectedOutletId) || OUTLETS[0];

  // Map outlet slug to numeric ID for WebSocket (e.g. out-kondapur -> 1)
  const outletIndex = OUTLETS.findIndex((o) => o.id === selectedOutletId) + 1;
  const numericOutletId = outletIndex > 0 ? outletIndex : 1;

  // Fetch live orders for this outlet from backend
  const fetchLiveOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders?outlet_id=${selectedOutletId}`);
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
              addonDetails: Array.isArray(it.addon_details) && it.addon_details.length > 0
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

          // Merge sample initial orders if empty or combine with real database orders
          if (mapped.length > 0) {
            setInternalOrders(mapped);
          } else {
            // Keep matching initial orders for demo
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

  // Poll every 3 seconds for continuous live reconciliation
  useEffect(() => {
    fetchLiveOrders();
    const interval = setInterval(fetchLiveOrders, 3000);
    return () => clearInterval(interval);
  }, [selectedOutletId]);

  // WebSocket Connection to Realtime KDS
  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/kds/${numericOutletId}`;
      ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.event === 'ORDER_STATUS_CHANGED' || msg.event === 'NEW_ORDER_DISPATCHED') {
            fetchLiveOrders();
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

    // 1. Optimistic update in UI
    setInternalOrders((prev) =>
      prev.map((o) => (o.orderNumber === order.orderNumber ? { ...o, status: next } : o))
    );

    if (onAdvanceOrder) {
      onAdvanceOrder(order.id, next);
    }

    // 2. Real API Call to PostgreSQL
    try {
      const res = await fetch(`/api/orders/${order.orderNumber}/status`, {
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

  return (
    <div className="min-h-screen bg-cocoa text-cream flex flex-col font-body">
      {/* Top Station Bar */}
      <header className="p-4 sm:p-5 border-b-[3px] border-cream/30 bg-cocoa-soft flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="h-10 w-10 rounded-full bg-cream text-cocoa border-2 border-cream flex items-center justify-center shadow-pop-sm hover:bg-lemon transition-colors shrink-0"
            title="Return to Storefront"
          >
            <ArrowLeft size={20} />
          </a>

          <div className="h-12 w-12 rounded-2xl bg-lemon text-cocoa border-2 border-cream flex items-center justify-center shadow-pop-sm shrink-0">
            <ChefHat size={26} className="text-cocoa" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl sm:text-3xl text-lemon tracking-wide leading-tight">
                Kitchen Display System (KDS)
              </h1>
              <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync (3s)
              </span>
            </div>
            <p className="text-xs font-bold text-cream/70 flex items-center gap-1.5 mt-0.5">
              <MapPin size={14} className="text-cherry shrink-0" />
              <span>Station: {currentOutlet.name}</span> &bull;
              <span>Min Prep: {currentOutlet.minPrepTimeMinutes}m</span> &bull;
              <span className="text-lemon">FSSAI: {currentOutlet.fssaiLicense}</span>
            </p>
          </div>
        </div>

        {/* Station Switcher & Manual Sync */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchLiveOrders}
            className="h-10 w-10 rounded-2xl bg-cocoa border-2 border-cream/40 flex items-center justify-center text-lemon hover:bg-cocoa-soft shadow-pop-sm transition-colors"
            title="Sync Orders Now"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <div className="flex items-center gap-2 bg-cocoa border-2 border-cream/40 rounded-2xl p-2 shadow-pop-sm">
            <span className="text-xs font-bold text-cream/70">Station:</span>
            <select
              value={selectedOutletId}
              onChange={(e) => setSelectedOutletId(e.target.value)}
              className="bg-cocoa-soft font-black text-xs text-lemon rounded-xl px-3 py-1.5 border border-cream/30 outline-none cursor-pointer"
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

      {/* Orders Grid */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {outletOrders.length === 0 ? (
          <div className="text-center py-32 bg-cocoa-soft/40 rounded-3xl border-2 border-dashed border-cream/20">
            <CheckCircle2 className="w-16 h-16 text-lemon/80 mx-auto" />
            <h3 className="font-display text-2xl text-lemon mt-4">All Handis Cleared!</h3>
            <p className="text-xs font-bold text-cream/60 mt-1">
              No pending orders for {currentOutlet.name}. Waiting for incoming orders...
            </p>
            <button
              onClick={fetchLiveOrders}
              className="mt-4 pill-btn bg-lemon text-cocoa text-xs font-black !py-2 !px-4 inline-flex items-center gap-1.5"
            >
              <RefreshCw size={14} />
              <span>Refresh Station Queue</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outletOrders.map((order) => {
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
                  {/* Card Header */}
                  <div>
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
                      <div className="bg-cherry text-white px-4 py-2 flex items-center justify-between text-xs font-black animate-pulse">
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
    </div>
  );
}
