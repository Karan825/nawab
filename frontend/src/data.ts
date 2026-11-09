export interface Outlet {
  id: string;
  name: string;
  type: 'PHYSICAL_DINEIN' | 'CLOUD_KITCHEN';
  address: string;
  area: string;
  city: string;
  deliveryRadiusKm: number;
  isOpen: boolean;
  minPrepTimeMinutes: number;
  fssaiLicense: string;
  openingHours: string;
}

export const OUTLETS: Outlet[] = [
  {
    id: 'out-kondapur',
    name: 'Kondapur Flagship Dine-In',
    type: 'PHYSICAL_DINEIN',
    address: 'Plot 42, Main Road, Near Botanical Gardens, Kondapur',
    area: 'Kondapur',
    city: 'Hyderabad',
    deliveryRadiusKm: 6.5,
    isOpen: true,
    minPrepTimeMinutes: 20,
    fssaiLicense: 'FSSAI-DEMO-23619028374901',
    openingHours: '11:00 AM – 11:30 PM',
  },
  {
    id: 'out-gachibowli',
    name: 'Gachibowli Cloud Kitchen',
    type: 'CLOUD_KITCHEN',
    address: 'DLF Cyber City lane, Gachibowli',
    area: 'Gachibowli',
    city: 'Hyderabad',
    deliveryRadiusKm: 7.0,
    isOpen: true,
    minPrepTimeMinutes: 15,
    fssaiLicense: 'FSSAI-DEMO-23619028374902',
    openingHours: '11:00 AM – 01:00 AM (Late Night)',
  },
  {
    id: 'out-kukatpally',
    name: 'Kukatpally Express Kitchen',
    type: 'PHYSICAL_DINEIN',
    address: 'KPHB Phase 3, Near Remedy Hospital, Kukatpally',
    area: 'Kukatpally',
    city: 'Hyderabad',
    deliveryRadiusKm: 5.5,
    isOpen: true,
    minPrepTimeMinutes: 25,
    fssaiLicense: 'FSSAI-DEMO-23619028374903',
    openingHours: '11:30 AM – 11:00 PM',
  },
];

export interface PortionOption {
  id: string;
  name: string;
  priceModifier: number;
  serves: string;
}

