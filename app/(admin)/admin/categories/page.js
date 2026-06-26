// boutique-frontend/app/(admin)/categories/page.js
// Admin categories management

'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import API from '@/lib/endpoints';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(null); // { type: 'add'|'edit'|'add_sub'|'edit_sub', data? }
  const [formName, setFormName]     = useState('');
  const [formDesc, setFormDesc]     = useState('');
  const [formSlug, setFormSlug]     = useState('');
  const [saving, setSaving]         = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(API.CATEGORY.ALL);
      if (res.data.success) setCategories(res.data.data.categories || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openModal = (type, data = null) => {
    setModal({ type, data });
    setFormName(data?.name || '');
    setFormDesc(data?.description || '');
    setFormSlug(data?.slug || '');
  };

  const closeModal = () => { setModal(null); setFormName(''); setFormDesc(''); setFormSlug(''); };

  // Auto-generate slug from name
  const handleNameChange = (val) => {
    setFormName(val);
    if (!modal?.data) {
      setFormSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  };

  const handleSave = async () => {
    if (!formName.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      let endpoint, payload;
      const { type, data } = modal;

      if (type === 'add') {
        endpoint = API.ADMIN.CATEGORIES.ADD;
        payload  = { name: formName, description: formDesc, slug: formSlug };
      } else if (type === 'edit') {
        endpoint = API.ADMIN.CATEGORIES.EDIT;
        payload  = { category_id: data.id, name: formName, description: formDesc, slug: formSlug };
      } else if (type === 'add_sub') {
        endpoint = API.ADMIN.CATEGORIES.ADD_SUB;
        payload  = { parent_id: data.id, name: formName, description: formDesc, slug: formSlug };
      } else if (type === 'edit_sub') {
        endpoint = API.ADMIN.CATEGORIES.EDIT_SUB;
        payload  = { subcategory_id: data.id, name: formName, description: formDesc, slug: formSlug };
      }

      const res = await apiClient.post(endpoint, payload);
      if (res.data.success) {
        toast.success('Saved successfully');
        closeModal();
        fetchCategories();
      } else {
        toast.error(res.data.message || 'Save failed');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (type, id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const endpoint = type === 'category' ? API.ADMIN.CATEGORIES.DELETE : API.ADMIN.CATEGORIES.DELETE_SUB;
      const payload  = type === 'category' ? { category_id: id } : { subcategory_id: id };
      const res = await apiClient.post(endpoint, payload);
      if (res.data.success) {
        toast.success('Deleted');
        fetchCategories();
      } else {
        toast.error(res.data.message || 'Delete failed');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Delete failed');
    }
  };

  const modalTitle = {
    add:     'Add Category',
    edit:    'Edit Category',
    add_sub: `Add Subcategory to "${modal?.data?.name}"`,
    edit_sub:'Edit Subcategory',
  }[modal?.type] || '';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button
          onClick={() => openModal('add')}
          className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 text-sm font-medium"
        >
          <FiPlus size={16} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
          No categories yet. Add your first one.
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl shadow overflow-hidden">
              {/* Category row */}
              <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                <div>
                  <p className="font-semibold text-gray-800">{cat.name}</p>
                  <p className="text-xs text-gray-400">/{cat.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openModal('add_sub', cat)}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium border border-blue-200 px-2 py-1 rounded"
                  >
                    <FiPlus size={12} /> Sub
                  </button>
                  <button onClick={() => openModal('edit', cat)} className="text-gray-500 hover:text-blue-600">
                    <FiEdit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete('category', cat.id, cat.name)} className="text-gray-400 hover:text-red-600">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Subcategories */}
              {cat.subcategories?.length > 0 && (
                <div className="divide-y divide-gray-50">
                  {cat.subcategories.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between px-8 py-3">
                      <div>
                        <p className="text-sm text-gray-700">{sub.name}</p>
                        <p className="text-xs text-gray-400">/{sub.slug}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => openModal('edit_sub', sub)} className="text-gray-400 hover:text-blue-600">
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete('sub', sub.id, sub.name)} className="text-gray-400 hover:text-red-600">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-bold">{modalTitle}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="category-slug"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Optional description"
                />
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FiCheck size={16} /> {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={closeModal} className="flex-1 border py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
