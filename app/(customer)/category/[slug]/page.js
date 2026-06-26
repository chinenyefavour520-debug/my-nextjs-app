// boutique-frontend/app/(customer)/category/[slug]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '@/lib/api';  // <-- Changed from apiClient
import API from '@/lib/endpoints';
import { formatPrice } from '@/lib/currency';  // <-- Added import

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const slug = params.slug;
  
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1 });

  const page = 1;

  useEffect(() => {
    if (slug) {
      fetchCategoryAndProducts();
    }
  }, [slug]);

  const fetchCategoryAndProducts = async () => {
    setLoading(true);
    try {
      // Get category info
      const catResponse = await api.get(`${API.CATEGORY.SUBCATEGORIES}?slug=${slug}`);
      if (catResponse.data.success && catResponse.data.data.category) {
        setCategory(catResponse.data.data.category);
        
        // Get products in this category
        const productsResponse = await api.get(`${API.PRODUCT.BY_CATEGORY}?slug=${slug}&limit=20`);
        if (productsResponse.data.success) {
          setProducts(productsResponse.data.data.products || []);
          setPagination(productsResponse.data.data.pagination || { current_page: 1, total_pages: 1 });
        }
      } else {
        toast.error('Category not found');
        router.push('/');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load category');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">
          <Link href="/" className="hover:text-pink-600">Home</Link> / 
          <span className="text-gray-700"> {category?.name || slug}</span>
        </div>
        <h1 className="font-playfair text-4xl md:text-5xl font-black text-gray-900">{category?.name || slug}</h1>
        <p className="text-gray-600 mt-2">{category?.description}</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <CategoryProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryProductCard({ product, onAddToCart }) {
  const [imageError, setImageError] = useState(false);
  const productImage = !imageError && product.primary_image ? product.primary_image : 'https://via.placeholder.com/300x300';
  const hasDiscount = product.compare_price && parseFloat(product.compare_price) > parseFloat(product.price);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group">
      <Link href={`/products/${product.slug || product.id}`}>
        <div className="relative h-64 overflow-hidden bg-gray-100">
          <img src={productImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition" onError={() => setImageError(true)} />
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">SALE</span>
          )}
          <button onClick={(e) => onAddToCart(product.id, e)} className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition flex items-center gap-2">
            <FiShoppingCart size={16} /> Quick Add
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map(star => <FiStar key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
          </div>
          <span className="text-pink-600 font-bold text-lg">{formatPrice(product.price)}</span>
        </div>
      </Link>
    </div>
  );
}