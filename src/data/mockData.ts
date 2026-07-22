import { MenuItem, Category, Order } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'Full Menu', iconName: 'Utensils', description: 'Explore all our culinary offerings' },
  { id: 'appetizers', name: 'Appetizers', iconName: 'Soup', description: 'Starters to awaken your palate' },
  { id: 'mains', name: 'Main Courses', iconName: 'Beef', description: 'Hearty artisan entrees' },
  { id: 'pizzas', name: 'Wood-Fired Pizza', iconName: 'Pizza', description: 'Authentic 48-hour fermented dough' },
  { id: 'desserts', name: 'Desserts', iconName: 'Cake', description: 'Decadent sweet endings' },
  { id: 'beverages', name: 'Beverages', iconName: 'Coffee', description: 'Craft cocktails, wines & juices' },
];

export const INITIAL_MENU: MenuItem[] = [
  {
    id: 'm1',
    name: 'Truffle & Wild Mushroom Arancini',
    category: 'appetizers',
    description: 'Crispy risotto balls stuffed with black truffle, wild mushroom ragù, and smoked mozzarella. Served over truffle aioli.',
    price: 14.50,
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=800',
    prepTimeMinutes: 10,
    calories: 480,
    dietaryTags: ['vegetarian', 'chef-special'],
    stockQuantity: 24,
    lowStockThreshold: 8,
    isAvailable: true,
    customizationOptions: [
      {
        id: 'opt1',
        title: 'Dip Selection',
        required: false,
        type: 'multiple',
        choices: [
          { id: 'c1', name: 'Extra Truffle Aioli', priceExtra: 1.50 },
          { id: 'c2', name: 'Spicy Marinara', priceExtra: 1.00 },
        ],
      },
    ],
  },
  {
    id: 'm2',
    name: 'Charred Octopus & Fingerling Potatoes',
    category: 'appetizers',
    description: 'Spanish octopus tenderized and flame-grilled, paired with crispy fingerlings, smoked paprika oil, and romesco sauce.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&q=80&w=800',
    prepTimeMinutes: 12,
    calories: 420,
    dietaryTags: ['gluten-free', 'chef-special'],
    stockQuantity: 12,
    lowStockThreshold: 5,
    isAvailable: true,
  },
  {
    id: 'm3',
    name: 'Dry-Aged Wagyu Smash Burger',
    category: 'mains',
    description: 'Double 80/20 Wagyu beef patties, melted aged cheddar, caramelized onion jam, signature burger sauce on toasted brioche.',
    price: 19.50,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    prepTimeMinutes: 12,
    calories: 890,
    dietaryTags: ['chef-special'],
    stockQuantity: 18,
    lowStockThreshold: 6,
    isAvailable: true,
    customizationOptions: [
      {
        id: 'opt_doneness',
        title: 'Patty Cooking',
        required: true,
        type: 'single',
        choices: [
          { id: 'cd1', name: 'Medium Rare', priceExtra: 0 },
          { id: 'cd2', name: 'Medium Well', priceExtra: 0 },
          { id: 'cd3', name: 'Well Done', priceExtra: 0 },
        ],
      },
      {
        id: 'opt_burger_addons',
        title: 'Add-Ons',
        required: false,
        type: 'multiple',
        choices: [
          { id: 'ca1', name: 'Crispy Thick Bacon', priceExtra: 2.50 },
          { id: 'ca2', name: 'Fried Egg', priceExtra: 1.50 },
          { id: 'ca3', name: 'Gluten-Free Bun', priceExtra: 2.00 },
        ],
      },
    ],
  },
  {
    id: 'm4',
    name: 'Pan-Seared Salmon Fillet',
    category: 'mains',
    description: 'Wild Atlantic salmon with crispy skin, lemon-dill butter, saffron risotto, and charred asparagus spears.',
    price: 26.00,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800',
    prepTimeMinutes: 16,
    calories: 620,
    dietaryTags: ['gluten-free'],
    stockQuantity: 10,
    lowStockThreshold: 4,
    isAvailable: true,
  },
  {
    id: 'm5',
    name: 'Truffle & Burrata Margherita Pizza',
    category: 'pizzas',
    description: 'San Marzano tomato base, fresh cream burrata ball, fresh basil leaves, extra virgin olive oil, and black truffle drizzle.',
    price: 21.00,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    prepTimeMinutes: 14,
    calories: 750,
    dietaryTags: ['vegetarian', 'chef-special'],
    stockQuantity: 15,
    lowStockThreshold: 5,
    isAvailable: true,
    customizationOptions: [
      {
        id: 'opt_crust',
        title: 'Crust Style',
        required: true,
        type: 'single',
        choices: [
          { id: 'cr1', name: 'Classic Neapolitan', priceExtra: 0 },
          { id: 'cr2', name: 'Thin Crispy', priceExtra: 0 },
          { id: 'cr3', name: 'Cauliflower Gluten-Free', priceExtra: 3.50 },
        ],
      },
    ],
  },
  {
    id: 'm6',
    name: 'Diavola Spicy Pepperoni Pizza',
    category: 'pizzas',
    description: 'Spicy Calabrian salami, fior di latte mozzarella, crushed chili oil, honey drizzle, and fresh oregano.',
    price: 19.00,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800',
    prepTimeMinutes: 12,
    calories: 820,
    dietaryTags: ['spicy'],
    stockQuantity: 4, // Intentionally low stock to show low stock warning
    lowStockThreshold: 5,
    isAvailable: true,
  },
  {
    id: 'm7',
    name: 'Plant-Based Avocado Goddess Bowl',
    category: 'mains',
    description: 'Quinoa, roasted sweet potato, edamame, pickled cabbage, sliced avocado, and creamy tahini green goddess dressing.',
    price: 16.50,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800',
    prepTimeMinutes: 8,
    calories: 450,
    dietaryTags: ['vegan', 'gluten-free'],
    stockQuantity: 30,
    lowStockThreshold: 8,
    isAvailable: true,
  },
  {
    id: 'm8',
    name: 'Valrhona Chocolate Molten Lava Cake',
    category: 'desserts',
    description: 'Warm dark chocolate cake with a molten center, served with house-made Madagascar vanilla bean gelato.',
    price: 11.00,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800',
    prepTimeMinutes: 10,
    calories: 520,
    dietaryTags: ['vegetarian'],
    stockQuantity: 14,
    lowStockThreshold: 5,
    isAvailable: true,
  },
  {
    id: 'm9',
    name: 'Classic Venetian Tiramisu',
    category: 'desserts',
    description: 'Layers of espresso-soaked ladyfingers, velvety mascarpone cream, dust of Dutch cocoa powder, and dark chocolate shavings.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=800',
    prepTimeMinutes: 5,
    calories: 410,
    dietaryTags: ['vegetarian'],
    stockQuantity: 20,
    lowStockThreshold: 6,
    isAvailable: true,
  },
  {
    id: 'm10',
    name: 'Smoked Rosemary Old Fashioned',
    category: 'beverages',
    description: 'Bourbon whiskey, Angostura bitters, smoked rosemary sprig, orange peel twist served over ice block.',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
    prepTimeMinutes: 4,
    calories: 190,
    dietaryTags: ['vegan'],
    stockQuantity: 50,
    lowStockThreshold: 10,
    isAvailable: true,
  },
  {
    id: 'm11',
    name: 'Fresh Dragonfruit & Mint Refresher',
    category: 'beverages',
    description: 'Cold-pressed pitaya juice, sparkling water, muddled fresh mint, line juice, and agave nectar.',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800',
    prepTimeMinutes: 3,
    calories: 120,
    dietaryTags: ['vegan', 'gluten-free'],
    stockQuantity: 40,
    lowStockThreshold: 10,
    isAvailable: true,
  }
];

