'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  FiShoppingBag, FiShoppingCart, FiHeart, FiArrowRight, FiArrowDownRight, FiStar
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api';
import API from '@/lib/endpoints';

export default function HomePage() {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hoveredImage, setHoveredImage] = useState(null);

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [catRes, featRes, recRes] = await Promise.all([
        apiClient.get(API.CATEGORY.ALL),
        apiClient.get(`${API.PRODUCT.LIST}?featured=true&limit=6`),
        apiClient.get(`${API.PRODUCT.LIST}?limit=8`),
      ]);
      if (catRes.data.success) setCategories(catRes.data.data.categories || []);
      if (featRes.data.success) setFeaturedProducts(featRes.data.data.products || []);
      if (recRes.data.success) setRecentProducts(recRes.data.data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    const result = await addToCart(productId, null, 1);
    if (!result.success) toast.error(result.message);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf8] text-zinc-900">
        <h1 className="font-playfair text-4xl animate-pulse tracking-widest uppercase">Fay's Luxe.</h1>
      </div>
    );
  }

  return (
    <div className="bg-[#fbfaf8] text-zinc-900 min-h-screen font-inter selection:bg-pink-300 selection:text-black">
      <style dangerouslySetInnerHTML={{ __html: `
        .marquee-container { overflow: hidden; white-space: nowrap; width: 100%; border-bottom: 1px solid #1a1a1a; padding: 0.75rem 0; background: #1a1a1a; color: #fbfaf8; }
        .marquee-content { display: inline-block; animation: marquee 25s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .editorial-border { border: 1px solid #1a1a1a; }
        .editorial-border-b { border-bottom: 1px solid #1a1a1a; }
        .editorial-border-r { border-right: 1px solid #1a1a1a; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}} />

      {/* ── TOP MARQUEE ── */}
      <div className="marquee-container">
        <div className="marquee-content text-xs font-bold tracking-[0.2em] uppercase">
          FREE SHIPPING ON ORDERS OVER ₦50,000 &nbsp; • &nbsp; NEW SUMMER COLLECTION OUT NOW &nbsp; • &nbsp; PREMIUM WOMEN's FASHION ABUJA &nbsp; • &nbsp; 
          FREE SHIPPING ON ORDERS OVER ₦50,000 &nbsp; • &nbsp; NEW SUMMER COLLECTION OUT NOW &nbsp; • &nbsp; PREMIUM WOMEN's FASHION ABUJA &nbsp; • &nbsp;
        </div>
      </div>

      {/* ── HERO EDITORIAL SPLIT ── */}
      <section className="flex flex-col lg:flex-row min-h-[90vh] editorial-border-b relative">
        {/* Left: Typography */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-between editorial-border-r relative z-10 bg-[#fbfaf8]">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-12">Issue No. 01 — 2026</p>
            <h1 className="font-playfair text-[5rem] md:text-[8rem] lg:text-[10rem] leading-[0.85] tracking-tighter uppercase mb-6 text-zinc-900">
              The<br/>Summer<br/>Edit.
            </h1>
            <p className="font-cormorant italic text-2xl md:text-4xl text-zinc-800 max-w-md">
              Unapologetic elegance. Discover the pieces defining this season's premium aesthetic.
            </p>
          </div>
          <div className="mt-12">
            <Link href="/products" className="group inline-flex items-center gap-4 border-b-2 border-zinc-900 pb-2 text-sm font-bold tracking-widest uppercase hover:text-pink-600 hover:border-pink-600 transition-colors">
              Explore Collection <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right: Full Bleed Image */}
        <div className="w-full lg:w-1/2 h-[60vh] lg:h-auto relative overflow-hidden group">
          <img 
            src="/red.jpg" 
            alt="Summer Editorial" 
            className="absolute inset-0 w-full h-full object-cover object-top grayscale hover:grayscale-0 transition duration-1000 scale-105 group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition duration-1000"></div>
          <div className="absolute bottom-8 right-8 bg-[#fbfaf8] p-4 text-xs font-bold tracking-widest uppercase editorial-border rotate-3 shadow-2xl">
            Featured Look
          </div>
        </div>
      </section>

      {/* ── CATEGORY INDEX (Interactive List) ── */}
      {categories.length > 0 && (
        <section className="py-24 px-8 md:px-16 editorial-border-b relative bg-zinc-900 text-[#fbfaf8] overflow-hidden">
          {/* Floating Hover Image */}
          {hoveredImage && (
            <div className="hidden lg:block absolute right-32 top-1/2 -translate-y-1/2 w-[400px] h-[500px] pointer-events-none z-10 transition-all duration-500 ease-out">
               <img src={hoveredImage} className="w-full h-full object-cover editorial-border opacity-80" alt="Category preview" />
            </div>
          )}

          <div className="max-w-4xl relative z-20">
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-zinc-400 mb-12">01. Departments</h2>
            <div className="flex flex-col w-full">
              {categories.slice(0, 5).map((cat, idx) => {
                // Determine a fallback hover image based on index just for the editorial effect
                const fallbackImages = ['/bag.jpg', '/red.jpg', '/jwel.jpg', '/shoes2.jpg', '/red.jpg'];
                const hoverSrc = cat.image || fallbackImages[idx % fallbackImages.length];

                return (
                  <Link 
                    key={cat.id} 
                    href={`/category/${cat.slug}`}
                    onMouseEnter={() => setHoveredImage(hoverSrc)}
                    onMouseLeave={() => setHoveredImage(null)}
                    className="group py-6 md:py-10 border-b border-zinc-800 flex justify-between items-center hover:px-8 transition-all duration-500"
                  >
                    <span className="font-playfair text-4xl md:text-7xl lowercase italic text-zinc-400 group-hover:text-[#fbfaf8] transition-colors">
                      {cat.name}
                    </span>
                    <span className="text-sm font-inter tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                      View <FiArrowRight />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED EDITORIAL GRID ── */}
      {featuredProducts.length > 0 && (
        <section className="editorial-border-b">
          <div className="flex flex-col md:flex-row border-b border-zinc-900">
            <div className="p-8 md:p-16 md:w-1/3 editorial-border-r flex flex-col justify-center">
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase mb-4">02. Curated</h2>
              <h3 className="font-playfair text-5xl md:text-6xl leading-none">Editor's<br/>Picks.</h3>
              <p className="mt-6 font-cormorant text-xl text-zinc-800 italic">Hand-selected garments that define modern luxury.</p>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2">
              {featuredProducts.slice(0, 4).map((p, idx) => (
                <EditorialCard key={p.id} product={p} onAddToCart={handleAddToCart} idx={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── THE STATEMENT (Banner) ── */}
      <section className="py-32 px-8 text-center bg-zinc-900 text-[#fbfaf8] editorial-border-b relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/shoes2.jpg')] bg-cover bg-center mix-blend-luminosity blur-sm"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <FiStar className="mx-auto text-pink-500 mb-8" size={32} />
          <h2 className="font-playfair text-4xl md:text-7xl leading-tight mb-8">
            "Fashion is the armor to survive the reality of everyday life."
          </h2>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-zinc-400">Join the Elite</p>
        </div>
      </section>

      {/* ── LATEST ARRIVALS (Horizontal Scroll) ── */}
      {recentProducts.length > 0 && (
        <section className="py-24 editorial-border-b bg-[#fbfaf8]">
          <div className="px-8 md:px-16 mb-12 flex justify-between items-end">
            <div>
               <h2 className="text-xs font-bold tracking-[0.3em] uppercase mb-4">03. Just In</h2>
               <h3 className="font-playfair text-5xl">New Arrivals</h3>
            </div>
            <Link href="/products" className="hidden md:flex items-center gap-2 text-xs font-bold tracking-widest uppercase hover:text-pink-600 transition-colors">
              All Products <FiArrowRight />
            </Link>
          </div>
          
          <div className="flex overflow-x-auto hide-scrollbar pl-8 md:pl-16 pb-8 gap-8">
            {recentProducts.map((p) => (
              <div key={p.id} className="min-w-[300px] md:min-w-[400px] flex-shrink-0">
                <EditorialCard product={p} onAddToCart={handleAddToCart} minimal />
              </div>
            ))}
            <div className="min-w-[100px] flex-shrink-0"></div> {/* padding spacer */}
          </div>
        </section>
      )}

      {/* ── MAGAZINE FOOTER CTA ── */}
      <section className="py-32 px-8 flex flex-col items-center justify-center text-center bg-[#fbfaf8]">
        <h2 className="font-playfair text-[4rem] md:text-[8rem] leading-[0.8] mb-8">Stay<br/><span className="italic text-pink-600">Inspired.</span></h2>
        <div className="w-full max-w-md flex flex-col gap-4 mt-8">
          <a
            href="https://tiktok.com/@Fays_luxe1"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full editorial-border py-4 text-sm font-bold tracking-widest uppercase hover:bg-zinc-900 hover:text-[#fbfaf8] transition-colors"
          >
            Follow on TikTok
          </a>
          <a
            href="https://wa.me/2348125633643"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-zinc-900 text-[#fbfaf8] editorial-border border-zinc-900 py-4 text-sm font-bold tracking-widest uppercase hover:bg-pink-600 hover:border-pink-600 transition-colors"
          >
            WhatsApp Client Services
          </a>
        </div>
      </section>

    </div>
  );
}

// ─── Editorial Product Card ───
function EditorialCard({ product, onAddToCart, idx = 0, minimal = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const img = product.primary_image || product.images?.[0]?.image_url || 'https://placehold.co/600x800/f3f4f6/9ca3af?text=No+Image';
  const hasDiscount = product.compare_price && parseFloat(product.compare_price) > parseFloat(product.price);
  
  // Create an alternating border effect for the grid
  const borderClass = minimal ? '' : `editorial-border-b ${idx % 2 === 0 ? 'sm:editorial-border-r' : ''}`;

  return (
    <div 
      className={`group flex flex-col ${borderClass} bg-[#fbfaf8] relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-zinc-100 block">
        <img
          src={img}
          alt={product.name}
          className="w-full h-full object-cover object-top grayscale-[50%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
        />
        
        {/* Editorial Badges */}
        {hasDiscount && (
          <div className="absolute top-4 left-4 bg-zinc-900 text-[#fbfaf8] text-[0.65rem] font-bold tracking-widest uppercase px-3 py-1">
            Sale
          </div>
        )}

        {/* Quick Add Overlay */}
        <div className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={(e) => onAddToCart(product.id, e)}
            className="bg-[#fbfaf8] text-zinc-900 px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-pink-600 hover:text-white transition-colors flex items-center gap-2"
          >
            Add to Tote <FiShoppingBag />
          </button>
          <button className="w-10 h-10 bg-[#fbfaf8]/20 backdrop-blur text-white flex items-center justify-center rounded-full hover:bg-pink-600 transition-colors">
            <FiHeart size={16} />
          </button>
        </div>
      </Link>

      {/* Info Block */}
      <div className={`p-6 flex flex-col flex-grow ${minimal ? 'px-0' : ''}`}>
        <div className="flex justify-between items-start gap-4 mb-4">
          <Link href={`/products/${product.slug}`} className="flex-grow">
            <h3 className="font-playfair text-xl md:text-2xl leading-tight group-hover:italic transition-all">
              {product.name}
            </h3>
          </Link>
          <div className="text-right flex-shrink-0">
            <p className="font-inter text-sm font-bold tracking-wider">
              ₦{parseFloat(product.price).toLocaleString()}
            </p>
            {hasDiscount && (
              <p className="font-inter text-xs text-zinc-400 line-through mt-1">
                ₦{parseFloat(product.compare_price).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
