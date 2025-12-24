import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import MessageBubble from '../components/MessageBubble';

const ChatPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isAuthenticated()) {
      loadChatHistory();
    }
  }, []);

  const loadChatHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await chatAPI.getChatHistory();
      const history = response.data.data;
      
      const formattedMessages = history.flatMap((chat) => [
        { 
          id: `user-${chat.id}`,
          text: chat.message, 
          isUser: true, 
          timestamp: chat.createdAt 
        },
        {
          id: `ai-${chat.id}`,
          text: chat.response,
          isUser: false,
          sentiment: chat.sentiment,
          moodScore: chat.moodScore,
          timestamp: chat.createdAt,
        },
      ]);
      
      setMessages(formattedMessages.reverse());
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    const userMsg = { 
      id: `temp-${Date.now()}`,
      text: userMessage, 
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setIsTyping(true);

    try {
      let response;
      if (isAuthenticated()) {
        response = await chatAPI.sendMessage({ message: userMessage });
      } else {
        response = await chatAPI.sendAnonymousMessage({ message: userMessage });
      }

      const aiResponse = response.data.data;

      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          text: aiResponse.response,
          isUser: false,
          sentiment: aiResponse.sentiment,
          moodScore: aiResponse.moodScore,
          timestamp: new Date().toISOString()
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. 💙",
          isUser: false,
          sentiment: 'NEUTRAL',
          timestamp: new Date().toISOString()
        },
      ]);
    } finally {
      setLoading(false);
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const quickResponses = [
    { emoji: '😊', text: "I'm feeling happy today!" },
    { emoji: '😔', text: "I'm feeling down..." },
    { emoji: '😰', text: "I'm feeling anxious" },
    { emoji: '🎵', text: "Give me some songs" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-md py-6 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Chat with Mood AI
          </h1>
          <p className="text-sm text-gray-600 mt-2 flex items-center">
            {isAuthenticated() ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Logged in as {user?.fullName} • Conversation saved
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
                💡 Anonymous mode - Login to save your chat history
              </>
            )}
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-4xl w-full mx-auto px-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100">
          {loadingHistory ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading your conversations...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fadeIn">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-8 shadow-2xl animate-bounce-slow">
                <span className="text-6xl">🧠</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                How are you feeling today?
              </h2>
              <p className="text-gray-600 mb-8 max-w-md text-lg">
                I'm here to listen and support you. Share what's on your mind, and let's talk about it together.
              </p>
              
              {/* Quick Response Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                {quickResponses.map((response, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(response.text)}
                    className="card hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer p-6"
                  >
                    <div className="text-4xl mb-2">{response.emoji}</div>
                    <p className="text-sm text-gray-700 font-medium">{response.text}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg.text}
                  isUser={msg.isUser}
                  sentiment={msg.sentiment}
                  moodScore={msg.moodScore}
                  timestamp={msg.timestamp}
                />
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="bg-white rounded-2xl px-6 py-4 shadow-lg border-2 border-purple-100">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Form */}
        <div className="py-6 bg-white/95 backdrop-blur-md border-t border-gray-100 rounded-t-3xl shadow-2xl">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here... (Shift+Enter for new line)"
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 resize-none"
                disabled={loading}
                rows="1"
                style={{ minHeight: '56px', maxHeight: '120px' }}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {inputMessage.length}/1000
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </>
              )}
            </button>
          </form>
          
          {/* Quick Actions */}
          {!loadingHistory && messages.length > 0 && (
            <div className="flex justify-center mt-4 space-x-2">
              {quickResponses.slice(0, 3).map((response, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(response.text)}
                  className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors"
                >
                  {response.emoji} {response.text.split(' ').slice(0, 2).join(' ')}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;