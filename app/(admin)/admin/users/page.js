// boutique-frontend/app/(admin)/users/page.js
// Admin users management

'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import API from '@/lib/endpoints';
import { FiUser, FiSlash, FiCheck, FiTrash2, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [actionLoading, setActionLoading] = useState(null); // holds user id being acted on

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(API.ADMIN.USERS.LIST);
      if (res.data.success) setUsers(res.data.data.users || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const doAction = async (endpoint, payload, successMsg, userId) => {
    if (!confirm('Are you sure?')) return;
    setActionLoading(userId);
    try {
      const res = await apiClient.post(endpoint, payload);
      if (res.data.success) {
        toast.success(successMsg);
        fetchUsers();
      } else {
        toast.error(res.data.message || 'Action failed');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="text-left px-6 py-3">User</th>
                  <th className="text-left px-6 py-3">Email</th>
                  <th className="text-left px-6 py-3">Role</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Joined</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">No users found</td>
                  </tr>
                ) : filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-semibold text-xs">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.is_suspended ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {u.is_suspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        {u.role !== 'admin' && (
                          <>
                            {u.is_suspended ? (
                              <button
                                onClick={() => doAction(API.ADMIN.USERS.UNSUSPEND, { user_id: u.id }, 'User unsuspended', u.id)}
                                disabled={actionLoading === u.id}
                                title="Unsuspend"
                                className="text-green-600 hover:text-green-700 disabled:opacity-40"
                              >
                                <FiCheck size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() => doAction(API.ADMIN.USERS.SUSPEND, { user_id: u.id }, 'User suspended', u.id)}
                                disabled={actionLoading === u.id}
                                title="Suspend"
                                className="text-yellow-600 hover:text-yellow-700 disabled:opacity-40"
                              >
                                <FiSlash size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => doAction(API.ADMIN.USERS.DELETE, { user_id: u.id }, 'User deleted', u.id)}
                              disabled={actionLoading === u.id}
                              title="Delete"
                              className="text-red-500 hover:text-red-700 disabled:opacity-40"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
