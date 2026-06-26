// boutique-frontend/app/(customer)/products/[slug]/page.js
// Single product details page

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { FiShoppingCart, FiHeart, FiShare2, FiMinus, FiPlus, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '@/lib/api';  // <-- CHANGED from apiClient to api
import API from '@/lib/endpoints';
import { formatPrice } from '@/lib/currency';  // <-- ADDED IMPORT

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const slug = params.slug;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get(`${API.PRODUCT.DETAILS}?slug=${slug}`);  // <-- CHANGED
      if (response.data.success) {
        setProduct(response.data.data.product);
        if (response.data.data.product.variants?.length > 0) {
          setSelectedVariant(response.data.data.product.variants[0]);
        }
        
        // Fetch related products from same category
        if (response.data.data.product.category_id) {
          const relatedRes = await api.get(`${API.PRODUCT.LIST}?category_id=${response.data.data.product.category_id}&limit=4`);  // <-- CHANGED
          if (relatedRes.data.success) {
            setRelatedProducts((relatedRes.data.data.products || []).filter(p => p.id !== response.data.data.product.id));
          }
        }
      } else {
        toast.error('Product not found');
        router.push('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login first');
      router.push('/login');
      return;
    }
    
    const variantId = selectedVariant?.id || null;
    const result = await addToCart(product.id, variantId, quantity);
    if (result.success) {
      toast.success('Added to cart!');
    } else {
      toast.error(result.message);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (selectedVariant?.stock_quantity || 99)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Link href="/products" className="text-pink-600">Back to Products</Link>
        </div>
      </div>
    );
  }

  const productImages = product.images || [];
  const mainImage = productImages[selectedImage]?.image_url || product.primary_image || 'https://via.placeholder.com/600x600';
  const discount = product.compare_price && product.compare_price > product.price 
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-pink-600">Home</Link> / 
        <Link href={`/category/${product.category_slug}`} className="hover:text-pink-600"> {product.category_name}</Link> / 
        <span className="text-gray-700"> {product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img src={mainImage} alt={product.name} className="w-full h-96 object-cover" />
          </div>
          {productImages.length > 1 && (
            <div className="flex gap-2">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === idx ? 'border-pink-600' : 'border-transparent'}`}
                >
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="font-playfair text-4xl md:text-5xl font-black text-gray-900 mb-3 leading-tight">{product.name}</h1>
          
          {/* Price */}
          <div className="mb-5">
            <span className="font-playfair text-4xl text-pink-600 font-black">{formatPrice(product.price)}</span>
            {product.compare_price && product.compare_price > product.price && (
              <>
                <span className="text-gray-400 line-through ml-3 text-xl">{formatPrice(product.compare_price)}</span>
                <span className="ml-3 bg-red-500 text-white text-sm px-3 py-1 rounded-full font-bold">-{discount}%</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="font-cormorant text-xl text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          {/* Variants (Size/Color) */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Select Options</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => { setSelectedVariant(variant); setQuantity(1); }}
                    className={`px-4 py-2 border rounded-lg ${selectedVariant?.id === variant.id ? 'border-pink-600 bg-pink-50' : 'border-gray-300'}`}
                  >
                    {variant.size && <span className="mr-2">{variant.size}</span>}
                    {variant.color && <span>{variant.color}</span>}
                    {variant.stock_quantity === 0 && <span className="ml-2 text-red-500 text-xs">(Out of stock)</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className="mb-4">
            {selectedVariant?.stock_quantity > 0 || product.variants?.length === 0 ? (
              <span className="text-green-600 flex items-center gap-2"><FiCheck /> In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-semibold">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <button onClick={() => handleQuantityChange(-1)} className="px-3 py-2 hover:bg-gray-100"><FiMinus /></button>
              <span className="w-12 text-center">{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} className="px-3 py-2 hover:bg-gray-100"><FiPlus /></button>
            </div>
            <span className="text-sm text-gray-500">Max: {selectedVariant?.stock_quantity || 99}</span>
          </div>

          {/* Add to Cart Button */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={selectedVariant?.stock_quantity === 0}
              className="flex-1 bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button className="p-3 border rounded-lg hover:bg-gray-50">
              <FiHeart size={24} />
            </button>
            <button className="p-3 border rounded-lg hover:bg-gray-50">
              <FiShare2 size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(relProduct => (
              <Link key={relProduct.id} href={`/products/${relProduct.slug}`} className="group">
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-2">
                  <img src={relProduct.primary_image || 'https://via.placeholder.com/300'} alt={relProduct.name} className="w-full h-48 object-cover group-hover:scale-105 transition" />
                </div>
                <h3 className="font-semibold text-sm">{relProduct.name}</h3>
                <p className="text-pink-600 font-bold">{formatPrice(relProduct.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}