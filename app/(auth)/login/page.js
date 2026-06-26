// boutique-frontend/app/(auth)/login/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.push('/');
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome back!');
      router.push(result.user?.role === 'admin' ? '/admin/dashboard' : '/');
    } else {
      toast.error(result.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pink-600 via-rose-500 to-purple-700 relative overflow-hidden flex-col items-center justify-center p-12 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center">
          <Link href="/" className="inline-block mb-8">
            <span className="text-4xl font-black">Fay's <span className="text-white/70">Luxe</span></span>
          </Link>
          <h2 className="font-playfair text-4xl font-black mb-4 leading-tight">
            Your Style,<br />Your Story
          </h2>
          <p className="text-white/70 font-cormorant text-xl max-w-sm">
            Discover premium women's fashion in Abuja, curated just for you.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            {[['500+', 'Products'], ['50+', 'Brands'], ['10K+', 'Happy Customers']].map(([n, l]) => (
              <div key={l} className="bg-white/10 rounded-2xl p-4">
                <p className="text-2xl font-black">{n}</p>
                <p className="text-white/60 text-xs mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-black text-pink-600">Fay's <span className="text-gray-900">Luxe</span></span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
              <h1 className="font-playfair text-3xl font-black text-gray-900 mb-1">Welcome back</h1>
              <p className="text-gray-500 text-sm font-inter">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Email Address</label>
                <div className="relative">
                  <FiMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Password</label>
                <div className="relative">
                  <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                  />
                  <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg shadow-pink-200"
              >
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
                  : <>Sign In <FiArrowRight size={16} /></>
                }
              </button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link href="/register" className="text-pink-600 font-bold hover:underline">Create one</Link>
              </p>
              <div className="border-t border-gray-100 pt-3">
                <Link href="/admin/login" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  Admin Login →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
