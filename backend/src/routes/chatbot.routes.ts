import { Router, Request, Response } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth.middleware';
import { chatbotService } from '../services/chatbot.service';

const router = Router();

/**
 * POST /api/chatbot/message
 * Send a message to the chatbot and get a response
 */
router.post('/message', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { message } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required and must be non-empty' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message is too long (max 1000 characters)' });
    }

    // Get chatbot response
    const response = await chatbotService.chat({
      userId,
      message: message.trim(),
    });

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Chatbot message error:', error);
    res.status(500).json({
      error: 'Failed to process message',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/chatbot/history
 * Get chat history for the current user
 */
router.get('/history', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const history = await chatbotService.getChatHistory(userId, limit);

    res.json({
      success: true,
      data: history.reverse(), // Return in chronological order
    });
  } catch (error) {
    console.error('Chatbot history error:', error);
    res.status(500).json({
      error: 'Failed to fetch chat history',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * DELETE /api/chatbot/history
 * Clear chat history for the current user
 */
router.delete('/history', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await chatbotService.clearChatHistory(userId);

    res.json({
      success: true,
      message: 'Chat history cleared',
    });
  } catch (error) {
    console.error('Clear chat history error:', error);
    res.status(500).json({
      error: 'Failed to clear chat history',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/chatbot/analytics
 * Get chatbot usage analytics (admin only)
 */
router.get('/analytics', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const analytics = await chatbotService.getChatAnalytics();

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/chatbot/feedback
 * Save user feedback about chatbot response
 */
router.post('/feedback', verifyToken, async (req: Request, res: Response) => {
  try {
    const { messageId, helpful, feedback } = req.body;

    // Validate input
    if (typeof helpful !== 'boolean') {
      return res.status(400).json({ error: 'Feedback rating is required' });
    }

    // TODO: Save feedback to database
    // For now, just log it
    console.log('Chatbot feedback:', { messageId, helpful, feedback });

    res.json({
      success: true,
      message: 'Feedback recorded',
    });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({
      error: 'Failed to save feedback',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
