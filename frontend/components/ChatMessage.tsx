'use client';

import Image from 'next/image';

interface ChatImageReference {
  item_id: string;
  title: string;
  image_url: string;
}

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  images?: ChatImageReference[];
}

// Simple markdown to HTML converter
function parseMarkdown(text: string): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  // Split by common markdown patterns
  const patterns = [
    { regex: /\*\*(.*?)\*\*/g, tag: 'strong' },
    { regex: /\*(.*?)\*/g, tag: 'em' },
    { regex: /__(.*?)__/g, tag: 'strong' },
    { regex: /_(.+?)_/g, tag: 'em' },
  ];

  let content = text;

  // Replace markdown bold
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  content = content.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Replace markdown italic
  content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
  content = content.replace(/_(.+?)_/g, '<em>$1</em>');

  // Replace markdown lists
  content = content.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>');
  content = content.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Replace line breaks
  content = content.replace(/\n/g, '<br />');

  return [content];
}

export default function ChatMessage({ role, content, images = [] }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}>
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-soft ${
          isUser
            ? 'bg-beige text-white'
            : 'bg-white/90 backdrop-blur-sm text-gray-800 border border-beige-light'
        }`}
      >
        <div
          className={`whitespace-pre-wrap break-words text-sm ${isUser ? 'font-medium' : ''}`}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Inline images */}
        {images && images.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {images.map((img) => (
              <div key={img.item_id} className="flex flex-col items-center">
                <Image
                  src={img.image_url}
                  alt={img.title}
                  width={112}
                  height={112}
                  className="w-28 h-28 object-cover rounded-xl border-2 border-beige-light shadow-medium hover:scale-110 transition-transform cursor-pointer"
                  title={img.title}
                />
                <p className="text-xs mt-2 text-center max-w-28 truncate font-medium">{img.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
