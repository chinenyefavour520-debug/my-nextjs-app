// boutique-frontend/app/(admin)/chat/page.js
// Admin Chat with All Customers

'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/api';
import API from '@/lib/endpoints';
import { FiSend, FiUsers, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminChatPage() {
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const pollInterval = useRef(null);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') { fetchConversations(); pollInterval.current = setInterval(fetchConversations, 5000); }
    return () => { if (pollInterval.current) clearInterval(pollInterval.current); };
  }, [isAuthenticated, user]);

  useEffect(() => { if (selectedCustomer) fetchMessages(); }, [selectedCustomer]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await apiClient.get(API.CHAT.CONVERSATIONS);
      if (response.data.success) setConversations(response.data.data.conversations || []);
    } catch (error) { console.error('Error fetching conversations:', error); }
    finally { setLoading(false); }
  };

  const fetchMessages = async () => {
    if (!selectedCustomer) return;
    try {
      const response = await apiClient.get(`${API.CHAT.MESSAGES}?customer_id=${selectedCustomer.customer_id}`);
      if (response.data.success) setMessages(response.data.data.messages || []);
    } catch (error) { console.error('Error fetching messages:', error); }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCustomer) return;
    setSending(true);
    try {
      const response = await apiClient.post(API.CHAT.SEND, { customer_id: selectedCustomer.customer_id, message: newMessage });
      if (response.data.success) { setNewMessage(''); fetchMessages(); fetchConversations(); }
      else toast.error(response.data.message);
    } catch (error) { toast.error('Failed to send message'); }
    finally { setSending(false); }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div></div>;

  return (
    <div className="h-[calc(100vh-120px)] flex">
      <div className="w-80 border-r bg-white overflow-y-auto">
        <div className="p-4 border-b bg-gray-50"><h2 className="font-semibold flex items-center gap-2"><FiUsers /> Customers</h2></div>
        {conversations.length === 0 ? (<div className="p-4 text-center text-gray-500">No conversations yet</div>) : (conversations.map(conv => (<div key={conv.customer_id} onClick={() => setSelectedCustomer(conv)} className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${selectedCustomer?.customer_id === conv.customer_id ? 'bg-pink-50 border-l-4 border-l-pink-600' : ''}`}><p className="font-semibold">{conv.customer_name}</p><p className="text-sm text-gray-500 truncate">{conv.last_message || 'No messages'}</p>{conv.unread_count > 0 && <span className="inline-block mt-1 bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full">{conv.unread_count} new</span>}</div>)))}
      </div>
      <div className="flex-1 flex flex-col bg-gray-50">
        {!selectedCustomer ? (<div className="flex-1 flex items-center justify-center text-gray-400"><FiMessageSquare size={48} /><p className="ml-2">Select a customer to start chatting</p></div>) : (<><div className="bg-white p-4 border-b"><h2 className="font-semibold">{selectedCustomer.customer_name}</h2><p className="text-sm text-gray-500">{selectedCustomer.customer_email}</p></div><div className="flex-1 overflow-y-auto p-4 space-y-3">{messages.map((msg, idx) => (<div key={idx} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[70%] p-3 rounded-lg ${msg.sender_id === user?.id ? 'bg-pink-600 text-white rounded-br-none' : 'bg-white border rounded-bl-none'}`}><p className="text-sm">{msg.message}</p><p className={`text-xs mt-1 ${msg.sender_id === user?.id ? 'text-pink-200' : 'text-gray-400'}`}>{new Date(msg.created_at).toLocaleTimeString()}</p></div></div>))}<div ref={messagesEndRef} /></div><form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-2"><input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" /><button type="submit" disabled={sending} className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50"><FiSend /></button></form></>)}
      </div>
    </div>
  );
}