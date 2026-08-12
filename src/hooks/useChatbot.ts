import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import api from '@/api/client';

export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  intent?: string;
  createdAt: string;
}

export interface UseChatbotReturn {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  loadHistory: () => Promise<void>;
  clearHistory: () => Promise<void>;
  isInitialized: boolean;
}

export const useChatbot = (): UseChatbotReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const conversationId = useRef<string>(new Date().getTime().toString());

  // Load chat history on initialization
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get('/chatbot/history', {
        params: { limit: 50 },
      });

      if (response.data.success) {
        setMessages(response.data.data);
        setIsInitialized(true);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
      // Don't set error for initial load failure - just start fresh
      setIsInitialized(true);
    }
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) {
        setError('Message cannot be empty');
        return;
      }

      // Optimistically add user message
      const userMessage: ChatMessage = {
        id: Date.now(),
        role: 'user',
        content: message.trim(),
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, userMessage]);
      setLoading(true);
      setError(null);

      try {
        const response = await api.post('/chatbot/message', {
          message: message.trim(),
          conversationId: conversationId.current,
        });

        if (response.status === 401) {
          throw new Error('Unauthorized. Please sign in again.');
        }

        if (response.data?.success) {
          const assistantMessage: ChatMessage = {
            id: response.data.data.id,
            role: 'assistant',
            content: response.data.data.response,
            intent: response.data.data.intent,
            createdAt: new Date().toISOString(),
          };

          setMessages(prev => [...prev, assistantMessage]);
        } else {
          throw new Error('Failed to get response');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to send message';
        setError(errorMessage);

      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Session expired. Please log in again.');
      }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearHistory = useCallback(async () => {
    try {
      await api.delete('/chatbot/history');
      setMessages([]);
      setError(null);
      conversationId.current = new Date().getTime().toString();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to clear history';
      setError(errorMessage);
    }
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    loadHistory,
    clearHistory,
    isInitialized,
  };
};
