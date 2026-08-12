import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { verifyToken, requireAdmin, AuthRequest } from '../middleware/auth.middleware';

const router = Router();


// GET /api/content - get all site content
router.get('/', async (_req: Request, res: Response) => {
    try {
        const content = await prisma.siteContent.findMany();
        const contentMap = Object.fromEntries(content.map((c) => [c.key, c.value]));
        res.json(contentMap);
    } catch (err) {
        console.error('Database connection error on GET /api/content:', err);
        // Fallback to empty content object so frontend context handles defaults cleanly
        res.json({});
    }
});

// PUT /api/content - update site content (admin)
router.put('/', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const updates: Record<string, string> = req.body;
        const promises = Object.entries(updates).map(([key, value]) =>
            prisma.siteContent.upsert({
                where: { key },
                update: { value },
                create: { key, value },
            })
        );
        await Promise.all(promises);
        res.json({ message: 'Content updated successfully' });
    } catch {
        res.status(500).json({ error: 'Failed to update content' });
    }
});

// PUT /api/content/:key - update single key (admin)
router.put('/:key', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const content = await prisma.siteContent.upsert({
            where: { key: String(req.params.key) },
            update: { value: req.body.value },
            create: { key: String(req.params.key), value: req.body.value },
        });
        res.json(content);
    } catch {
        res.status(500).json({ error: 'Failed to update content' });
    }
});

export default router;
