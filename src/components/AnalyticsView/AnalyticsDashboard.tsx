import React from 'react';
import { Order, MenuItem } from '../../types';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  CreditCard, 
  Download, 
  Award, 
  PieChart, 
  Users,
  Sparkles
} from 'lucide-react';

interface AnalyticsDashboardProps {
  orders: Order[];
  menu: MenuItem[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ orders, menu }) => {
  // Aggregate sales statistics
  const totalRevenue = orders.reduce((sum, o) => sum + o.payment.total, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  // Dishes ranking
  const itemSalesCount: Record<string, { name: string; qty: number; revenue: number; image: string }> = {};

  orders.forEach((ord) => {
    ord.items.forEach((item) => {
      const id = item.menuItem.id;
      if (!itemSalesCount[id]) {
        itemSalesCount[id] = {
          name: item.menuItem.name,
          qty: 0,
          revenue: 0,
          image: item.menuItem.image,
        };
      }
      itemSalesCount[id].qty += item.quantity;
      itemSalesCount[id].revenue += item.unitPrice * item.quantity;
    });
  });

  const topDishes = Object.values(itemSalesCount).sort((a, b) => b.qty - a.qty).slice(0, 5);

  // Payment method breakdown
  const paymentMethodCounts: Record<string, number> = {
    credit_card: 0,
    apple_pay: 0,
    google_pay: 0,
    cash: 0,
  };

  orders.forEach((o) => {
    paymentMethodCounts[o.payment.method] = (paymentMethodCounts[o.payment.method] || 0) + o.payment.total;
  });

  // Export CSV Report function
  const handleExportCSV = () => {
    const csvRows = [
      ['Order ID', 'Table Number', 'Status', 'Payment Method', 'Subtotal', 'Tax', 'Tip', 'Total', 'Date'],
      ...orders.map((o) => [
        o.orderNumber,
        o.tableNumber,
        o.status,
        o.payment.method,
        o.payment.subtotal.toFixed(2),
        o.payment.tax.toFixed(2),
        o.payment.tip.toFixed(2),
        o.payment.total.toFixed(2),
        new Date(o.createdAt).toLocaleString(),
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DineFlow_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-24">
      
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-stone-100">Automated Staff Reports</h1>
            <p className="text-xs text-stone-400">Real-time revenue, top dishes, prep performance & sales audit</p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs rounded-2xl shadow-lg flex items-center space-x-2 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Sales Audit</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Revenue</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400">${totalRevenue.toFixed(2)}</div>
          <p className="text-[11px] text-stone-500 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>Across {totalOrdersCount} completed orders</span>
          </p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-400">${avgOrderValue.toFixed(2)}</div>
          <p className="text-[11px] text-stone-500">Per table check average</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Kitchen Prep Time</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">11.4 mins</div>
          <p className="text-[11px] text-stone-500">Avg turn time from QR order</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Tables</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-400">8 / 12</div>
          <p className="text-[11px] text-stone-500">66% floor occupancy</p>
        </div>

      </div>

      {/* Two Column Section: Top Dishes & Payment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Dishes Ranking */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-stone-100">Top Selling Artisan Dishes</h3>
          </div>

          <div className="space-y-3">
            {topDishes.length === 0 ? (
              <p className="text-xs text-stone-500">No order analytics recorded yet</p>
            ) : (
              topDishes.map((dish, idx) => (
                <div key={dish.name} className="p-3 bg-stone-950 border border-stone-800 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-black text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-10 h-10 rounded-xl object-cover bg-stone-900"
                    />
                    <div>
                      <p className="text-xs font-bold text-stone-100">{dish.name}</p>
                      <p className="text-[10px] text-stone-400">{dish.qty} orders served</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-amber-400 text-xs">${dish.revenue.toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-stone-100">Payment Channel Metrics</h3>
          </div>

          <div className="space-y-3">
            {[
              { key: 'credit_card', label: 'Credit / Debit Cards', color: 'bg-amber-500' },
              { key: 'apple_pay', label: 'Apple Pay', color: 'bg-blue-500' },
              { key: 'google_pay', label: 'Google Pay', color: 'bg-emerald-500' },
              { key: 'cash', label: 'Cash at Table', color: 'bg-purple-500' },
            ].map((pm) => {
              const rev = paymentMethodCounts[pm.key] || 0;
              const pct = totalRevenue > 0 ? (rev / totalRevenue) * 100 : 0;

              return (
                <div key={pm.key} className="space-y-1.5 p-3 bg-stone-950 rounded-2xl border border-stone-800">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-stone-300">{pm.label}</span>
                    <span className="text-amber-400">${rev.toFixed(2)} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pm.color}`}
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
