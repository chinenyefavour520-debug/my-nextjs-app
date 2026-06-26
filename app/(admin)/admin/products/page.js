// boutique-frontend/app/(admin)/products/page.js
// Admin products list

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import API from '@/lib/endpoints';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/currency';  // <-- ADD IMPORT AT TOP

export default function AdminProductsPage() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [deleting, setDeleting]   = useState(null);
  const [page, setPage]           = useState(1);
  const [pagination, setPagination] = useState({ total_pages: 1, total: 0 });

  useEffect(() => { fetchProducts(); }, [page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${API.PRODUCT.LIST}?page=${page}&limit=20`);
      if (res.data.success) {
        setProducts(res.data.data.products || []);
        setPagination(res.data.data.pagination || { total_pages: 1, total: 0 });
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleDelete = async (product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeleting(product.id);
    try {
      const res = await api.post(API.ADMIN.PRODUCTS.DELETE, { product_id: product.id });
      if (res.data.success) {
        toast.success('Product deleted');
        fetchProducts();
      } else {
        toast.error(res.data.message || 'Delete failed');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <Link
            href="/admin/products/add"
            className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 text-sm font-medium whitespace-nowrap"
          >
            <FiPlus size={16} /> Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="text-left px-6 py-3">Product</th>
                    <th className="text-left px-6 py-3">Category</th>
                    <th className="text-left px-6 py-3">Price</th>
                    <th className="text-left px-6 py-3">Stock</th>
                    <th className="text-left px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gray-400">No products found</td>
                    </tr>
                  ) : filtered.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.primary_image || 'https://placehold.co/600x600/f3f4f6/9ca3af?text=No+Image'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                            onError={(e) => { e.target.src = 'https://placehold.co/600x600/f3f4f6/9ca3af?text=No+Image'; }}
                          />
                          <div>
                            <p className="font-medium line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-400">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{product.category_name || '—'}</td>
                      <td className="px-6 py-4 font-semibold text-pink-600">
                        {formatPrice(product.price)}
                        {product.compare_price && product.compare_price > product.price && (
                          <span className="ml-2 text-xs text-gray-400 line-through">
                            {formatPrice(product.compare_price)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${
                          (product.total_stock || 0) === 0 ? 'text-red-600' :
                          (product.total_stock || 0) < 10 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {product.total_stock ?? '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <Link
                            href={`/admin/products/edit?id=${product.id}`}
                            className="text-blue-600 hover:text-blue-700"
                            title="Edit"
                          >
                            <FiEdit2 size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product)}
                            disabled={deleting === product.id}
                            className="text-red-500 hover:text-red-700 disabled:opacity-40"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.total_pages > 1 && (
              <div className="flex justify-between items-center px-6 py-4 border-t text-sm text-gray-600">
                <span>Total: {pagination.total} products</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-40"
                  >
                    Prev
                  </button>
                  <span className="px-3 py-1">{page} / {pagination.total_pages}</span>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
                    disabled={page === pagination.total_pages}
                    className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}