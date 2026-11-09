export interface Dish {
  id: string;
  name: string;
  tagline: string;
  ingredients: string[];
  price: number;
  category: 'Biryani' | 'Starters & Kebabs' | 'Desserts' | 'Chai & Drinks';
  photo: string;
  badge?: string;
  dietary: 'VEG' | 'NON_VEG';
  spiceLevel: 'MILD' | 'MEDIUM' | 'SPICY' | 'EXTRA SPICY';
  allergens: string[];
}

// Demo content for the Hyderabad direct-ordering experience. Every displayed price includes 5% GST.
export const DISHES: Dish[] = [
  { id: 'chicken-dum-biryani', name: 'Hyderabadi Chicken Dum Biryani', tagline: 'Slow-cooked in a sealed handi with aged basmati and saffron', ingredients: ['Farm chicken', 'Aged basmati', 'Saffron', 'Mint'], price: 380, category: 'Biryani', dietary: 'NON_VEG', spiceLevel: 'MEDIUM', allergens: ['Dairy'], badge: 'Best seller', photo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80' },
  { id: 'mutton-dum-biryani', name: 'Royal Nizami Mutton Biryani', tagline: 'Tender mutton layered with fragrant rice and slow-dummed for four hours', ingredients: ['Goat mutton', 'Basmati', 'Brown onions', 'Pure ghee'], price: 490, category: 'Biryani', dietary: 'NON_VEG', spiceLevel: 'SPICY', allergens: ['Dairy'], badge: 'Royal choice', photo: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=900&q=80' },
  { id: 'veg-dum-biryani', name: 'Nawabi Subz Dum Biryani', tagline: 'Garden vegetables and paneer layered into saffron rice', ingredients: ['Paneer', 'Seasonal vegetables', 'Basmati', 'Cashews'], price: 290, category: 'Biryani', dietary: 'VEG', spiceLevel: 'MILD', allergens: ['Dairy', 'Nuts'], badge: 'Pure veg', photo: 'https://images.unsplash.com/photo-1642821373181-696a54913e9a?auto=format&fit=crop&w=900&q=80' },
  { id: 'mutton-haleem', name: 'Shahi Mutton Haleem', tagline: 'Twelve-hour slow-cooked Hyderabadi comfort in every spoon', ingredients: ['Mutton', 'Wheat', 'Lentils', 'Desi ghee'], price: 350, category: 'Starters & Kebabs', dietary: 'NON_VEG', spiceLevel: 'MEDIUM', allergens: ['Gluten', 'Dairy', 'Nuts'], badge: '12-hour slow cook', photo: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=80' },
  { id: 'chicken-65', name: 'Authentic Hyderabad Chicken 65', tagline: 'Crispy chicken tossed with curry leaves and Guntur chillies', ingredients: ['Boneless chicken', 'Curry leaves', 'Chillies', 'Garlic'], price: 310, category: 'Starters & Kebabs', dietary: 'NON_VEG', spiceLevel: 'EXTRA SPICY', allergens: ['Egg'], badge: 'Fiery', photo: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=900&q=80' },
  { id: 'paneer-tikka', name: 'Banjara Malai Paneer Tikka', tagline: 'Smoky tandoori paneer, hung curd, saffron and carom', ingredients: ['Paneer', 'Hung curd', 'Bell peppers', 'Ajwain'], price: 280, category: 'Starters & Kebabs', dietary: 'VEG', spiceLevel: 'MILD', allergens: ['Dairy'], photo: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=900&q=80' },
  { id: 'double-ka-meetha', name: 'Shahi Double Ka Meetha', tagline: 'Fried bread, saffron-cardamom rabri and toasted dry fruits', ingredients: ['Bread', 'Rabri', 'Saffron', 'Pistachios'], price: 160, category: 'Desserts', dietary: 'VEG', spiceLevel: 'MILD', allergens: ['Gluten', 'Dairy', 'Nuts'], badge: 'Wedding classic', photo: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80' },
  { id: 'qubani-ka-meetha', name: 'Old City Qubani Ka Meetha', tagline: 'Slow-stewed apricots crowned with fresh clotted malai', ingredients: ['Dried apricots', 'Apricot kernels', 'Malai'], price: 190, category: 'Desserts', dietary: 'VEG', spiceLevel: 'MILD', allergens: ['Dairy', 'Nuts'], photo: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=900&q=80' },
  { id: 'irani-chai', name: 'Dum Ki Irani Chai Flask', tagline: 'Thick, sweet Irani chai for three to four cups', ingredients: ['Assam tea', 'Buffalo milk', 'Cardamom'], price: 120, category: 'Chai & Drinks', dietary: 'VEG', spiceLevel: 'MILD', allergens: ['Dairy'], photo: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80' },
];

export const CATEGORIES = ['All', 'Biryani', 'Starters & Kebabs', 'Desserts', 'Chai & Drinks'] as const;
export type Category = (typeof CATEGORIES)[number];

export interface Snack { id: string; name: string; description: string; price: number; photo: string; emoji: string; }
export const SNACKS: Snack[] = [
  { id: 'luqmi', name: 'Hyderabadi Mutton Luqmi', description: 'Crisp square pastry parcels filled with spiced minced mutton and mint.', price: 180, emoji: '🥟', photo: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80' },
  { id: 'mirchi-bajji', name: 'Cut Mirchi Bajji', description: 'Tangy stuffed green chillies, double fried and served hot.', price: 120, emoji: '🌶️', photo: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80' },
  { id: 'osmania', name: 'Osmania Biscuits', description: 'Sweet-and-salty Old City biscuits, baked fresh for chai time.', price: 140, emoji: '🍪', photo: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=80' },
];

export interface MerchItem { id: string; name: string; description: string; price: string; photo: string; }
export const MERCH: MerchItem[] = [
  { id: 'kds-new', name: '1. Paid order reaches the right kitchen', description: 'Outlet routing assigns each successful direct order to its serviceable kitchen.', price: 'LIVE', photo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80' },
  { id: 'kds-prep', name: '2. Kitchen follows every stage', description: 'Large, timer-led KDS cards guide staff from Placed to Preparing—no printed tickets.', price: 'KDS', photo: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=80' },
  { id: 'kds-ready', name: '3. Customer sees the real status', description: 'Ready and rider-handoff updates keep the customer informed with an honest promise time.', price: 'FAST', photo: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80' },
];

export interface InstagramPost { id: string; photo: string; caption: string; likes: number; }
export const INSTAGRAM_POSTS: InstagramPost[] = [
  { id: 'ig1', photo: DISHES[0].photo, caption: 'Sealed with dough, cooked with patience. Dum perfection. 🔥', likes: 3412 },
  { id: 'ig2', photo: DISHES[3].photo, caption: 'Haleem is on. Slow food, done right. ✨', likes: 4210 },
  { id: 'ig3', photo: DISHES[4].photo, caption: 'Crispy Chicken 65, straight from the kadai. 🍗', likes: 2890 },
  { id: 'ig4', photo: DISHES[6].photo, caption: 'Double Ka Meetha and a little extra rabri. 🍯', likes: 5120 },
  { id: 'ig5', photo: DISHES[1].photo, caption: 'Fragrant basmati, tender Nizami mutton. 👑', likes: 3950 },
  { id: 'ig6', photo: DISHES[8].photo, caption: 'Evening Irani chai and Osmania biscuits. ☕', likes: 6710 },
];

export const HERO_PHOTO = DISHES[0].photo;
export const STORE_PHOTO = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80';
export const MARQUEE_FLAVORS = ['Chicken Dum Biryani', 'Royal Mutton Biryani', 'Shahi Haleem', 'Chicken 65', 'Double Ka Meetha', 'Irani Chai', '17 Hyderabad locations', 'Prices include 5% GST'];
export const HOURS = [
  { days: 'Monday – Thursday', time: '11:00 AM – 11:30 PM' },
  { days: 'Friday – Saturday', time: '11:00 AM – 01:00 AM' },
  { days: 'Sunday', time: '11:00 AM – 11:30 PM' },
];
