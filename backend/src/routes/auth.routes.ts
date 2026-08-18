import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { sendOtpEmail, generateOtp } from '../lib/email';
import { verifyToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const generateTokens = (user: { id: number; email: string; role: string }) => {
    const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
    );
    return { accessToken };
};

// ─── POST /api/auth/send-otp ──────────────────────────────────────────────────
// Generates a 6-digit OTP and sends it to the given email address.
// purpose: "verify" (for registration) | "login" (for sign in)
router.post('/send-otp', async (req: Request, res: Response) => {
    try {
        const { email, purpose = 'verify' } = req.body;
        if (!email) { res.status(400).json({ error: 'Email is required' }); return; }

        const normalizedEmail = normalizeEmail(email);

        // Invalidate old unused OTPs for this email+purpose
        await prisma.otpCode.updateMany({
            where: { email: normalizedEmail, purpose, used: false },
            data: { used: true },
        });

        const code = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.otpCode.create({ data: { email: normalizedEmail, code, purpose, expiresAt } });
        await sendOtpEmail(normalizedEmail, code, purpose as 'verify' | 'login');

        res.json({ message: 'OTP sent successfully' });
    } catch (err) {
        console.error('send-otp error:', err);
        res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
    }
});

// ─── POST /api/auth/verify-otp ────────────────────────────────────────────────
// Verifies a 6-digit OTP. Returns { valid: true } or error.
router.post('/verify-otp', async (req: Request, res: Response) => {
    try {
        const { email, code, purpose = 'verify' } = req.body;
        if (!email || !code) { res.status(400).json({ error: 'Email and code are required' }); return; }

        const normalizedEmail = normalizeEmail(email);

        const record = await prisma.otpCode.findFirst({
            where: { email: normalizedEmail, code, purpose, used: false },
            orderBy: { createdAt: 'desc' },
        });

        if (!record) { res.status(400).json({ error: 'Invalid OTP code' }); return; }
        if (record.expiresAt < new Date()) { res.status(400).json({ error: 'OTP has expired. Please request a new one.' }); return; }

        // Mark as used
        await prisma.otpCode.update({ where: { id: record.id }, data: { used: true } });

        // If verifying email for a new registration, mark user as verified
        if (purpose === 'verify') {
            await prisma.user.updateMany({
                where: { email },
                data: { emailVerified: true },
            });
        }

        res.json({ valid: true });
    } catch (err) {
        console.error('verify-otp error:', err);
        res.status(500).json({ error: 'OTP verification failed' });
    }
});

// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, institution } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ error: 'Name, email, and password are required' });
            return;
        }

        const normalizedEmail = normalizeEmail(email);
        const exists = await prisma.user.findFirst({
            where: { email: { equals: normalizedEmail, mode: 'insensitive' } }
        });
        if (exists) { res.status(409).json({ error: 'Email already registered' }); return; }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email: normalizedEmail, passwordHash, phone, institution, emailVerified: false },
        });
        const tokens = generateTokens(user);
        res.status(201).json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, institution: user.institution, emailVerified: user.emailVerified },
            ...tokens,
        });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) { res.status(400).json({ error: 'Email and password required' }); return; }

        const normalizedEmail = normalizeEmail(email);
        const user = await prisma.user.findFirst({
            where: { email: { equals: normalizedEmail, mode: 'insensitive' } }
        });
        if (!user) { res.status(401).json({ error: 'Invalid credentials' }); return; }
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) { res.status(401).json({ error: 'Invalid credentials' }); return; }
        const tokens = generateTokens(user);
        res.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, institution: user.institution, emailVerified: user.emailVerified },
            ...tokens,
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) { res.status(401).json({ error: 'Not authenticated' }); return; }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) { res.status(404).json({ error: 'User not found' }); return; }
        res.json({ id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, institution: user.institution, emailVerified: user.emailVerified });
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// ─── PUT /api/auth/profile ────────────────────────────────────────────────────
router.put('/profile', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { name, phone, institution } = req.body;
        const user = await prisma.user.update({
            where: { id: req.user!.id },
            data: { name, phone, institution },
        });
        res.json({ id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, institution: user.institution });
    } catch {
        res.status(500).json({ error: 'Profile update failed' });
    }
});

export default router;