export interface AddonOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  ingredients: string[];
  price: number; // inclusive 5% GST
  category: 'Biryani' | 'Starters & Kebabs' | 'Desserts' | 'Chai & Drinks';
  photo: string;
  colors: { top: string; bottom: string; foam: string };
  badge?: string;
  dietary: 'VEG' | 'NON_VEG';
  spiceLevel: 'MILD' | 'MEDIUM' | 'SPICY' | 'EXTRA_SPICY';
  allergens: string[];
  portions: PortionOption[];
  addons: AddonOption[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'chk-dum-biryani',
    name: 'Hyderabadi Chicken Dum Biryani',
    tagline: 'Slow-cooked in sealed handis with aged basmati & saffron',
    description:
      'Authentic Kachhi Dum style biryani with succulent bone-in chicken marinated in freshly ground Nizami spices, caramelized onions, and pure desi ghee.',
    ingredients: ['Aged Basmati', 'Farm Chicken', 'Kashmiri Saffron', 'Desi Ghee', 'Mint & Fried Onions'],
    price: 380,
    category: 'Biryani',
    photo:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#FFC96B', bottom: '#D96E14', foam: '#FFF4E2' },
    badge: 'Nawaab Legend',
    dietary: 'NON_VEG',
    spiceLevel: 'MEDIUM',
    allergens: ['Dairy (Ghee/Curd)'],
    portions: [
      { id: 'p-reg', name: 'Regular Handi', priceModifier: 0, serves: '1 person' },
      { id: 'p-fam', name: 'Family Pack (Serves 3-4)', priceModifier: 420, serves: '3–4 persons' },
      { id: 'p-jum', name: 'Jumbo Handi (Serves 6-8)', priceModifier: 850, serves: '6–8 persons' },
    ],
    addons: [
      { id: 'a-salan', name: 'Extra Mirchi Ka Salan', price: 60 },
      { id: 'a-raita', name: 'Double Dahi Raita', price: 40 },
      { id: 'a-egg', name: 'Extra Boiled Eggs (2 pcs)', price: 40 },
      { id: 'a-masala', name: 'Double Masala Layer', price: 50 },
    ],
  },
  {
    id: 'mut-dum-biryani',
    name: 'Royal Nizami Mutton Dum Biryani',
    tagline: 'Tender baby goat cuts layered with fragrant saffron rice',
    description:
      'The jewel of Hyderabad. Tender goat meat slow-dummed for 4 hours with shahi garam masala, brown onions, fresh mint, and pure ghee.',
    ingredients: ['Prime Goat Mutton', 'Aged Basmati', 'Shahi Garam Masala', 'Pure Ghee', 'Saffron Milk'],
    price: 490,
    category: 'Biryani',
    photo:
      'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#E8636A', bottom: '#A61B22', foam: '#FFE9E6' },
    badge: 'Royal Choice',
    dietary: 'NON_VEG',
    spiceLevel: 'SPICY',
    allergens: ['Dairy (Ghee)'],
    portions: [
      { id: 'p-reg', name: 'Regular Handi', priceModifier: 0, serves: '1 person' },
      { id: 'p-fam', name: 'Family Pack (Serves 3-4)', priceModifier: 490, serves: '3–4 persons' },
    ],
    addons: [
      { id: 'a-salan', name: 'Extra Mirchi Ka Salan', price: 60 },
      { id: 'a-raita', name: 'Double Dahi Raita', price: 40 },
    ],
  },
  {
    id: 'subz-dum-biryani',
    name: 'Nawabi Subz Dum Biryani',
    tagline: 'Farm-fresh garden vegetables & malai paneer in saffron rice',
    description:
      'Layered with spiced cauliflower, carrots, beans, malai paneer, and golden fried onions. Served with rich burani raita.',
    ingredients: ['Malai Paneer', 'Fresh Veggies', 'Aged Basmati', 'Golden Fried Onions', 'Cashew Paste'],
    price: 290,
    category: 'Biryani',
    photo:
      'https://images.unsplash.com/photo-1642821373181-696a54913e9a?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#A8E6A3', bottom: '#3BA55D', foam: '#F0FFF0' },
    badge: 'Pure Veg',
    dietary: 'VEG',
    spiceLevel: 'MILD',
    allergens: ['Dairy (Paneer/Ghee)', 'Nuts (Cashews)'],
    portions: [
      { id: 'p-reg', name: 'Regular Handi', priceModifier: 0, serves: '1 person' },
      { id: 'p-fam', name: 'Family Pack (Serves 3-4)', priceModifier: 320, serves: '3–4 persons' },
    ],
    addons: [
      { id: 'a-raita', name: 'Double Burani Raita', price: 40 },
      { id: 'a-paneer', name: 'Extra Tawa Paneer Toss', price: 70 },
    ],
  },
  {
    id: 'shahi-mutton-haleem',
    name: 'Shahi Mutton Haleem',
    tagline: '12-hour slow cooked shredded goat, broken wheat & pure ghee',
    description:
      'Rich, velvety stew infused with royal spices, pure ghee, fried onions, and roasted cashews. A Hyderabadi culinary heritage dish.',
    ingredients: ['Shredded Goat Meat', 'Broken Wheat', 'Lentils', 'Asli Ghee', 'Fried Cashews & Brown Onions'],
    price: 350,
    category: 'Starters & Kebabs',
    photo:
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#C9A47E', bottom: '#6B4226', foam: '#FFF7EC' },
    badge: '12-Hr Slow Cooked',
    dietary: 'NON_VEG',
    spiceLevel: 'MEDIUM',
    allergens: ['Gluten (Wheat)', 'Dairy (Ghee)', 'Nuts'],
    portions: [
      { id: 'p-hal-reg', name: 'Regular Bowl (350ml)', priceModifier: 0, serves: '1 person' },
      { id: 'p-hal-fam', name: 'Family Bowl (1000ml)', priceModifier: 380, serves: '3–4 persons' },
    ],
    addons: [
      { id: 'a-cashew', name: 'Extra Roasted Cashews & Fried Onions', price: 50 },
      { id: 'a-ghee', name: 'Extra Hot Desi Ghee Tadka', price: 40 },
    ],
  },
  {
    id: 'chicken-65',
    name: 'Authentic Hyderabad Chicken 65',
    tagline: 'Crispy, fiery fried chicken tossed with curry leaves & green chilies',
    description:
      'The iconic south-Indian bar appetizer. Boneless chicken cubes marinated in crushed red chilies, garlic, curry leaves, and lemon juice.',
    ingredients: ['Boneless Chicken', 'Fresh Curry Leaves', 'Guntur Red Chilies', 'Garlic Ginger Marinade'],
    price: 310,
    category: 'Starters & Kebabs',
    photo:
      'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#E8333A', bottom: '#8A151A', foam: '#FFE9E6' },
    badge: 'Fiery & Crispy',
    dietary: 'NON_VEG',
    spiceLevel: 'EXTRA_SPICY',
    allergens: ['Eggs'],
    portions: [
      { id: 'p-65-reg', name: 'Standard Plate (8 pcs)', priceModifier: 0, serves: '1–2 persons' },
      { id: 'p-65-lar', name: 'Jumbo Platter (16 pcs)', priceModifier: 240, serves: '3–4 persons' },
    ],
    addons: [{ id: 'a-dip', name: 'Garlic Yogurt Dip', price: 30 }],
  },
  {
    id: 'pathar-ka-gosht',
    name: 'Barkas Pathar Ka Gosht',
    tagline: 'Tender mutton steaks seared on natural granite stone slabs',
    description:
      'Traditional Hyderabadi delicacy seared on heated river stone slabs with allspice, raw papaya, and black pepper.',
    ingredients: ['Mutton Fillets', 'Raw Papaya Marinade', 'River Stone Seared', 'Allspice Powder'],
    price: 420,
    category: 'Starters & Kebabs',
    photo:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#8A5D4A', bottom: '#4A2A1A', foam: '#FFF4E2' },
    badge: 'Stone Seared',
    dietary: 'NON_VEG',
    spiceLevel: 'MEDIUM',
    allergens: ['Dairy'],
    portions: [
      { id: 'p-pk-reg', name: 'Portion (6 tender pieces)', priceModifier: 0, serves: '1–2 persons' },
    ],
    addons: [],
  },
  {
    id: 'paneer-tikka',
    name: 'Banjara Malai Paneer Tikka',
    tagline: 'Smoky tandoori paneer cubes bathed in hung curd & saffron marinade',
    description:
      'Charred in clay tandoors with bell peppers and Spanish onions, basted with carom seeds and butter.',
    ingredients: ['Fresh Malai Paneer', 'Hung Curd', 'Bell Peppers', 'Carom Seeds & Ghee'],
    price: 280,
    category: 'Starters & Kebabs',
    photo:
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#FFC96B', bottom: '#D97E14', foam: '#FFF4E2' },
    dietary: 'VEG',
    spiceLevel: 'MILD',
    allergens: ['Dairy (Paneer/Curd)'],
    portions: [
      { id: 'p-pt-reg', name: 'Platter (6 large cubes)', priceModifier: 0, serves: '1–2 persons' },
    ],
    addons: [{ id: 'a-mint', name: 'Extra Mint Chutney', price: 20 }],
  },
  {
    id: 'double-ka-meetha',
    name: 'Shahi Double Ka Meetha',
    tagline: 'Crispy fried bread soaked in saffron-cardamom rabri & dry fruits',
    description:
      'The definitive Hyderabadi wedding dessert. Golden bread soaked in concentrated saffron milk, garnished with silver vark, pistachios, and almonds.',
    ingredients: ['Golden Fried Bread', 'Cardamom Rabri', 'Kashmiri Saffron', 'Roasted Almonds & Pistachios'],
    price: 160,
    category: 'Desserts',
    photo:
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#FFB98A', bottom: '#E26D2B', foam: '#FFF4E2' },
    badge: 'Wedding Classic',
    dietary: 'VEG',
    spiceLevel: 'MILD',
    allergens: ['Gluten (Bread)', 'Dairy (Milk/Ghee)', 'Nuts'],
    portions: [
      { id: 'p-dm-reg', name: 'Single Bowl (2 slices)', priceModifier: 0, serves: '1 person' },
      { id: 'p-dm-fam', name: 'Family Tub (6 slices)', priceModifier: 240, serves: '3–4 persons' },
    ],
    addons: [{ id: 'a-rabri', name: 'Extra Thick Khoya Rabri', price: 50 }],
  },
  {
    id: 'qubani-ka-meetha',
    name: 'Old City Qubani Ka Meetha',
    tagline: 'Sun-dried Turkish apricots stewed to perfection with fresh malai',
    description:
      'Velvety apricot compote cooked slowly with cracked apricot kernels and served with fresh clotted malai.',
    ingredients: ['Turkish Dried Apricots', 'Apricot Kernels', 'Sugar Syrup', 'Fresh Clotted Malai'],
    price: 190,
    category: 'Desserts',
    photo:
      'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#F48C42', bottom: '#9E4A10', foam: '#FFF7EC' },
    badge: 'Nizami Heirloom',
    dietary: 'VEG',
    spiceLevel: 'MILD',
    allergens: ['Dairy (Malai)', 'Nuts (Kernels)'],
    portions: [
      { id: 'p-qb-reg', name: 'Single Bowl', priceModifier: 0, serves: '1 person' },
    ],
    addons: [{ id: 'a-cream', name: 'Extra Clotted Malai', price: 40 }],
  },
  {
    id: 'irani-chai-flask',
    name: 'Dum Ki Irani Chai Flask',
    tagline: 'Thick, creamy Irani tea brewed with 4-hour reduced buffalo milk',
    description:
      'The lifeblood of Hyderabad cafes. Piping hot, sweet, and aromatic. Delivered in an insulated spill-proof flask.',
    ingredients: ['Special Assam Tea Leaves', 'Condensed Buffalo Milk', 'Green Cardamom', 'Sugar'],
    price: 120,
    category: 'Chai & Drinks',
    photo:
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#D9A066', bottom: '#7D471D', foam: '#FFF6E9' },
    dietary: 'VEG',
    spiceLevel: 'MILD',
    allergens: ['Dairy (Milk)'],
    portions: [
      { id: 'p-ic-flask', name: 'Insulated Flask (Serves 3-4 cups)', priceModifier: 0, serves: '3–4 cups' },
    ],
    addons: [{ id: 'a-biscuit', name: 'Osmania Biscuits (4 pcs)', price: 40 }],
  },
];

