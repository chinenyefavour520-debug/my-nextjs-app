// boutique-frontend/app/(customer)/account/chat/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/api';
import API from '@/lib/endpoints';
import { FiSend, FiArrowLeft, FiMessageCircle, FiHeadphones } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CustomerChatPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [messages, setMessages]   = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending]     = useState(false);
  const [loading, setLoading]     = useState(true);
  const messagesEndRef = useRef(null);
  const pollRef        = useRef(null);
  const inputRef       = useRef(null);

  const POLL_INTERVAL = parseInt(process.env.NEXT_PUBLIC_CHAT_POLL_INTERVAL || '5000');

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await apiClient.get(API.CHAT.MESSAGES);
      if (res.data.success) setMessages(res.data.data.messages || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text) return;
    setSending(true);
    try {
      const res = await apiClient.post(API.CHAT.SEND, { message: text });
      if (res.data.success) {
        setNewMessage('');
        await fetchMessages();
        inputRef.current?.focus();
      } else {
        toast.error(res.data.message || 'Failed to send');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to send');
    } finally {
      setSending(false); }
  };

  if (!isAuthenticated) return null;

  const initials = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 shrink-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link href="/account" className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
            <FiArrowLeft size={18} />
          </Link>

          {/* Support avatar */}
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-md">
              <FiHeadphones size={20} className="text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
          </div>

          <div className="flex-1">
            <h1 className="font-playfair text-xl font-black text-gray-900">Support Team</h1>
            <p className="text-xs text-green-500 font-semibold flex items-center gap-1 font-inter">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" /> Online · Typically replies in a few hours
            </p>
          </div>
        </div>
      </div>

      {/* ── Chat area ── */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 flex flex-col py-4" style={{ height: 'calc(100vh - 140px)' }}>
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">

          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-8 h-8 border-2 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-4">
                <FiMessageCircle size={36} className="text-pink-500" />
              </div>
              <h3 className="font-black text-gray-800 text-lg mb-2">Start a Conversation</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                Our support team is here to help. Send us a message and we'll get back to you shortly.
              </p>
              {/* Quick prompts */}
              <div className="flex flex-wrap gap-2 mt-6 justify-center">
                {['Track my order', 'Return an item', 'Product question', 'Other'].map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => setNewMessage(prompt)}
                    className="text-xs bg-white border border-gray-200 hover:border-pink-300 hover:text-pink-600 text-gray-600 px-4 py-2 rounded-full transition-colors font-medium"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Date divider */}
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">Today</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {messages.map((msg, idx) => {
                const isOwn    = msg.sender_role === 'customer' || msg.sender === 'user';
                const showAvatar = !isOwn && (idx === 0 || messages[idx - 1]?.sender_role === 'customer' || messages[idx - 1]?.sender === 'user');

                return (
                  <div key={msg.id || idx} className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    {/* Support avatar */}
                    {!isOwn && (
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                        <FiHeadphones size={14} className="text-white" />
                      </div>
                    )}

                    <div className={`max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      {!isOwn && showAvatar && (
                        <span className="text-xs font-bold text-pink-600 ml-1">Support</span>
                      )}
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        isOwn
                          ? 'bg-gradient-to-br from-pink-600 to-rose-500 text-white rounded-br-sm shadow-md shadow-pink-200'
                          : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                      }`}>
                        {msg.message}
                      </div>
                      <span className={`text-[10px] text-gray-400 px-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* User avatar */}
                    {isOwn && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 text-xs font-bold text-gray-600">
                        {initials}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Input bar ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3 shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type your message…"
              disabled={sending}
              className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="w-11 h-11 rounded-xl bg-pink-600 hover:bg-pink-700 disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 shadow-md shadow-pink-200"
            >
              {sending
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <FiSend size={16} />
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
