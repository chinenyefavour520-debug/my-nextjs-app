'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import API from '@/lib/endpoints';
import { FiShoppingBag, FiUsers, FiPackage, FiDollarSign, FiEye, FiClock } from 'react-icons/fi';
import { formatPrice } from '@/lib/currency';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get(API.ADMIN.DASHBOARD.STATS),
          api.get(API.ADMIN.DASHBOARD.RECENT_ORDERS),
        ]);
        if (statsRes.data.success) setStats(statsRes.data.data);
        if (ordersRes.data.success) setRecentOrders(ordersRes.data.data.orders || []);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusColor = (status) => {
    const map = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Revenue',
      value: formatPrice(stats?.revenue?.total || 0),
      sub: formatPrice(stats?.revenue?.this_month || 0) + ' this month',
      icon: FiDollarSign,
      color: 'bg-green-500',
    },
    {
      label: 'Total Orders',
      value: stats?.orders?.total ?? 0,
      sub: (stats?.orders?.pending ?? 0) + ' pending',
      icon: FiShoppingBag,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Products',
      value: stats?.products?.total ?? 0,
      sub: 'active listings',
      icon: FiPackage,
      color: 'bg-purple-500',
    },
    {
      label: 'Total Customers',
      value: stats?.users?.total ?? 0,
      sub: (stats?.users?.active ?? 0) + ' active',
      icon: FiUsers,
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-playfair text-3xl font-black text-gray-800">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-4 mb-2">
                <div className={`${card.color} p-3 rounded-lg text-white shrink-0`}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 pl-1">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {stats?.orders?.by_status?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.orders.by_status.map((item) => (
            <div key={item.status} className="bg-white rounded-xl shadow p-4 text-center">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 ${statusColor(item.status)}`}>
                {item.status.toUpperCase()}
              </span>
              <p className="text-2xl font-bold text-gray-800">{item.count}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl shadow">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FiClock size={18} className="text-pink-600" /> Recent Orders
          </h3>
          <Link href="/admin/orders" className="text-sm text-pink-600 hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="text-left px-6 py-3">Order #</th>
                <th className="text-left px-6 py-3">Customer</th>
                <th className="text-left px-6 py-3">Amount</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Date</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">No orders yet</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">#{order.order_number}</td>
                    <td className="px-6 py-4">{order.customer_name}</td>
                    <td className="px-6 py-4 font-semibold">{formatPrice(order.total_amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link href="/admin/orders" className="text-pink-600 hover:text-pink-700">
                        <FiEye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}