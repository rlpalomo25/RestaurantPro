export type Role = 'customer' | 'kitchen' | 'manager';

export type ManagerTab = 'tables' | 'menu' | 'kitchen' | 'inventory' | 'analytics' | 'qr-gen';

export type DietaryTag = 'vegetarian' | 'vegan' | 'gluten-free' | 'contains-nuts' | 'chef-special' | 'spicy';

export interface OptionChoice {
  id: string;
  name: string;
  priceExtra: number;
}

export interface CustomizationOption {
  id: string;
  title: string;
  required: boolean;
  type: 'single' | 'multiple';
  choices: OptionChoice[];
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  prepTimeMinutes: number;
  calories?: number;
  dietaryTags: DietaryTag[];
  customizationOptions?: CustomizationOption[];
  isAvailable: boolean; // Managed by 86'd status or inventory
  stockQuantity: number;
  lowStockThreshold: number;
}

export interface SelectedCustomization {
  optionId: string;
  optionTitle: string;
  selectedChoices: { name: string; priceExtra: number }[];
}

export interface CartItem {
  cartItemId: string; // unique ID for specific item + customization configuration
  menuItem: MenuItem;
  quantity: number;
  selectedCustomizations: SelectedCustomization[];
  specialInstructions?: string;
  unitPrice: number; // base price + extras
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export type PaymentMethod = 'credit_card' | 'apple_pay' | 'google_pay' | 'cash';

export interface PaymentDetails {
  method: PaymentMethod;
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  paidAt: string;
  transactionId: string;
}

export interface Order {
  id: string;
  orderNumber: number; // e.g., 101, 102
  tableNumber: number;
  customerName?: string;
  items: CartItem[];
  status: OrderStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  estimatedReadyTime: string; // ISO string
  payment: PaymentDetails;
  specialInstructions?: string;
  waiterRequested?: boolean;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  description: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'order_status' | 'low_stock' | 'waiter_call' | 'payment_success';
  timestamp: string;
  tableNumber?: number;
  orderId?: string;
  read: boolean;
}
