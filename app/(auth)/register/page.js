// boutique-frontend/app/(auth)/register/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck } from 'react-icons/fi';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({ pw: false, confirm: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.push('/');
  }, [isAuthenticated]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill in all fields'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    const result = await register(form.name, form.email, form.password);
    setLoading(false);
    if (result.success) {
      toast.success('Account created! Please sign in.');
      router.push('/login');
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };

  const pwStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'][pwStrength];
  const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-green-400'][pwStrength];

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-700 via-pink-600 to-rose-500 relative overflow-hidden flex-col items-center justify-center p-12 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center">
          <Link href="/" className="inline-block mb-8">
            <span className="text-4xl font-black">Fay's <span className="text-white/70">Luxe</span></span>
          </Link>
          <h2 className="text-3xl font-black mb-4 leading-tight">
            Join the<br />Fashion Community
          </h2>
          <p className="text-white/70 text-lg max-w-sm mb-10">
            Create your account and start exploring thousands of premium styles.
          </p>
          <div className="space-y-3 text-left max-w-xs mx-auto">
            {['Free shipping on orders over $50', 'Exclusive member discounts', 'Early access to new arrivals', 'Easy returns & exchanges'].map(b => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <FiCheck size={12} />
                </div>
                <span className="text-sm text-white/80">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-black text-pink-600">Fay's <span className="text-gray-900">Luxe</span></span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
              <h1 className="font-playfair text-3xl font-black text-gray-900 mb-1">Create account</h1>
              <p className="text-gray-500 text-sm font-inter">Join thousands of happy shoppers</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Full Name</label>
                <div className="relative">
                  <FiUser size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Jane Doe"
                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 focus:bg-white transition-all" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Email Address</label>
                <div className="relative">
                  <FiMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 focus:bg-white transition-all" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Password</label>
                <div className="relative">
                  <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPw.pw ? 'text' : 'password'} name="password" required value={form.password} onChange={handleChange} placeholder="Min. 6 characters"
                    className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 focus:bg-white transition-all" />
                  <button type="button" onClick={() => setShowPw(p => ({ ...p, pw: !p.pw }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw.pw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {/* Strength bar */}
                {form.password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 flex gap-1">
                      {[1,2,3].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwStrength ? strengthColor : 'bg-gray-200'}`} />
                      ))}
                    </div>
                    <span className={`text-xs font-semibold ${['','text-red-500','text-yellow-500','text-green-500'][pwStrength]}`}>{strengthLabel}</span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Confirm Password</label>
                <div className="relative">
                  <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPw.confirm ? 'text' : 'password'} name="confirmPassword" required value={form.confirmPassword} onChange={handleChange} placeholder="••••••••"
                    className={`w-full pl-11 pr-12 py-3.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 focus:bg-white transition-all ${
                      form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-300' : 'border-gray-200'
                    }`} />
                  <button type="button" onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw.confirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                  {form.confirmPassword && form.password === form.confirmPassword && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2">
                      <FiCheck size={16} className="text-green-500" />
                    </div>
                  )}
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg shadow-pink-200"
              >
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account…</>
                  : <>Create Account <FiArrowRight size={16} /></>
                }
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-pink-600 font-bold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
