import {
  User,
  Branch,
  Shipment,
  Notification,
  AuditLog,
  DashboardStats,
  ChartDataPoint,
  ShipmentStatus
} from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Daniel Cooper',
    email: 'customer@demo.com',
    phone: '+1-303-555-0101',
    role: 'CUSTOMER',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-2',
    name: 'Sarah Chen',
    email: 'admin@demo.com',
    phone: '+1-555-0102',
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-3',
    name: 'Mike Johnson',
    email: 'staff@demo.com',
    phone: '+1-555-0103',
    role: 'BRANCH_STAFF',
    branchId: 'branch-1',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-4',
    name: 'Jimmy Jordan',
    email: 'driver@demo.com',
    phone: '+1-555-0104',
    role: 'DELIVERY_PARTNER',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-5',
    name: 'Emily Davis',
    email: 'emily.customer@demo.com',
    phone: '+1-555-0105',
    role: 'CUSTOMER',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-6',
    name: 'Robert Wilson',
    email: 'driver2@demo.com',
    phone: '+1-555-0106',
    role: 'DELIVERY_PARTNER',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-7',
    name: 'Anna Taylor',
    email: 'staff2@demo.com',
    phone: '+1-555-0107',
    role: 'BRANCH_STAFF',
    branchId: 'branch-2',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-8',
    name: 'James Anderson',
    email: 'driver3@demo.com',
    phone: '+1-555-0108',
    role: 'DELIVERY_PARTNER',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const mockBranches: Branch[] = [
  {
    id: 'branch-1',
    name: 'Downtown Hub',
    code: 'DTH',
    address: '123 Main St',
    city: 'Denver',
    state: 'CO',
    lat: 39.7392,
    lng: -104.9903,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'branch-2',
    name: 'Lakewood Center',
    code: 'LKW',
    address: '456 Colfax Ave',
    city: 'Lakewood',
    state: 'CO',
    lat: 39.7047,
    lng: -105.0814,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'branch-3',
    name: 'Aurora Station',
    code: 'AUR',
    address: '789 Havana St',
    city: 'Aurora',
    state: 'CO',
    lat: 39.7294,
    lng: -104.8319,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const generateTimeline = (statuses: ShipmentStatus[], startDate: Date) => {
  return statuses.map((status, index) => {
    const d = new Date(startDate);
    d.setHours(d.getHours() + index * 12);
    return {
      status,
      timestamp: d.toISOString(),
      location: 'Hub Location ' + (index + 1),
      note: 'Status updated to ' + status,
    };
  });
};

export const mockShipments: Shipment[] = [
  {
    id: 'ship-1',
    trackingId: 'V789456AR123',
    packageName: 'Apple 2022 MacBook Pro',
    senderId: 'user-1',
    senderName: 'Daniel Cooper',
    senderAddress: '100 Sender St, Denver',
    senderPhone: '+1-303-555-0101',
    receiverId: 'rec-1',
    receiverName: 'Alice Smith',
    receiverAddress: '200 Receiver Rd, Denver',
    receiverPhone: '+1-555-0201',
    status: 'OUT_FOR_DELIVERY',
    timeline: generateTimeline(['BOOKED', 'PICKED_UP', 'IN_TRANSIT', 'AT_BRANCH', 'OUT_FOR_DELIVERY'], new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    branchId: 'branch-1',
    branchName: 'Downtown Hub',
    assignedPartnerId: 'user-4',
    assignedPartnerName: 'Jimmy Jordan',
    bookingDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expectedDeliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryOtp: '482916',
    estimatedRevenue: 150,
    currentLat: 39.74,
    currentLng: -104.99,
  },
  {
    id: 'ship-2',
    trackingId: 'V789456AR124',
    packageName: 'iPhone 14 Pro Max (purple)',
    senderId: 'user-5',
    senderName: 'Emily Davis',
    senderAddress: '300 Sender St, Lakewood',
    senderPhone: '+1-555-0105',
    receiverId: 'rec-2',
    receiverName: 'Bob Jones',
    receiverAddress: '400 Receiver Rd, Lakewood',
    receiverPhone: '+1-555-0202',
    status: 'DELIVERED',
    timeline: generateTimeline(['BOOKED', 'PICKED_UP', 'IN_TRANSIT', 'AT_BRANCH', 'OUT_FOR_DELIVERY', 'DELIVERED'], new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
    branchId: 'branch-2',
    branchName: 'Lakewood Center',
    assignedPartnerId: 'user-6',
    assignedPartnerName: 'Robert Wilson',
    bookingDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expectedDeliveryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    deliveredDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedRevenue: 85,
  },
  {
    id: 'ship-3',
    trackingId: 'V789456AR125',
    packageName: 'Premium Box Packing',
    senderId: 'user-1',
    senderName: 'Daniel Cooper',
    senderAddress: '100 Sender St, Denver',
    senderPhone: '+1-303-555-0101',
    receiverId: 'rec-3',
    receiverName: 'Charlie Brown',
    receiverAddress: '500 Receiver Rd, Aurora',
    receiverPhone: '+1-555-0203',
    status: 'IN_TRANSIT',
    timeline: generateTimeline(['BOOKED', 'PICKED_UP', 'IN_TRANSIT'], new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
    branchId: 'branch-3',
    branchName: 'Aurora Station',
    assignedPartnerId: 'user-8',
    assignedPartnerName: 'James Anderson',
    bookingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expectedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedRevenue: 45,
    currentLat: 39.73,
    currentLng: -104.85,
  },
  {
    id: 'ship-4',
    trackingId: 'V789456AR126',
    packageName: 'Samsung Galaxy S24',
    senderId: 'user-5',
    senderName: 'Emily Davis',
    senderAddress: '300 Sender St, Lakewood',
    senderPhone: '+1-555-0105',
    receiverId: 'rec-4',
    receiverName: 'Diana Prince',
    receiverAddress: '600 Receiver Rd, Denver',
    receiverPhone: '+1-555-0204',
    status: 'BOOKED',
    timeline: generateTimeline(['BOOKED'], new Date()),
    branchId: 'branch-1',
    branchName: 'Downtown Hub',
    bookingDate: new Date().toISOString(),
    expectedDeliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedRevenue: 120,
  },
  {
    id: 'ship-5',
    trackingId: 'V789456AR127',
    packageName: 'Sony WH-1000XM5',
    senderId: 'user-1',
    senderName: 'Daniel Cooper',
    senderAddress: '100 Sender St, Denver',
    senderPhone: '+1-303-555-0101',
    receiverId: 'rec-5',
    receiverName: 'Eve Adams',
    receiverAddress: '700 Receiver Rd, Lakewood',
    receiverPhone: '+1-555-0205',
    status: 'FAILED_ATTEMPT',
    timeline: generateTimeline(['BOOKED', 'PICKED_UP', 'IN_TRANSIT', 'AT_BRANCH', 'OUT_FOR_DELIVERY', 'FAILED_ATTEMPT'], new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)),
    branchId: 'branch-2',
    branchName: 'Lakewood Center',
    assignedPartnerId: 'user-6',
    assignedPartnerName: 'Robert Wilson',
    bookingDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expectedDeliveryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedRevenue: 95,
  },
  // Add 10 more shipments with similar structure
  ...Array.from({ length: 10 }).map((_, i) => {
    const id = `ship-\${i + 6}`;
    const isDelivered = i % 3 === 0;
    const isOut = i % 4 === 0;
    const partnerId = i % 2 === 0 ? 'user-4' : 'user-8';
    const partnerName = i % 2 === 0 ? 'Jimmy Jordan' : 'James Anderson';
    const bId = (i % 3) + 1;
    
    return {
      id,
      trackingId: `V789456AR\${128 + i}`,
      packageName: `Generic Package \${i + 1}`,
      senderId: 'user-1',
      senderName: 'Daniel Cooper',
      senderAddress: '100 Sender St, Denver',
      senderPhone: '+1-303-555-0101',
      receiverId: `rec-\${i + 6}`,
      receiverName: `Receiver \${i + 6}`,
      receiverAddress: `\${800 + i * 10} Receiver Rd, CO`,
      receiverPhone: `+1-555-02\${10 + i}`,
      status: (isDelivered ? 'DELIVERED' : (isOut ? 'OUT_FOR_DELIVERY' : 'IN_TRANSIT')) as ShipmentStatus,
      timeline: generateTimeline(['BOOKED', 'PICKED_UP', 'IN_TRANSIT'], new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
      branchId: `branch-\${bId}`,
      branchName: `Branch \${bId}`,
      assignedPartnerId: partnerId,
      assignedPartnerName: partnerName,
      bookingDate: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
      expectedDeliveryDate: new Date(Date.now() + (2 - (i % 3)) * 24 * 60 * 60 * 1000).toISOString(),
      deliveredDate: isDelivered ? new Date().toISOString() : undefined,
      deliveryOtp: isOut ? '123456' : undefined,
      estimatedRevenue: 15 + i * 10,
      currentLat: isOut ? 39.7392 + (i * 0.001) : undefined,
      currentLng: isOut ? -104.9903 + (i * 0.001) : undefined,
    };
  })
];

export const mockNotifications: Notification[] = [
  { id: 'notif-1', userId: 'user-1', type: 'STATUS_UPDATE', title: 'Package Delivered', message: 'Your package V789456AR124 has been delivered.', shipmentId: 'ship-2', trackingId: 'V789456AR124', isRead: false, createdAt: new Date().toISOString() },
  { id: 'notif-2', userId: 'user-1', type: 'OTP', title: 'Delivery OTP', message: 'Your OTP for V789456AR123 is 482916.', shipmentId: 'ship-1', trackingId: 'V789456AR123', isRead: false, createdAt: new Date().toISOString() },
  { id: 'notif-3', userId: 'user-4', type: 'ASSIGNMENT', title: 'New Delivery Assigned', message: 'You have been assigned to deliver V789456AR123.', shipmentId: 'ship-1', trackingId: 'V789456AR123', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'notif-4', userId: 'user-1', type: 'DELIVERY_ATTEMPT', title: 'Delivery Failed', message: 'We attempted to deliver V789456AR127 but you were unavailable.', shipmentId: 'ship-5', trackingId: 'V789456AR127', isRead: true, createdAt: new Date(Date.now() - 100000).toISOString() },
  ...Array.from({ length: 6 }).map((_, i) => ({
    id: `notif-\${i + 5}`,
    userId: 'user-1',
    type: 'SYSTEM' as const,
    title: 'System Alert',
    message: `Maintenance scheduled for \${new Date().toLocaleDateString()}`,
    isRead: i % 2 === 0,
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
  }))
];

export const mockAuditLogs: AuditLog[] = [
  { id: 'audit-1', userId: 'user-2', userName: 'Sarah Chen', action: 'STATUS_UPDATE', resource: 'SHIPMENT', resourceId: 'ship-1', details: 'Status changed to OUT_FOR_DELIVERY', timestamp: new Date().toISOString() },
  { id: 'audit-2', userId: 'user-3', userName: 'Mike Johnson', action: 'ASSIGNMENT', resource: 'SHIPMENT', resourceId: 'ship-1', details: 'Assigned to Jimmy Jordan', timestamp: new Date().toISOString() },
  { id: 'audit-3', userId: 'user-2', userName: 'Sarah Chen', action: 'USER_CREATED', resource: 'USER', resourceId: 'user-5', details: 'Created customer Emily Davis', timestamp: new Date().toISOString() },
  { id: 'audit-4', userId: 'user-2', userName: 'Sarah Chen', action: 'BRANCH_UPDATED', resource: 'BRANCH', resourceId: 'branch-1', details: 'Updated Downtown Hub details', timestamp: new Date().toISOString() },
  ...Array.from({ length: 4 }).map((_, i) => ({
    id: `audit-\${i + 5}`,
    userId: 'user-2',
    userName: 'Sarah Chen',
    action: 'STATUS_UPDATE',
    resource: 'SHIPMENT',
    resourceId: `ship-\${i + 6}`,
    details: 'Status automatically updated',
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
  }))
];

// Helper Functions
export const getShipmentsForCustomer = (userId: string): Shipment[] => mockShipments.filter(s => s.senderId === userId || s.receiverId === userId);
export const getShipmentsForBranch = (branchId: string): Shipment[] => mockShipments.filter(s => s.branchId === branchId);
export const getShipmentsForPartner = (partnerId: string): Shipment[] => mockShipments.filter(s => s.assignedPartnerId === partnerId);
export const getNotificationsForUser = (userId: string): Notification[] => mockNotifications.filter(n => n.userId === userId);

export const getDashboardStats = (shipments: Shipment[]): DashboardStats => {
  return {
    totalShipments: shipments.length,
    delivered: shipments.filter(s => s.status === 'DELIVERED').length,
    pending: shipments.filter(s => ['BOOKED', 'PICKED_UP', 'AT_BRANCH'].includes(s.status)).length,
    inTransit: shipments.filter(s => s.status === 'IN_TRANSIT').length,
    outForDelivery: shipments.filter(s => s.status === 'OUT_FOR_DELIVERY').length,
    failedAttempts: shipments.filter(s => s.status === 'FAILED_ATTEMPT').length,
    activePartners: new Set(shipments.map(s => s.assignedPartnerId).filter(Boolean)).size,
    totalRevenue: shipments.reduce((acc, s) => acc + (s.estimatedRevenue || 0), 0),
  };
};

export const getChartData = (shipments: Shipment[]): { daily: ChartDataPoint[], statusBreakdown: ChartDataPoint[] } => {
  const daily: ChartDataPoint[] = [];
  const statusCounts: Record<string, number> = {};
  
  shipments.forEach(s => {
    statusCounts[s.status] = (statusCounts[s.status] || 0) + 1;
  });

  const statusBreakdown = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Mocking last 7 days daily data
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    daily.push({
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      value: Math.floor(Math.random() * 50) + 10,
      delivered: Math.floor(Math.random() * 20),
      pending: Math.floor(Math.random() * 30),
      failed: Math.floor(Math.random() * 5),
    });
  }

  return { daily, statusBreakdown };
};
