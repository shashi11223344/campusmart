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
        console.log(`Admin ${_req.user?.id} fetched ${pages.length} pages`);
        res.json(pages);
    } catch (error) {
        console.error('Failed to fetch pages:', error);
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
        // Validate required fields
        if (!req.body.title || !req.body.slug) {
            res.status(400).json({ error: 'Title and slug are required' });
            return;
        }

        const page = await prisma.page.create({
            data: {
                ...req.body,
                published: req.body.published !== undefined ? req.body.published : true
            }
        });
        console.log(`Page created by admin ${req.user?.id}: ${page.slug}`);
        res.status(201).json(page);
    } catch (error) {
        console.error('Failed to create page:', error);
        res.status(500).json({ error: 'Failed to create page' });
    }
});

// PUT /api/pages/:id - update a page
router.put('/:id', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        
        // Validate ID
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid page ID' });
            return;
        }

        // Check page exists before attempting update
        const existing = await prisma.page.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: 'Page not found' });
            return;
        }

        // Update page
        const page = await prisma.page.update({
            where: { id },
            data: {
                ...req.body,
                updatedAt: new Date() // Ensure updatedAt is set
            }
        });
        
        console.log(`Page ${id} updated by admin ${req.user?.id}`);
        res.json(page);
    } catch (error) {
        console.error(`Failed to update page ${req.params.id}:`, error);
        res.status(500).json({ error: 'Failed to update page' });
    }
});

// DELETE /api/pages/:id - delete a page
router.delete('/:id', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        
        // Validate ID
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid page ID' });
            return;
        }

        // Check page exists before attempting delete
        const existing = await prisma.page.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: 'Page not found' });
            return;
        }

        await prisma.page.delete({
            where: { id }
        });
        console.log(`Page ${id} deleted by admin ${req.user?.id}`);
        res.status(204).end();
    } catch (error) {
        console.error(`Failed to delete page ${req.params.id}:`, error);
        res.status(500).json({ error: 'Failed to delete page' });
    }
});

export default router;
