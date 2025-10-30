'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/supabase';
import { chatAPI, scanAPI } from '@/lib/api';
import ChatMessage from '@/components/ChatMessage';
import DropdownMenu from '@/components/DropdownMenu';
import ScanPreviewModal from '@/components/ScanPreviewModal';

interface Message {
  role: 'user' | 'assistant';
  content: string;
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(userMessage, messages);
      setMessages((prev) => [...prev, { role: 'assistant', content: response.message }]);
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
    <div className="flex flex-col h-screen bg-beige-lightest">
      {/* Header */}
      <header className="bg-white border-b border-beige-light px-6 py-4 flex items-center justify-between">
        <DropdownMenu />
        <h1 className="text-xl font-semibold text-gray-800">AI Stylist</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleClearChat}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
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
            className={`w-10 h-10 rounded-full bg-beige hover:bg-beige-dark text-white flex items-center justify-center cursor-pointer transition-colors ${
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
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">Welcome to your AI Stylist!</p>
              <p className="text-sm">
                Upload clothing items using the camera icon or ask me for styling advice.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} role={msg.role} content={msg.content} />
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
      <form onSubmit={handleSendMessage} className="bg-white border-t border-beige-light px-6 py-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask your stylist anything..."
            className="flex-1 px-4 py-2 border border-beige-light rounded-lg focus:outline-none focus:ring-2 focus:ring-beige disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-2 bg-beige hover:bg-beige-dark text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
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
