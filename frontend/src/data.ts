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
  price: number; // inclusive of 5% GST
  category: 'Biryani' | 'Starters' | 'Desserts' | 'Chai';
  photo: string;
  colors: { top: string; bottom: string; foam: string };
  badge?: string;
  dietary: 'VEG' | 'NON_VEG';
  spiceLevel: 'MILD' | 'MEDIUM' | 'SPICY' | 'EXTRA_SPICY';
  allergens: string[];
  portions: PortionOption[];
  addons: AddonOption[];
  isAvailable: boolean;
  rating?: number;
  ratingCount?: number;
  bestseller?: boolean;
  outletAvailability?: Record<string, { isAvailable: boolean; statusLabel?: string; priceOverride?: number }>;
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

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'chk-dum-biryani',
    name: 'Royal Chicken Dum Biryani',
    tagline: 'The one that started it all in 1978',
    description:
      'Authentic Kachhi Dum style biryani with succulent chicken marinated overnight in freshly ground Nizami spices, layered with aged basmati rice and pure desi ghee.',
    ingredients: ['Aged Basmati Rice', 'Farm Fresh Chicken', 'Pure Desi Ghee', 'Kashmiri Saffron', 'Fried Onions'],
    price: 380,
    category: 'Biryani',
    photo:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#FFC96B', bottom: '#D96E14', foam: '#FFF4E2' },
    badge: 'Fan fave',
    dietary: 'NON_VEG',
    spiceLevel: 'MEDIUM',
    allergens: ['Dairy (Ghee, Curd)'],
    isAvailable: true,
    rating: 4.9,
    ratingCount: 2340,
    bestseller: true,
    portions: [
      { id: 'p-reg', name: 'Regular Handi', priceModifier: 0, serves: '1 person' },
      { id: 'p-fam', name: 'Family Pack (Serves 3–4)', priceModifier: 420, serves: '3–4 persons' },
      { id: 'p-jum', name: 'Jumbo Royal Handi (Serves 6–8)', priceModifier: 850, serves: '6–8 persons' },
    ],
    addons: [
      { id: 'a-salan', name: 'Extra Mirchi Ka Salan (250ml)', price: 60 },
      { id: 'a-raita', name: 'Double Garlic Dahi Raita', price: 40 },
      { id: 'a-egg', name: 'Fried Boiled Eggs (2 pcs)', price: 40 },
      { id: 'a-ghee', name: 'Pure Desi Ghee Tadka', price: 40 },
    ],
  },
  {
    id: 'mutton-dum-biryani',
    name: 'Nizami Mutton Dum Biryani',
    tagline: 'Tender baby goat slow-dummed for 4 hours',
    description:
      'The crown jewel of Hyderabad cuisine. Tender baby goat cuts slow-dummed on coal fire with aged basmati, caramelized onions, and rich saffron milk.',
    ingredients: ['Prime Baby Goat Mutton', 'Aged Basmati Rice', 'Shahi Garam Masala', 'Pure Ghee', 'Saffron Milk'],
    price: 490,
    category: 'Biryani',
    photo:
      'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#E8636A', bottom: '#A61B22', foam: '#FFE9E6' },
    badge: 'Most lovable',
    dietary: 'NON_VEG',
    spiceLevel: 'MEDIUM',
    allergens: ['Dairy (Ghee)'],
    isAvailable: true,
    rating: 4.9,
    ratingCount: 1890,
    bestseller: true,
    portions: [
      { id: 'p-reg', name: 'Regular Handi', priceModifier: 0, serves: '1 person' },
      { id: 'p-fam', name: 'Family Pack (Serves 3–4)', priceModifier: 510, serves: '3–4 persons' },
      { id: 'p-jum', name: 'Jumbo Royal Handi (Serves 6–8)', priceModifier: 990, serves: '6–8 persons' },
    ],
    addons: [
      { id: 'a-salan', name: 'Extra Mirchi Ka Salan (250ml)', price: 60 },
      { id: 'a-raita', name: 'Double Garlic Dahi Raita', price: 40 },
      { id: 'a-boti', name: 'Extra Mutton Boti Gravy', price: 90 },
    ],
  },
  {
    id: 'veg-dum-biryani',
    name: 'Nawabi Subz Dum Biryani',
    tagline: 'Farm-fresh veggies & malai paneer',
    description:
      'Garden fresh vegetables, french beans, carrots, and succulent malai paneer cubes marinated in authentic spices and slow-dummed with saffron basmati.',
    ingredients: ['Malai Paneer', 'French Beans', 'Carrots & Peas', 'Brown Onions', 'Aged Basmati', 'Kaju Paste'],
    price: 290,
    category: 'Biryani',
    photo:
      'https://images.unsplash.com/photo-1642821373181-696a54913e9a?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#A8E6A3', bottom: '#3BA55D', foam: '#F0FFF0' },
    dietary: 'VEG',
    spiceLevel: 'MILD',
    allergens: ['Dairy (Paneer, Ghee)', 'Tree Nuts (Cashew)'],
    isAvailable: true,
    rating: 4.7,
    ratingCount: 680,
    bestseller: false,
    portions: [
      { id: 'p-reg', name: 'Regular Handi', priceModifier: 0, serves: '1 person' },
      { id: 'p-fam', name: 'Family Pack (Serves 3–4)', priceModifier: 350, serves: '3–4 persons' },
    ],
    addons: [
      { id: 'a-salan', name: 'Extra Mirchi Ka Salan', price: 60 },
      { id: 'a-paneer', name: 'Extra Tandoori Paneer (4 pcs)', price: 70 },
      { id: 'a-raita', name: 'Double Garlic Dahi Raita', price: 40 },
    ],
  },
  {
    id: 'chicken-65',
    name: 'Authentic Hyderabad Chicken 65',
    tagline: 'Crispy, fiery, tossed in crackling curry leaves',
    description:
      'The legendary 1965 recipe: boneless chicken chunks coated in spiced batter, fried till crackling, and tossed in yogurt, garlic, and fresh curry leaves.',
    ingredients: ['Boneless Chicken', 'Fresh Curry Leaves', 'Guntur Red Chilies', 'Curd & Garlic'],
    price: 310,
    category: 'Starters',
    photo:
      'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#E8333A', bottom: '#8A151A', foam: '#FFE9E6' },
    badge: 'Chef fave',
    dietary: 'NON_VEG',
    spiceLevel: 'EXTRA_SPICY',
    allergens: ['Dairy (Curd)'],
    isAvailable: true,
    rating: 4.8,
    ratingCount: 1520,
    bestseller: true,
    portions: [
      { id: 'p-reg', name: 'Standard Plate (8 pcs)', priceModifier: 0, serves: '1–2 persons' },
      { id: 'p-plat', name: 'Party Platter (16 pcs)', priceModifier: 280, serves: '3–4 persons' },
    ],
    addons: [
      { id: 'a-dip', name: 'Spicy Garlic Mayo Dip', price: 30 },
      { id: 'a-lemon', name: 'Extra Onion & Lemon Rings', price: 15 },
    ],
  },
  {
    id: 'mutton-haleem',
    name: 'Shahi Mutton Haleem',
    tagline: '12-hour slow simmered royal festival stew',
    description:
      'Nizami delicacy of shredded goat meat, pounded wheat, and lentils slow-cooked overnight with pure ghee and dry spices, garnished with fried cashews.',
    ingredients: ['Shredded Goat Mutton', 'Broken Wheat', 'Desi Ghee', 'Lentils', 'Fried Cashews & Birista'],
    price: 350,
    category: 'Starters',
    photo:
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#C9A47E', bottom: '#6B4226', foam: '#FFF7EC' },
    badge: 'Royal Stew',
    dietary: 'NON_VEG',
    spiceLevel: 'MEDIUM',
    allergens: ['Gluten (Wheat)', 'Dairy (Ghee)', 'Nuts (Cashews)'],
    isAvailable: true,
    rating: 4.9,
    ratingCount: 2150,
    bestseller: true,
    outletAvailability: {
      'out-charminar': { isAvailable: true, statusLabel: 'Heritage Recipe · Handi Fresh' },
    },
    portions: [
      { id: 'p-bowl', name: 'Regular Bowl (350ml)', priceModifier: 0, serves: '1 person' },
      { id: 'p-pot', name: 'Family Pot (750ml)', priceModifier: 320, serves: '2–3 persons' },
    ],
    addons: [
      { id: 'a-kaju', name: 'Extra Roasted Cashews & Lemon', price: 40 },
      { id: 'a-ghee', name: 'Extra Hot Desi Ghee Drizzle', price: 30 },
    ],
  },
  {
    id: 'pathar-ka-gosht',
    name: 'Barkas Pathar Ka Gosht',
    tagline: 'Seared on natural heated river stone slabs',
    description:
      'Thinly beaten lamb fillets marinated with raw papaya and secret potli spices, seared live over heated granite stone slabs.',
    ingredients: ['Mutton Fillets', 'Raw Papaya Marinade', 'Allspice Blend', 'Black Pepper', 'Mint'],
    price: 420,
    category: 'Starters',
    photo:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#8A5D4A', bottom: '#4A2A1A', foam: '#FFF4E2' },
    dietary: 'NON_VEG',
    spiceLevel: 'SPICY',
    allergens: [],
    isAvailable: true,
    rating: 4.8,
    ratingCount: 840,
    bestseller: false,
    outletAvailability: {
      'out-gachibowli': { isAvailable: false, statusLabel: 'Dine-In Stone Pit Only' },
      'out-manikonda-ck': { isAvailable: false, statusLabel: 'Dine-In Stone Pit Only' },
      'out-miyapur-ck': { isAvailable: false, statusLabel: 'Dine-In Stone Pit Only' },
      'out-kukatpally': { isAvailable: false, statusLabel: 'Unavailable at Express' },
      'out-charminar': { isAvailable: true, statusLabel: 'Special River Granite Seared' },
    },
    portions: [{ id: 'p-std', name: 'Standard Plate (6 strips)', priceModifier: 0, serves: '1–2 persons' }],
    addons: [{ id: 'a-chilli', name: 'Charred Green Chilies', price: 20 }],
  },
  {
    id: 'paneer-tikka',
    name: 'Banjara Malai Paneer Tikka',
    tagline: 'Clay tandoor charred with hung curd & saffron',
    description:
      'Creamy malai paneer cubes marinated with saffron, crushed pepper, hung curd, and carom seeds, skewered and roasted in clay tandoor.',
    ingredients: ['Malai Paneer', 'Hung Curd', 'Bell Peppers', 'Carom Seeds', 'Saffron'],
    price: 280,
    category: 'Starters',
    photo:
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#FFC96B', bottom: '#D97E14', foam: '#FFF4E2' },
    dietary: 'VEG',
    spiceLevel: 'MILD',
    allergens: ['Dairy (Paneer, Curd)'],
    isAvailable: true,
    rating: 4.7,
    ratingCount: 540,
    bestseller: false,
    portions: [{ id: 'p-std', name: 'Standard Skewer (6 pcs)', priceModifier: 0, serves: '1–2 persons' }],
    addons: [{ id: 'a-dip', name: 'Mint Chutney & Garlic Dip', price: 25 }],
  },
  {
    id: 'double-ka-meetha',
    name: 'Shahi Double Ka Meetha',
    tagline: 'Crispy fried bread in cardamom rabri & pistachios',
    description:
      'Hyderabad’s royal dessert: deep fried bread slices soaked in saffron milk and rich reduced khoya rabri, finished with silver vark and toasted pistachios.',
    ingredients: ['Fried Bread Slices', 'Saffron Milk', 'Reduced Khoya Rabri', 'Pistachios', 'Silver Vark'],
    price: 160,
    category: 'Desserts',
    photo:
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#FFB98A', bottom: '#E26D2B', foam: '#FFF4E2' },
    badge: 'Limited',
    dietary: 'VEG',
    spiceLevel: 'MILD',
    allergens: ['Gluten (Bread)', 'Dairy (Milk, Khoya)', 'Nuts (Pistachio)'],
    isAvailable: true,
    rating: 4.9,
    ratingCount: 1120,
    bestseller: true,
    outletAvailability: {
      'out-kukatpally': { isAvailable: false, statusLabel: 'Sold Out for the Day' },
    },
    portions: [{ id: 'p-std', name: 'Single Bowl (2 slices)', priceModifier: 0, serves: '1 person' }],
    addons: [{ id: 'a-rabri', name: 'Extra Khoya Rabri Scoop', price: 40 }],
  },
  {
    id: 'irani-chai',
    name: 'Dum Ki Irani Chai Flask',
    tagline: 'Reduced buffalo milk tea with Osmania biscuits',
    description:
      'Slow-simmered rich black tea decoction combined with creamy reduced milk, served with 4 fresh handmade Osmania sweet & salt biscuits.',
    ingredients: ['Assam Black Tea', 'Reduced Buffalo Milk', 'Green Cardamom', '4 Osmania Biscuits'],
    price: 120,
    category: 'Chai',
    photo:
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#D9A066', bottom: '#7D471D', foam: '#FFF6E9' },
    dietary: 'VEG',
    spiceLevel: 'MILD',
    allergens: ['Dairy (Milk)', 'Gluten (Biscuits)'],
    isAvailable: true,
    rating: 4.8,
    ratingCount: 960,
    bestseller: false,
    portions: [{ id: 'p-flask', name: 'Thermal Flask (Serves 2–3)', priceModifier: 0, serves: '2–3 cups' }],
    addons: [{ id: 'a-bisc', name: 'Extra Osmania Biscuits (Pack of 6)', price: 40 }],
  },
  {
    id: 'cloud-express-box',
    name: 'Express Biryani Box + Thums Up',
    tagline: 'Quick lunch combo for tech parks & cloud deliveries',
    description:
      'Single handi dum biryani accompanied by 250ml mirchi ka salan, spiced dahi raita, gulab jamun, and a chilled Thums Up can.',
    ingredients: ['Chicken Dum Biryani', 'Mirchi Ka Salan', 'Dahi Raita', 'Thums Up 250ml', 'Gulab Jamun'],
    price: 330,
    category: 'Biryani',
    photo:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80',
    colors: { top: '#FFD93D', bottom: '#D96E14', foam: '#FFF4E2' },
    badge: 'Cloud Exclusive',
    dietary: 'NON_VEG',
    spiceLevel: 'MEDIUM',
    allergens: ['Dairy (Ghee, Curd)'],
    isAvailable: true,
    rating: 4.9,
    ratingCount: 410,
    bestseller: true,
    outletAvailability: {
      'out-kondapur': { isAvailable: false, statusLabel: 'Cloud Kitchen Only' },
      'out-banjara-hills': { isAvailable: false, statusLabel: 'Cloud Kitchen Only' },
      'out-jubilee-hills': { isAvailable: false, statusLabel: 'Cloud Kitchen Only' },
      'out-charminar': { isAvailable: false, statusLabel: 'Cloud Kitchen Only' },
    },
    portions: [{ id: 'p-box', name: 'Complete Combo Box', priceModifier: 0, serves: '1 person' }],
    addons: [{ id: 'a-egg', name: 'Extra Boiled Egg', price: 20 }],
  },
];

