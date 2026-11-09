import { useState } from 'react';
import { ChefHat, AlertTriangle, CheckCircle2, Bike, MapPin, ArrowLeft } from 'lucide-react';
import { Order, OrderStatus, OUTLETS, INITIAL_ORDERS } from '../data';

export default function KDSPage() {
  const [selectedOutletId, setSelectedOutletId] = useState<string>(OUTLETS[0].id);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const currentOutlet = OUTLETS.find((o) => o.id === selectedOutletId) || OUTLETS[0];
  const outletOrders = orders.filter((o) => o.outletId === selectedOutletId);

  const handleAdvance = (order: Order) => {
    let next: OrderStatus = 'ACCEPTED';
    if (order.status === 'PLACED') next = 'ACCEPTED';
    else if (order.status === 'ACCEPTED') next = 'PREPARING';
    else if (order.status === 'PREPARING') next = 'READY';
    else if (order.status === 'READY') next = 'HANDED_TO_RIDER';
    else return;

    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: next } : o))
    );
  };

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

          <div className="h-12 w-12 rounded-2xl bg-lemon text-cocoa border-2 border-cream flex items-center justify-center font-display text-2xl shadow-pop-sm shrink-0">
            👨‍🍳
          </div>

          <div>
            <h1 className="font-display text-2xl sm:text-3xl text-lemon tracking-wide leading-tight">
              Kitchen Display System (KDS)
            </h1>
            <p className="text-xs font-bold text-cream/70 flex items-center gap-1.5 mt-0.5">
              <MapPin size={14} className="text-cherry shrink-0" />
              <span>Station: {currentOutlet.name}</span> &bull;
              <span>Min Prep: {currentOutlet.minPrepTimeMinutes}m</span> &bull;
              <span className="text-lemon">FSSAI: {currentOutlet.fssaiLicense}</span>
            </p>
          </div>
        </div>

        {/* Station Switcher */}
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
      </header>

      {/* Orders Grid */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {outletOrders.length === 0 ? (
          <div className="text-center py-32 bg-cocoa-soft/40 rounded-3xl border-2 border-dashed border-cream/20">
            <span className="text-6xl">✨</span>
            <h3 className="font-display text-2xl text-lemon mt-4">All Handis Cleared!</h3>
            <p className="text-xs font-bold text-cream/60 mt-1">
              No pending orders for {currentOutlet.name}. Waiting for incoming orders...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outletOrders.map((order) => {
              const isLate = order.isLate;

              return (
                <div
                  key={order.id}
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
                          {new Date(order.promisedReadyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                            {it.addonDetails !== 'None' && (
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
                        className="pill-btn w-full bg-lemon text-cocoa text-sm !py-3.5 border-cream flex items-center justify-center gap-2 hover:bg-lemon-deep"
                      >
                        <CheckCircle2 size={18} />
                        <span>Accept Order</span>
                      </button>
                    )}

                    {order.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleAdvance(order)}
                        className="pill-btn w-full bg-tangerine text-cocoa text-sm !py-3.5 border-cream flex items-center justify-center gap-2 hover:bg-tangerine-deep"
                      >
                        <ChefHat size={18} />
                        <span>Put on Dum (Start Cooking)</span>
                      </button>
                    )}

                    {order.status === 'PREPARING' && (
                      <button
                        onClick={() => handleAdvance(order)}
                        className="pill-btn w-full bg-emerald-500 text-white text-sm !py-3.5 border-cream flex items-center justify-center gap-2 hover:bg-emerald-600"
                      >
                        <CheckCircle2 size={18} />
                        <span>Mark Ready for Pickup</span>
                      </button>
                    )}

                    {order.status === 'READY' && (
                      <button
                        onClick={() => handleAdvance(order)}
                        className="pill-btn w-full bg-aqua text-cocoa text-sm !py-3.5 border-cream flex items-center justify-center gap-2 hover:bg-aqua-deep"
                      >
                        <Bike size={18} />
                        <span>Hand to Delivery Rider</span>
                      </button>
                    )}

                    {order.status === 'HANDED_TO_RIDER' && (
                      <div className="text-center py-3 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl text-xs font-black text-emerald-300">
                        ✓ Handed to Rider (Dispatched)
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
