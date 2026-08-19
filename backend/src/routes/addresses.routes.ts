import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { verifyToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();


router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        await prisma.address.updateMany({ where: { userId: req.user!.id }, data: { isDefault: false } });
        const addresses = await prisma.address.findMany({ where: { userId: req.user!.id }, orderBy: { id: 'desc' } });
        res.json(addresses);
    } catch {
        res.status(500).json({ error: 'Failed to fetch addresses' });
    }
});

router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { type, line1, line2, city, state, pincode, isDefault } = req.body;
        const address = await prisma.address.create({
            data: { userId: req.user!.id, type, line1, line2, city, state, pincode, isDefault: false },
        });
        res.status(201).json(address);
    } catch {
        res.status(500).json({ error: 'Failed to add address' });
    }
});

router.put('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { type, line1, line2, city, state, pincode, isDefault } = req.body;
        const existing = await prisma.address.findFirst({ where: { id: Number(req.params.id), userId: req.user!.id } });
        if (!existing) { res.status(404).json({ error: 'Address not found' }); return; }
        const address = await prisma.address.update({
            where: { id: existing.id },
            data: { type, line1, line2, city, state, pincode, isDefault: false },
        });
        res.json(address);
    } catch {
        res.status(500).json({ error: 'Failed to update address' });
    }
});

router.delete('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const existing = await prisma.address.findFirst({ where: { id: Number(req.params.id), userId: req.user!.id } });
        if (!existing) { res.status(404).json({ error: 'Address not found' }); return; }
        await prisma.address.delete({ where: { id: existing.id } });
        res.json({ message: 'Address deleted' });
    } catch {
        res.status(500).json({ error: 'Failed to delete address' });
    }
});

export default router;
