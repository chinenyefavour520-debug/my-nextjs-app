// boutique-frontend/app/(customer)/account/profile/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/api';
import API from '@/lib/endpoints';
import toast from 'react-hot-toast';
import {
  FiUser, FiMail, FiLock, FiSave, FiArrowLeft,
  FiEye, FiEyeOff, FiCheck,
} from 'react-icons/fi';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState({ new: false, confirm: false });
  const [saved, setSaved]       = useState(false);
  const [form, setForm] = useState({
    name: '', email: '',
    new_password: '', confirm_password: '',
  });

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user) setForm(f => ({ ...f, name: user.name || '', email: user.email || '' }));
  }, [isAuthenticated, user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.new_password) {
      if (form.new_password !== form.confirm_password) { toast.error('Passwords do not match'); return; }
      if (form.new_password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    }
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.new_password) payload.password = form.new_password;

      const res = await apiClient.post(API.USER.UPDATE, payload);
      if (res.data.success) {
        localStorage.setItem(process.env.NEXT_PUBLIC_USER_KEY, JSON.stringify(res.data.data.user));
        setSaved(true);
        toast.success('Profile updated!');
        setForm(f => ({ ...f, new_password: '', confirm_password: '' }));
        setTimeout(() => { setSaved(false); window.location.reload(); }, 1500);
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-4">
          <Link href="/account" className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
            <FiArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-playfair text-2xl font-black text-gray-900">Edit Profile</h1>
            <p className="text-sm text-gray-500 font-inter">Update your personal information</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Avatar card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="inline-block mt-2 text-xs bg-pink-50 text-pink-600 font-semibold px-3 py-1 rounded-full capitalize">
              {user?.role || 'customer'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Personal info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <FiUser size={16} className="text-pink-600" />
              <h3 className="font-bold text-gray-800">Personal Information</h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <FiUser size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Your full name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <FiMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <FiLock size={16} className="text-pink-600" />
              <div>
                <h3 className="font-bold text-gray-800">Change Password</h3>
                <p className="text-xs text-gray-400">Leave blank to keep current password</p>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {[
                { name: 'new_password',     label: 'New Password',     key: 'new' },
                { name: 'confirm_password', label: 'Confirm Password', key: 'confirm' },
              ].map(({ name, label, key }) => (
                <div key={name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                  <div className="relative">
                    <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPw[key] ? 'text' : 'password'}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPw[key] ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-400">Minimum 6 characters</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || saved}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all ${
                saved
                  ? 'bg-green-500 text-white'
                  : 'bg-pink-600 hover:bg-pink-700 text-white disabled:opacity-60'
              }`}
            >
              {saved ? (
                <><FiCheck size={16} /> Saved!</>
              ) : loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
              ) : (
                <><FiSave size={16} /> Save Changes</>
              )}
            </button>
            <Link
              href="/account"
              className="px-6 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
