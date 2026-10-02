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

// --- AUTH ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body;
  const user = await prisma.user.findFirst({ where: { email, role } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ user, token });
});

// --- SHIPMENTS ---
app.get('/api/shipments', async (req, res) => {
  const { branchId, partnerId, customerId } = req.query;
  const where: any = {};
  if (branchId) where.branchId = branchId;
  if (partnerId) where.assignedPartnerId = partnerId;
  if (customerId) where.senderId = customerId;
  
  const shipments = await prisma.shipment.findMany({ 
    where, 
    include: { assignedPartner: true, timeline: true, branch: true, sender: true } 
  });
  // Map Prisma model to match frontend types where necessary
  res.json(shipments.map(s => ({
    ...s,
    assignedPartnerName: s.assignedPartner?.name,
    branchName: s.branch?.name,
    senderName: s.sender?.name,
    senderPhone: s.sender?.phone,
    senderAddress: '123 Sender Default Address' // since user doesn't have address
  })));
});

app.post('/api/shipments', async (req, res) => {
  const data = req.body;
  const trackingId = `V${Math.floor(100000 + Math.random() * 900000)}AR`;
  
  const shipment = await prisma.shipment.create({
    data: {
      trackingId,
      packageName: data.packageName,
      senderId: data.senderId || 'user-1', // Fallback for testing if missing
      receiverName: data.receiverName,
      receiverAddress: data.receiverAddress,
      receiverPhone: data.receiverPhone,
      status: 'BOOKED',
      expectedDeliveryDate: new Date(Date.now() + 86400000 * 3), // 3 days
      estimatedRevenue: data.estimatedRevenue || 10,
      timeline: {
        create: [{ status: 'BOOKED' }]
      }
    }
  });
  res.json(shipment);
});

app.get('/api/shipments/tracking/:trackingId', async (req, res) => {
  const shipment = await prisma.shipment.findUnique({
    where: { trackingId: req.params.trackingId },
    include: { timeline: true, assignedPartner: true, branch: true, sender: true }
  });
  if (!shipment) return res.status(404).json({ message: 'Not found' });
  res.json({ 
    ...shipment, 
    assignedPartnerName: shipment.assignedPartner?.name,
    branchName: shipment.branch?.name,
    senderName: shipment.sender?.name,
    senderPhone: shipment.sender?.phone,
    senderAddress: '123 Sender Default Address'
  });
});

app.put('/api/shipments/:id/status', async (req, res) => {
  const { status, note } = req.body;
  const shipment = await prisma.shipment.update({
    where: { id: req.params.id },
    data: {
      status,
      timeline: { create: [{ status, location: note }] }
    }
  });
  res.json(shipment);
});

app.put('/api/shipments/:id/assign', async (req, res) => {
  const { partnerId } = req.body;
  const shipment = await prisma.shipment.update({
    where: { id: req.params.id },
    data: { assignedPartnerId: partnerId },
    include: { assignedPartner: true }
  });
  res.json({ ...shipment, assignedPartnerName: shipment.assignedPartner?.name });
});

// --- DELIVERY OTP ---
app.post('/api/delivery/otp/generate', async (req, res) => {
  const { shipmentId } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await prisma.shipment.update({
    where: { id: shipmentId },
    data: { deliveryOtp: otp, otpAttempts: 0 }
  });
  // Normally you would send a real SMS or socket event here
  res.json({ otp });
});

app.post('/api/delivery/otp/verify', async (req, res) => {
  const { shipmentId, otp } = req.body;
  const shipment = await prisma.shipment.findUnique({ where: { id: shipmentId } });
  if (shipment?.deliveryOtp === otp) {
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

// --- USERS & OTHERS ---
app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get('/api/branches', async (req, res) => {
  const branches = await prisma.branch.findMany();
  res.json(branches);
});

app.get('/api/notifications', async (req, res) => {
  const { userId } = req.query;
  const notifications = await prisma.notification.findMany({ where: { userId: String(userId) }, orderBy: { createdAt: 'desc' } });
  res.json(notifications);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
