import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';


export interface AuthRequest extends Request {
    user?: { id: number; email: string; role: string };
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string; role: string };
        // Always fetch fresh user data from database to ensure current role and status
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) { 
            res.status(401).json({ error: 'User not found' }); 
            return; 
        }
        // Use database role, not JWT role, for accurate permission checks
        req.user = { id: user.id, email: user.email, role: user.role || 'user' };
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    // Strict admin check - role must be exactly 'admin'
    if (req.user.role !== 'admin') {
        console.warn(`Admin access denied for user ${req.user.id} with role: ${req.user.role}`);
        res.status(403).json({ error: 'Admin access required' });
        return;
    }
    next();
};

export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return next();
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string; role: string };
        req.user = decoded;
    } catch { /* ignore */ }
    next();
};
