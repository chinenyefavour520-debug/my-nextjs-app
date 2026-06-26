'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  FiShoppingCart, FiStar, FiFilter, FiX, FiHeart,
  FiGrid, FiList, FiChevronLeft, FiChevronRight, FiSearch,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '@/lib/api';  // <-- CHANGED from apiClient to api
import API from '@/lib/endpoints';
import { formatPrice } from '@/lib/currency';  // <-- ADDED IMPORT

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const { addToCart }      = useCart();
  const { isAuthenticated } = useAuth();

  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total: 0 });
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode]     = useState('grid'); // grid | list
  const [filters, setFilters] = useState({
    category_id: searchParams.get('category') || '',
    min_price:   '',
    max_price:   '',
    sort_by:     'created_at',
    sort_order:  'DESC',
  });

  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProducts(); }, [page, filters]);

  const fetchCategories = async () => {
    try {
      const res = await api.get(API.CATEGORY.ALL);  // <-- CHANGED
      if (res.data.success) setCategories(res.data.data.categories || []);
    } catch (e) { console.error(e); }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const clean  = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
      const params = new URLSearchParams({ page, limit: 12, ...clean });
      const res    = await api.get(`${API.PRODUCT.LIST}?${params}`);  // <-- CHANGED
      if (res.data.success) {
        setProducts(res.data.data.products || []);
        setPagination(res.data.data.pagination || { current_page: 1, total_pages: 1, total: 0 });
      }
    } catch (e) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId, e) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please login first'); router.push('/login'); return; }
    const result = await addToCart(productId, null, 1);
    if (!result.success) toast.error(result.message);
  };

  const setFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value }));
    router.push('/products');
  };

  const clearFilters = () => {
    setFilters({ category_id: '', min_price: '', max_price: '', sort_by: 'created_at', sort_order: 'DESC' });
    router.push('/products');
  };

  const activeFilterCount = [filters.category_id, filters.min_price, filters.max_price]
    .filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-pink-600 uppercase tracking-widest mb-1 font-inter">Fay's Luxe</p>
              <h1 className="font-playfair text-4xl md:text-5xl font-black text-gray-900">All Products</h1>
              <p className="text-gray-500 mt-1 font-inter">
                {loading ? 'Loading…' : `${pagination.total || products.length} products`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* View toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow text-pink-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <FiGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow text-pink-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <FiList size={16} />
                </button>
              </div>

              {/* Sort */}
              <select
                value={`${filters.sort_by}:${filters.sort_order}`}
                onChange={e => {
                  const [sort_by, sort_order] = e.target.value.split(':');
                  setFilters(f => ({ ...f, sort_by, sort_order }));
                  router.push('/products');
                }}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
              >
                <option value="created_at:DESC">Newest First</option>
                <option value="price:ASC">Price: Low to High</option>
                <option value="price:DESC">Price: High to Low</option>
                <option value="name:ASC">Name A–Z</option>
              </select>

              {/* Filter toggle (mobile) */}
              <button
                onClick={() => setShowFilters(o => !o)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  showFilters || activeFilterCount > 0
                    ? 'bg-pink-600 text-white border-pink-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300'
                }`}
              >
                <FiFilter size={15} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-white text-pink-600 text-xs font-black flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">

          {/* ── Sidebar filters ── */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-64 shrink-0`}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="font-black text-gray-900">Filters</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-pink-600 font-bold hover:underline flex items-center gap-1">
                    <FiX size={12} /> Clear all
                  </button>
                )}
              </div>

              {/* Category */}
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Category</p>
                <div className="space-y-1">
                  <button
                    onClick={() => setFilter('category_id', '')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      !filters.category_id ? 'bg-pink-50 text-pink-600 font-bold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setFilter('category_id', cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        filters.category_id == cat.id ? 'bg-pink-50 text-pink-600 font-bold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="px-5 py-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Price Range (₦)</p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 mb-1 block">Min (₦)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={filters.min_price}
                      onChange={e => setFilter('min_price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 mb-1 block">Max (₦)</label>
                    <input
                      type="number"
                      placeholder="999"
                      value={filters.max_price}
                      onChange={e => setFilter('max_price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Products ── */}
          <div className="flex-1 min-w-0">
            {loading && products.length === 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-64 bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiSearch size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-black text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters</p>
                <button onClick={clearFilters} className="bg-pink-600 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-pink-700 transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}>
                  {products.map(product => (
                    viewMode === 'grid'
                      ? <GridCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                      : <ListCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.total_pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => router.push(`/products?page=${page - 1}`)}
                      disabled={page <= 1}
                      className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:border-pink-300 hover:text-pink-600 disabled:opacity-40 transition-all"
                    >
                      <FiChevronLeft size={16} />
                    </button>

                    {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                      let p;
                      if (pagination.total_pages <= 5) p = i + 1;
                      else if (page <= 3) p = i + 1;
                      else if (page >= pagination.total_pages - 2) p = pagination.total_pages - 4 + i;
                      else p = page - 2 + i;
                      return (
                        <button
                          key={p}
                          onClick={() => router.push(`/products?page=${p}`)}
                          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                            p === page
                              ? 'bg-pink-600 text-white shadow-md shadow-pink-200'
                              : 'border border-gray-200 text-gray-600 hover:border-pink-300 hover:text-pink-600'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => router.push(`/products?page=${page + 1}`)}
                      disabled={page >= pagination.total_pages}
                      className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:border-pink-300 hover:text-pink-600 disabled:opacity-40 transition-all"
                    >
                      <FiChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Grid Card ────────────────────────────────────────────────────────────────
function GridCard({ product, onAddToCart }) {
  const [imgErr, setImgErr]       = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const img  = !imgErr && product.primary_image ? product.primary_image : 'https://placehold.co/600x600/f3f4f6/9ca3af?text=No+Image';
  const slug = product.slug || product.id;
  const hasDiscount = product.compare_price && parseFloat(product.compare_price) > parseFloat(product.price);
  const pct  = hasDiscount ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-pink-100 hover:shadow-xl transition-all duration-300">
      <Link href={`/products/${slug}`}>
        <div className="relative h-64 overflow-hidden bg-gray-50">
          <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={() => setImgErr(true)} />
          {hasDiscount && <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">-{pct}%</span>}
          <button onClick={e => { e.preventDefault(); setWishlisted(w => !w); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <FiHeart size={14} className={wishlisted ? 'fill-pink-600 text-pink-600' : 'text-gray-400'} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button onClick={e => onAddToCart(product.id, e)} className="w-full bg-gray-900 hover:bg-pink-600 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
              <FiShoppingCart size={14} /> Quick Add
            </button>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${slug}`}>
          <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 hover:text-pink-600 transition-colors min-h-[40px] mb-2">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          {[1,2,3,4,5].map(s => <FiStar key={s} size={11} className="fill-amber-400 text-amber-400" />)}
          <span className="text-xs text-gray-400 ml-1">(12)</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-pink-600 font-bold">{formatPrice(product.price)}</span>
            {hasDiscount && <span className="text-gray-400 text-xs line-through">{formatPrice(product.compare_price)}</span>}
          </div>
          <button onClick={e => onAddToCart(product.id, e)} className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-600 text-pink-600 hover:text-white flex items-center justify-center transition-colors">
            <FiShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── List Card ────────────────────────────────────────────────────────────────
function ListCard({ product, onAddToCart }) {
  const [imgErr, setImgErr] = useState(false);
  const img  = !imgErr && product.primary_image ? product.primary_image : 'https://placehold.co/200x200/f3f4f6/9ca3af?text=?';
  const slug = product.slug || product.id;
  const hasDiscount = product.compare_price && parseFloat(product.compare_price) > parseFloat(product.price);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:border-pink-100 hover:shadow-md transition-all overflow-hidden flex">
      <Link href={`/products/${slug}`} className="shrink-0">
        <div className="w-36 h-36 sm:w-48 sm:h-48 overflow-hidden bg-gray-50">
          <img src={img} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" onError={() => setImgErr(true)} />
        </div>
      </Link>
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <Link href={`/products/${slug}`}>
            <h3 className="font-bold text-gray-800 hover:text-pink-600 transition-colors mb-1">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map(s => <FiStar key={s} size={11} className="fill-amber-400 text-amber-400" />)}
            <span className="text-xs text-gray-400 ml-1">(12 reviews)</span>
          </div>
          {product.description && <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>}
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-pink-600 font-black text-xl">{formatPrice(product.price)}</span>
            {hasDiscount && <span className="text-gray-400 text-sm line-through">{formatPrice(product.compare_price)}</span>}
          </div>
          <button
            onClick={e => onAddToCart(product.id, e)}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
          >
            <FiShoppingCart size={14} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}