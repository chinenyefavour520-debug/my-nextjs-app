// boutique-frontend/components/product/ProductCard.js
// Product card for grid display

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/currency';  // <-- ✅ ADD THIS IMPORT

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const result = await addToCart(product.id, null, 1);
    if (!result.success) {
      toast.error(result.message);
    }
  };

  // Get primary image or placeholder
  const productImage = product.primary_image || product.images?.[0]?.image_url || 'https://placehold.co/600x600/f3f4f6/9ca3af?text=No+Image';

  return (
    <div className="card group">
      <Link href={`/products/${product.slug}`}>
        {/* Product Image */}
        <div className="relative h-64 overflow-hidden bg-gray-100">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Sale Badge */}
          {product.compare_price && product.compare_price > product.price && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Sale
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="text-pink-600 font-bold">{formatPrice(product.price)}</span>  {/* ✅ CHANGED */}
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-gray-400 text-sm line-through ml-2">
                  {formatPrice(product.compare_price)}  {/* ✅ CHANGED */}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-pink-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-pink-700"
            >
              <FiShoppingCart size={16} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}