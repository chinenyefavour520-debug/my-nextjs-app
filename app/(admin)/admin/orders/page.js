// boutique-frontend/app/(admin)/admin/orders/page.js
'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import API from '@/lib/endpoints';
import { FiEye, FiCheck, FiX, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/currency';

export default function AdminOrdersPage() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const res = await api.get(`${API.ADMIN.ORDERS.LIST}${params}`);
      if (res.data.success) setOrders(res.data.data.orders || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const doAction = async (endpoint, payload, successMsg) => {
    setActionLoading(true);
    try {
      const res = await api.post(endpoint, payload);
      if (res.data.success) {
        toast.success(successMsg);
        fetchOrders();
        setSelected(null);
      } else {
        toast.error(res.data.message || 'Action failed');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const statusColor = (s) => ({
    pending:   'bg-yellow-100 text-yellow-800',
    approved:  'bg-blue-100 text-blue-800',
    shipped:   'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }[s] || 'bg-gray-100 text-gray-800');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Orders</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="text-left px-6 py-3">Order #</th>
                  <th className="text-left px-6 py-3">Customer</th>
                  <th className="text-left px-6 py-3">Amount</th>
                  <th className="text-left px-6 py-3">Payment</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-10 text-gray-400">No orders found</td></tr>
                ) : orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">#{order.order_number}</td>
                    <td className="px-6 py-4">{order.customer_name}</td>
                    <td className="px-6 py-4 font-semibold">{formatPrice(order.total_amount)}</td>
                    <td className="px-6 py-4 capitalize">{order.payment_method?.replace('_', ' ')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelected(order)}
                        className="text-pink-600 hover:text-pink-700"
                        title="View details"
                      >
                        <FiEye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-bold">Order #{selected.order_number}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-500">Customer</p><p className="font-semibold">{selected.customer_name}</p></div>
                <div><p className="text-gray-500">Status</p><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(selected.status)}`}>{selected.status.toUpperCase()}</span></div>
                <div><p className="text-gray-500">Shipping Address</p><p>{selected.shipping_address}</p></div>
                <div><p className="text-gray-500">Phone</p><p>{selected.shipping_phone}</p></div>
                <div><p className="text-gray-500">Payment</p><p className="capitalize">{selected.payment_method?.replace('_', ' ')}</p></div>
                <div><p className="text-gray-500">Date</p><p>{new Date(selected.created_at).toLocaleString()}</p></div>
              </div>

              {selected.items?.length > 0 && (
                <div>
                  <p className="font-semibold mb-2">Items</p>
                  <div className="space-y-2">
                    {selected.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm border-b pb-2">
                        <span>{item.quantity}× {item.product_name}</span>
                        <span className="font-semibold">{formatPrice(item.price_at_time * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-right font-bold mt-2">Total: {formatPrice(selected.total_amount)}</div>
                </div>
              )}

              {/* ── Action Buttons ── */}
              <div className="flex flex-wrap gap-3 pt-2">
                {selected.status === 'pending' && (
                  <>
                    <button
                      onClick={() => doAction(API.ADMIN.ORDERS.APPROVE, { order_id: selected.id }, 'Order approved')}
                      disabled={actionLoading}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                    >
                      <FiCheck /> Approve
                    </button>
                    <button
                      onClick={() => doAction(API.ADMIN.ORDERS.REJECT, { order_id: selected.id }, 'Order rejected')}
                      disabled={actionLoading}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
                    >
                      <FiX /> Reject
                    </button>
                  </>
                )}
                {selected.status === 'approved' && (
                  <button
                    onClick={() => doAction(API.ADMIN.ORDERS.MARK_SHIPPED, { order_id: selected.id }, 'Marked as shipped')}
                    disabled={actionLoading}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm"
                  >
                    <FiTruck /> Mark Shipped
                  </button>
                )}
                {selected.status === 'shipped' && (
                  <button
                    onClick={() => doAction(API.ADMIN.ORDERS.MARK_DELIVERED, { order_id: selected.id }, 'Marked as delivered')}
                    disabled={actionLoading}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                  >
                    <FiCheck /> Mark Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}