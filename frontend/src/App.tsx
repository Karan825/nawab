import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Menu from './components/Menu';
import { FindUs, Footer, PopularStrip, Divider } from './components/Sections';
import CartDrawer from './components/CartDrawer';
import OrderTrackModal from './components/OrderTrackModal';
import KDSPage from './pages/KDSPage';
import AdminPage from './pages/AdminPage';
import CheckoutPage from './pages/CheckoutPage';
import {
  OUTLETS,
  MENU_ITEMS,
  INITIAL_ORDERS,
  type Outlet,
  type MenuItem,
  type PortionOption,
  type AddonOption,
  type CartItem,
  type Order,
  type OrderStatus,
} from './data';

export default function App() {
  const [route, setRoute] = useState(window.location.pathname);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet>(OUTLETS[0]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle client-side history navigation
  useEffect(() => {
    const handlePopState = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOutlet = (newOutlet: Outlet) => {
    if (cartItems.length > 0 && newOutlet.id !== selectedOutlet.id) {
      const confirmSwitch = window.confirm(
        `Your cart contains items from ${selectedOutlet.name}. Switching to ${newOutlet.name} will clear your current cart. Proceed?`
      );
      if (!confirmSwitch) return;
      setCartItems([]);
    }
    setSelectedOutlet(newOutlet);
  };

  const handleAddToCart = (
    item: MenuItem,
    portion: PortionOption,
    addons: AddonOption[]
  ) => {
    const addonIds = addons.map((a) => a.id).sort().join('_');
    const cartItemId = `${item.id}-${portion.id}-${addonIds}`;
    const unitPrice =
      item.price + portion.priceModifier + addons.reduce((sum, a) => sum + a.price, 0);

    setCartItems((prev) => {
      const existing = prev.find((c) => c.id === cartItemId);
      if (existing) {
        return prev.map((c) =>
          c.id === cartItemId
            ? { ...c, quantity: c.quantity + 1, totalPrice: (c.quantity + 1) * c.unitPrice }
            : c
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          item,
          portion,
          addons,
          quantity: 1,
          unitPrice,
          totalPrice: unitPrice,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const handleUpdateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, quantity: qty, totalPrice: qty * c.unitPrice } : c))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCheckoutSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setIsCartOpen(false);
    setTrackingOrder(newOrder);
  };

  const handleAdvanceKDSOrder = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
    // If currently tracking this order, update tracking view too
    setTrackingOrder((prev) => (prev && prev.id === orderId ? { ...prev, status: nextStatus } : prev));
  };

  const totalCartCount = cartItems.reduce((acc, c) => acc + c.quantity, 0);
  const totalCartPrice = cartItems.reduce((acc, c) => acc + c.totalPrice, 0);

  // Dedicated Route Views
  if (route === '/kds') {
    return <KDSPage orders={orders} onAdvanceOrder={handleAdvanceKDSOrder} />;
  }

  if (route === '/admin') {
    return <AdminPage />;
  }

  if (route === '/checkout') {
    return (
      <CheckoutPage
        cartItems={cartItems}
        selectedOutlet={selectedOutlet}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onCheckoutSuccess={handleCheckoutSuccess}
        onBackToMenu={() => navigate('/')}
      />
    );
  }

  // Customer Storefront
  return (
    <div className="min-h-screen bg-cream">
      <Navbar
        selectedOutlet={selectedOutlet}
        onSelectOutlet={handleSelectOutlet}
        cartCount={totalCartCount}
        cartTotal={totalCartPrice}
        onOpenCart={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main>
        <Hero />
        <Marquee />
        <Menu items={MENU_ITEMS} onAddToCart={handleAddToCart} searchTerm={searchTerm} />
        <Divider />
        <PopularStrip />
        <FindUs selectedOutlet={selectedOutlet} onSelectOutlet={handleSelectOutlet} />
      </main>

      <Footer />

      {/* Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        selectedOutlet={selectedOutlet}
        onCheckoutSuccess={handleCheckoutSuccess}
        onNavigateToCheckout={() => navigate('/checkout')}
      />

      {/* Live Order Tracking Modal */}
      <OrderTrackModal
        order={trackingOrder}
        onClose={() => setTrackingOrder(null)}
      />
    </div>
  );
}
