import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [typedText, setTypedText] = useState('');
  const [isVisible, setIsVisible] = useState({});
  
  const fullText = "Your Personal Mental Wellness Companion";
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.substring(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );
    
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background Circles */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Logo Animation */}
            <div className="mb-8 inline-block animate-bounce-slow">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <span className="text-6xl">🧠</span>
              </div>
            </div>
            
            {/* Main Heading with Gradient */}
            <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent animate-slideUp">
              Mood AI
            </h1>
            
            {/* Typing Effect Subtitle */}
            <div className="h-20 mb-8">
              <p className="text-3xl text-gray-700 font-light animate-slideUp">
                {typedText}
                <span className="animate-pulse">|</span>
              </p>
            </div>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto animate-slideUp leading-relaxed">
              Experience AI-powered emotional support with real-time sentiment analysis, 
              personalized recommendations, and comprehensive mood tracking. Your mental wellness journey starts here.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex justify-center space-x-6 animate-slideUp">
              {isAuthenticated() ? (
                <Link 
                  to="/chat" 
                  className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-purple-500/50 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center">
                    Start Chatting
                    <svg className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              ) : (
                <>
                  <Link 
                    to="/register" 
                    className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-purple-500/50 hover:scale-105"
                  >
                    <span className="relative z-10">Get Started Free</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Link>
                  
                  <Link 
                    to="/chat" 
                    className="group inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-purple-700 bg-white border-3 border-purple-600 rounded-2xl shadow-xl transition-all duration-300 hover:bg-purple-50 hover:scale-105"
                  >
                    Try Anonymous Chat
                  </Link>
                </>
              )}
            </div>
            
            {/* Trust Badges */}
            <div className="mt-16 flex justify-center items-center space-x-8 text-gray-600">
              <div className="flex items-center space-x-2">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">100% Free</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16 animate-on-scroll" id="features-title">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600">Everything you need for your mental wellness journey</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "💬",
              title: "AI-Powered Chat",
              description: "Natural conversations with our advanced AI that understands context and remembers your journey.",
              gradient: "from-purple-500 to-purple-600",
              delay: "0s"
            },
            {
              icon: "📊",
              title: "Mood Analytics",
              description: "Track your emotional patterns with beautiful visualizations and detailed insights over time.",
              gradient: "from-blue-500 to-blue-600",
              delay: "0.1s"
            },
            {
              icon: "🎵",
              title: "Smart Recommendations",
              description: "Get personalized song suggestions, breathing exercises, and coping strategies based on your mood.",
              gradient: "from-pink-500 to-pink-600",
              delay: "0.2s"
            },
            {
              icon: "🔒",
              title: "Privacy First",
              description: "Your data is encrypted and secure. Use anonymous mode for complete privacy.",
              gradient: "from-indigo-500 to-indigo-600",
              delay: "0s"
            },
            {
              icon: "⚡",
              title: "Real-time Analysis",
              description: "Instant sentiment detection and mood scoring with every message you send.",
              gradient: "from-cyan-500 to-cyan-600",
              delay: "0.1s"
            },
            {
              icon: "📱",
              title: "Responsive Design",
              description: "Beautiful experience on any device - desktop, tablet, or mobile.",
              gradient: "from-teal-500 to-teal-600",
              delay: "0.2s"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="animate-on-scroll card group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
              id={`feature-${index}`}
              style={{ animationDelay: feature.delay }}
            >
              <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                <span className="text-4xl">{feature.icon}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: "24/7", label: "Always Available" },
              { value: "100%", label: "Confidential" },
              { value: "AI", label: "Powered Intelligence" },
              { value: "Free", label: "Forever" }
            ].map((stat, index) => (
              <div key={index} className="animate-on-scroll" id={`stat-${index}`}>
                <div className="text-6xl font-black mb-2 animate-pulse">{stat.value}</div>
                <div className="text-xl text-purple-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">Get started in just 3 simple steps</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: "1", icon: "📝", title: "Sign Up", desc: "Create your free account in seconds" },
            { step: "2", icon: "💭", title: "Share Your Feelings", desc: "Express yourself freely" },
            { step: "3", icon: "🤖", title: "Get AI Support", desc: "Receive personalized guidance" },
            { step: "4", icon: "📈", title: "Track Progress", desc: "Monitor your wellness journey" }
          ].map((item, index) => (
            <div key={index} className="relative animate-on-scroll" id={`step-${index}`}>
              <div className="card text-center relative z-10 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {item.step}
                </div>
                <div className="text-5xl mb-4 mt-4">{item.icon}</div>
                <h4 className="font-bold text-xl text-gray-800 mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
              {index < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-0">
                  <svg className="w-6 h-6 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial/Quote Section */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="card bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
            <svg className="w-16 h-16 text-purple-300 mx-auto mb-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <blockquote className="text-2xl font-medium text-gray-700 mb-6 italic">
              "Mental health is not a destination, but a process. It's about how you drive, not where you're going."
            </blockquote>
            <p className="text-gray-500">— Mental Health Awareness</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="card bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-white text-center transform hover:scale-105 transition-all duration-500 shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Wellness Journey?</h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands who trust Mood AI for their mental wellness
          </p>
          <Link 
            to="/register" 
            className="inline-block bg-white text-purple-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-110"
          >
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Premium Footer with Your Name */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🧠</span>
                </div>
                <span className="text-2xl font-bold">Mood AI</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your trusted AI-powered mental wellness companion. Get personalized emotional support, 
                track your mood patterns, and receive expert guidance 24/7.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/Aalekh09" target="_blank" rel="noopener noreferrer" 
                   className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://linkedin.com/in/aalekhkumar" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="mailto:aalekh.dev@gmail.com"
                   className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/chat" className="text-gray-400 hover:text-white transition-colors">Chat</Link></li>
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="https://github.com/Aalekh09/Mood_AI" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar with Your Name */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-gray-400">
                  © 2025 Mood AI. All rights reserved.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Built with ❤️ for mental wellness
                </p>
              </div>
              
              {/* Your Name & Details */}
              <div className="text-center md:text-right">
                <p className="text-white font-bold text-lg mb-1">
                  Developed by <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Aalekh Kumar</span>
                </p>
                <p className="text-gray-400 text-sm">
                  B.Tech CSE (2026) | Manav Rachna University
                </p>
                <div className="flex justify-center md:justify-end space-x-2 mt-2">
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-xs rounded-full">Full Stack Developer</span>
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full">AI Enthusiast</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Add Custom Animations to index.css */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease-out;
        }
        
        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default LandingPage;