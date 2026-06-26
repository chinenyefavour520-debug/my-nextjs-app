// boutique-frontend/app/(customer)/checkout/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import API from '@/lib/endpoints';
import {
  FiCheck, FiTruck, FiShield, FiArrowLeft, FiMapPin,
  FiUser, FiMail, FiPhone, FiCreditCard, FiLock,
  FiChevronRight, FiPackage,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/currency';

const STEPS = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    payment_method: 'paystack',
    notes: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user) {
      setForm((f) => ({ ...f, full_name: user.name || '', email: user.email || '' }));
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (cart && (!cart.items || cart.items.length === 0)) {
      router.push('/cart');
    }
  }, [cart]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ── UPDATED handleSubmit ──
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // 1. Create the order
      const orderRes = await api.post(API.ORDER.CREATE, {
        shipping_address: `${form.address}, ${form.city}, ${form.state} ${form.zip_code}`,
        shipping_phone: form.phone,
        payment_method: form.payment_method,
        notes: form.notes,
      });

      if (!orderRes.data.success) {
        toast.error(orderRes.data.message || 'Order creation failed');
        setSubmitting(false);
        return;
      }

      const order = orderRes.data.data.order;

      // 2. Payment method is always Paystack – initialize payment
      if (form.payment_method === 'paystack') {
        const initRes = await api.post('/api/payment/initialize.php', {
          order_id: order.id,
        });
        
        if (initRes.data.success) {
          // ── Clear cart ONLY after payment init succeeds ──
          await clearCart();
          // Redirect to Paystack payment page
          window.location.href = initRes.data.data.authorization_url;
          return;
        } else {
          toast.error(initRes.data.message || 'Payment initialization failed');
          setSubmitting(false);
          return;
        }
      }

      // 3. For other payment methods (if any) – clear cart and go to order details
      await clearCart();
      toast.success('Order placed successfully!');
      router.push(`/account/orders/${order.order_number}`);
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart?.items) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
      </div>
    );
  }

  const subtotal = cart.subtotal || 0;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const inputCls =
    'w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top bar ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-gray-500 hover:text-pink-600 transition-colors text-sm font-medium font-inter"
          >
            <FiArrowLeft size={16} /> Back to Cart
          </Link>
          <span className="font-playfair text-xl font-black text-gray-900">
            <span className="text-pink-600 italic">Fay's</span> Luxe
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-400 font-inter">
            <FiLock size={12} /> Secure Checkout
          </div>
        </div>
      </div>

      {/* ── Step indicator ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      i < step
                        ? 'bg-green-500 text-white'
                        : i === step
                        ? 'bg-pink-600 text-white shadow-lg shadow-pink-200'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {i < step ? <FiCheck size={14} /> : i + 1}
                  </div>
                  <span
                    className={`text-sm font-semibold hidden sm:block ${
                      i === step ? 'text-pink-600' : i < step ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-16 sm:w-24 h-0.5 mx-3 transition-all ${
                      i < step ? 'bg-green-400' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Left: Form ── */}
          <div className="flex-1 space-y-6">
            {/* Step 0 — Shipping */}
            {step === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                    <FiMapPin size={18} className="text-pink-600" />
                  </div>
                  <div>
                    <h2 className="font-black text-gray-900">Shipping Information</h2>
                    <p className="text-xs text-gray-400">Where should we deliver your order?</p>
                  </div>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-5">
                  {[
                    { name: 'full_name', label: 'Full Name', icon: FiUser, type: 'text', span: false },
                    { name: 'email', label: 'Email Address', icon: FiMail, type: 'email', span: false },
                    { name: 'phone', label: 'Phone Number', icon: FiPhone, type: 'tel', span: false },
                    { name: 'address', label: 'Street Address', icon: FiMapPin, type: 'text', span: true },
                    { name: 'city', label: 'City', icon: FiMapPin, type: 'text', span: false },
                    { name: 'state', label: 'State', icon: FiMapPin, type: 'text', span: false },
                    { name: 'zip_code', label: 'ZIP Code', icon: FiMapPin, type: 'text', span: false },
                  ].map(({ name, label, icon: Icon, type, span }) => (
                    <div key={name} className={span ? 'md:col-span-2' : ''}>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                        {label} *
                      </label>
                      <div className="relative">
                        <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={type}
                          name={name}
                          required
                          value={form[name]}
                          onChange={handleChange}
                          className={inputCls}
                          placeholder={label}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Special delivery instructions..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 focus:bg-white transition-all resize-none"
                    />
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <button
                    onClick={() => {
                      if (
                        !form.full_name ||
                        !form.phone ||
                        !form.address ||
                        !form.city ||
                        !form.state ||
                        !form.zip_code
                      ) {
                        toast.error('Please fill in all required fields');
                        return;
                      }
                      setStep(1);
                    }}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    Continue to Payment <FiChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 1 — Payment */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                    <FiCreditCard size={18} className="text-pink-600" />
                  </div>
                  <div>
                    <h2 className="font-black text-gray-900">Payment Method</h2>
                    <p className="text-xs text-gray-400">You will be redirected to Paystack for secure payment</p>
                  </div>
                </div>
                <div className="p-6">
                  <label
                    className="flex items-center gap-4 p-5 rounded-xl border-2 border-pink-500 bg-pink-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="paystack"
                      checked={form.payment_method === 'paystack'}
                      onChange={handleChange}
                      className="accent-pink-600"
                    />
                    <span className="text-2xl">💳</span>
                    <div>
                      <p className="font-bold text-gray-800">Pay with Paystack</p>
                      <p className="text-xs text-gray-500">Secure online payment – all major cards accepted</p>
                    </div>
                    <div className="ml-auto w-6 h-6 rounded-full bg-pink-600 flex items-center justify-center">
                      <FiCheck size={12} className="text-white" />
                    </div>
                  </label>
                  <p className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                    <FiLock size={12} /> Your payment is securely handled by Paystack
                  </p>
                </div>
                <div className="px-6 pb-6 flex gap-3">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 border border-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    Review Order <FiChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Review */}
            {step === 2 && (
              <div className="space-y-4">
                {/* Shipping summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-gray-900 flex items-center gap-2">
                      <FiMapPin size={16} className="text-pink-600" /> Shipping To
                    </h3>
                    <button onClick={() => setStep(0)} className="text-xs text-pink-600 font-semibold hover:underline">
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 font-semibold">{form.full_name}</p>
                  <p className="text-sm text-gray-500">
                    {form.address}, {form.city}, {form.state} {form.zip_code}
                  </p>
                  <p className="text-sm text-gray-500">{form.phone}</p>
                </div>

                {/* Payment summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-gray-900 flex items-center gap-2">
                      <FiCreditCard size={16} className="text-pink-600" /> Payment
                    </h3>
                    <button onClick={() => setStep(1)} className="text-xs text-pink-600 font-semibold hover:underline">
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 font-semibold capitalize">Paystack (Online Payment)</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 bg-gray-900 hover:bg-gray-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{' '}
                        Processing…
                      </>
                    ) : (
                      <>
                        <FiCheck size={18} /> Pay & Place Order • {formatPrice(total)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Order summary ── */}
          <div className="lg:w-96">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                  <FiPackage size={18} className="text-gray-600" />
                </div>
                <h2 className="font-black text-gray-900">Order Summary</h2>
              </div>

              {/* Items */}
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-6 py-3">
                    <img
                      src={item.primary_image || 'https://placehold.co/48x48/f3f4f6/9ca3af?text=?'}
                      alt={item.product_name}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.product_name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-800">{formatPrice(item.item_total)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="px-6 py-5 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (10%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-lg text-gray-900">
                  <span>Total</span>
                  <span className="text-pink-600">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Trust */}
              <div className="px-6 pb-5 grid grid-cols-3 gap-2">
                {[
                  { icon: FiLock, label: 'Secure' },
                  { icon: FiTruck, label: 'Fast Ship' },
                  { icon: FiShield, label: 'Guarantee' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-3">
                    <Icon size={16} className="text-pink-600" />
                    <span className="text-xs text-gray-500 font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}