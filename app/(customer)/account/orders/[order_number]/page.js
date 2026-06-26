// boutique-frontend/app/(customer)/account/orders/[order_number]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import API from '@/lib/endpoints';
import {
  FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle,
  FiArrowLeft, FiMapPin, FiCreditCard, FiPhone, FiAlertCircle,
  FiCheck,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/currency';

const STATUS_CFG = {
  pending:   { color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200',  icon: FiClock,       label: 'Pending' },
  approved:  { color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200',      icon: FiPackage,     label: 'Approved' },
  shipped:   { color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200',  icon: FiTruck,       label: 'Shipped' },
  delivered: { color: 'text-green-600',  bg: 'bg-green-50 border-green-200',    icon: FiCheckCircle, label: 'Delivered' },
  cancelled: { color: 'text-red-600',    bg: 'bg-red-50 border-red-200',        icon: FiXCircle,     label: 'Cancelled' },
  rejected:  { color: 'text-red-600',    bg: 'bg-red-50 border-red-200',        icon: FiXCircle,     label: 'Rejected' },
};

const STEPS = [
  { status: 'pending',   label: 'Order Placed',   desc: 'We received your order',       icon: FiClock },
  { status: 'approved',  label: 'Confirmed',       desc: 'Your order is being prepared', icon: FiPackage },
  { status: 'shipped',   label: 'Shipped',         desc: 'Your order is on the way',     icon: FiTruck },
  { status: 'delivered', label: 'Delivered',       desc: 'Enjoy your purchase!',         icon: FiCheckCircle },
];

// ── Helper: calculate delivery window (3–5 working days) ──
const getDeliveryWindow = (createdAt) => {
  if (!createdAt) return { start: 'N/A', end: 'N/A' };
  const startDate = new Date(createdAt);
  const endDate = new Date(createdAt);
  let daysAdded = 0;
  while (daysAdded < 3) {
    startDate.setDate(startDate.getDate() + 1);
    if (startDate.getDay() !== 0 && startDate.getDay() !== 6) daysAdded++;
  }
  daysAdded = 0;
  while (daysAdded < 5) {
    endDate.setDate(endDate.getDate() + 1);
    if (endDate.getDay() !== 0 && endDate.getDay() !== 6) daysAdded++;
  }
  const format = (d) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  return { start: format(startDate), end: format(endDate) };
};

import { Suspense } from 'react';

function OrderDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const paymentStatus = searchParams.get('payment');

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (params.order_number) fetchOrder();
  }, [isAuthenticated, params.order_number]);

  useEffect(() => {
    if (paymentStatus === 'success' && order) {
      toast.success('🎉 Payment successful! Your order is confirmed.');
    }
  }, [paymentStatus, order]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${API.ORDER.DETAILS}?order_number=${params.order_number}`);
      if (res.data.success) setOrder(res.data.data.order);
      else toast.error('Order not found');
    } catch { toast.error('Failed to load order'); }
    finally { setLoading(false); }
  };

  const handleCancel = async () => {
    if (!confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await api.post(API.ORDER.CANCEL, { order_id: order.id });
      if (res.data.success) { toast.success('Order cancelled'); fetchOrder(); }
      else toast.error(res.data.message);
    } catch { toast.error('Cancellation failed'); }
    finally { setCancelling(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-2 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiAlertCircle size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold mb-4">Order not found</p>
          <Link href="/account/orders" className="text-pink-600 font-bold hover:underline">← Back to Orders</Link>
        </div>
      </div>
    );
  }

  const cfg = STATUS_CFG[order.status] || STATUS_CFG.pending;
  const StatusIcon = cfg.icon;
  const isCancelled = order.status === 'cancelled' || order.status === 'rejected';
  const currentStep = STEPS.findIndex(s => s.status === order.status);
  const deliveryWindow = getDeliveryWindow(order.created_at);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-4">
          <Link href="/account/orders" className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
            <FiArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="font-playfair text-2xl font-black text-gray-900">Order #{order.order_number}</h1>
            <p className="text-sm text-gray-400 font-inter">
              Placed on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${cfg.bg} ${cfg.color}`}>
            <StatusIcon size={14} /> {cfg.label}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── PERMANENT SUCCESS BANNER with 3–5 working days ── */}
        {paymentStatus === 'success' && (
          <div className="bg-gradient-to-r from-green-100 via-emerald-100 to-green-50 border-4 border-green-500 rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-2xl">
                <FiCheck size={48} className="text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-4xl font-extrabold text-green-800">🎉 Payment Successful!</h2>
                <p className="text-xl text-green-700 mt-2">
                  Your order has been confirmed.
                </p>
                <p className="text-lg text-green-700 mt-1 font-bold">
                  Delivery in 3–5 working days
                </p>
                <p className="text-base text-green-600 mt-1">
                  Estimated delivery window:{' '}
                  <strong>{deliveryWindow.start}</strong> – <strong>{deliveryWindow.end}</strong>
                </p>
                <p className="text-sm text-green-500 mt-2">
                  We'll send you a notification when your order is shipped.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Progress tracker ── */}
        {!isCancelled && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-black text-gray-900 mb-6">Order Progress</h2>
            <div className="relative">
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 hidden sm:block" />
              <div
                className="absolute top-5 left-5 h-0.5 bg-pink-500 hidden sm:block transition-all duration-500"
                style={{ width: `${currentStep >= 0 ? (currentStep / (STEPS.length - 1)) * 100 : 0}%`, right: 'auto' }}
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
                {STEPS.map((step, idx) => {
                  const done    = idx < currentStep;
                  const active  = idx === currentStep;
                  const StepIcon = step.icon;
                  return (
                    <div key={step.status} className="flex flex-col items-center text-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        done   ? 'bg-pink-600 border-pink-600 text-white' :
                        active ? 'bg-white border-pink-600 text-pink-600 shadow-lg shadow-pink-100' :
                                 'bg-white border-gray-200 text-gray-300'
                      }`}>
                        {done ? <FiCheckCircle size={18} /> : <StepIcon size={18} />}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${active ? 'text-pink-600' : done ? 'text-gray-700' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                        <p className="text-[10px] text-gray-400 hidden sm:block">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Cancelled banner ── */}
        {isCancelled && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <FiXCircle size={24} className="text-red-500" />
            </div>
            <div>
              <p className="font-bold text-red-700">Order {cfg.label}</p>
              <p className="text-sm text-red-500">This order has been {order.status}. Contact support if you have questions.</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* ── Shipping info ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
              <FiMapPin size={16} className="text-pink-600" /> Shipping Address
            </h3>
            <p className="text-sm text-gray-700 font-semibold mb-1">{order.shipping_address}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
              <FiPhone size={13} /> {order.shipping_phone}
            </div>
          </div>

          {/* ── Payment info ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
              <FiCreditCard size={16} className="text-pink-600" /> Payment Details
            </h3>
            <p className="text-sm text-gray-700 font-semibold capitalize mb-1">
              {order.payment_method?.replace('_', ' ')}
            </p>
            <p className="text-xs text-gray-400">Order placed {new Date(order.created_at).toLocaleString()}</p>
          </div>
        </div>

        {/* ── Items ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="font-black text-gray-900 flex items-center gap-2">
              <FiPackage size={16} className="text-pink-600" /> Items Ordered
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {order.items?.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                  <FiPackage size={20} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{item.product_name}</p>
                  <div className="flex gap-3 mt-1">
                    {item.size  && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Size: {item.size}</span>}
                    {item.color && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Color: {item.color}</span>}
                    <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                  </div>
                </div>
                <p className="font-black text-gray-900 text-sm shrink-0">
                  {formatPrice(item.price_at_time * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500">{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}</span>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">Order Total</p>
              <p className="text-xl font-black text-pink-600">{formatPrice(order.total_amount)}</p>
            </div>
          </div>
        </div>

        {/* ── Cancel button ── */}
        {order.status === 'pending' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-800">Need to cancel?</p>
              <p className="text-sm text-gray-500">You can cancel this order while it's still pending.</p>
            </div>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="flex items-center gap-2 border-2 border-red-200 text-red-600 hover:bg-red-50 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
            >
              {cancelling ? 'Cancelling…' : <><FiXCircle size={15} /> Cancel Order</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-10 h-10 border-2 border-pink-200 border-t-pink-600 rounded-full animate-spin" /></div>}>
      <OrderDetailsContent />
    </Suspense>
  );
}