export const CATEGORIES = ['All', 'Biryani', 'Starters & Kebabs', 'Desserts', 'Chai & Drinks'] as const;
export type Category = (typeof CATEGORIES)[number];

export interface Snack {
  id: string;
  name: string;
  description: string;
  price: number;
  photo: string;
  emoji: string;
}

export const SNACKS: Snack[] = [
  {
    id: 'snack-samosa',
    name: 'Hyderabadi Luqmi (Mutton)',
    description: 'Crispy square pastry parcels stuffed with spiced minced mutton & mint.',
    price: 180,
    photo: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
    emoji: '🥟',
  },
  {
    id: 'snack-mirchi-bajji',
    name: 'Hyderabad Cut Mirchi Bajji',
    description: 'Bhavnagri green chilies stuffed with tangy ajwain-tamarind paste, double fried.',
    price: 120,
    photo: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
    emoji: '🌶️',
  },
  {
    id: 'snack-osmania',
    name: 'Osmania Biscuits Tin (12 pcs)',
    description: 'Sweet and mildly salted legendary biscuits baked fresh in Old City ovens.',
    price: 140,
    photo: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=80',
    emoji: '🍪',
  },
];

export interface MerchItem {
  id: string;
  name: string;
  description: string;
  price: number;
  photo: string;
}

