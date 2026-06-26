// boutique-frontend/components/common/Footer.js
'use client';

import Link from 'next/link';
import {
  FiInstagram, FiTwitter, FiFacebook,
  FiPhone, FiMapPin, FiMessageCircle,
} from 'react-icons/fi';

const CATEGORIES = [
  { name: 'Clothes',      href: '/category/clothing' },
  { name: 'Shoes',        href: '/category/shoes' },
  { name: 'Bags',         href: '/category/bags' },
  { name: 'Jewelry',      href: '/category/jewelry' },
  { name: 'Headwear',     href: '/category/headwear' },
  { name: 'Belts',        href: '/category/belts' },
  { name: 'All Products', href: '/products' },
];

const HELP = [
  { name: 'About Us',           href: '#' },
  { name: 'Contact Us',         href: '#' },
  { name: 'Shipping Info',      href: '#' },
  { name: 'Returns Policy',     href: '#' },
  { name: 'Privacy Policy',     href: '#' },
  { name: 'Terms & Conditions', href: '#' },
];

function TikTokIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
    </svg>
  );
}

const SOCIAL = [
  { icon: FiInstagram, href: 'https://instagram.com',           label: 'Instagram' },
  { icon: FiFacebook,  href: 'https://facebook.com',            label: 'Facebook' },
  { icon: FiTwitter,   href: 'https://twitter.com',             label: 'Twitter' },
  { icon: TikTokIcon,  href: 'https://tiktok.com/@Fays_luxe1',  label: 'TikTok' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: '#0D0D0D', color: '#8A7A6A' }}>

      {/* ── WhatsApp CTA strip ── */}
      <div style={{ background: '#161616', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <div className="container-custom py-7 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <p
              className="font-playfair text-2xl font-bold mb-1"
              style={{ color: '#FAF8F5', letterSpacing: '-0.01em' }}
            >
              Need help? We're one message away.
            </p>
            <p className="text-sm" style={{ color: '#8A7A6A', fontFamily: 'var(--font-inter)' }}>
              Available Mon–Sat, 9AM–8PM
            </p>
          </div>
          <a
            href="https://wa.me/2348125633643"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 font-semibold text-xs tracking-widest uppercase whitespace-nowrap transition-all duration-200 hover:opacity-90"
            style={{
              background: '#25D366',
              color: '#fff',
              padding: '0.9rem 2rem',
              fontFamily: 'var(--font-inter)',
            }}
          >
            <FiMessageCircle size={16} />
            WhatsApp: 08125633643
          </a>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="container-custom py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand column */}
          <div>
            <Link href="/" className="inline-flex items-baseline gap-1 mb-3">
              <span
                className="font-playfair text-3xl font-black italic"
                style={{ color: '#C0395A' }}
              >
                Fay's
              </span>
              <span
                className="font-playfair text-3xl font-black"
                style={{ color: '#FAF8F5' }}
              >
                Luxe
              </span>
            </Link>
            <p
              className="text-xs font-bold tracking-widest uppercase mb-5"
              style={{ color: '#C9A84C', fontFamily: 'var(--font-inter)' }}
            >
              Premium Women's Fashion
            </p>
            <p
              className="text-sm leading-relaxed mb-8"
              style={{ color: '#8A7A6A', fontFamily: 'var(--font-inter)' }}
            >
              Your destination for luxury women's fashion in Abuja. Curated styles, exceptional quality.
            </p>
            <div className="flex gap-3">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center transition-all duration-200"
                  style={{
                    border: '1px solid rgba(201,168,76,0.25)',
                    color: '#8A7A6A',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#C9A84C';
                    e.currentTarget.style.color = '#0D0D0D';
                    e.currentTarget.style.borderColor = '#C9A84C';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#8A7A6A';
                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)';
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4
              className="text-xs font-bold tracking-widest uppercase mb-6"
              style={{ color: '#FAF8F5', fontFamily: 'var(--font-inter)' }}
            >
              Shop
            </h4>
            <div className="w-8 h-px mb-6" style={{ background: '#C9A84C' }} />
            <ul className="space-y-3.5">
              {CATEGORIES.map(c => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-sm transition-colors duration-200 hover:text-gold-solid"
                    style={{ color: '#8A7A6A', fontFamily: 'var(--font-inter)' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                    onMouseLeave={e => e.currentTarget.style.color = '#8A7A6A'}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4
              className="text-xs font-bold tracking-widest uppercase mb-6"
              style={{ color: '#FAF8F5', fontFamily: 'var(--font-inter)' }}
            >
              Help
            </h4>
            <div className="w-8 h-px mb-6" style={{ background: '#C9A84C' }} />
            <ul className="space-y-3.5">
              {HELP.map(h => (
                <li key={h.name}>
                  <Link
                    href={h.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: '#8A7A6A', fontFamily: 'var(--font-inter)' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                    onMouseLeave={e => e.currentTarget.style.color = '#8A7A6A'}
                  >
                    {h.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-xs font-bold tracking-widest uppercase mb-6"
              style={{ color: '#FAF8F5', fontFamily: 'var(--font-inter)' }}
            >
              Contact
            </h4>
            <div className="w-8 h-px mb-6" style={{ background: '#C9A84C' }} />
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <FiPhone size={14} className="mt-0.5 shrink-0" style={{ color: '#C9A84C' }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#FAF8F5', fontFamily: 'var(--font-inter)' }}>08125633643</p>
                  <p className="text-xs mt-0.5" style={{ color: '#5A4A3A', fontFamily: 'var(--font-inter)' }}>Call or WhatsApp</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FiMapPin size={14} className="mt-0.5 shrink-0" style={{ color: '#C9A84C' }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#FAF8F5', fontFamily: 'var(--font-inter)' }}>Abuja, Mararaba</p>
                  <p className="text-xs mt-0.5" style={{ color: '#5A4A3A', fontFamily: 'var(--font-inter)' }}>Nigeria</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <TikTokIcon size={14} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#FAF8F5', fontFamily: 'var(--font-inter)' }}>@Fay's_luxe1</p>
                  <p className="text-xs mt-0.5" style={{ color: '#5A4A3A', fontFamily: 'var(--font-inter)' }}>Follow on TikTok</p>
                </div>
              </li>
            </ul>

            <a
              href="https://wa.me/2348125633643"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 flex items-center gap-2 text-xs font-semibold tracking-widest uppercase transition-all duration-200"
              style={{
                border: '1px solid rgba(37,211,102,0.4)',
                color: '#25D366',
                padding: '0.75rem 1.25rem',
                fontFamily: 'var(--font-inter)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(37,211,102,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <FiMessageCircle size={14} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: '1px solid rgba(201,168,76,0.12)' }}>
        <div className="container-custom py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p
            className="text-xs"
            style={{ color: '#4A3A2A', fontFamily: 'var(--font-inter)', letterSpacing: '0.05em' }}
          >
            © {year} Fay's Luxe. All rights reserved. &nbsp;|&nbsp; Abuja, Mararaba, Nigeria
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map(t => (
              <Link
                key={t}
                href="#"
                className="text-xs transition-colors duration-200"
                style={{ color: '#4A3A2A', fontFamily: 'var(--font-inter)', letterSpacing: '0.08em' }}
                onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                onMouseLeave={e => e.currentTarget.style.color = '#4A3A2A'}
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
