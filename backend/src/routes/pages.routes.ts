import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { verifyToken, requireAdmin, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// GET /api/pages - get all pages (admin only to see unpublished)
router.get('/', verifyToken, requireAdmin, async (_req: AuthRequest, res: Response) => {
    try {
        const pages = await prisma.page.findMany({
            orderBy: { title: 'asc' }
        });
        res.json(pages);
    } catch {
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
});

// GET /api/pages/published - get all published pages (public)
router.get('/published', async (req: Request, res: Response) => {
    try {
        const pages = await prisma.page.findMany({
            where: { published: true }
        });
        res.json(pages);
    } catch {
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
});

// GET /api/pages/:idOrSlug - get specific page by ID (number) or slug (string)
router.get('/:idOrSlug', async (req: Request, res: Response) => {
    try {
        const param = req.params.idOrSlug as string;
        const numericId = parseInt(param);
        const isNumeric = !isNaN(numericId) && String(numericId) === param;

        const page = isNumeric
            ? await prisma.page.findUnique({ where: { id: numericId } })
            : await prisma.page.findUnique({ where: { slug: param } });

        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }
        res.json(page);
    } catch {
        res.status(500).json({ error: 'Failed to fetch page' });
    }
});

// POST /api/pages - create a page
router.post('/', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const page = await prisma.page.create({
            data: req.body
        });
        res.status(201).json(page);
    } catch {
        res.status(500).json({ error: 'Failed to create page' });
    }
});

// PUT /api/pages/:id - update a page
router.put('/:id', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const page = await prisma.page.update({
            where: { id },
            data: req.body
        });
        res.json(page);
    } catch {
        res.status(500).json({ error: 'Failed to update page' });
    }
});

// DELETE /api/pages/:id - delete a page
router.delete('/:id', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        await prisma.page.delete({
            where: { id }
        });
        res.status(204).end();
    } catch {
        res.status(500).json({ error: 'Failed to delete page' });
    }
});

export default router;
