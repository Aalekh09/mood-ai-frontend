import React, { useState } from 'react';

const MessageBubble = ({ message, isUser, sentiment, moodScore, timestamp }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'POSITIVE':
        return 'text-green-600';
      case 'NEGATIVE':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'POSITIVE':
        return '😊';
      case 'NEGATIVE':
        return '😔';
      default:
        return '😐';
    }
  };

  const getSentimentBg = (sentiment) => {
    switch (sentiment) {
      case 'POSITIVE':
        return 'bg-green-50';
      case 'NEGATIVE':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn group`}>
      <div className={`max-w-md ${isUser ? 'message-user' : 'message-ai'} relative`}>
        {/* Message Content */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message}</p>
        
        {/* AI Response Details */}
        {!isUser && sentiment && (
          <div className="mt-3 pt-3 border-t border-purple-100">
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-full font-semibold transition-all ${getSentimentBg(sentiment)} ${getSentimentColor(sentiment)} hover:scale-105`}
              >
                <span>{getSentimentEmoji(sentiment)}</span>
                <span>{sentiment}</span>
              </button>
              {moodScore && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Mood:</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        moodScore > 0.7 ? 'bg-green-500' : moodScore > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${moodScore * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-700 font-bold">{(moodScore * 100).toFixed(0)}%</span>
                </div>
              )}
            </div>
            
            {/* Expanded Details */}
            {showDetails && (
              <div className="mt-3 p-3 bg-purple-50 rounded-lg text-xs space-y-2 animate-fadeIn">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sentiment Analysis:</span>
                  <span className={`font-bold ${getSentimentColor(sentiment)}`}>{sentiment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mood Score:</span>
                  <span className="font-bold text-gray-800">{(moodScore * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Quality:</span>
                  <span className="text-green-600 font-bold">✓ AI-Generated</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Timestamp */}
        {timestamp && (
          <p className={`text-xs mt-2 ${isUser ? 'text-purple-200' : 'text-gray-400'} flex items-center space-x-1`}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{formatTime(timestamp)}</span>
          </p>
        )}

        {/* Copy Button (appears on hover) */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(message);
            // You can add a toast notification here
          }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MessageBubble;