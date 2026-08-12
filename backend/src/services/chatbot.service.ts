import OpenAI from 'openai';
import prisma from '../lib/prisma';

interface ChatbotRequest {
  userId: number;
  message: string;
}

interface ChatbotResponse {
  id: number;
  response: string;
  intent: string;
  metadata?: Record<string, any>;
}

export class ChatbotService {
  private groq: OpenAI;
  private systemPrompt: string;

  constructor() {
    // Initialize Groq API client
    // Groq uses OpenAI-compatible API, so we use OpenAI SDK with Groq's base URL
    this.groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY || '',
      baseURL: 'https://api.groq.com/openai/v1',
    });

    this.systemPrompt = `You are CampusMart Assistant, a helpful AI chatbot for a campus marketplace and services platform. 

Your responsibilities:
1. Answer questions about products and services
2. Help users track their orders
3. Provide information about campus facilities (libraries, labs, innovation centers, sports facilities)
4. Guide students through admission/enrollment processes
5. Resolve common issues and complaints
6. Provide information about courses and learning materials
7. Help with account and profile management
8. Provide booking and reservation assistance

Guidelines:
- Be friendly, professional, and helpful
- Keep responses concise (under 200 words)
- If you don't know something, say so and suggest contacting support
- For sensitive information (passwords, personal data), always advise using secure channels
- Provide relevant suggestions for next steps
- Use user's name when appropriate to personalize responses
- If a user asks about orders, encourage them to track via the dashboard
- For facility bookings or admissions, provide clear steps

Always respond in a structured manner with:
- Direct answer to the question
- Relevant details or options
- Next steps or follow-up actions`;
  }

  /**
   * Detect user intent from the message
   */
  private async detectIntent(message: string): Promise<string> {
    const keywords: Record<string, string[]> = {
      product_info: ['product', 'price', 'specs', 'specifications', 'features', 'buy', 'cost'],
      order_tracking: ['order', 'track', 'delivery', 'shipping', 'status', 'when', 'arrives'],
      facility_info: ['lab', 'library', 'facility', 'center', 'sports', 'innovation', 'location', 'hours'],
      admission_guidance: ['admission', 'enroll', 'register', 'apply', 'admission', 'course', 'program'],
      account_management: ['account', 'profile', 'password', 'email', 'address', 'settings'],
      general: [],
    };

    const lowerMessage = message.toLowerCase();

    for (const [intent, keywordList] of Object.entries(keywords)) {
      if (keywordList.some(keyword => lowerMessage.includes(keyword))) {
        return intent;
      }
    }

    return 'general';
  }

  /**
   * Get conversation history for context
   */
  private async getConversationHistory(userId: number, limit: number = 10) {
    const messages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });

    return messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));
  }

  /**
   * Enhance prompt with user context
   */
  private async getUserContext(userId: number): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
    });

    if (!user) return '';

    let context = `\nUser Context:\n`;
    context += `- Name: ${user.name}\n`;
    context += `- Institution: ${user.institution || 'Not specified'}\n`;
    context += `- Recent Orders: ${user.orders.length > 0 ? user.orders.length + ' orders' : 'None'}\n`;

    if (user.orders.length > 0) {
      context += `- Last Order Status: ${user.orders[0].status}\n`;
    }

    return context;
  }

  /**
   * Main chat method
   */
  async chat(request: ChatbotRequest): Promise<ChatbotResponse> {
    const { userId, message } = request;

    // Validate user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Detect intent
    const intent = await this.detectIntent(message);

    // Save user message
    await prisma.chatMessage.create({
      data: {
        userId,
        role: 'user',
        content: message,
        intent,
      },
    });

    try {
      // Get conversation history
      const history = await this.getConversationHistory(userId, 6);

      // Get user context
      const userContext = await this.getUserContext(userId);

      // Prepare messages for OpenAI
      const messages = [
        {
          role: 'system' as const,
          content: this.systemPrompt + userContext,
        },
        ...history,
        {
          role: 'user' as const,
          content: message,
        },
      ];

      // Call Groq API
      const response = await this.groq.chat.completions.create({
        model: process.env.GROQ_MODEL || 'mixtral-8x7b-32768',
        messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
      });

      const assistantMessage =
        response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";

      // Save assistant response
      const savedMessage = await prisma.chatMessage.create({
        data: {
          userId,
          role: 'assistant',
          content: assistantMessage,
          intent,
        },
      });

      return {
        id: savedMessage.id,
        response: assistantMessage,
        intent,
        metadata: {
          tokens_used: response.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      // Save error message for logging
      console.error('Chatbot error:', error);

      // Return fallback response
      const fallbackMessage =
        "I'm experiencing technical difficulties. Please try again or contact our support team.";

      await prisma.chatMessage.create({
        data: {
          userId,
          role: 'assistant',
          content: fallbackMessage,
          intent,
        },
      });

      throw error;
    }
  }

  /**
   * Get chat history for a user
   */
  async getChatHistory(userId: number, limit: number = 50) {
    return await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Clear chat history for a user
   */
  async clearChatHistory(userId: number) {
    return await prisma.chatMessage.deleteMany({
      where: { userId },
    });
  }

  /**
   * Get analytics about chatbot usage
   */
  async getChatAnalytics(userId?: number) {
    const where = userId ? { userId } : {};

    const totalMessages = await prisma.chatMessage.count({ where });
    const intentDistribution = await prisma.chatMessage.groupBy({
      by: ['intent'],
      where,
      _count: true,
    });

    const activeUsers = await prisma.chatMessage.findMany({
      distinct: ['userId'],
      where,
      select: { userId: true },
    });

    return {
      totalMessages,
      intentDistribution,
      uniqueUsers: activeUsers.length,
    };
  }
}

export const chatbotService = new ChatbotService();
