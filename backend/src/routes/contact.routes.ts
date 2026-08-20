import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { syncToSpreadsheet } from '../services/spreadsheet.service';
import { isValidEmail, isValidPhone, isValidPincode } from '../lib/validation';

const router = Router();


// POST /api/contact
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, email, phone, institution, subject, message } = req.body;
        if (!name || !email || !phone || !message) {
            res.status(400).json({ error: 'Name, email, phone, and message are required' });
            return;
        }
        if (!isValidEmail(email)) {
            res.status(400).json({ error: 'Please enter a valid email address' });
            return;
        }
        if (!isValidPhone(phone)) {
            res.status(400).json({ error: 'Please enter a valid 10-digit Indian phone number' });
            return;
        }
        const storedMessage = institution
            ? `Institution: ${institution}\n\n${message}`
            : message;
        const enquiry = await prisma.contactEnquiry.create({ data: { name, email, phone, subject, message: storedMessage } });
        await syncToSpreadsheet({ type: 'Contact Enquiry', id: enquiry.id, name, email, phone, institution, subject, message, createdAt: enquiry.createdAt });
        res.status(201).json({ message: 'Enquiry submitted successfully', id: enquiry.id });
    } catch {
        res.status(500).json({ error: 'Failed to submit enquiry' });
    }
});

// POST /api/contact/quote
router.post('/quote', async (req: Request, res: Response) => {
    try {
        const { name, email, phone, institution, pincode, items, message } = req.body;
        if (!name || !email || !phone || !pincode || !message) {
            res.status(400).json({ error: 'Name, email, phone, pincode, and message are required' });
            return;
        }
        if (!isValidEmail(email)) {
            res.status(400).json({ error: 'Please enter a valid email address' });
            return;
        }
        if (!isValidPhone(phone)) {
            res.status(400).json({ error: 'Please enter a valid 10-digit Indian phone number' });
            return;
        }
        if (!isValidPincode(pincode)) {
            res.status(400).json({ error: 'Please enter a valid 6-digit pincode' });
            return;
        }
        const quote = await prisma.quoteRequest.create({ data: { name, email, phone, institution, items, message } });
        await syncToSpreadsheet({ type: 'Quote Request', id: quote.id, name, email, phone, institution, items, message, createdAt: quote.createdAt });
        res.status(201).json({ message: 'Quote request submitted successfully', id: quote.id });
    } catch {
        res.status(500).json({ error: 'Failed to submit quote request' });
    }
});

export default router;
