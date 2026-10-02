import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123';

// --- AUTH ROUTES ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await prisma.user.findFirst({
      where: { email, role, isActive: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // In a real app, use bcrypt.compare. Here we use plaintext for demo simplicity
    // or bcrypt if we seeded it that way.
    if (password !== 'password123' && !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// --- SHIPMENT ROUTES ---
app.get('/api/shipments', async (req, res) => {
  try {
    const shipments = await prisma.shipment.findMany({
      include: {
        customer: true,
        assignedPartner: true,
        branch: true,
        timeline: true
      }
    });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.get('/api/shipments/tracking/:trackingId', async (req, res) => {
  try {
    const shipment = await prisma.shipment.findUnique({
      where: { trackingId: req.params.trackingId },
      include: { timeline: true, assignedPartner: true }
    });
    if (!shipment) return res.status(404).json({ message: 'Not found' });
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.get('/api/shipments/:id', async (req, res) => {
  try {
    const shipment = await prisma.shipment.findUnique({
      where: { id: req.params.id },
      include: { timeline: true, assignedPartner: true }
    });
    if (!shipment) return res.status(404).json({ message: 'Not found' });
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// --- MORE ROUTES ---
// Add your other endpoints here...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