export const MERCH: MerchItem[] = [
  {
    id: 'merch-ghee-tin',
    name: 'Pure Buffalo Desi Ghee (500g)',
    description: 'Aromatic, golden clarified butter churned from high-fat buffalo milk. The secret to our dum biryani.',
    price: 450,
    photo: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'merch-handi-pot',
    name: 'Nawaab Glazed Clay Handi',
    description: 'Traditional earthen cooking handi pre-seasoned for authentic home dum cooking.',
    price: 350,
    photo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'merch-chai-tumbler',
    name: 'Charminar Brass Chai Glass Set',
    description: 'Traditional heavy brass tea tumblers for that authentic Irani cafe feel at home.',
    price: 520,
    photo: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80',
  },
];

export interface InstagramPost {
  id: string;
  photo: string;
  caption: string;
  likes: number;
}

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'ig1',
    photo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80',
    caption: 'Sealed with dough, cooked with patience. Dum biryani perfection 🔥',
    likes: 3412,
  },
  {
    id: 'ig2',
    photo: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=80',
    caption: '12-hour slow simmered Shahi Mutton Haleem drizzled with pure ghee ✨',
    likes: 4210,
  },
  {
    id: 'ig3',
    photo: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=900&q=80',
    caption: 'Crispy, tangy, fiery Chicken 65 straight from the kadai 🍗',
    likes: 2890,
  },
  {
    id: 'ig4',
    photo: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
    caption: 'Double Ka Meetha topped with thick khoya rabri and silver vark 🍯',
    likes: 5120,
  },
  {
    id: 'ig5',
    photo: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=900&q=80',
    caption: 'Fragrant long-grain aged basmati layered with tender Nizami mutton 👑',
    likes: 3950,
  },
  {
    id: 'ig6',
    photo: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80',
    caption: 'Evening Irani chai with buttery Osmania biscuits in Hyderabad ☕',
    likes: 6710,
  },
];

