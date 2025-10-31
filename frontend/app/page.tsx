'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/supabase';
import { chatAPI, scanAPI } from '@/lib/api';
import ChatMessage from '@/components/ChatMessage';
import DropdownMenu from '@/components/DropdownMenu';
import ScanPreviewModal from '@/components/ScanPreviewModal';

interface ChatImageReference {
  item_id: string;
  title: string;
  image_url: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  images?: ChatImageReference[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanImageFile, setScanImageFile] = useState<File | null>(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = getAccessToken();
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Format markdown in text
  const formatMarkdown = (text: string): string => {
    // Bold: **text** or __text__
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Italic: *text* or _text_
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/_(.+?)_/g, '<em>$1</em>');

    // Lists: - item or * item
    text = text.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Line breaks
    text = text.replace(/\n/g, '<br />');

    return text;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(userMessage, messages);
      const formattedContent = formatMarkdown(response.message);
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: formattedContent,
        images: response.images || []
      }]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanLoading(true);

    try {
      const result = await scanAPI.scanImage(file);
      setScanResult(result);
      setScanImageFile(file);
      setShowScanModal(true);
    } catch (error: any) {
      alert('Failed to scan image: ' + error.message);
    } finally {
      setScanLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleScanSuccess = () => {
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: 'Great! I\'ve added that item to your wardrobe. How can I help you style it?',
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-beige-50 via-beige-100 to-beige-200">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-beige-light/60 px-6 py-4 flex items-center justify-between shadow-soft">
        <DropdownMenu />
        <h1 className="text-2xl font-bold text-beige-dark">
          StyleIt
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleClearChat}
            className="text-sm text-gray-700 hover:text-gray-900 hover:bg-beige-50 px-3 py-1.5 rounded-lg transition-all font-medium"
          >
            Clear Chat
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`w-11 h-11 rounded-full bg-beige hover:bg-beige-dark text-white flex items-center justify-center cursor-pointer transition-all shadow-medium hover:shadow-glow ${
              scanLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {scanLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            )}
          </label>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-2xl mx-auto px-4 animate-fadeIn">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-beige shadow-glow mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-3">
                Welcome to StyleIt
              </h2>
              <p className="text-gray-600 mb-8 font-medium text-lg">Try asking me:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setInput("What should I wear to a casual dinner?")}
                  className="px-5 py-4 bg-white/90 backdrop-blur-sm border border-beige-light rounded-2xl text-sm text-left text-gray-700 font-medium hover:border-beige hover:shadow-medium transition-all duration-200 hover:scale-105"
                >
                  <span className="text-2xl mr-3">💬</span>
                  What should I wear to a casual dinner?
                </button>
                <button
                  onClick={() => setInput("Help me create a professional work outfit")}
                  className="px-5 py-4 bg-white/90 backdrop-blur-sm border border-beige-light rounded-2xl text-sm text-left text-gray-700 font-medium hover:border-beige hover:shadow-medium transition-all duration-200 hover:scale-105"
                >
                  <span className="text-2xl mr-3">👔</span>
                  Help me create a professional work outfit
                </button>
                <button
                  onClick={() => setInput("What colors go well together in my wardrobe?")}
                  className="px-5 py-4 bg-white/90 backdrop-blur-sm border border-beige-light rounded-2xl text-sm text-left text-gray-700 font-medium hover:border-beige hover:shadow-medium transition-all duration-200 hover:scale-105"
                >
                  <span className="text-2xl mr-3">🎨</span>
                  What colors go well together in my wardrobe?
                </button>
                <button
                  onClick={() => setInput("Suggest an outfit for a weekend brunch")}
                  className="px-5 py-4 bg-white/90 backdrop-blur-sm border border-beige-light rounded-2xl text-sm text-left text-gray-700 font-medium hover:border-beige hover:shadow-medium transition-all duration-200 hover:scale-105"
                >
                  <span className="text-2xl mr-3">☀️</span>
                  Suggest an outfit for a weekend brunch
                </button>
              </div>
              <p className="text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg inline-block mt-8">
                Upload clothing items using the camera icon above to get started
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} role={msg.role} content={msg.content} images={msg.images} />
            ))}
            {loading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white border border-beige-light px-4 py-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-beige rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-beige rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-beige rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="bg-white/80 backdrop-blur-xl border-t border-beige-light/60 px-6 py-4 shadow-soft">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask me anything about your wardrobe..."
            className="flex-1 px-5 py-3 bg-white border border-beige-light rounded-xl focus:outline-none focus:ring-2 focus:ring-beige focus:border-beige transition-all font-medium text-gray-700 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-8 py-3 bg-beige hover:bg-beige-dark text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-medium hover:shadow-glow"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>

      {/* Scan Preview Modal */}
      <ScanPreviewModal
        isOpen={showScanModal}
        onClose={() => setShowScanModal(false)}
        scanResult={scanResult}
        imageFile={scanImageFile}
        onSuccess={handleScanSuccess}
      />
    </div>
  );
}
