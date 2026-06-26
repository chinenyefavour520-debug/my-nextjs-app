// boutique-frontend/app/(customer)/account/orders/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';  // <-- ADDED useSearchParams
import api from '@/lib/api';
import API from '@/lib/endpoints';
import {
  FiPackage, FiEye, FiArrowLeft, FiChevronRight,
  FiTruck, FiCheckCircle, FiClock, FiXCircle, FiShoppingBag,
  FiCheck,  // <-- ADDED FiCheck
} from 'react-icons/fi';
import { formatPrice } from '@/lib/currency';

const STATUS_CONFIG = {
  pending:   { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: FiClock,        label: 'Pending' },
  approved:  { color: 'bg-blue-100 text-blue-700 border-blue-200',       icon: FiPackage,      label: 'Approved' },
  shipped:   { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: FiTruck,        label: 'Shipped' },
  delivered: { color: 'bg-green-100 text-green-700 border-green-200',    icon: FiCheckCircle,  label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-700 border-red-200',          icon: FiXCircle,      label: 'Cancelled' },
  rejected:  { color: 'bg-red-100 text-red-700 border-red-200',          icon: FiXCircle,      label: 'Rejected' },
};

import { Suspense } from 'react';

function MyOrdersContent() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();  // <-- ADDED

  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');

  const paymentStatus = searchParams.get('payment');  // <-- ADDED

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(API.USER.ORDERS);
      if (res.data.success) setOrders(res.data.data.orders || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const tabs = [
    { key: 'all',       label: 'All',       count: orders.length },
    { key: 'pending',   label: 'Pending',   count: orders.filter(o => o.status === 'pending').length },
    { key: 'shipped',   label: 'Shipped',   count: orders.filter(o => o.status === 'shipped').length },
    { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-4">
          <Link href="/account" className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
            <FiArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-playfair text-2xl font-black text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-500 font-inter">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto pb-0 scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  filter === tab.key
                    ? 'border-pink-600 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    filter === tab.key ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── PERMANENT SUCCESS BANNER ── */}
        {paymentStatus === 'success' && (
          <div className="bg-gradient-to-r from-green-100 to-emerald-200 border-2 border-green-500 rounded-2xl p-6 mb-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-2xl">
                <FiCheck size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-800">✅ Payment Successful!</h3>
                <p className="text-green-700">
                  Your order is confirmed and will be delivered in <strong>3–5 working days</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">No orders found</h3>
            <p className="text-gray-500 text-sm mb-6">
              {filter === 'all' ? "You haven't placed any orders yet." : `No ${filter} orders.`}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-pink-700 transition-colors"
            >
              <FiShoppingBag size={16} /> Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const StatusIcon = cfg.icon;
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-pink-100 hover:shadow-md transition-all"
                >
                  {/* Order header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${cfg.color}`}>
                        <StatusIcon size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">#{order.order_number}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Order body */}
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Total Amount</p>
                        <p className="text-xl font-black text-gray-900">
                          {formatPrice(order.total_amount)}
                        </p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-xs text-gray-400 mb-0.5">Items</p>
                        <p className="font-semibold text-gray-700">
                          {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-xs text-gray-400 mb-0.5">Payment</p>
                        <p className="font-semibold text-gray-700 capitalize text-sm">
                          {order.payment_method?.replace('_', ' ') || '—'}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/account/orders/${order.order_number}`}
                      className="flex items-center gap-2 bg-gray-50 hover:bg-pink-50 text-gray-600 hover:text-pink-600 border border-gray-200 hover:border-pink-200 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    >
                      <FiEye size={15} /> Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex justify-center py-20"><div className="w-10 h-10 border-2 border-pink-200 border-t-pink-600 rounded-full animate-spin" /></div>}>
      <MyOrdersContent />
    </Suspense>
  );
}