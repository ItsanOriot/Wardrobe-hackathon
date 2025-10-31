'use client';

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
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] ${
          isUser
            ? 'bg-beige text-white'
            : 'bg-white border border-beige-light text-gray-800'
        }`}
      >
        {/* Message content */}
        <div className="px-4 py-3 rounded-lg">
          <div
            className="whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {/* Inline images */}
        {images && images.length > 0 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {images.map((img) => (
              <div key={img.item_id} className="flex flex-col items-center">
                <img
                  src={img.image_url}
                  alt={img.title}
                  className="w-24 h-24 object-cover rounded-lg border border-beige-light"
                  title={img.title}
                />
                <p className="text-xs mt-1 text-center max-w-24 truncate">{img.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