const now = new Date();
const timeAgo = (mins: number) => new Date(now.getTime() - mins * 60000).toISOString();
const timeInFuture = (mins: number) => new Date(now.getTime() + mins * 60000).toISOString();

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 1001,
    tableNumber: 4,
    customerName: 'Table 4 (David L.)',
    items: [
      {
        cartItemId: 'c-1',
        menuItem: INITIAL_MENU[2], // Wagyu smash burger
        quantity: 2,
        selectedCustomizations: [
          { optionId: 'opt_doneness', optionTitle: 'Patty Cooking', selectedChoices: [{ name: 'Medium Rare', priceExtra: 0 }] },
          { optionId: 'opt_burger_addons', optionTitle: 'Add-Ons', selectedChoices: [{ name: 'Crispy Thick Bacon', priceExtra: 2.50 }] }
        ],
        unitPrice: 22.00,
      },
      {
        cartItemId: 'c-2',
        menuItem: INITIAL_MENU[9], // Old Fashioned
        quantity: 2,
        selectedCustomizations: [],
        unitPrice: 15.00,
      }
    ],
    status: 'preparing',
    createdAt: timeAgo(14), // 14 mins ago -> Amber timer
    updatedAt: timeAgo(10),
    estimatedReadyTime: timeInFuture(4),
    specialInstructions: 'Extra napkins and serve drinks immediately please.',
    payment: {
      method: 'apple_pay',
      subtotal: 74.00,
      tax: 6.66,
      tip: 13.32,
      total: 93.98,
      paidAt: timeAgo(14),
      transactionId: 'TXN-984210'
    }
  },
  {
    id: 'ord-1002',
    orderNumber: 1002,
    tableNumber: 2,
    customerName: 'Table 2 (Sarah M.)',
    items: [
      {
        cartItemId: 'c-3',
        menuItem: INITIAL_MENU[4], // Truffle & Burrata Pizza
        quantity: 1,
        selectedCustomizations: [
          { optionId: 'opt_crust', optionTitle: 'Crust Style', selectedChoices: [{ name: 'Classic Neapolitan', priceExtra: 0 }] }
        ],
        unitPrice: 21.00,
      },
      {
        cartItemId: 'c-4',
        menuItem: INITIAL_MENU[0], // Arancini
        quantity: 1,
        selectedCustomizations: [],
        unitPrice: 14.50,
      },
      {
        cartItemId: 'c-5',
        menuItem: INITIAL_MENU[10], // Dragonfruit juice
        quantity: 1,
        selectedCustomizations: [],
        unitPrice: 7.50,
      }
    ],
    status: 'pending',
    createdAt: timeAgo(4), // 4 mins ago -> Green timer
    updatedAt: timeAgo(4),
    estimatedReadyTime: timeInFuture(12),
    specialInstructions: 'Allergies: Severe Peanut allergy at table.',
    payment: {
      method: 'credit_card',
      subtotal: 43.00,
      tax: 3.87,
      tip: 8.60,
      total: 55.47,
      paidAt: timeAgo(4),
      transactionId: 'TXN-984211'
    }
  },
  {
    id: 'ord-1003',
    orderNumber: 1003,
    tableNumber: 7,
    customerName: 'Table 7 (Alex K.)',
    items: [
      {
        cartItemId: 'c-6',
        menuItem: INITIAL_MENU[3], // Salmon Fillet
        quantity: 2,
        selectedCustomizations: [],
        unitPrice: 26.00,
      },
      {
        cartItemId: 'c-7',
        menuItem: INITIAL_MENU[7], // Lava cake
        quantity: 1,
        selectedCustomizations: [],
        unitPrice: 11.00,
      }
    ],
    status: 'ready',
    createdAt: timeAgo(22),
    updatedAt: timeAgo(2),
    estimatedReadyTime: timeAgo(2),
    payment: {
      method: 'credit_card',
      subtotal: 63.00,
      tax: 5.67,
      tip: 12.60,
      total: 81.27,
      paidAt: timeAgo(22),
      transactionId: 'TXN-984209'
    }
  }
];
