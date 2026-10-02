import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Clear existing
  await prisma.shipmentTimeline.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.branch.deleteMany();

  const password = await bcrypt.hash('password123', 10);

  // 1. Create a Branch
  const branch = await prisma.branch.create({
    data: {
      code: 'DTH',
      name: 'Downtown Hub',
      address: '123 Main St',
      city: 'Denver',
      state: 'CO',
      lat: 39.7392,
      lng: -104.9903,
      isActive: true,
    }
  });

  // 2. Create Users
  const customer = await prisma.user.create({
    data: {
      email: 'customer@demo.com',
      password,
      name: 'Daniel Cooper',
      phone: '+1-303-555-0101',
      role: 'CUSTOMER',
    }
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      password,
      name: 'Sarah Chen',
      phone: '+1-555-0102',
      role: 'ADMIN',
    }
  });

  const staff = await prisma.user.create({
    data: {
      email: 'staff@demo.com',
      password,
      name: 'Mike Johnson',
      phone: '+1-555-0103',
      role: 'BRANCH_STAFF',
      branchId: branch.id,
    }
  });

  const driver = await prisma.user.create({
    data: {
      email: 'driver@demo.com',
      password,
      name: 'Jimmy Jordan',
      phone: '+1-555-0104',
      role: 'DELIVERY_PARTNER',
      branchId: branch.id,
    }
  });

  // 3. Create a few shipments
  await prisma.shipment.create({
    data: {
      trackingId: 'V789456AR123',
      senderId: customer.id,
      branchId: branch.id,
      assignedPartnerId: driver.id,
      packageName: 'Apple MacBook Pro',
      status: 'OUT_FOR_DELIVERY',
      receiverName: customer.name,
      receiverPhone: customer.phone || '0000000000',
      receiverAddress: '123 Customer Home Ave',
      bookingDate: new Date(),
      expectedDeliveryDate: new Date(),
      estimatedRevenue: 150,
      deliveryOtp: '123456',
      timeline: {
        create: [
          { status: 'BOOKED', timestamp: new Date() },
          { status: 'AT_BRANCH', timestamp: new Date() },
          { status: 'OUT_FOR_DELIVERY', timestamp: new Date() }
        ]
      }
    }
  });

  console.log('Seeding completed!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
