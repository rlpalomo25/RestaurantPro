import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Role, 
  MenuItem, 
  Order, 
  CartItem, 
  PaymentDetails, 
  SystemNotification, 
  OrderStatus 
} from './types';
import { 
  getStoredMenu, 
  saveMenu, 
  getStoredOrders, 
  saveOrders, 
  getStoredNotifications, 
  addNotification, 
  saveNotifications, 
  getStoredTableNumber, 
  saveTableNumber, 
  playSoundAlert, 
  subscribeToBroadcast 
} from './services/storageService';

import { Header } from './components/Header';
import { NotificationsModal } from './components/NotificationsModal';
import { MenuBrowser } from './components/CustomerView/MenuBrowser';
import { ItemCustomizerModal } from './components/CustomerView/ItemCustomizerModal';
import { CartDrawer } from './components/CustomerView/CartDrawer';
import { PaymentTerminalModal } from './components/CustomerView/PaymentTerminalModal';
import { OrderTrackerModal } from './components/CustomerView/OrderTrackerModal';
import { QRScannerModal } from './components/CustomerView/QRScannerModal';

import { KitchenKDS } from './components/KitchenView/KitchenKDS';
import { ManagerDashboard } from './components/ManagerView/ManagerDashboard';
import { INITIAL_MENU } from './data/mockData';

