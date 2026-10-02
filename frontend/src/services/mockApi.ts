import {
  User, UserRole, Shipment, Branch, Notification,
  DeliveryUpdate, AuditLog, ShipmentStatus
} from '@/types';
import {
  mockUsers, mockBranches, mockShipments, mockNotifications, mockAuditLogs,
  getShipmentsForCustomer, getShipmentsForBranch, getShipmentsForPartner,
  getNotificationsForUser, getDashboardStats, getChartData
} from '@/mocks/data';

const delay = <T>(ms = 300): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export const authApi = {
  login: async (email: string, password: string, role: UserRole) => {
    await delay(300);
    const user = mockUsers.find(u => u.email === email && u.role === role);
    if (user && password === 'password123') {
      return { user, token: `fake-jwt-token-${user.id}` };
    }
    throw new Error('Invalid credentials');
  },
  verifyToken: async (token: string) => {
    await delay(200);
    const userId = token.replace('fake-jwt-token-', '');
    const user = mockUsers.find(u => u.id === userId);
    if (user) return user;
    throw new Error('Invalid token');
  }
};

export const shipmentApi = {
  getAll: async (_filters?: Record<string, unknown>) => {
    await delay(300);
    return mockShipments;
  },
  getForCustomer: async (userId: string) => {
    await delay(300);
    return getShipmentsForCustomer(userId);
  },
  getForBranch: async (branchId: string) => {
    await delay(300);
    return getShipmentsForBranch(branchId);
  },
  getForPartner: async (partnerId: string) => {
    await delay(300);
    return getShipmentsForPartner(partnerId);
  },
  getById: async (id: string) => {
    await delay(200);
    const s = mockShipments.find(s => s.id === id);
    if (!s) throw new Error('Not found');
    return s;
  },
  getByTrackingId: async (trackingId: string) => {
    await delay(200);
    const s = mockShipments.find(s => s.trackingId === trackingId);
    if (!s) throw new Error('Not found');
    return s;
  },
  updateStatus: async (id: string, status: ShipmentStatus, note?: string) => {
    await delay(300);
    const s = mockShipments.find(s => s.id === id);
    if (!s) throw new Error('Not found');
    s.status = status;
    s.timeline.push({ status, timestamp: new Date().toISOString(), note });
    
    // Automatically generate OTP and notify when OUT_FOR_DELIVERY
    if (status === 'OUT_FOR_DELIVERY' && s.customerId) {
      // Import socketService dynamically to avoid circular dependency loops if any
      import('./socketService').then(({ socketService }) => {
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        s.deliveryOtp = generatedOtp;
        s.otpAttempts = 0;
        
        const newNotif = {
          id: `notif-${Date.now()}`,
          userId: s.customerId,
          type: 'OTP',
          title: 'Delivery OTP Generated',
          message: `Your package ${s.trackingId} is out for delivery. Your OTP is ${generatedOtp}. Do not share this with anyone except the delivery partner.`,
          isRead: false,
          createdAt: new Date().toISOString(),
          shipmentId: s.id,
          trackingId: s.trackingId,
        } as Notification;
        
        mockNotifications.unshift(newNotif);
        
        socketService.emit({
          type: 'notification',
          topic: `user.${s.customerId}.notifications`,
          payload: newNotif,
          timestamp: new Date().toISOString()
        });
      });
    }

    return s;
  },
  assignPartner: async (id: string, partnerId: string) => {
    await delay(300);
    const s = mockShipments.find(s => s.id === id);
    const u = mockUsers.find(u => u.id === partnerId);
    if (!s || !u) throw new Error('Not found');
    s.assignedPartnerId = partnerId;
    s.assignedPartnerName = u.name;
    
    // Automatically notify the assigned delivery partner
    import('./socketService').then(({ socketService }) => {
      const newNotif = {
        id: `notif-${Date.now()}`,
        userId: partnerId,
        type: 'SYSTEM',
        title: 'New Delivery Assigned',
        message: `You have been assigned to deliver package ${s.trackingId} (${s.packageName}).`,
        isRead: false,
        createdAt: new Date().toISOString(),
        shipmentId: s.id,
        trackingId: s.trackingId,
      } as Notification;
      
      mockNotifications.unshift(newNotif);
      
      socketService.emit({
        type: 'notification',
        topic: `user.${partnerId}.notifications`,
        payload: newNotif,
        timestamp: new Date().toISOString()
      });
    });

    return s;
  },
  create: async (shipmentData: any) => {
    await delay(300);
    const trackingId = `V${Math.floor(Math.random() * 1000000)}AR${Math.floor(Math.random() * 1000)}`;
    const newShipment: Shipment = {
      id: `shipment-${Date.now()}`,
      trackingId,
      ...shipmentData,
      status: 'BOOKED',
      timeline: [
        { status: 'BOOKED', timestamp: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockShipments.push(newShipment);
    return newShipment;
  }
};

export const userApi = {
  getAll: async () => { await delay(300); return [...mockUsers]; },
  getById: async (id: string) => { await delay(200); return mockUsers.find(u => u.id === id); },
  create: async (user: Partial<User>) => {
    await delay(300);
    const newUser = { ...user, id: `user-${Date.now()}`, isActive: true, createdAt: new Date().toISOString() } as User;
    mockUsers.push(newUser);
    return newUser;
  },
  update: async (id: string, data: Partial<User>) => {
    await delay(300);
    const idx = mockUsers.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('Not found');
    Object.assign(mockUsers[idx]!, data);
    return mockUsers[idx]!;
  },
  toggleActive: async (id: string) => {
    await delay(200);
    const u = mockUsers.find(u => u.id === id);
    if (u) u.isActive = !u.isActive;
    return u;
  }
};

export const branchApi = {
  getAll: async () => { await delay(300); return [...mockBranches]; },
  getById: async (id: string) => { await delay(200); return mockBranches.find(b => b.id === id); },
  create: async (branch: Partial<Branch>) => {
    await delay(300);
    const newBranch = { ...branch, id: `branch-${Date.now()}`, isActive: true, createdAt: new Date().toISOString() } as Branch;
    mockBranches.push(newBranch);
    return newBranch;
  },
  update: async (id: string, data: Partial<Branch>) => {
    await delay(300);
    const idx = mockBranches.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Not found');
    Object.assign(mockBranches[idx]!, data);
    return mockBranches[idx]!;
  }
};

export const notificationApi = {
  getForUser: async (userId: string) => { await delay(300); return getNotificationsForUser(userId); },
  markAsRead: async (id: string) => {
    await delay(200);
    const n = mockNotifications.find(n => n.id === id);
    if (n) n.isRead = true;
    return n;
  },
  markAllRead: async (userId: string) => {
    await delay(200);
    const notifs = getNotificationsForUser(userId);
    notifs.forEach(n => n.isRead = true);
    return notifs;
  }
};

export const deliveryApi = {
  generateAndSendOtp: async (shipmentId: string) => {
    await delay(300);
    const s = mockShipments.find(s => s.id === shipmentId);
    if (!s) throw new Error('Not found');
    
    // Generate actual random OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    s.deliveryOtp = generatedOtp;
    s.otpAttempts = 0;
    
    if (s.customerId) {
      import('./socketService').then(({ socketService }) => {
        const newNotif = {
          id: `notif-${Date.now()}`,
          userId: s.customerId!,
          type: 'OTP',
          title: 'Your Delivery OTP',
          message: `The delivery partner is at your location! Your OTP is ${generatedOtp}.`,
          isRead: false,
          createdAt: new Date().toISOString(),
          shipmentId: s.id,
          trackingId: s.trackingId,
        } as Notification;
        
        mockNotifications.unshift(newNotif);
        
        socketService.emit({
          type: 'notification',
          topic: `user.${s.customerId}.notifications`,
          payload: newNotif,
          timestamp: new Date().toISOString()
        });
      });
    }
    return generatedOtp;
  },
  verifyOtp: async (shipmentId: string, otp: string): Promise<boolean> => {
    await delay(500);
    const s = mockShipments.find(s => s.id === shipmentId);
    if (!s) throw new Error('Not found');
    if (s.deliveryOtp === otp) return true;
    s.otpAttempts = (s.otpAttempts || 0) + 1;
    if (s.otpAttempts >= 3) throw new Error('Max attempts reached');
    return false;
  },
  updateDelivery: async (update: DeliveryUpdate) => {
    await delay(400);
    const s = mockShipments.find(s => s.id === update.shipmentId);
    if (!s) throw new Error('Not found');
    s.status = update.status;
    if (update.status === 'DELIVERED') s.deliveredDate = new Date().toISOString();
    s.timeline.push({ status: update.status, timestamp: new Date().toISOString(), note: update.note || update.failedReason });
    return s;
  }
};

export const dashboardApi = {
  getStats: async (branchId?: string) => {
    await delay(300);
    return getDashboardStats(branchId ? getShipmentsForBranch(branchId) : mockShipments);
  },
  getChartData: async (branchId?: string) => {
    await delay(300);
    return getChartData(branchId ? getShipmentsForBranch(branchId) : mockShipments);
  }
};

export const auditApi = {
  getAll: async () => { await delay(300); return [...mockAuditLogs]; }
};

// Convenience namespace for components that import { mockApi }
export const mockApi = {
  getShipments: shipmentApi.getAll,
  createShipment: shipmentApi.create,
  getShipmentById: shipmentApi.getById,
  getShipmentByTrackingId: shipmentApi.getByTrackingId,
  getShipmentsForCustomer: shipmentApi.getForCustomer,
  getShipmentsForBranch: shipmentApi.getForBranch,
  getShipmentsForPartner: shipmentApi.getForPartner,
  updateShipmentStatus: shipmentApi.updateStatus,
  assignPartner: shipmentApi.assignPartner,
  getUsers: userApi.getAll,
  getUserById: userApi.getById,
  createUser: userApi.create,
  updateUser: userApi.update,
  toggleUserActive: userApi.toggleActive,
  getBranches: branchApi.getAll,
  getBranchById: branchApi.getById,
  createBranch: branchApi.create,
  updateBranch: branchApi.update,
  getNotifications: notificationApi.getForUser,
  markNotificationRead: notificationApi.markAsRead,
  markAllNotificationsRead: notificationApi.markAllRead,
  generateAndSendOtp: deliveryApi.generateAndSendOtp,
  verifyOtp: deliveryApi.verifyOtp,
  updateDelivery: deliveryApi.updateDelivery,
  getDashboardStats: dashboardApi.getStats,
  getBranchStats: dashboardApi.getStats,
  getChartData: dashboardApi.getChartData,
  getBranchCharts: dashboardApi.getChartData,
  getAuditLogs: auditApi.getAll,
};