export function getMenuItemsForOutlet(outletId: string): (MenuItem & { effectivePrice: number; effectiveAvailable: boolean; outletStatusLabel?: string })[] {
  return MENU_ITEMS.map((item) => {
    const override = item.outletAvailability?.[outletId];
    return {
      ...item,
      effectivePrice: override?.priceOverride ?? item.price,
      effectiveAvailable: override !== undefined ? override.isAvailable : item.isAvailable,
      outletStatusLabel: override?.statusLabel,
    };
  });
}

export const DRINKS: MenuItem[] = MENU_ITEMS;

export const CATEGORIES = ['All', 'Biryani', 'Starters', 'Desserts', 'Chai'] as const;
export type Category = (typeof CATEGORIES)[number];

export interface Outlet {
  id: string;
  name: string;
  type: 'PHYSICAL_DINEIN' | 'CLOUD_KITCHEN';
  address: string;
  area: string;
  city: string;
  latitude: number;
  longitude: number;
  deliveryRadiusKm: number;
  minPrepTimeMinutes: number;
  fssaiLicense: string;
  openingHours: string;
}

export const OUTLETS: Outlet[] = [
  // --- 14 Flagship Dine-In & Takeaway Outlets ---
  {
    id: 'out-kondapur',
    name: 'Kondapur Flagship Dine-In',
    type: 'PHYSICAL_DINEIN',
    address: 'Plot 42, Main Road, Near Botanical Gardens, Kondapur',
    area: 'Kondapur',
    city: 'Hyderabad',
    latitude: 17.4622,
    longitude: 78.3568,
    deliveryRadiusKm: 6.5,
    minPrepTimeMinutes: 20,
    fssaiLicense: '23619028374901',
    openingHours: '11:00 AM – 11:30 PM',
  },
  {
    id: 'out-banjara-hills',
    name: 'Banjara Hills Dine-In',
    type: 'PHYSICAL_DINEIN',
    address: 'Road No. 12, Opposite City Center Mall, Banjara Hills',
    area: 'Banjara Hills',
    city: 'Hyderabad',
    latitude: 17.4156,
    longitude: 78.4357,
    deliveryRadiusKm: 7.0,
    minPrepTimeMinutes: 25,
    fssaiLicense: '23619028374904',
    openingHours: '11:30 AM – 11:30 PM',
  },
  {
    id: 'out-jubilee-hills',
    name: 'Jubilee Hills Dine-In',
    type: 'PHYSICAL_DINEIN',
    address: 'Road No. 36, Near Peddamma Temple Metro, Jubilee Hills',
    area: 'Jubilee Hills',
    city: 'Hyderabad',
    latitude: 17.4319,
    longitude: 78.4073,
    deliveryRadiusKm: 6.0,
    minPrepTimeMinutes: 25,
    fssaiLicense: '23619028374905',
    openingHours: '12:00 PM – 11:45 PM',
  },
  {
    id: 'out-madhapur',
    name: 'Madhapur Hitec City Dine-In',
    type: 'PHYSICAL_DINEIN',
    address: 'Survey 64, Opposite Mindspace Junction, Madhapur',
    area: 'Madhapur',
    city: 'Hyderabad',
    latitude: 17.4483,
    longitude: 78.3915,
    deliveryRadiusKm: 5.5,
    minPrepTimeMinutes: 20,
    fssaiLicense: '23619028374906',
    openingHours: '11:00 AM – 12:30 AM',
  },
  {
    id: 'out-gachibowli-dinein',
    name: 'Gachibowli Dine-In',
    type: 'PHYSICAL_DINEIN',
    address: 'Old Mumbai Highway, Near Bio-Diversity Park, Gachibowli',
    area: 'Gachibowli',
    city: 'Hyderabad',
    latitude: 17.4435,
    longitude: 78.3570,
    deliveryRadiusKm: 6.5,
    minPrepTimeMinutes: 20,
    fssaiLicense: '23619028374907',
    openingHours: '11:30 AM – 11:30 PM',
  },
  {
    id: 'out-kukatpally',
    name: 'Kukatpally Express Kitchen',
    type: 'PHYSICAL_DINEIN',
    address: 'KPHB Phase 3, Near Remedy Hospital, Kukatpally',
    area: 'Kukatpally',
    city: 'Hyderabad',
    latitude: 17.4933,
    longitude: 78.3995,
    deliveryRadiusKm: 5.5,
    minPrepTimeMinutes: 25,
    fssaiLicense: '23619028374903',
    openingHours: '11:30 AM – 11:00 PM',
  },
  {
    id: 'out-secunderabad',
    name: 'Secunderabad Paradise Circle Dine-In',
    type: 'PHYSICAL_DINEIN',
    address: 'MG Road, Near Paradise Circle, Secunderabad',
    area: 'Secunderabad',
    city: 'Hyderabad',
    latitude: 17.4399,
    longitude: 78.4983,
    deliveryRadiusKm: 6.0,
    minPrepTimeMinutes: 25,
    fssaiLicense: '23619028374908',
    openingHours: '11:00 AM – 11:30 PM',
  },
  {
    id: 'out-charminar',
    name: 'Charminar Heritage Dine-In',
    type: 'PHYSICAL_DINEIN',
    address: 'Patharghatti Main Road, Near Madina Building, Old City',
    area: 'Charminar',
    city: 'Hyderabad',
    latitude: 17.3616,
    longitude: 78.4747,
    deliveryRadiusKm: 5.0,
    minPrepTimeMinutes: 30,
    fssaiLicense: '23619028374909',
    openingHours: '12:00 PM – 01:00 AM (Late Night)',
  },
  {
    id: 'out-begumpet',
    name: 'Begumpet Dine-In',
    type: 'PHYSICAL_DINEIN',
    address: 'Prakash Nagar, Beside Shoppers Stop, SP Road, Begumpet',
    area: 'Begumpet',
    city: 'Hyderabad',
    latitude: 17.4448,
    longitude: 78.4678,
    deliveryRadiusKm: 6.0,
    minPrepTimeMinutes: 20,
    fssaiLicense: '23619028374910',
    openingHours: '11:30 AM – 11:00 PM',
  },
  {
    id: 'out-himayatnagar',
    name: 'Himayatnagar Dine-In',
    type: 'PHYSICAL_DINEIN',
    address: 'Street No. 3, Near Liberty Circle, Himayatnagar',
    area: 'Himayatnagar',
    city: 'Hyderabad',
    latitude: 17.4042,
    longitude: 78.4851,
    deliveryRadiusKm: 5.5,
    minPrepTimeMinutes: 20,
    fssaiLicense: '23619028374911',
    openingHours: '11:30 AM – 11:15 PM',
  },
  {
    id: 'out-ameerpet',
    name: 'Ameerpet Dine-In',
    type: 'PHYSICAL_DINEIN',
    address: 'Dharam Karam Road, Beside Metro Station, Ameerpet',
    area: 'Ameerpet',
    city: 'Hyderabad',
    latitude: 17.4375,
    longitude: 78.4482,
    deliveryRadiusKm: 5.5,
    minPrepTimeMinutes: 20,
    fssaiLicense: '23619028374912',
    openingHours: '11:00 AM – 11:30 PM',
  },
  {
    id: 'out-tolichowki',
    name: 'Tolichowki Dine-In',
    type: 'PHYSICAL_DINEIN',
    address: 'Main Road, Opposite Rumaan Hotel, Tolichowki',
    area: 'Tolichowki',
    city: 'Hyderabad',
    latitude: 17.4018,
    longitude: 78.4112,
    deliveryRadiusKm: 6.0,
    minPrepTimeMinutes: 20,
    fssaiLicense: '23619028374913',
    openingHours: '12:00 PM – 12:30 AM',
  },
  {
    id: 'out-mehdipatnam',
    name: 'Mehdipatnam Dine-In',
    type: 'PHYSICAL_DINEIN',
    address: 'PVNR Expressway Pillar 48, Mehdipatnam',
    area: 'Mehdipatnam',
    city: 'Hyderabad',
    latitude: 17.3916,
    longitude: 78.4419,
    deliveryRadiusKm: 6.0,
    minPrepTimeMinutes: 25,
    fssaiLicense: '23619028374914',
    openingHours: '11:30 AM – 11:30 PM',
  },
  {
    id: 'out-dilsukhnagar',
    name: 'Dilsukhnagar Dine-In',
    type: 'PHYSICAL_DINEIN',
    address: 'Main Road, Near Konark Theatre, Dilsukhnagar',
    area: 'Dilsukhnagar',
    city: 'Hyderabad',
    latitude: 17.3685,
    longitude: 78.5247,
    deliveryRadiusKm: 6.5,
    minPrepTimeMinutes: 20,
    fssaiLicense: '23619028374915',
    openingHours: '11:00 AM – 11:00 PM',
  },

  // --- 3 Specialized Cloud Kitchens ---
  {
    id: 'out-gachibowli',
    name: 'Gachibowli Cloud Kitchen',
    type: 'CLOUD_KITCHEN',
    address: 'DLF Cyber City Lane, Gachibowli, Financial District',
    area: 'Gachibowli',
    city: 'Hyderabad',
    latitude: 17.4435,
    longitude: 78.3570,
    deliveryRadiusKm: 7.0,
    minPrepTimeMinutes: 15,
    fssaiLicense: '23619028374902',
    openingHours: '11:00 AM – 01:00 AM (Late Night)',
  },
  {
    id: 'out-manikonda-ck',
    name: 'Manikonda Cloud Kitchen',
    type: 'CLOUD_KITCHEN',
    address: 'Puppalguda Main Road, Golden Temple Road, Manikonda',
    area: 'Manikonda',
    city: 'Hyderabad',
    latitude: 17.4011,
    longitude: 78.3792,
    deliveryRadiusKm: 7.5,
    minPrepTimeMinutes: 15,
    fssaiLicense: '23619028374916',
    openingHours: '11:00 AM – 12:00 AM',
  },
  {
    id: 'out-miyapur-ck',
    name: 'Miyapur Cloud Kitchen',
    type: 'CLOUD_KITCHEN',
    address: 'Allwyn Colony Junction, Near Metro Terminal, Miyapur',
    area: 'Miyapur',
    city: 'Hyderabad',
    latitude: 17.4968,
    longitude: 78.3614,
    deliveryRadiusKm: 7.0,
    minPrepTimeMinutes: 15,
    fssaiLicense: '23619028374917',
    openingHours: '11:00 AM – 11:30 PM',
  },
];

