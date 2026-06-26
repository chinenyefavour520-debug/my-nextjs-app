'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { FiShoppingCart, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api';
import API from '@/lib/endpoints';

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (query) {
      performSearch();
    } else {
      setLoading(false);
      setProducts([]);
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`${API.PRODUCT.SEARCH}?q=${encodeURIComponent(query)}`);
      if (response.data.success) {
        setProducts(response.data.data.products || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleAddToCart = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login first');
      router.push('/login');
      return;
    }
    const result = await addToCart(productId, null, 1);
    if (!result.success) toast.error(result.message);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs font-bold text-pink-600 uppercase tracking-widest mb-1 font-inter">Fay's Luxe</p>
          <h1 className="font-playfair text-4xl md:text-5xl font-black text-gray-900 mb-6">Search Products</h1>
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for dresses, shoes, bags…"
              className="flex-1 px-5 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 focus:bg-white transition-all font-inter"
            />
            <button type="submit" className="bg-pink-600 text-white px-6 py-3.5 rounded-xl hover:bg-pink-700 flex items-center gap-2 font-bold text-sm font-inter transition-colors">
              <FiSearch size={16} /> Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {query && (
        <div className="mb-6">
          <p className="font-cormorant text-2xl text-gray-700">Results for: <em className="text-pink-600">"{query}"</em></p>
          <p className="text-gray-500 text-sm font-inter mt-1">{products.length} products found</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <FiSearch className="mx-auto text-gray-400 text-6xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-gray-500">Try different keywords or browse our categories</p>
          <Link href="/products" className="inline-block mt-4 text-pink-600">View all products →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <SearchProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

function SearchProductCard({ product, onAddToCart }) {
  const [imageError, setImageError] = useState(false);
  const productImage = !imageError && product.primary_image ? product.primary_image : 'https://placehold.co/600x600/f3f4f6/9ca3af?text=No+Image';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group">
      <Link href={`/products/${product.slug || product.id}`}>
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img src={productImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition" onError={() => setImageError(true)} />
          <button onClick={(e) => onAddToCart(product.id, e)} className="absolute bottom-2 right-2 bg-pink-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
            <FiShoppingCart size={16} />
          </button>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{product.name}</h3>
          <span className="text-pink-600 font-bold">${parseFloat(product.price).toFixed(2)}</span>
        </div>
      </Link>
    </div>
  );
}
