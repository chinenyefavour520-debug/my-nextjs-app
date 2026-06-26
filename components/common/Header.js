// boutique-frontend/components/common/Header.js
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  FiSearch, FiShoppingBag, FiUser, FiMenu, FiX,
  FiChevronDown, FiLogOut, FiPackage, FiMessageSquare,
  FiGrid,
} from 'react-icons/fi';

const NAV = [
  { name: 'Home',    href: '/' },
  { name: 'Clothes', href: '/category/clothing' },
  { name: 'Shoes',   href: '/category/shoes' },
  { name: 'Bags',    href: '/category/bags' },
  { name: 'Jewelry', href: '/category/jewelry' },
  { name: 'All',     href: '/products' },
];

export default function Header() {
  const pathname   = usePathname();
  const router     = useRouter();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery]           = useState('');
  const [scrolled, setScrolled]     = useState(false);

  const userRef   = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current   && !userRef.current.contains(e.target))   setUserOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSearchOpen(false);
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserOpen(false);
    router.push('/');
  };

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(250,248,245,0.97)' : '#FAF8F5',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 1px 0 rgba(201,168,76,0.25), 0 4px 24px rgba(0,0,0,0.06)' : '0 1px 0 rgba(201,168,76,0.2)',
      }}
    >
      {/* ── Announcement bar ── */}
      <div
        className="text-center py-2.5 px-4 text-xs font-medium tracking-widest"
        style={{ background: '#0D0D0D', color: '#C9A84C', letterSpacing: '0.15em' }}
      >
        ✦ &nbsp; FREE DELIVERY IN ABUJA &nbsp; ✦ &nbsp; WHATSAPP:{' '}
        <span className="font-bold" style={{ color: '#E8C97A' }}>08125633643</span>
        &nbsp; ✦ &nbsp; TIKTOK:{' '}
        <span className="font-bold" style={{ color: '#E8C97A' }}>@FAY'S_LUXE1</span>
        &nbsp; ✦
      </div>

      {/* ── Main header ── */}
      <div className="container-custom">
        <div className="flex items-center justify-between h-20 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-1 shrink-0 group">
            <span
              className="font-playfair text-3xl font-black italic"
              style={{ color: '#C0395A', letterSpacing: '-0.02em' }}
            >
              Fay's
            </span>
            <span
              className="font-playfair text-3xl font-black"
              style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}
            >
              Luxe
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0">
            {NAV.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-colors duration-200 group"
                style={{
                  color: pathname === link.href ? '#C9A84C' : '#4A3728',
                  fontFamily: 'var(--font-inter)',
                }}
              >
                {link.name}
                <span
                  className="absolute bottom-0 left-5 right-5 h-px transition-all duration-300"
                  style={{
                    background: 'linear-gradient(90deg, #C9A84C, #E8C97A)',
                    transform: pathname === link.href ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left',
                  }}
                />
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">

            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setSearchOpen(o => !o)}
                className="w-10 h-10 flex items-center justify-center transition-colors duration-200 rounded-full hover:bg-black/5"
                style={{ color: '#4A3728' }}
                aria-label="Search"
              >
                <FiSearch size={19} />
              </button>
              {searchOpen && (
                <div
                  className="absolute right-0 top-14 w-80 p-4 z-50"
                  style={{
                    background: '#FAF8F5',
                    border: '1px solid #C9A84C',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                  }}
                >
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                      autoFocus
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Search products…"
                      className="input-luxury flex-1 text-sm"
                      style={{ padding: '0.65rem 1rem' }}
                    />
                    <button
                      type="submit"
                      className="btn-luxury text-xs"
                      style={{ padding: '0.65rem 1.2rem' }}
                    >
                      Go
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative w-10 h-10 flex items-center justify-center transition-colors duration-200 rounded-full hover:bg-black/5"
              style={{ color: '#4A3728' }}
              aria-label="Shopping bag"
            >
              <FiShoppingBag size={19} />
              {itemCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 text-[9px] font-black rounded-full w-5 h-5 flex items-center justify-center"
                  style={{ background: '#C0395A', color: '#fff', fontFamily: 'var(--font-inter)' }}
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            <div className="relative hidden md:block" ref={userRef}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setUserOpen(o => !o)}
                    className="flex items-center gap-2 px-3 py-2 transition-colors duration-200 hover:bg-black/5 rounded-full"
                    style={{ color: '#4A3728' }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                      style={{ background: '#C0395A', color: '#fff', fontFamily: 'var(--font-inter)' }}
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className="max-w-[72px] truncate text-xs font-semibold tracking-wide"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {user?.name?.split(' ')[0]}
                    </span>
                    <FiChevronDown
                      size={12}
                      className="transition-transform duration-200"
                      style={{ transform: userOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>

                  {userOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 py-2 z-50"
                      style={{
                        background: '#FAF8F5',
                        border: '1px solid #EDE8E0',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                      }}
                    >
                      <div className="px-4 py-3 mb-1" style={{ borderBottom: '1px solid #EDE8E0' }}>
                        <p className="text-xs text-gray-400 mb-0.5" style={{ fontFamily: 'var(--font-inter)' }}>Signed in as</p>
                        <p className="text-sm font-bold truncate" style={{ color: '#0D0D0D', fontFamily: 'var(--font-inter)' }}>{user?.name}</p>
                      </div>
                      {[
                        { icon: FiUser,          label: 'My Account',   href: '/account' },
                        { icon: FiPackage,       label: 'My Orders',    href: '/account/orders' },
                        { icon: FiMessageSquare, label: 'Chat Support', href: '/account/chat' },
                      ].map(item => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setUserOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-colors hover:bg-black/5"
                          style={{ color: '#4A3728', fontFamily: 'var(--font-inter)', letterSpacing: '0.05em' }}
                        >
                          <item.icon size={14} style={{ color: '#C9A84C' }} /> {item.label}
                        </Link>
                      ))}
                      {isAdmin && isAdmin() && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-colors hover:bg-purple-50"
                          style={{ color: '#7C3AED', fontFamily: 'var(--font-inter)' }}
                        >
                          <FiGrid size={14} /> Admin Dashboard
                        </Link>
                      )}
                      <div className="mt-1 pt-1" style={{ borderTop: '1px solid #EDE8E0' }}>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-medium transition-colors hover:bg-red-50"
                          style={{ color: '#C0395A', fontFamily: 'var(--font-inter)' }}
                        >
                          <FiLogOut size={14} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-xs font-semibold px-4 py-2 transition-colors hover:bg-black/5 rounded-full tracking-widest uppercase"
                    style={{ color: '#4A3728', fontFamily: 'var(--font-inter)' }}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary text-xs"
                    style={{ padding: '0.55rem 1.25rem' }}
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
              style={{ color: '#4A3728' }}
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div
          className="lg:hidden px-5 py-5 space-y-1"
          style={{ background: '#FAF8F5', borderTop: '1px solid rgba(201,168,76,0.3)' }}
        >
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-5">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products…"
              className="input-luxury flex-1 text-sm"
              style={{ padding: '0.65rem 1rem' }}
            />
            <button type="submit" className="btn-luxury" style={{ padding: '0.65rem 1.2rem' }}>
              <FiSearch size={15} />
            </button>
          </form>

          {NAV.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-xs font-semibold tracking-widest uppercase transition-colors"
              style={{
                color: pathname === link.href ? '#C9A84C' : '#4A3728',
                fontFamily: 'var(--font-inter)',
                borderLeft: pathname === link.href ? '2px solid #C9A84C' : '2px solid transparent',
              }}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 mt-4 space-y-1" style={{ borderTop: '1px solid #EDE8E0' }}>
            {isAuthenticated ? (
              <>
                <Link href="/account"        onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-xs font-semibold tracking-widest uppercase" style={{ color: '#4A3728', fontFamily: 'var(--font-inter)' }}>My Account</Link>
                <Link href="/account/orders" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-xs font-semibold tracking-widest uppercase" style={{ color: '#4A3728', fontFamily: 'var(--font-inter)' }}>My Orders</Link>
                {isAdmin && isAdmin() && (
                  <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-xs font-semibold tracking-widest uppercase" style={{ color: '#7C3AED', fontFamily: 'var(--font-inter)' }}>Admin Dashboard</Link>
                )}
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="block w-full text-left px-4 py-3 text-xs font-semibold tracking-widest uppercase"
                  style={{ color: '#C0395A', fontFamily: 'var(--font-inter)' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3 px-4 pt-2">
                <Link href="/login"    onClick={() => setMobileOpen(false)} className="flex-1 text-center py-3 border text-xs font-semibold tracking-widest uppercase" style={{ borderColor: '#C9A84C', color: '#4A3728', fontFamily: 'var(--font-inter)' }}>Login</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-3 text-xs font-semibold tracking-widest uppercase" style={{ background: '#C0395A', color: '#fff', fontFamily: 'var(--font-inter)' }}>Join</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
