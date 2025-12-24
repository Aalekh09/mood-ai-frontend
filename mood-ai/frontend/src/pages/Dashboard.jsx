import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChats: 0,
    avgMoodScore: 0,
    positiveCount: 0,
    negativeCount: 0,
    neutralCount: 0,
  });
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await chatAPI.getChatHistory();
      const history = response.data.data;
      setChatHistory(history);
      calculateStats(history);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally{
setLoading(false);
}
};
const calculateStats = (history) => {
const total = history.length;
const positive = history.filter((chat) => chat.sentiment === 'POSITIVE').length;
const negative = history.filter((chat) => chat.sentiment === 'NEGATIVE').length;
const neutral = history.filter((chat) => chat.sentiment === 'NEUTRAL').length;
const avgMood = total > 0 
  ? history.reduce((sum, chat) => sum + (chat.moodScore || 0), 0) / total
  : 0;

setStats({
  totalChats: total,
  avgMoodScore: avgMood,
  positiveCount: positive,
  negativeCount: negative,
  neutralCount: neutral,
});
};
const handleDeleteChat = async (chatId) => {
if (!window.confirm('Are you sure you want to delete this conversation?')) return;
try {
  await chatAPI.deleteChat(chatId);
  loadDashboardData();
} catch (error) {
  console.error('Error deleting chat:', error);
  alert('Failed to delete conversation');
}};
const exportChats = () => {
const dataStr = JSON.stringify(chatHistory, null, 2);
const dataBlob = new Blob([dataStr], { type: 'application/json' });
const url = URL.createObjectURL(dataBlob);
const link = document.createElement('a');
link.href = url;
link.download = `mood-ai-chats-${new Date().toISOString().split('T')[0]}.json`;
link.click();
};
if (loading) {
return (
<div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
<div className="text-center">
<div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
<p className="text-gray-600 font-medium text-lg">Loading your dashboard...</p>
</div>
</div>
);
}
return (
<div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
<div className="max-w-7xl mx-auto">
{/* Header */}
<div className="mb-8 animate-fadeIn">
<h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
Your Dashboard
</h1>
<p className="text-gray-600 text-xl">Welcome back, <span className="font-bold text-purple-600">{user?.fullName}</span>! 👋</p>
</div>
{/* Stats Grid */}
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-105 transition-all duration-300 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm opacity-90">Total Conversations</p>
          <span className="text-3xl">💬</span>
        </div>
        <p className="text-5xl font-black mb-1">{stats.totalChats}</p>
        <p className="text-xs opacity-75">All time</p>
      </div>

      <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-all duration-300 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm opacity-90">Average Mood</p>
          <span className="text-3xl">
            {stats.avgMoodScore > 0.7 ? '😊' : stats.avgMoodScore > 0.4 ? '😐' : '😔'}
          </span>
        </div>
        <p className="text-5xl font-black mb-1">{(stats.avgMoodScore * 100).toFixed(0)}%</p>
        <p className="text-xs opacity-75">Mood score</p>
      </div>

      <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white transform hover:scale-105 transition-all duration-300 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm opacity-90">Positive Moments</p>
          <span className="text-3xl">✨</span>
        </div>
        <p className="text-5xl font-black mb-1">{stats.positiveCount}</p>
        <p className="text-xs opacity-75">{((stats.positiveCount / stats.totalChats) * 100 || 0).toFixed(0)}% of total</p>
      </div>

      <div className="card bg-gradient-to-br from-pink-500 to-pink-600 text-white transform hover:scale-105 transition-all duration-300 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm opacity-90">Support Needed</p>
          <span className="text-3xl">💙</span>
        </div>
        <p className="text-5xl font-black mb-1">{stats.negativeCount}</p>
        <p className="text-xs opacity-75">{((stats.negativeCount / stats.totalChats) * 100 || 0).toFixed(0)}% of total</p>
      </div>
    </div>

    {/* Mood Distribution */}
    <div className="card mb-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Mood Distribution</h2>
        <button
          onClick={exportChats}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Export Data</span>
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-3">
            <span className="text-lg font-semibold text-gray-700 flex items-center">
              <span className="text-2xl mr-2">😊</span> Positive
            </span>
            <span className="text-lg text-gray-600 font-bold">{stats.positiveCount} ({((stats.positiveCount / stats.totalChats) * 100 || 0).toFixed(0)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
              style={{ width: `${(stats.positiveCount / stats.totalChats) * 100 || 0}%` }}
            >
              <span className="text-xs text-white font-bold">{stats.positiveCount}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-3">
            <span className="text-lg font-semibold text-gray-700 flex items-center">
              <span className="text-2xl mr-2">😐</span> Neutral
            </span>
            <span className="text-lg text-gray-600 font-bold">{stats.neutralCount} ({((stats.neutralCount / stats.totalChats) * 100 || 0).toFixed(0)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
              style={{ width: `${(stats.neutralCount / stats.totalChats) * 100 || 0}%` }}
            >
              <span className="text-xs text-white font-bold">{stats.neutralCount}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-3">
            <span className="text-lg font-semibold text-gray-700 flex items-center">
              <span className="text-2xl mr-2">😔</span> Negative
            </span>
            <span className="text-lg text-gray-600 font-bold">{stats.negativeCount} ({((stats.negativeCount / stats.totalChats) * 100 || 0).toFixed(0)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-red-400 to-red-600 h-4 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
              style={{ width: `${(stats.negativeCount / stats.totalChats) * 100 || 0}%` }}
            >
              <span className="text-xs text-white font-bold">{stats.negativeCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Recent Conversations */}
    <div className="card animate-fadeIn">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Recent Conversations</h2>
      {chatHistory.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">💬</div>
          <p className="text-gray-600 text-xl mb-6">No conversations yet</p>
          <button
            onClick={() => navigate('/chat')}
            className="btn-primary text-lg"
          >
            Start Your First Chat
          </button>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100">
          {chatHistory.slice(0, 20).map((chat) => (
            <div
              key={chat.id}
              className="border-2 border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </span>
                    <p className="text-sm font-bold text-gray-800">You</p>
                  </div>
                  <p className="text-sm text-gray-700 mb-4 pl-10">{chat.message}</p>
                  
                  <div className="flex items-center space-x-2 mb-2 pl-10">
                    <span className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white">
                      🧠
                    </span>
                    <p className="text-sm font-bold text-purple-600">Mood AI</p>
                  </div>
                  <p className="text-sm text-gray-600 pl-10">{chat.response}</p>
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
                <span className={`px-4 py-1.5 rounded-full font-bold ${
                  chat.sentiment === 'POSITIVE' ? 'bg-green-100 text-green-700' :
                  chat.sentiment === 'NEGATIVE' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {chat.sentiment === 'POSITIVE' ? '😊' : chat.sentiment === 'NEGATIVE' ? '😔' : '😐'} {chat.sentiment}
                </span>
                <span className="text-gray-500 font-medium">
                  {new Date(chat.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Insights Card */}
    {chatHistory.length > 0 && (
      <div className="card mt-8 bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-200 animate-fadeIn">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">💡 Your Insights</h3>
        <div className="space-y-3">
          <p className="text-gray-700">
            • You've had <strong>{stats.totalChats} conversations</strong> with Mood AI
          </p>
          <p className="text-gray-700">
            • Your overall mood trend is <strong>
              {stats.avgMoodScore > 0.7 ? 'very positive 😊' : 
               stats.avgMoodScore > 0.4 ? 'balanced 😐' : 'needs support 💙'}
            </strong>
          </p>
          <p className="text-gray-700">
            • <strong>{((stats.positiveCount / stats.totalChats) * 100 || 0).toFixed(0)}%</strong> of your conversations were positive
          </p>
          {stats.negativeCount > stats.positiveCount && (
            <p className="text-gray-700">
              💙 Remember: It's okay to have difficult days. We're here to support you.
            </p>
          )}
        </div>
      </div>
    )}
  </div>
</div>
);
};
export default Dashboard;