export default function App() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tableNumber, setTableNumber] = useState<number>(getStoredTableNumber());
  const [menu, setMenu] = useState<MenuItem[]>(getStoredMenu());
  const [orders, setOrders] = useState<Order[]>(getStoredOrders());
  const [notifications, setNotifications] = useState<SystemNotification[]>(getStoredNotifications());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  // Modals state
  const [isQRScannerOpen, setIsQRScannerOpen] = useState<boolean>(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [pendingPaymentInfo, setPendingPaymentInfo] = useState<{
    subtotal: number;
    tax: number;
    tip: number;
    total: number;
    notes: string;
  } | null>(null);

  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [waiterRequested, setWaiterRequested] = useState<boolean>(false);

  // Parse URL search parameters for table number (e.g. /customer?table=5)
  useEffect(() => {
    const tableParam = searchParams.get('table');
    if (tableParam) {
      const parsed = parseInt(tableParam, 10);
      if (!isNaN(parsed) && parsed > 0) {
        handleSelectTable(parsed);
      }
    }
  }, [searchParams]);

  // Detect online / offline connectivity status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cross-tab broadcast channel listener
  useEffect(() => {
    const unsubscribe = subscribeToBroadcast((data) => {
      if (data.type === 'MENU_UPDATED') setMenu(data.payload as MenuItem[]);
      if (data.type === 'ORDERS_UPDATED') setOrders(data.payload as Order[]);
      if (data.type === 'NOTIFS_UPDATED') setNotifications(data.payload as SystemNotification[]);
      if (data.type === 'TABLE_CHANGED') setTableNumber(data.payload as number);
    });
    return unsubscribe;
  }, []);

  // Sync state to LocalStorage
  const updateMenuState = (newMenu: MenuItem[]) => {
    setMenu(newMenu);
    saveMenu(newMenu);
  };

  const updateOrdersState = (newOrders: Order[]) => {
    setOrders(newOrders);
    saveOrders(newOrders);
  };

  const handleSelectTable = (tblNum: number) => {
    setTableNumber(tblNum);
    saveTableNumber(tblNum);
  };

  // Sound play helper respecting soundEnabled toggle
  const playSound = (type: 'new_order' | 'ready' | 'bell') => {
    if (soundEnabled) playSoundAlert(type);
  };

  // Add Item to Cart
  const handleAddToCart = (cartItem: CartItem) => {
    setCart((prev) => [...prev, cartItem]);
  };

  // Update Cart Item Quantity
  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity: newQty } : i))
      );
    }
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  // Step 1 of Checkout: Open Payment Terminal
  const handleProceedToPayment = (
    subtotal: number,
    tax: number,
    tip: number,
    total: number,
    notes: string
  ) => {
    setPendingPaymentInfo({ subtotal, tax, tip, total, notes });
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  // Step 2 of Checkout: Payment Authorized & Order Created
  const handlePaymentComplete = (payment: PaymentDetails) => {
    if (!pendingPaymentInfo) return;

    const newOrderNumber = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      tableNumber,
      items: [...cart],
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedReadyTime: new Date(Date.now() + 15 * 60000).toISOString(),
      payment,
      specialInstructions: pendingPaymentInfo.notes,
    };

    // Auto decrement inventory stock
    const updatedMenu = menu.map((mItem) => {
      const purchasedCartItems = cart.filter((c) => c.menuItem.id === mItem.id);
      if (purchasedCartItems.length === 0) return mItem;

      const totalQtyPurchased = purchasedCartItems.reduce((s, c) => s + c.quantity, 0);
      const remaining = Math.max(0, mItem.stockQuantity - totalQtyPurchased);

      // Low stock trigger notification
      if (remaining <= mItem.lowStockThreshold) {
        addNotification({
          title: `Low Stock Warning: ${mItem.name}`,
          message: `${mItem.name} now has only ${remaining} items remaining in stock!`,
          type: 'low_stock',
        });
      }

      return {
        ...mItem,
        stockQuantity: remaining,
        isAvailable: remaining > 0 && mItem.isAvailable,
      };
    });

    updateMenuState(updatedMenu);

    const updatedOrders = [newOrder, ...orders];
    updateOrdersState(updatedOrders);

    // Trigger Notification & Audio
    addNotification({
      title: `New Order #${newOrderNumber} Placed!`,
      message: `Table #${tableNumber} placed an order worth $${payment.total.toFixed(2)}.`,
      type: 'order_status',
      orderId: newOrder.id,
      tableNumber,
    });
    setNotifications(getStoredNotifications());

    playSound('new_order');

    // Clear cart and open tracker modal
    setCart([]);
    setIsPaymentOpen(false);
    setTrackedOrder(newOrder);
    setIsTrackerOpen(true);
  };

  // Kitchen KDS Order Status Advancement
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        const updated = {
          ...o,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };

        // Notify customer
        if (newStatus === 'ready') {
          addNotification({
            title: `Order #${o.orderNumber} is READY!`,
            message: `Your food is fresh & plated for Table #${o.tableNumber}.`,
            type: 'order_status',
            orderId: o.id,
            tableNumber: o.tableNumber,
          });
          setNotifications(getStoredNotifications());
        }

        return updated;
      }
      return o;
    });

    updateOrdersState(updatedOrders);

    // Keep tracked order in sync if modal open
    if (trackedOrder && trackedOrder.id === orderId) {
      setTrackedOrder(updatedOrders.find((o) => o.id === orderId) || null);
    }
  };

  // Waiter Assistance Request
  const handleRequestWaiter = () => {
    setWaiterRequested(true);
    addNotification({
      title: `Table #${tableNumber} Requested Assistance`,
      message: `Customer at Table #${tableNumber} called a waiter for drink refill / assistance.`,
      type: 'waiter_call',
      tableNumber,
    });
    setNotifications(getStoredNotifications());
    playSound('bell');

    setTimeout(() => {
      setWaiterRequested(false);
    }, 15000);
  };

  // Inventory Stock Adjustments
  const handleUpdateStock = (itemId: string, newStock: number) => {
    const updated = menu.map((m) =>
      m.id === itemId
        ? {
            ...m,
            stockQuantity: newStock,
            isAvailable: newStock > 0 ? m.isAvailable : false,
          }
        : m
    );
    updateMenuState(updated);
  };

  const handleToggleAvailability = (itemId: string, isAvailable: boolean) => {
    const updated = menu.map((m) => (m.id === itemId ? { ...m, isAvailable } : m));
    updateMenuState(updated);
  };

  const handleRestockAll = () => {
    updateMenuState(INITIAL_MENU);
  };

  // Find active orders for current customer table
  const currentTableOrders = orders.filter(
    (o) => o.tableNumber === tableNumber && o.status !== 'delivered' && o.status !== 'cancelled'
  );

  return (
    <div className="min-[#0f0e0d] min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
      
      {/* Navigation Header */}
      <Header
        tableNumber={tableNumber}
        openQRScanner={() => setIsQRScannerOpen(true)}
        isOffline={isOffline}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        notifications={notifications}
        openNotifications={() => setIsNotificationsOpen(true)}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
        activeOrderCount={currentTableOrders.length}
        openActiveOrders={() => {
          if (currentTableOrders.length > 0) {
            setTrackedOrder(currentTableOrders[0]);
            setIsTrackerOpen(true);
          }
        }}
      />

      {/* Main Container View per Page Route */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <Routes>
          {/* Customer Routes (/customer and /customers) */}
          <Route
            path="/customer"
            element={
              <MenuBrowser
                menu={menu}
                tableNumber={tableNumber}
                isOffline={isOffline}
                onOpenCustomizer={(item) => setCustomizingItem(item)}
                onRequestWaiter={handleRequestWaiter}
                waiterRequested={waiterRequested}
              />
            }
          />
          <Route path="/customers" element={<Navigate to="/customer" replace />} />

          {/* Kitchen Route (/kitchen) */}
          <Route
            path="/kitchen"
            element={
              <KitchenKDS
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onPlaySound={playSound}
              />
            }
          />

          {/* Manager Route (/manager) */}
          <Route
            path="/manager"
            element={
              <ManagerDashboard
                menu={menu}
                onUpdateMenu={updateMenuState}
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onPlaySound={playSound}
                onUpdateStock={handleUpdateStock}
                onToggleAvailability={handleToggleAvailability}
                onRestockAll={handleRestockAll}
                onLaunchTableCustomerView={(tblNum) => {
                  handleSelectTable(tblNum);
                  navigate(`/customer?table=${tblNum}`);
                }}
              />
            }
          />

          {/* Root fallback */}
          <Route path="/" element={<Navigate to="/customer" replace />} />
          <Route path="*" element={<Navigate to="/customer" replace />} />
        </Routes>
      </main>

      {/* All Application Modals */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        currentTable={tableNumber}
        onSelectTable={handleSelectTable}
      />

      <ItemCustomizerModal
        item={customizingItem}
        isOpen={!!customizingItem}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCart([])}
        tableNumber={tableNumber}
        onProceedToPayment={handleProceedToPayment}
      />

      {pendingPaymentInfo && (
        <PaymentTerminalModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          tableNumber={tableNumber}
          subtotal={pendingPaymentInfo.subtotal}
          tax={pendingPaymentInfo.tax}
          tip={pendingPaymentInfo.tip}
          total={pendingPaymentInfo.total}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        order={trackedOrder}
        onRequestWaiter={handleRequestWaiter}
        waiterRequested={waiterRequested}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          const readNotifs = notifications.map((n) => ({ ...n, read: true }));
          setNotifications(readNotifs);
          saveNotifications(readNotifs);
        }}
      />

    </div>
  );
}

