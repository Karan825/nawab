import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import {
  ShopHeritageSection,
  SignatureSpecialtiesSection,
  DirectOrderingBenefitsSection,
  BulkPartyCateringSection,
  Footer,
  PopularStrip,
  Divider,
} from './components/Sections';
import LoginModal from './components/LoginModal';
import CartDrawer from './components/CartDrawer';
import OrderTrackingModal from './components/OrderTrackingModal';
import KDSPage from './pages/KDSPage';
import AdminPage from './pages/AdminPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderDashboardPage from './pages/OrderDashboardPage';
import {
  OUTLETS,
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [customerUser, setCustomerUser] = useState({
    name: 'Karan Sharma',
    phone: '+91 98765 43210',
    address: 'Flat 402, Aditya Sunshine, Kondapur',
  });

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

  const handleLoginSuccess = (
    user: { name: string; phone: string; address: string },
    chosenOutlet: Outlet
  ) => {
    setCustomerUser(user);
    setSelectedOutlet(chosenOutlet);
    setIsLoggedIn(true);
    navigate('/order');
  };

  const handleStartOrder = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      navigate('/order');
    }
  };

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
        onBackToMenu={() => navigate('/order')}
      />
    );
  }

  // Dedicated Swiggy-Level Food Ordering App (Visible after login / order click)
  if (route === '/order') {
    return (
      <>
        <OrderDashboardPage
          selectedOutlet={selectedOutlet}
          onSelectOutlet={handleSelectOutlet}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onOpenCart={() => setIsCartOpen(true)}
          onNavigateToCheckout={() => navigate('/checkout')}
          onBackToHome={() => navigate('/')}
          customerUser={customerUser}
        />

        {/* Slide-over Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          selectedOutlet={selectedOutlet}
          onNavigateToCheckout={() => navigate('/checkout')}
        />

        {/* Live Order Tracking Modal */}
        <OrderTrackingModal
          isOpen={trackingOrder !== null}
          activeOrder={trackingOrder}
          onClose={() => setTrackingOrder(null)}
        />
      </>
    );
  }

  // Customer Brand Shop & Landing Page
  return (
    <div className="min-h-screen bg-cream">
      <Navbar
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onGoToOrder={handleStartOrder}
        isLoggedIn={isLoggedIn}
        userName={customerUser.name}
      />

      <main>
        <Hero onStartOrder={handleStartOrder} />
        <Marquee />
        <ShopHeritageSection />
        <Divider />
        <SignatureSpecialtiesSection onOrderClick={handleStartOrder} />
        <DirectOrderingBenefitsSection onOrderClick={handleStartOrder} />
        <Divider flip />
        <BulkPartyCateringSection />
        <PopularStrip />
      </main>

      <Footer />

      {/* Customer Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialOutlet={selectedOutlet}
      />

      {/* Live Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={trackingOrder !== null}
        activeOrder={trackingOrder}
        onClose={() => setTrackingOrder(null)}
      />
    </div>
  );
}
