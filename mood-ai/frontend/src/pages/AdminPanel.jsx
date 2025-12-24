import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, chatsRes, analyticsRes] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getAllChats(),
        adminAPI.getAnalytics(),
      ]);

      setUsers(usersRes.data.data);
      setChats(chatsRes.data.data);
      setAnalytics(analyticsRes.data.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('⚠️ Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      await adminAPI.deleteUser(userId);
      loadAdminData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (!window.confirm('Are you sure you want to delete this chat?')) return;

    try {
      await adminAPI.deleteChat(chatId);
      loadAdminData();
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Failed to delete chat');
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredChats = chats.filter(chat =>
    chat.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-5xl">👑</span>
            <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
          <p className="text-gray-600 text-xl">Manage users, chats, and view analytics</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-105 transition-all duration-300 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-90">Total Users</p>
              <span className="text-3xl">👥</span>
            </div>
            <p className="text-5xl font-black mb-1">{analytics?.totalUsers || 0}</p>
            <p className="text-xs opacity-75">Registered accounts</p>
          </div>

          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-all duration-300 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-90">Total Chats</p>
              <span className="text-3xl">💬</span>
            </div>
            <p className="text-5xl font-black mb-1">{analytics?.totalChats || 0}</p>
            <p className="text-xs opacity-75">All conversations</p>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white transform hover:scale-105 transition-all duration-300 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-90">Active Today</p>
              <span className="text-3xl">⚡</span>
            </div>
            <p className="text-5xl font-black mb-1">
              {chats.filter(chat => {
                const today = new Date().toDateString();
                return new Date(chat.createdAt).toDateString() === today;
              }).length}
            </p>
            <p className="text-xs opacity-75">Today's activity</p>
          </div>

          <div className="card bg-gradient-to-br from-pink-500 to-pink-600 text-white transform hover:scale-105 transition-all duration-300 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-90">Avg per User</p>
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-5xl font-black mb-1">
              {users.length > 0 ? (chats.length / users.length).toFixed(1) : 0}
            </p>
            <p className="text-xs opacity-75">Chats per user</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="card mb-8 animate-fadeIn">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users, emails, or chat content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-14 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
            />
            <svg className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="card mb-8 animate-fadeIn">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'users', label: 'Users', icon: '👥' },
              { id: 'chats', label: 'Chats', icon: '💬' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-4 font-bold transition-all duration-300 flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-4 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-6">System Overview</h3>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">📈 Recent Activity</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Last Hour</p>
                        <p className="text-3xl font-bold text-purple-600">
                          {chats.filter(chat => {
                            const lastHour = new Date(Date.now() - 60 * 60 * 1000);
                            return new Date(chat.createdAt) > lastHour;
                          }).length}
                        </p>
                        <p className="text-xs text-gray-500">chats</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Today</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {chats.filter(chat => {
                            const today = new Date().toDateString();
                            return new Date(chat.createdAt).toDateString() === today;
                          }).length}
                        </p>
                        <p className="text-xs text-gray-500">chats</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">This Week</p>
                        <p className="text-3xl font-bold text-green-600">
                          {chats.filter(chat => {
                            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                            return new Date(chat.createdAt) > weekAgo;
                          }).length}
                        </p>
                        <p className="text-xs text-gray-500">chats</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border-2 border-green-200">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">👥 User Statistics</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Regular Users</p>
                        <div className="flex items-center justify-between">
                          <p className="text-3xl font-bold text-gray-800">
                            {users.filter(u => u.role === 'USER').length}
                          </p>
                          <span className="text-xs text-gray-500">
                            {((users.filter(u => u.role === 'USER').length / users.length) * 100 || 0).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Administrators</p>
                        <div className="flex items-center justify-between">
                          <p className="text-3xl font-bold text-gray-800">
                            {users.filter(u => u.role === 'ADMIN').length}
                          </p>
                          <span className="text-xs text-gray-500">
                            {((users.filter(u => u.role === 'ADMIN').length / users.length) * 100 || 0).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-200">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">😊 Sentiment Analysis</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Positive</span>
                          <span className="text-sm font-bold">
                            {chats.filter(c => c.sentiment === 'POSITIVE').length} chats
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(chats.filter(c => c.sentiment === 'POSITIVE').length / chats.length) * 100 || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Neutral</span>
                          <span className="text-sm font-bold">
                            {chats.filter(c => c.sentiment === 'NEUTRAL').length} chats
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(chats.filter(c => c.sentiment === 'NEUTRAL').length / chats.length) * 100 || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Negative</span>
                          <span className="text-sm font-bold">
                            {chats.filter(c => c.sentiment === 'NEGATIVE').length} chats
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-red-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(chats.filter(c => c.sentiment === 'NEGATIVE').length / chats.length) * 100 || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-6">All Users ({filteredUsers.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Chats</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-purple-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                {user.fullName?.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{user.fullName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-4 py-1.5 text-xs font-bold rounded-full ${
                              user.role === 'ADMIN' 
                                ? 'bg-purple-100 text-purple-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {user.role === 'ADMIN' ? '👑' : '👤'} {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                              {chats.filter(c => c.user?.id === user.id).length}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {user.role !== 'ADMIN' && (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-500 hover:text-red-700 text-sm font-bold px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'chats' && (
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-6">All Chats ({filteredChats.length})</h3>
                <div className="space-y-4 max-h-[800px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="border-2 border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-lg transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-xs text-gray-500">User ID: {chat.user?.id || 'Anonymous'}</span>
                            {chat.user && (
                              <span className="text-xs text-purple-600 font-semibold">{chat.user.email}</span>
                            )}
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg mb-3">
                            <p className="text-xs font-bold text-purple-600 mb-1">User Message:</p>
                            <p className="text-sm text-gray-800">{chat.message}</p>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-xs font-bold text-blue-600 mb-1">AI Response:</p>
                            <p className="text-sm text-gray-800">{chat.response}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteChat(chat.id)}
                          className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-3">
                          <span className={`px-4 py-1.5 rounded-full font-bold ${
                            chat.sentiment === 'POSITIVE' ? 'bg-green-100 text-green-700' :
                            chat.sentiment === 'NEGATIVE' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {chat.sentiment === 'POSITIVE' ? '😊' : chat.sentiment === 'NEGATIVE' ? '😔' : '😐'} {chat.sentiment}
                          </span>
                          {chat.moodScore && (
                            <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full font-bold">
                              Mood: {(chat.moodScore * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>
                        <span className="text-gray-500 font-medium">
                          {new Date(chat.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;