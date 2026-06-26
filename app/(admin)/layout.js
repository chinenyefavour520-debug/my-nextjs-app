// boutique-frontend/app/(admin)/layout.js
// Admin layout with sidebar navigation

'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers,
  FiTag, FiMessageSquare, FiLogOut, FiMenu, FiX
} from 'react-icons/fi';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard',  href: '/admin/dashboard',  icon: FiGrid },
  { label: 'Products',   href: '/admin/products',   icon: FiPackage },
  { label: 'Orders',     href: '/admin/orders',     icon: FiShoppingBag },
  { label: 'Users',      href: '/admin/users',      icon: FiUsers },
  { label: 'Categories', href: '/admin/categories', icon: FiTag },
  { label: 'Chat',       href: '/admin/chat',       icon: FiMessageSquare },
];

export default function AdminLayout({ children }) {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/admin/login');
      } else if (user?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [isAuthenticated, loading, user]);

  // Don't wrap the login page in the admin shell
  if (pathname === '/admin/login') return <>{children}</>;

  if (loading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar — fixed on desktop, slide-in on mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col
          transform transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:shrink-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <span className="font-playfair text-xl font-black italic">
            <span className="text-pink-500">Fay's</span>
            <span className="text-white"> Luxe</span>
          </span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <FiX size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium
                ${pathname.startsWith(href)
                  ? 'bg-pink-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-4 py-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 mb-1">Logged in as</p>
          <p className="text-sm font-semibold truncate">{user?.name}</p>
          <button
            onClick={handleLogout}
            className="mt-3 flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content — scrolls independently, sidebar stays fixed */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white shadow-sm flex items-center px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <FiMenu size={22} />
          </button>
          <h1 className="text-lg font-semibold text-gray-800 capitalize">
            {navItems.find(n => pathname.startsWith(n.href))?.label || 'Admin'}
          </h1>
          <div className="ml-auto text-sm text-gray-500">
            Welcome, {user?.name?.split(' ')[0]}
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
