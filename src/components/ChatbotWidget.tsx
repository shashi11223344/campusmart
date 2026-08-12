import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Trash2, Copy, RotateCw } from 'lucide-react';
import { useChatbot } from '@/hooks/useChatbot';
import { cn } from '@/lib/utils';

interface ChatbotWidgetProps {
  className?: string;
  isDarkMode?: boolean;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ className, isDarkMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, loading, error, sendMessage, clearHistory, isInitialized } = useChatbot();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when widget opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage(input);
    setInput('');
    inputRef.current?.focus();
  };

  const handleCopyMessage = (messageId: number, content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(messageId);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      {/* Chat Widget Container */}
      <div
        className={cn(
          'fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]',
          className
        )}
      >
        {isOpen && (
          <div
            className={cn(
              'flex flex-col rounded-xl shadow-2xl border transition-all duration-200 ease-out transform animate-in fade-in zoom-in-95',
              isDarkMode
                ? 'bg-gray-900 border-gray-700'
                : 'bg-white border-gray-200'
            )}
            style={{ height: '600px' }}
          >
            {/* Header */}
            <div
              className={cn(
                'flex items-center justify-between p-4 border-b rounded-t-xl',
                isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 border-gray-200'
              )}
            >
              <div className="flex items-center gap-2">
                <MessageCircle className={isDarkMode ? 'text-blue-400' : 'text-white'} size={20} />
                <div>
                  <h3 className={cn(
                    'font-semibold',
                    isDarkMode ? 'text-white' : 'text-white'
                  )}>
                    CampusMart Assistant
                  </h3>
                  <p className={cn(
                    'text-xs',
                    isDarkMode ? 'text-gray-400' : 'text-blue-100'
                  )}>
                    {loading ? 'Thinking...' : 'Always here to help'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => clearHistory()}
                  title="Clear chat"
                  className={cn(
                    'p-2 rounded hover:bg-opacity-20 transition',
                    isDarkMode
                      ? 'hover:bg-red-500 text-gray-400'
                      : 'hover:bg-white text-white'
                  )}
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'p-2 rounded hover:bg-opacity-20 transition',
                    isDarkMode
                      ? 'hover:bg-gray-600 text-gray-400'
                      : 'hover:bg-white text-white'
                  )}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div
              className={cn(
                'flex-1 overflow-y-auto p-4 space-y-4',
                isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
              )}
            >
              {!isInitialized ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin">
                    <RotateCw size={24} className="text-blue-500" />
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle size={48} className="text-gray-400 mb-4" />
                  <h4 className={cn(
                    'font-semibold mb-2',
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    Welcome to CampusMart Assistant!
                  </h4>
                  <p className={cn(
                    'text-sm',
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    Ask me about products, orders, facilities, admissions, and more.
                  </p>
                </div>
              ) : (
                <>
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex gap-2 transition-all duration-200',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-xs px-4 py-2 rounded-lg',
                          message.role === 'user'
                            ? isDarkMode
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-blue-500 text-white rounded-br-none'
                            : isDarkMode
                            ? 'bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700'
                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                        {message.role === 'assistant' && (
                          <button
                            onClick={() => handleCopyMessage(message.id, message.content)}
                            className={cn(
                              'text-xs mt-2 flex items-center gap-1 opacity-60 hover:opacity-100 transition',
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            )}
                          >
                            <Copy size={12} />
                            {copied === message.id ? 'Copied!' : 'Copy'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div
                className={cn(
                  'px-4 py-2 text-sm rounded-none border-t',
                  isDarkMode
                    ? 'bg-red-900/30 border-red-700 text-red-300'
                    : 'bg-red-100 border-red-200 text-red-800'
                )}
              >
                {error}
              </div>
            )}

            {/* Input Area */}
            <form
              onSubmit={handleSendMessage}
              className={cn(
                'p-4 border-t flex gap-2 rounded-b-xl',
                isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              )}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={loading}
                className={cn(
                  'flex-1 px-3 py-2 rounded border outline-none transition',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                )}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className={cn(
                  'px-4 py-2 rounded font-medium transition flex items-center gap-2',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:hover:bg-blue-600'
                    : 'bg-blue-500 hover:bg-blue-600 text-white disabled:hover:bg-blue-500'
                )}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        )}

        {/* Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center shadow-lg font-medium text-white transition-all duration-200 transform hover:scale-110 active:scale-95',
            isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100',
            isDarkMode
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-500 hover:bg-blue-600'
          )}
        >
          <MessageCircle size={24} />
        </button>
      </div>
    </>
  );
};

export default ChatbotWidget;

