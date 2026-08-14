import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { verifyToken, requireAdmin, AuthRequest } from '../middleware/auth.middleware';

const router = Router();


// GET /api/orders (my orders)
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user!.id },
            include: { orderitem: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    } catch {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// POST /api/orders
router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { items, notes } = req.body; // items: [{productId, qty}]
        if (!items?.length) { res.status(400).json({ error: 'No items provided' }); return; }
        const products = await prisma.product.findMany({ where: { id: { in: items.map((i: { productId: number }) => i.productId) } } });
        let total = 0;
        const orderItems = items.map((item: { productId: number; qty: number }) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) throw new Error(`Product ${item.productId} not found`);
            const unitPrice = product.price;
            total += unitPrice * item.qty;
            return { productId: item.productId, qty: item.qty, unitPrice };
        });
        const order = await prisma.order.create({
            data: { userId: req.user!.id, total, notes, orderitem: { create: orderItems } },
            include: { orderitem: { include: { product: true } } },
        });
        res.status(201).json(order);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to create order';
        res.status(500).json({ error: msg });
    }
});

// GET /api/orders/all (admin)
router.get('/all', verifyToken, requireAdmin, async (_req: AuthRequest, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: { user: { select: { name: true, email: true } }, orderitem: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    } catch {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// PUT /api/orders/:id/status (admin)
router.put('/:id/status', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.body;
        const order = await prisma.order.update({ where: { id: Number(req.params.id) }, data: { status } });
        res.json(order);
    } catch {
        res.status(500).json({ error: 'Failed to update order' });
    }
});

export default router;