// Haversine Distance Calculator (km)
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function findNearestOutlet(
  userLat: number,
  userLon: number,
  outlets: Outlet[] = OUTLETS
): { outlet: Outlet; distanceKm: number; isDeliverable: boolean; fallbackOutlet?: Outlet } {
  let closest = outlets[0];
  let minDistance = 999999;

  for (const outlet of outlets) {
    const dist = calculateHaversineDistanceKm(userLat, userLon, outlet.latitude, outlet.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      closest = outlet;
    }
  }

  const isDeliverable = minDistance <= closest.deliveryRadiusKm;
  let fallbackOutlet: Outlet | undefined = undefined;
  if (!isDeliverable) {
    const cloudKitchens = outlets.filter((o) => o.type === 'CLOUD_KITCHEN');
    let minCloudDist = 999999;
    for (const ck of cloudKitchens) {
      const d = calculateHaversineDistanceKm(userLat, userLon, ck.latitude, ck.longitude);
      if (d < minCloudDist) {
        minCloudDist = d;
        fallbackOutlet = ck;
      }
    }
  }

  return {
    outlet: closest,
    distanceKm: minDistance,
    isDeliverable,
    fallbackOutlet,
  };
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
  gstAmount: number; // authoritative: itemTotal * 5 / 105
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

export const HERO_PHOTO =
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80';

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
