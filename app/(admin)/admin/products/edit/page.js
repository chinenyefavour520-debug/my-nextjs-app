// boutique-frontend/app/(admin)/products/edit/page.js
// Edit existing product with image management

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import API from '@/lib/endpoints';
import { FiArrowLeft, FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';

const emptyVariant = { size: '', color: '', stock_quantity: '', price_modifier: '0' };

import { Suspense } from 'react';

function EditProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    compare_price: '',
    category_id: '',
    is_active: true,
    is_featured: false,
  });

  useEffect(() => {
    if (!productId) {
      toast.error('No product ID provided');
      router.push('/admin/products');
      return;
    }
    fetchCategories();
    fetchProduct();
  }, [productId]);

  const fetchCategories = async () => {
    try {
      const res = await api.get(API.CATEGORY.ALL);
      if (res.data.success) setCategories(res.data.data.categories || []);
    } catch (e) { console.error(e); }
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${API.PRODUCT.DETAILS}?id=${productId}`);
      if (res.data.success) {
        const p = res.data.data.product;
        setForm({
          name: p.name || '',
          slug: p.slug || '',
          description: p.description || '',
          price: p.price || '',
          compare_price: p.compare_price || '',
          category_id: p.category_id || '',
          is_active: !!p.is_active,
          is_featured: !!p.is_featured,
        });
        setVariants(p.variants || []);
        // Load existing images
        setImages(p.images || []);
      } else {
        toast.error('Product not found');
        router.push('/admin/products');
      }
    } catch (e) {
      toast.error('Failed to load product');
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    
    if (name === 'name' && value) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setForm((prev) => ({ ...prev, slug }));
    }
  };

  const addVariant = () => setVariants((v) => [...v, { ...emptyVariant }]);

  const updateVariant = (idx, field, value) => {
    setVariants((v) => v.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const removeVariant = (idx) => setVariants((v) => v.filter((_, i) => i !== idx));

  // ── Image upload handler ──
  const handleImageUpload = async (files) => {
    setUploading(true);
    try {
      for (let file of files) {
        const fd = new FormData();
        fd.append('image', file);
        const res = await api.post('/api/upload.php', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.success) {
          setImages(prev => [...prev, {
            image_url: res.data.data.image_url,
            is_primary: prev.length === 0,
            display_order: prev.length
          }]);
        }
      }
      toast.success('Images uploaded');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.slug || !form.price || !form.category_id) {
      toast.error('Name, slug, price and category are required');
      return;
    }
    
    setSubmitting(true);
    try {
      const payload = {
        product_id: parseInt(productId),
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase(),
        description: form.description || '',
        price: parseFloat(form.price),
        compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
        category_id: parseInt(form.category_id),
        subcategory_id: null,
        is_featured: form.is_featured ? 1 : 0,
        is_active: form.is_active ? 1 : 0,
        variants: variants.map((v) => ({
          id: v.id || null,
          size: v.size || null,
          color: v.color || null,
          sku: v.sku || `${form.slug}-${v.size || 'OS'}-${v.color || 'BLK'}`,
          stock: parseInt(v.stock_quantity) || 0,
          additional_price: parseFloat(v.price_modifier) || 0,
        })),
        images: images.map(img => img.image_url),
      };
      
      const res = await api.post(API.ADMIN.PRODUCTS.EDIT, payload);
      if (res.data.success) {
        toast.success('Product updated successfully');
        router.push('/admin/products');
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="text-gray-500 hover:text-gray-700">
          <FiArrowLeft size={20} />
        </Link>
        <h2 className="text-2xl font-bold">Edit Product</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Basic info ── */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h3 className="font-semibold text-gray-700 border-b pb-2">Basic Information</h3>

          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <input 
              name="name" 
              required 
              value={form.name} 
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <input 
              name="slug" 
              required 
              value={form.slug} 
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50"
            />
            <p className="text-xs text-gray-400 mt-1">Used in the URL: /products/your-slug</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              name="description" 
              rows={4} 
              value={form.description} 
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (₦) *</label>
              <input 
                name="price" 
                type="number" 
                step="0.01" 
                min="0" 
                required 
                value={form.price} 
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Compare Price (₦)</label>
              <input 
                name="compare_price" 
                type="number" 
                step="0.01" 
                min="0" 
                value={form.compare_price} 
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select 
              name="category_id" 
              required 
              value={form.category_id} 
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                name="is_active" 
                checked={form.is_active} 
                onChange={handleChange}
                className="w-4 h-4 accent-pink-600" 
              />
              <span className="text-sm font-medium">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                name="is_featured" 
                checked={form.is_featured} 
                onChange={handleChange}
                className="w-4 h-4 accent-pink-600" 
              />
              <span className="text-sm font-medium">Featured</span>
            </label>
          </div>
        </div>

        {/* ── Variants ── */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-semibold text-gray-700">Variants</h3>
            <button 
              type="button" 
              onClick={addVariant}
              className="flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700 font-medium"
            >
              <FiPlus size={16} /> Add Variant
            </button>
          </div>

          {variants.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No variants</p>
          ) : variants.map((v, idx) => (
            <div key={idx} className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end border rounded-lg p-3">
              <div>
                <label className="block text-xs font-medium mb-1">Size</label>
                <input 
                  value={v.size || ''} 
                  onChange={(e) => updateVariant(idx, 'size', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="S / M / L" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Color</label>
                <input 
                  value={v.color || ''} 
                  onChange={(e) => updateVariant(idx, 'color', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Red / Blue" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Stock Qty</label>
                <input 
                  type="number" 
                  min="0" 
                  value={v.stock_quantity ?? ''} 
                  onChange={(e) => updateVariant(idx, 'stock_quantity', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="0" 
                />
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1">Price +/-</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={v.price_modifier ?? '0'} 
                    onChange={(e) => updateVariant(idx, 'price_modifier', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="0.00" 
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => removeVariant(idx)}
                  className="text-red-500 hover:text-red-700 pb-2"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Image Upload ── */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-semibold text-gray-700">Product Images</h3>
            <span className="text-xs text-gray-400">{images.length} images</span>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-500 transition">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
              id="image-upload"
              disabled={uploading}
            />
            <label htmlFor="image-upload" className="cursor-pointer block">
              <FiUpload className="mx-auto text-gray-400 text-2xl mb-2" />
              <p className="text-gray-500">Drag & drop images here, or click to select</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP up to 5MB</p>
              {uploading && <p className="text-pink-600 mt-2">Uploading...</p>}
            </label>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative border rounded-lg overflow-hidden group">
                  <img src={img.image_url} alt="Product" className="w-full h-24 object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setImages(prev => prev.map((im, i) => ({ ...im, is_primary: i === idx })));
                      }}
                      className={`text-xs px-2 py-1 rounded ${img.is_primary ? 'bg-pink-600 text-white' : 'bg-white text-gray-700'}`}
                    >
                      {img.is_primary ? '★ Primary' : 'Set Primary'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Remove this image?')) {
                          setImages(prev => prev.filter((_, i) => i !== idx));
                        }
                      }}
                      className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Submit ── */}
        <div className="flex gap-4">
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Update Product'}
          </button>
          <Link 
            href="/admin/products"
            className="border px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 text-gray-700"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function EditProductPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div></div>}>
      <EditProductContent />
    </Suspense>
  );
}