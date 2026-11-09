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
  description?: string;
  ingredients: string[];
  price: number;
  category: 'Biryani' | 'Starters' | 'Desserts' | 'Chai';
  photo: string;
  colors: { top: string; bottom: string; foam: string };
  badge?: string;
  dietary: 'VEG' | 'NON_VEG';
  spiceLevel: 'MILD' | 'MEDIUM' | 'SPICY' | 'EXTRA_SPICY';
  allergens: string[];
  portions: PortionOption[];
  addons: AddonOption[];
}

export type Drink = MenuItem;

export interface CartItem {
  id: string;
  item: MenuItem;
  portion: PortionOption;
  addons: AddonOption[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export const DRINKS: MenuItem[] = [
  {
    id: 'chk-dum-biryani',
    name: 'Royal Chicken Dum Biryani',
    tagline: 'The one that started it all in 1978',
    description: 'Authentic Kachhi Dum style biryani with succulent chicken marinated in Nizami spices, aged basmati, and pure desi ghee.',
    ingredients: ['Aged Basmati', 'Farm Chicken', 'Pure Desi Ghee', 'Kashmiri Saffron'],
    price: 380,
    category: 'Biryani',
    photo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#FFC96B', bottom: '#D96E14', foam: '#FFF4E2' },
    badge: 'Fan fave',
    dietary: 'NON_VEG',
    spiceLevel: 'MEDIUM',
    allergens: ['Dairy (Ghee/Curd)'],
    portions: [
      { id: 'p-reg', name: 'Regular Handi', priceModifier: 0, serves: '1 person' },
      { id: 'p-fam', name: 'Family Pack (Serves 3-4)', priceModifier: 420, serves: '3–4 persons' },
      { id: 'p-jum', name: 'Jumbo Royal (Serves 6-8)', priceModifier: 850, serves: '6–8 persons' },
    ],
    addons: [
      { id: 'a-salan', name: 'Extra Mirchi Ka Salan', price: 60 },
      { id: 'a-raita', name: 'Double Garlic Raita', price: 40 },
      { id: 'a-egg', name: 'Fried Eggs (2 pcs)', price: 40 },
    ],
  },
  {
    id: 'mutton-dum-biryani',
    name: 'Nizami Mutton Dum Biryani',
    tagline: 'Tender baby goat slow-dummed for 4 hours',
    description: 'The royal crown of Hyderabad. Tender goat cuts dum-cooked with shahi garam masala, brown onions, and pure saffron.',
    ingredients: ['Prime Mutton', 'Shahi Garam Masala', 'Brown Onions', 'Saffron Milk'],
    price: 490,
    category: 'Biryani',
    photo: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#E8636A', bottom: '#A61B22', foam: '#FFE9E6' },
    badge: 'Most lovable',
    dietary: 'NON_VEG',
    spiceLevel: 'MEDIUM',
    allergens: ['Dairy (Ghee)'],
    portions: [
      { id: 'p-reg', name: 'Regular Handi', priceModifier: 0, serves: '1 person' },
      { id: 'p-fam', name: 'Family Pack (Serves 3-4)', priceModifier: 510, serves: '3–4 persons' },
      { id: 'p-jum', name: 'Jumbo Royal (Serves 6-8)', priceModifier: 990, serves: '6–8 persons' },
    ],
    addons: [
      { id: 'a-salan', name: 'Extra Mirchi Ka Salan', price: 60 },
      { id: 'a-raita', name: 'Double Garlic Raita', price: 40 },
      { id: 'a-boti', name: 'Extra Boti Gravy', price: 80 },
    ],
  },
  {
    id: 'veg-dum-biryani',
    name: 'Nawabi Subz Dum Biryani',
    tagline: 'Farm-fresh veggies & malai paneer',
    description: 'Fresh seasonal vegetables and tender malai paneer layered with fragrant aged rice and freshly ground aromatic spices.',
    ingredients: ['Malai Paneer', 'Carrots & Beans', 'Fried Onions', 'Kaju Paste'],
    price: 290,
    category: 'Biryani',
    photo: 'https://images.unsplash.com/photo-1642821373181-696a54913e9a?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#A8E6A3', bottom: '#3BA55D', foam: '#F0FFF0' },
    dietary: 'VEG',
    spiceLevel: 'MILD',
    allergens: ['Dairy (Paneer/Ghee)', 'Nuts (Cashew)'],
    portions: [
      { id: 'p-reg', name: 'Regular Handi', priceModifier: 0, serves: '1 person' },
      { id: 'p-fam', name: 'Family Pack', priceModifier: 350, serves: '3–4 persons' },
    ],
    addons: [
      { id: 'a-salan', name: 'Extra Mirchi Ka Salan', price: 60 },
      { id: 'a-raita', name: 'Double Garlic Raita', price: 40 },
      { id: 'a-paneer', name: 'Extra Paneer Cubes (4 pcs)', price: 70 },
    ],
  },
  {
    id: 'chicken-65',
    name: 'Authentic Chicken 65',
    tagline: 'Crispy, fiery, tossed in fresh curry leaves',
    description: 'Legendary Hyderabad starter: crispy boneless chicken chunks tossed in chili garlic sauce, curd, and crackling curry leaves.',
    ingredients: ['Boneless Chicken', 'Curry Leaves', 'Guntur Chilies', 'Garlic Dip'],
    price: 310,
    category: 'Starters',
    photo: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#E8333A', bottom: '#8A151A', foam: '#FFE9E6' },
    badge: 'New!',
    dietary: 'NON_VEG',
    spiceLevel: 'EXTRA_SPICY',
    allergens: [],
    portions: [
      { id: 'p-plate', name: 'Standard Plate (8 pcs)', priceModifier: 0, serves: '1–2 persons' },
      { id: 'p-platter', name: 'Party Platter (16 pcs)', priceModifier: 280, serves: '3–4 persons' },
    ],
    addons: [{ id: 'a-dip', name: 'Mint Chutney & Mayo Dip', price: 30 }],
  },
  {
    id: 'mutton-haleem',
    name: 'Shahi Mutton Haleem',
    tagline: '12-hour slow cooked royal festival stew',
    description: 'Nizami delicacy of shredded goat meat, pounded wheat, and lentils slow-cooked overnight with pure ghee and cashews.',
    ingredients: ['Shredded Mutton', 'Broken Wheat', 'Desi Ghee', 'Fried Cashews'],
    price: 350,
    category: 'Starters',
    photo: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#C9A47E', bottom: '#6B4226', foam: '#FFF7EC' },
    dietary: 'NON_VEG',
    spiceLevel: 'MEDIUM',
    allergens: ['Gluten (Wheat)', 'Dairy (Ghee)', 'Nuts (Cashew)'],
    portions: [
      { id: 'p-bowl', name: 'Regular Bowl (350ml)', priceModifier: 0, serves: '1 person' },
      { id: 'p-pot', name: 'Family Handi (750ml)', priceModifier: 320, serves: '2–3 persons' },
    ],
    addons: [
      { id: 'a-ghee', name: 'Extra Desi Ghee Drizzle', price: 30 },
      { id: 'a-kaju', name: 'Roasted Cashews & Lemon', price: 40 },
    ],
  },
  {
    id: 'pathar-ka-gosht',
    name: 'Barkas Pathar Ka Gosht',
    tagline: 'Seared on natural heated river stone slabs',
    description: 'Finely sliced lamb fillets marinated in raw papaya and exotic spices, seared over heated granite stone slabs.',
    ingredients: ['Mutton Fillets', 'Raw Papaya', 'Allspice', 'Black Pepper'],
    price: 420,
    category: 'Starters',
    photo: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#8A5D4A', bottom: '#4A2A1A', foam: '#FFF4E2' },
    dietary: 'NON_VEG',
    spiceLevel: 'SPICY',
    allergens: [],
    portions: [{ id: 'p-std', name: 'Standard Portion (6 strips)', priceModifier: 0, serves: '1–2 persons' }],
    addons: [{ id: 'a-chilli', name: 'Charred Green Chilies & Onions', price: 20 }],
  },
  {
    id: 'paneer-tikka',
    name: 'Banjara Malai Paneer Tikka',
    tagline: 'Clay tandoor charred with hung curd & saffron',
    description: 'Juicy cottage cheese cubes marinated in hung curd, fresh cream, saffron, and carom seeds, skewered in clay tandoor.',
    ingredients: ['Malai Paneer', 'Hung Curd', 'Bell Peppers', 'Carom Seeds'],
    price: 280,
    category: 'Starters',
    photo: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#FFC96B', bottom: '#D97E14', foam: '#FFF4E2' },
    dietary: 'VEG',
    spiceLevel: 'MILD',
    allergens: ['Dairy (Paneer/Curd)'],
    portions: [{ id: 'p-std', name: 'Standard Skewer (6 pcs)', priceModifier: 0, serves: '1–2 persons' }],
    addons: [{ id: 'a-dip', name: 'Mint Yogurt Dip', price: 25 }],
  },
  {
    id: 'double-ka-meetha',
    name: 'Shahi Double Ka Meetha',
    tagline: 'Crispy fried bread in cardamom rabri & pistachios',
    description: 'Deep-fried golden bread slices soaked in saffron milk and rich condensed khoya rabri, topped with silver vark and almonds.',
    ingredients: ['Fried Bread', 'Saffron Milk', 'Khoya Rabri', 'Silver Vark'],
    price: 160,
    category: 'Desserts',
    photo: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#FFB98A', bottom: '#E26D2B', foam: '#FFF4E2' },
    badge: 'Limited',
    dietary: 'VEG',
    spiceLevel: 'MILD',
    allergens: ['Dairy (Milk/Khoya)', 'Gluten (Bread)', 'Nuts'],
    portions: [{ id: 'p-std', name: 'Single Bowl (2 slices)', priceModifier: 0, serves: '1 person' }],
    addons: [{ id: 'a-rabri', name: 'Extra Khoya Rabri Scoop', price: 40 }],
  },
  {
    id: 'qubani-ka-meetha',
    name: 'Old City Qubani Ka Meetha',
    tagline: 'Turkish stewed apricots with clotted malai',
    description: 'Slow stewed dried apricots from Hunza Valley cooked in natural syrup, served with apricot kernels and fresh clotted malai.',
    ingredients: ['Dried Apricots', 'Apricot Kernels', 'Sugar Syrup', 'Clotted Malai'],
    price: 190,
    category: 'Desserts',
    photo: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#F48C42', bottom: '#9E4A10', foam: '#FFF7EC' },
    dietary: 'VEG',
    spiceLevel: 'MILD',
    allergens: ['Dairy (Malai)', 'Tree Nuts (Apricot Kernels)'],
    portions: [{ id: 'p-std', name: 'Standard Cup', priceModifier: 0, serves: '1 person' }],
    addons: [{ id: 'a-cream', name: 'Double Clotted Malai', price: 35 }],
  },
  {
    id: 'irani-chai',
    name: 'Dum Ki Irani Chai Flask',
    tagline: 'Reduced buffalo milk tea with Osmania biscuits',
    description: 'Slow simmered Assam decoction poured over rich reduced milk, served with 4 handmade Osmania biscuits.',
    ingredients: ['Assam Tea', 'Condensed Milk', 'Green Cardamom', 'Osmania Biscuits'],
    price: 120,
    category: 'Chai',
    photo: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#D9A066', bottom: '#7D471D', foam: '#FFF6E9' },
    dietary: 'VEG',
    spiceLevel: 'MILD',
    allergens: ['Dairy (Milk)', 'Gluten (Biscuits)'],
    portions: [{ id: 'p-flask', name: 'Flask (Serves 2-3)', priceModifier: 0, serves: '2–3 cups' }],
    addons: [{ id: 'a-biscuits', name: 'Extra Osmania Biscuits (Pack of 6)', price: 40 }],
  },
];

export const MENU_ITEMS = DRINKS;

export const CATEGORIES = ['All', 'Biryani', 'Starters', 'Desserts', 'Chai'] as const;
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
    id: 'shahi-luqmi',
    name: 'Hyderabadi Mutton Luqmi',
    description: 'Crisp square pastry parcels stuffed with spiced minced mutton, mint & coriander.',
    price: 180,
    photo: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
    emoji: '🥟',
  },
  {
    id: 'cut-mirchi',
    name: 'Hyderabad Cut Mirchi Bajji',
    description: 'Bhavnagri green chilies stuffed with tangy ajwain-tamarind, double fried crispy.',
    price: 120,
    photo: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
    emoji: '🌶️',
  },
  {
    id: 'osmania-tin',
    name: 'Osmania Biscuits Tin',
    description: 'Legendary sweet and salted biscuits baked fresh daily in traditional ovens.',
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
    id: 'desi-ghee-jar',
    name: 'Pure Buffalo Desi Ghee (500g)',
    description: 'Aromatic, golden clarified butter churned from high-fat buffalo milk.',
    price: 450,
    photo: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'clay-handi-pot',
    name: 'Glazed Clay Cooking Handi',
    description: 'Seasoned earthen pot for authentic slow dum cooking at home.',
    price: 350,
    photo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'brass-chai-set',
    name: 'Charminar Brass Chai Tumblers',
    description: 'Heavy brass double-walled tea glasses for that authentic Irani cafe feel.',
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
    caption: 'Sealed with dough, slow cooked with patience 🔥 #DumHappens',
    likes: 3412,
  },
  {
    id: 'ig2',
    photo: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=80',
    caption: '12-hour slow simmered Shahi Mutton Haleem with pure ghee ✨',
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
    caption: 'Double Ka Meetha soaked in rich saffron rabri 🍯',
    likes: 5120,
  },
  {
    id: 'ig5',
    photo: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=900&q=80',
    caption: 'Aged basmati layered with tender Nizami mutton 👑',
    likes: 3950,
  },
  {
    id: 'ig6',
    photo: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80',
    caption: 'Evening Irani chai with Osmania biscuits in Hyderabad ☕',
    likes: 6710,
  },
];

