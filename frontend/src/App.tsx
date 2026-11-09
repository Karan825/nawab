import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Menu from './components/Menu';
import Builder from './components/Builder';
import { Snacks, Merch, FindUs, InstagramWall, Footer, PopularStrip, Divider } from './components/Sections';
import CartDrawer from './components/CartDrawer';
import OrderTrackModal from './components/OrderTrackModal';
import KDSPage from './pages/KDSPage';
import AdminPage from './pages/AdminPage';
import {
  OUTLETS,
  MENU_ITEMS,
  INITIAL_ORDERS,
  type Outlet,
  type MenuItem,
  type CartItem,
  type Order,
  type Snack,
  type MerchItem,
} from './data';

function CustomerStorefront() {
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet>(OUTLETS[0]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

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

  const handleAddToCart = (item: MenuItem) => {
    const defaultPortion = item.portions[0] || { id: 'p-def', name: 'Standard Portion', priceModifier: 0, serves: '1 person' };
    const cartItemId = `${item.id}-${defaultPortion.id}`;

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
          portion: defaultPortion,
          addons: [],
          quantity: 1,
          unitPrice: item.price,
          totalPrice: item.price,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const handleAddSnack = (snack: Snack) => {
    const snackMenuItem: MenuItem = {
      id: snack.id,
      name: snack.name,
      tagline: 'Hyderabadi Appetizer',
      description: snack.description,
      ingredients: [snack.name],
      price: snack.price,
      category: 'Starters & Kebabs',
      photo: snack.photo,
      colors: { top: '#FFC96B', bottom: '#D96E14', foam: '#FFF4E2' },
      dietary: snack.id.includes('mutton') ? 'NON_VEG' : 'VEG',
      spiceLevel: 'MEDIUM',
      allergens: [],
      portions: [{ id: 'p-reg', name: 'Standard Plate', priceModifier: 0, serves: '1–2' }],
      addons: [],
    };
    handleAddToCart(snackMenuItem);
  };

  const handleAddMerch = (merch: MerchItem) => {
    const merchMenuItem: MenuItem = {
      id: merch.id,
      name: merch.name,
      tagline: 'Royal Pantry Item',
      description: merch.description,
      ingredients: [merch.name],
      price: merch.price,
      category: 'Desserts',
      photo: merch.photo,
      colors: { top: '#FFC96B', bottom: '#D96E14', foam: '#FFF4E2' },
      dietary: 'VEG',
      spiceLevel: 'MILD',
      allergens: [],
      portions: [{ id: 'p-reg', name: 'Pack', priceModifier: 0, serves: '1 unit' }],
      addons: [],
    };
    handleAddToCart(merchMenuItem);
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

  const totalCartCount = cartItems.reduce((acc, c) => acc + c.quantity, 0);

  return (
    <div className="min-h-screen">
      <Navbar
        selectedOutlet={selectedOutlet}
        onSelectOutlet={handleSelectOutlet}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main>
        <Hero />
        <Marquee />
        <Menu onAddToCart={handleAddToCart} />
        <Divider />
        <PopularStrip />
        <Builder onAddToCart={handleAddToCart} />
        <Divider flip />
        <Snacks onAddSnack={handleAddSnack} />
        <Merch onAddMerch={handleAddMerch} />
        <FindUs selectedOutlet={selectedOutlet} onSelectOutlet={handleSelectOutlet} />
        <InstagramWall />
      </main>

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        selectedOutlet={selectedOutlet}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      {/* Customer Live Order Tracking Modal */}
      <OrderTrackModal
        order={trackingOrder}
        onClose={() => setTrackingOrder(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerStorefront />} />
        <Route path="/kds" element={<KDSPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