export const HERO_PHOTO =
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80';
export const STORE_PHOTO =
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80';

export const MARQUEE_FLAVORS = [
  'Hyderabadi Chicken Dum Biryani',
  'Royal Mutton Haleem',
  'Shahi Double Ka Meetha',
  'Authentic Chicken 65',
  'Pathar Ka Gosht',
  'Desi Ghee & Saffron',
  'Old City Qubani Ka Meetha',
  'Dum Ki Irani Chai',
  '17 Hyderabad Outlets',
  'Prices Include 5% GST',
];

export const HOURS = [
  { days: 'Monday – Thursday', time: '11:00 AM – 11:30 PM' },
  { days: 'Friday – Saturday', time: '11:00 AM – 01:00 AM (Late Night)' },
  { days: 'Sunday', time: '11:00 AM – 11:30 PM' },
];

export interface CartItem {
  id: string;
  item: MenuItem;
  portion: PortionOption;
  addons: AddonOption[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'HANDED_TO_RIDER';

export interface OrderItemSnapshot {
  id: string;
  itemName: string;
  portionName: string;
  addonDetails: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  outletId: string;
  outletName: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItemSnapshot[];
  itemTotal: number;
  gstAmount: number; // inclusive: total * 5 / 105
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'CARD';
  paymentStatus: 'SUCCESS';
  status: OrderStatus;
  placedAt: string;
  promisedReadyTime: string;
  estimatedPrepMinutes: number;
  isLate: boolean;
  lateMinutes?: number;
}

// Assignment seed sample orders:
// 1. WEB-778120, Kondapur, Chicken dum biryani family pack x1, Double ka meetha x2, ₹1,180, UPI, Preparing
// 2. WEB-778131, Gachibowli Cloud Kitchen, Veg biryani x2, Mirchi ka salan x1, ₹640, Card, Ready for pickup
// 3. WEB-778146, Kukatpally, Mutton haleem x3, ₹1,050, UPI, Late by 4 minutes!
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-778120',
    orderNumber: 'WEB-778120',
    outletId: 'out-kondapur',
    outletName: 'Kondapur Flagship Dine-In',
    customerName: 'Karan Sharma',
    customerPhone: '+91 98765 43210',
    deliveryAddress: 'Flat 402, Aditya Sunshine, Kondapur, Hyderabad',
    items: [
      {
        id: 'li-1',
        itemName: 'Hyderabadi Chicken Dum Biryani',
        portionName: 'Family Pack (Serves 3-4)',
        addonDetails: 'None',
        unitPrice: 800,
        quantity: 1,
        totalPrice: 800,
      },
      {
        id: 'li-2',
        itemName: 'Shahi Double Ka Meetha',
        portionName: 'Single Bowl (2 slices)',
        addonDetails: 'None',
        unitPrice: 160,
        quantity: 2,
        totalPrice: 320,
      },
    ],
    itemTotal: 1120,
    gstAmount: 53.33,
    deliveryFee: 60,
    totalAmount: 1180,
    paymentMethod: 'UPI',
    paymentStatus: 'SUCCESS',
    status: 'PREPARING',
    placedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    promisedReadyTime: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    estimatedPrepMinutes: 45,
    isLate: false,
  },
  {
    id: 'ord-778131',
    orderNumber: 'WEB-778131',
    outletId: 'out-gachibowli',
    outletName: 'Gachibowli Cloud Kitchen',
    customerName: 'Ananya Reddy',
    customerPhone: '+91 98123 45678',
    deliveryAddress: 'Tower 4, My Home Bhooja, Hitec City, Hyderabad',
    items: [
      {
        id: 'li-3',
        itemName: 'Nawabi Subz Dum Biryani',
        portionName: 'Regular Handi',
        addonDetails: 'None',
        unitPrice: 290,
        quantity: 2,
        totalPrice: 580,
      },
      {
        id: 'li-4',
        itemName: 'Extra Mirchi Ka Salan',
        portionName: 'Standard (250ml)',
        addonDetails: 'None',
        unitPrice: 60,
        quantity: 1,
        totalPrice: 60,
      },
    ],
    itemTotal: 640,
    gstAmount: 30.48,
    deliveryFee: 0,
    totalAmount: 640,
    paymentMethod: 'CARD',
    paymentStatus: 'SUCCESS',
    status: 'READY',
    placedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    promisedReadyTime: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    estimatedPrepMinutes: 40,
    isLate: false,
  },
  {
    id: 'ord-778146',
    orderNumber: 'WEB-778146',
    outletId: 'out-kukatpally',
    outletName: 'Kukatpally Express Kitchen',
    customerName: 'Syed Faheem',
    customerPhone: '+91 99887 76655',
    deliveryAddress: 'House 14/B, KPHB Phase 1, Kukatpally, Hyderabad',
    items: [
      {
        id: 'li-5',
        itemName: 'Shahi Mutton Haleem',
        portionName: 'Regular Bowl (350ml)',
        addonDetails: 'None',
        unitPrice: 350,
        quantity: 3,
        totalPrice: 1050,
      },
    ],
    itemTotal: 1050,
    gstAmount: 50.0,
    deliveryFee: 0,
    totalAmount: 1050,
    paymentMethod: 'UPI',
    paymentStatus: 'SUCCESS',
    status: 'PREPARING',
    placedAt: new Date(Date.now() - 44 * 60 * 1000).toISOString(),
    promisedReadyTime: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    estimatedPrepMinutes: 40,
    isLate: true,
    lateMinutes: 4,
  },
];
