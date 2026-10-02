import {
  User, UserRole, Shipment, Branch, Notification,
  DeliveryUpdate, AuditLog, ShipmentStatus
} from '@/types';
import {
  mockUsers, mockBranches, mockShipments, mockNotifications, mockAuditLogs,
  getShipmentsForCustomer, getShipmentsForBranch, getShipmentsForPartner,
  getNotificationsForUser, getDashboardStats, getChartData
} from '@/mocks/data';
import axios from 'axios';

const delay = <T>(ms = 300): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const client = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
});

export const authApi = {
  login: async (email: string, password: string, role: UserRole) => {
    try {
      const res = await client.post('/auth/login', { email, password, role });
      return res.data;
    } catch (e) {
      throw new Error('Invalid credentials');
    }
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
    const res = await client.get('/shipments');
    return res.data;
  },
  getForCustomer: async (userId: string) => {
    const res = await client.get(`/shipments?customerId=${userId}`);
    return res.data;
  },
  getForBranch: async (branchId: string) => {
    const res = await client.get(`/shipments?branchId=${branchId}`);
    return res.data;
  },
  getForPartner: async (partnerId: string) => {
    const res = await client.get(`/shipments?partnerId=${partnerId}`);
    return res.data;
  },
  getById: async (id: string) => {
    // Basic lookup for mock compatibility
    const res = await client.get(`/shipments`);
    return res.data.find((s: any) => s.id === id);
  },
  getByTrackingId: async (trackingId: string) => {
    const res = await client.get(`/shipments/tracking/${trackingId}`);
    return res.data;
  },
  updateStatus: async (id: string, status: ShipmentStatus, note?: string) => {
    const res = await client.put(`/shipments/${id}/status`, { status, note });
    if (status === 'OUT_FOR_DELIVERY') {
      await deliveryApi.generateAndSendOtp(id);
    }
    return res.data;
  },
  assignPartner: async (id: string, partnerId: string) => {
    const res = await client.put(`/shipments/${id}/assign`, { partnerId });
    import('./socketService').then(({ socketService }) => {
      socketService.emit({
        type: 'notification',
        topic: `user.${partnerId}.notifications`,
        payload: {
          id: `notif-${Date.now()}`,
          userId: partnerId,
          type: 'SYSTEM',
          title: 'New Delivery Assigned',
          message: `You have been assigned to deliver a new package.`,
          isRead: false,
          createdAt: new Date().toISOString()
        } as Notification,
        timestamp: new Date().toISOString()
      });
    });
    return res.data;
  },
  create: async (shipmentData: any) => {
    const res = await client.post('/shipments', shipmentData);
    return res.data;
  }
};

export const userApi = {
  getAll: async () => {
    const res = await client.get('/users');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await client.get('/users');
    return res.data.find((u: any) => u.id === id);
  },
  create: async (user: Partial<User>) => {
    const newUser = { ...user, id: `user-${Date.now()}`, isActive: true, createdAt: new Date().toISOString() } as User;
    return newUser;
  },
  update: async (id: string, data: Partial<User>) => {
    return data as User;
  },
  toggleActive: async (id: string) => {
    return true;
  }
};

export const branchApi = {
  getAll: async () => {
    const res = await client.get('/branches');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await client.get('/branches');
    return res.data.find((b: any) => b.id === id);
  },
  create: async (branch: Partial<Branch>) => {
    const newBranch = { ...branch, id: `branch-${Date.now()}`, isActive: true, createdAt: new Date().toISOString() } as Branch;
    return newBranch;
  },
  update: async (id: string, data: Partial<Branch>) => {
    return data as Branch;
  }
};

export const notificationApi = {
  getForUser: async (userId: string) => {
    const res = await client.get(`/notifications?userId=${userId}`);
    return res.data;
  },
  markAsRead: async (id: string) => {
    return true;
  },
  markAllRead: async (userId: string) => {
    return true;
  }
};

export const deliveryApi = {
  generateAndSendOtp: async (shipmentId: string) => {
    const res = await client.post('/delivery/otp/generate', { shipmentId });
    return res.data.otp;
  },
  verifyOtp: async (shipmentId: string, otp: string): Promise<boolean> => {
    try {
      const res = await client.post('/delivery/otp/verify', { shipmentId, otp });
      return res.data.success;
    } catch (e) {
      return false;
    }
  },
  updateDelivery: async (update: DeliveryUpdate) => {
    const res = await client.put(`/shipments/${update.shipmentId}/status`, { 
      status: update.status, 
      note: update.note || update.failedReason 
    });
    return res.data;
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
