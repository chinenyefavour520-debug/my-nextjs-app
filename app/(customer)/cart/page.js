// boutique-frontend/app/(customer)/cart/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  FiTrash2, FiMinus, FiPlus, FiShoppingBag,
  FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiLock,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/currency';  // <-- ADDED IMPORT AT TOP

export default function CartPage() {
  const router = useRouter();
  const { cart, loading, updateQuantity, removeFromCart, clearCart, fetchCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [updating, setUpdating] = useState(null); // holds item id being updated

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated]);

  const handleQty = async (itemId, newQty) => {
    if (newQty < 1) { handleRemove(itemId); return; }
    setUpdating(itemId);
    await updateQuantity(itemId, newQty);
    setUpdating(null);
  };

  const handleRemove = async (itemId) => {
    setUpdating(itemId);
    await removeFromCart(itemId);
    setUpdating(null);
  };

  const handleClear = async () => {
    if (!confirm('Clear your entire cart?')) return;
    setUpdating('all');
    await clearCart();
    setUpdating(null);
  };

  /* ── Empty / loading states ── */
  if (!isAuthenticated) {
    return (
      <EmptyState
        icon="🛍️"
        title="Your cart is waiting"
        desc="Sign in to view and manage your cart"
        cta="Sign In"
        href="/login"
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <EmptyState
        icon="🛒"
        title="Your cart is empty"
        desc="Looks like you haven't added anything yet"
        cta="Start Shopping"
        href="/products"
      />
    );
  }

  const subtotal = cart.subtotal || 0;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax      = subtotal * 0.1;
  const total    = subtotal + shipping + tax;
  const savings  = cart.items.reduce((acc, item) => {
    const compare = parseFloat(item.compare_price || 0);
    const price   = parseFloat(item.product_price || 0);
    return compare > price ? acc + (compare - price) * item.quantity : acc;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold text-pink-600 uppercase tracking-widest mb-1 font-inter">
                Fay's Luxe
              </p>
              <h1 className="font-playfair text-4xl md:text-5xl font-black text-gray-900">
                Shopping Bag
              </h1>
              <p className="text-gray-500 mt-2 font-inter">
                {cart.item_count} {cart.item_count === 1 ? 'item' : 'items'} in your bag
              </p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-pink-600 transition-colors font-inter"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Cart items ── */}
          <div className="flex-1 space-y-4">

            {/* Savings banner */}
            {savings > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl px-5 py-3 flex items-center gap-3">
                <span className="text-2xl">🎉</span>
                <p className="text-sm font-bold text-green-700 font-inter">
                  You're saving <span className="text-green-600">{formatPrice(savings)}</span> on this order!
                </p>
              </div>
            )}

            {/* Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-50">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex gap-4 p-5 transition-opacity ${updating === item.id ? 'opacity-50' : ''}`}
                  >
                    {/* Product image */}
                    <Link href={`/products/${item.slug}`} className="shrink-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={item.primary_image || 'https://placehold.co/112x112/f3f4f6/9ca3af?text=?'}
                          alt={item.product_name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-playfair font-bold text-gray-900 text-lg hover:text-pink-600 transition-colors line-clamp-2 leading-tight"
                          >
                            {item.product_name}
                          </Link>
                          <div className="flex flex-wrap gap-2 mt-1.5">
                            {item.size  && <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-inter font-medium">Size: {item.size}</span>}
                            {item.color && <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-inter font-medium">Color: {item.color}</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={!!updating}
                          className="w-8 h-8 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors shrink-0"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Qty control */}
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => handleQty(item.id, item.quantity - 1)}
                            disabled={!!updating}
                            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
                          >
                            <FiMinus size={13} />
                          </button>
                          <span className="w-10 text-center text-sm font-bold text-gray-800 font-inter">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQty(item.id, item.quantity + 1)}
                            disabled={!!updating}
                            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
                          >
                            <FiPlus size={13} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-playfair font-black text-xl text-gray-900">
                            {formatPrice(item.item_total)}
                          </p>
                          <p className="text-xs text-gray-400 font-inter">
                            {formatPrice(item.product_price)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart actions */}
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-t border-gray-100">
                <Link
                  href="/products"
                  className="text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors font-inter flex items-center gap-1"
                >
                  ← Continue Shopping
                </Link>
                <button
                  onClick={handleClear}
                  disabled={!!updating}
                  className="text-sm text-gray-400 hover:text-red-500 transition-colors font-inter disabled:opacity-40"
                >
                  Clear bag
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: FiTruck,      label: 'Free Delivery',  sub: 'Orders over ₦50,000' },
                { icon: FiShield,     label: 'Secure Payment', sub: '100% protected' },
                { icon: FiRefreshCw,  label: 'Easy Returns',   sub: '30-day policy' },
                { icon: FiLock,       label: 'Safe Checkout',  sub: 'SSL encrypted' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-pink-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700 font-inter">{label}</p>
                    <p className="text-[10px] text-gray-400 font-inter">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Order summary ── */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">

              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="font-playfair text-2xl font-black text-gray-900">Order Summary</h2>
              </div>

              {/* Line items */}
              <div className="px-6 py-5 space-y-3 font-inter">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({cart.item_count} items)</span>
                  <span className="font-semibold text-gray-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                    {shipping === 0 ? '🎉 FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    Add <strong>{formatPrice(50 - subtotal)}</strong> more for free shipping
                  </p>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (10%)</span>
                  <span className="font-semibold text-gray-800">{formatPrice(tax)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>You save</span>
                    <span className="font-bold">-{formatPrice(savings)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-baseline">
                  <span className="font-playfair text-lg font-bold text-gray-700">Total</span>
                  <span className="font-playfair text-3xl font-black text-pink-600">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="px-6 pb-6 pt-4 space-y-3">
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white py-4 rounded-xl font-bold font-inter text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-pink-200"
                >
                  Proceed to Checkout <FiArrowRight size={16} />
                </button>

                {/* WhatsApp order option */}
                <a
                  href={`https://wa.me/2348125633643?text=Hi Fay's Luxe! I'd like to place an order. My cart total is ${formatPrice(total)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-bold font-inter text-sm transition-colors"
                >
                  💬 Order via WhatsApp
                </a>

                <p className="text-center text-xs text-gray-400 font-inter flex items-center justify-center gap-1">
                  <FiLock size={11} /> Secure checkout — SSL encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Empty state component ── */
function EmptyState({ icon, title, desc, cta, href }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-6">{icon}</div>
        <h2 className="font-playfair text-4xl font-black text-gray-900 mb-3">{title}</h2>
        <p className="text-gray-500 font-inter mb-8 text-lg">{desc}</p>
        <Link
          href={href}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white px-8 py-4 rounded-full font-bold font-inter text-sm hover:opacity-90 transition-opacity shadow-lg shadow-pink-200"
        >
          {cta} <FiArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}