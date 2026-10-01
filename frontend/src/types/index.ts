// ─── User & Auth ────────────────────────────────────────────────────
export type UserRole = 'CUSTOMER' | 'ADMIN' | 'BRANCH_STAFF' | 'DELIVERY_PARTNER';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  branchId?: string;     // for BRANCH_STAFF
  isActive: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

// ─── Shipment ───────────────────────────────────────────────────────
export type ShipmentStatus =
  | 'BOOKED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'AT_BRANCH'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED_ATTEMPT';

export interface ShipmentTimeline {
  status: ShipmentStatus;
  timestamp: string;
  location?: string;
  note?: string;
}

export interface Shipment {
  id: string;
  trackingId: string;
  packageName: string;
  packageDescription?: string;
  packageWeight?: number;
  packageType?: string;

  senderId: string;
  senderName: string;
  senderAddress: string;
  senderPhone: string;

  receiverId: string;
  receiverName: string;
  receiverAddress: string;
  receiverPhone: string;

  status: ShipmentStatus;
  timeline: ShipmentTimeline[];
  
  branchId: string;
  branchName: string;
  assignedPartnerId?: string;
  assignedPartnerName?: string;

  bookingDate: string;
  expectedDeliveryDate: string;
  deliveredDate?: string;
  
  deliveryOtp?: string;       // 6-digit OTP for delivery confirmation
  otpAttempts?: number;
  
  currentLat?: number;
  currentLng?: number;
  
  estimatedRevenue: number;
}

// ─── Branch ─────────────────────────────────────────────────────────
export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  managerId?: string;
  isActive: boolean;
  createdAt: string;
}

// ─── Notification ───────────────────────────────────────────────────
export type NotificationType = 'STATUS_UPDATE' | 'DELIVERY_ATTEMPT' | 'OTP' | 'SYSTEM' | 'ASSIGNMENT';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  shipmentId?: string;
  trackingId?: string;
  isRead: boolean;
  createdAt: string;
}

// ─── Live Tracking ──────────────────────────────────────────────────
export interface LocationUpdate {
  partnerId: string;
  partnerName: string;
  shipmentId: string;
  trackingId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp: string;
}

export interface StatusUpdate {
  shipmentId: string;
  trackingId: string;
  previousStatus: ShipmentStatus;
  newStatus: ShipmentStatus;
  timestamp: string;
  note?: string;
}

// ─── WebSocket Events ───────────────────────────────────────────────
export type WSEventType = 'location.update' | 'status.update' | 'notification' | 'heartbeat' | 'auth';

export interface WSEvent<T = unknown> {
  type: WSEventType;
  topic: string;
  payload: T;
  timestamp: string;
}

// ─── Delivery Partner specific ──────────────────────────────────────
export type FailedReason =
  | 'CUSTOMER_UNAVAILABLE'
  | 'WRONG_ADDRESS'
  | 'REFUSED'
  | 'DAMAGED_PACKAGE'
  | 'OTHER';

export interface DeliveryUpdate {
  shipmentId: string;
  status: 'DELIVERED' | 'FAILED_ATTEMPT';
  otp?: string;
  failedReason?: FailedReason;
  note?: string;
}

// ─── Stats / Dashboard ─────────────────────────────────────────────
export interface DashboardStats {
  totalShipments: number;
  delivered: number;
  pending: number;
  inTransit: number;
  outForDelivery: number;
  failedAttempts: number;
  activePartners: number;
  totalRevenue: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  delivered?: number;
  pending?: number;
  failed?: number;
}

// ─── API Response wrapper ───────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Audit Log ──────────────────────────────────────────────────────
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  timestamp: string;
}
