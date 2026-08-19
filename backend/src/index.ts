import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.routes';
import productRoutes from './routes/products.routes';
import blogRoutes from './routes/blog.routes';
import orderRoutes from './routes/orders.routes';
import wishlistRoutes from './routes/wishlist.routes';
import addressRoutes from './routes/addresses.routes';
import classifiedRoutes from './routes/classifieds.routes';
import contactRoutes from './routes/contact.routes';
import catalogueRoutes from './routes/catalogues.routes';
import adminRoutes from './routes/admin.routes';
import contentRoutes from './routes/content.routes';
import pagesRoutes from './routes/pages.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT || 3001;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
const cataloguesDir = path.join(uploadsDir, 'catalogues');
const imagesDir = path.join(uploadsDir, 'images');
[uploadsDir, cataloguesDir, imagesDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        // Allow any vercel.app subdomain
        if (origin.endsWith('.vercel.app')) return callback(null, true);
        // Allow explicitly listed origins
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
}));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files (uploaded images/PDFs)
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/classifieds', classifiedRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/catalogues', catalogueRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/pages', pagesRoutes);

// Error handler must be last
app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`CampusMart Backend running on port ${PORT}`);
  });
}

export default app;