export const HERO_PHOTO =
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80';
export const STORE_PHOTO =
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80';

export const MARQUEE_FLAVORS = [
  'Royal Chicken Dum Biryani',
  'Shahi Mutton Haleem',
  'Double Ka Meetha',
  'Mirchi Ka Salan',
  'Authentic Chicken 65',
  'Barkas Pathar Ka Gosht',
  'Pure Desi Ghee',
  'Dum Ki Irani Chai',
];

export const HOURS = [
  { days: 'Monday – Thursday', time: '11:00 AM – 11:30 PM' },
  { days: 'Friday – Saturday', time: '11:00 AM – 01:00 AM' },
  { days: 'Sunday', time: '11:00 AM – 11:30 PM' },
];

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
    address: 'DLF Cyber City Lane, Gachibowli',
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
  gstAmount: number;
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
        itemName: 'Chicken Dum Biryani',
        portionName: 'Family Pack (x1)',
        addonDetails: 'None',
        unitPrice: 800,
        quantity: 1,
        totalPrice: 800,
      },
      {
        id: 'li-2',
        itemName: 'Double Ka Meetha',
        portionName: 'Single Bowl (x2)',
        addonDetails: 'None',
        unitPrice: 190,
        quantity: 2,
        totalPrice: 380,
      },
    ],
    itemTotal: 1180,
    gstAmount: 56.19,
    deliveryFee: 0,
    totalAmount: 1180,
    paymentMethod: 'UPI',
    paymentStatus: 'SUCCESS',
    status: 'PREPARING',
    placedAt: '2026-11-09T20:14:00Z',
    promisedReadyTime: '2026-11-09T20:59:00Z',
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
        itemName: 'Veg Dum Biryani',
        portionName: 'Regular (x2)',
        addonDetails: 'None',
        unitPrice: 290,
        quantity: 2,
        totalPrice: 580,
      },
      {
        id: 'li-4',
        itemName: 'Mirchi Ka Salan',
        portionName: 'Standard (x1)',
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
    placedAt: '2026-11-09T20:21:00Z',
    promisedReadyTime: '2026-11-09T21:01:00Z',
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
        itemName: 'Mutton Haleem',
        portionName: 'Regular Pot (x3)',
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
    placedAt: '2026-11-09T20:26:00Z',
    promisedReadyTime: '2026-11-09T21:16:00Z',
    estimatedPrepMinutes: 40,
    isLate: true,
    lateMinutes: 4,
  },
];
