// boutique-frontend/app/(customer)/account/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  FiUser, FiPackage, FiMessageSquare, FiLogOut,
  FiShoppingBag, FiChevronRight, FiEdit2, FiHeart,
  FiMapPin, FiClock,
} from 'react-icons/fi';
import api from '@/lib/api';  // <-- CHANGED from apiClient to api
import API from '@/lib/endpoints';
import { formatPrice } from '@/lib/currency';  // <-- ADDED IMPORT

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const res = await api.get(API.USER.ORDERS);  // <-- CHANGED
      if (res.data.success) setOrders(res.data.data.orders || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (!isAuthenticated) return null;

  const orderCount   = orders.length;
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const recentOrders = orders.slice(0, 3);

  const statusColor = (s) => ({
    pending:   'bg-yellow-100 text-yellow-700',
    approved:  'bg-blue-100 text-blue-700',
    shipped:   'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }[s] || 'bg-gray-100 text-gray-600');

  const menuItems = [
    {
      icon: FiUser,
      label: 'Profile Information',
      desc: 'Update your name, email & password',
      href: '/account/profile',
      color: 'bg-pink-50 text-pink-600',
    },
    {
      icon: FiPackage,
      label: 'My Orders',
      desc: `${orderCount} order${orderCount !== 1 ? 's' : ''} placed`,
      href: '/account/orders',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: FiMessageSquare,
      label: 'Chat Support',
      desc: 'Talk with our support team',
      href: '/account/chat',
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero banner ── */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-black border-2 border-white/30 shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium mb-1 font-inter">Welcome back 👋</p>
                <h1 className="font-playfair text-2xl md:text-3xl font-black">{user?.name}</h1>
                <p className="text-white/60 text-sm mt-1 font-inter">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
            >
              <FiLogOut size={15} /> Logout
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: 'Total Orders',   value: orderCount },
              { label: 'Pending',        value: pendingCount },
              { label: 'Member Since',   value: user?.created_at ? new Date(user.created_at).getFullYear() : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/10">
                <p className="text-2xl font-black">{value}</p>
                <p className="text-white/60 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Menu cards ── */}
        <div className="grid sm:grid-cols-3 gap-4">
          {menuItems.map(({ icon: Icon, label, desc, href, color }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-pink-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
                  <Icon size={22} />
                </div>
                <FiChevronRight size={18} className="text-gray-300 group-hover:text-pink-500 group-hover:translate-x-1 transition-all mt-1" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1 group-hover:text-pink-600 transition-colors">{label}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </Link>
          ))}
        </div>

        {/* ── Recent orders ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <FiClock size={16} className="text-pink-600" /> Recent Orders
            </h2>
            <Link href="/account/orders" className="text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1">
              View all <FiChevronRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-2 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <FiPackage size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No orders yet</p>
              <Link href="/products" className="inline-block mt-3 text-sm text-pink-600 font-medium hover:underline">
                Start shopping →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">#{order.order_number}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{formatPrice(order.total_amount)}</p>  {/* <-- CHANGED */}
                    <Link href={`/account/orders/${order.order_number}`} className="text-xs text-pink-600 hover:underline mt-0.5 inline-block">
                      Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Continue shopping banner ── */}
        <div className="relative bg-gray-900 rounded-2xl overflow-hidden p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-pink-500 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <p className="text-white/60 text-sm mb-1">Ready to shop?</p>
            <h3 className="text-white text-xl font-black">Explore New Collections</h3>
            <p className="text-white/50 text-sm mt-1">Fresh styles added every week</p>
          </div>
          <Link
            href="/products"
            className="relative z-10 flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full font-bold text-sm transition-colors whitespace-nowrap"
          >
            <FiShoppingBag size={16} /> Shop Now
          </Link>
        </div>

        {/* Mobile logout */}
        <button
          onClick={() => { logout(); router.push('/'); }}
          className="sm:hidden w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 py-3 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
        >
          <FiLogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}