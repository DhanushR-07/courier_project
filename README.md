# CourierFlow — Courier Management System

A comprehensive, role-based Courier Management System built with React, TypeScript, and modern frontend tooling. Features live tracking, real-time notifications, OTP verification, and dashboards for four distinct user roles.

![Dark Theme](https://img.shields.io/badge/Theme-Dark%20%2B%20Orange-orange) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue) ![React](https://img.shields.io/badge/React-19-61dafb) ![Vite](https://img.shields.io/badge/Vite-6.x-646CFF)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open **http://localhost:5173** in your browser.

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Customer** | `customer@demo.com` | `password123` |
| **Admin** | `admin@demo.com` | `password123` |
| **Branch Staff** | `staff@demo.com` | `password123` |
| **Delivery Partner** | `driver@demo.com` | `password123` |

---

## 📁 Project Structure

```
src/
├── App.tsx                         # Root component (QueryClient, Router, Toast)
├── main.tsx                        # Entry point
├── index.css                       # Global styles + Tailwind v4 import
├── vite-env.d.ts                   # Vite env types
│
├── types/
│   └── index.ts                    # All TypeScript interfaces & types
│
├── stores/
│   ├── authStore.ts                # Zustand auth state (persist)
│   ├── themeStore.ts               # Zustand dark/light mode (persist)
│   └── notificationStore.ts        # Zustand notification state
│
├── services/
│   ├── api.ts                      # Axios instance + interceptors
│   ├── mockApi.ts                  # Mock API layer (swap for real backend)
│   └── socketService.ts            # Mock WebSocket service + event simulator
│
├── hooks/
│   ├── useLiveTracking.ts          # Live tracking hook (location, status, ETA)
│   └── useNotifications.ts         # Notification subscription hook
│
├── mocks/
│   └── data.ts                     # All mock data + helper functions
│
├── router/
│   └── index.tsx                   # React Router config (all routes)
│
├── layouts/
│   ├── CustomerLayout.tsx          # Bottom nav (mobile) + sidebar (desktop)
│   ├── AdminLayout.tsx             # Collapsible sidebar
│   ├── BranchLayout.tsx            # Simplified sidebar
│   └── DeliveryLayout.tsx          # Mobile-only bottom nav
│
├── components/
│   ├── auth/
│   │   ├── LoginPage.tsx           # Login with role selector
│   │   └── ProtectedRoute.tsx      # Role-based route guard
│   └── shared/
│       ├── StatCard.tsx            # Dashboard metric card
│       ├── StatusBadge.tsx         # Shipment status pill
│       ├── Timeline.tsx            # Vertical status timeline
│       ├── DataTable.tsx           # Reusable sortable table
│       ├── MapView.tsx             # Leaflet map wrapper
│       ├── OtpInput.tsx            # 6-digit OTP input
│       ├── NotificationBell.tsx    # Bell icon + dropdown
│       ├── SearchInput.tsx         # Debounced search input
│       ├── Modal.tsx               # Reusable modal
│       ├── ConfirmDialog.tsx       # Confirm action dialog
│       ├── Skeleton.tsx            # Loading skeletons
│       └── EmptyState.tsx          # Empty state component
│
├── features/
│   ├── customer/
│   │   ├── CustomerDashboard.tsx   # Current shipping + recent shipments
│   │   ├── MyShipments.tsx         # Shipment list with filters
│   │   ├── ShipmentDetail.tsx      # Detail + timeline + OTP display
│   │   ├── LiveTrackingPage.tsx    # Map with moving marker + ETA
│   │   └── NotificationHistory.tsx # Full notification list
│   │
│   ├── admin/
│   │   ├── AdminDashboard.tsx      # Global stats + charts
│   │   ├── AllShipments.tsx        # All shipments + CSV export
│   │   ├── UserManagement.tsx      # User CRUD + role management
│   │   ├── BranchManagement.tsx    # Branch CRUD
│   │   ├── GlobalTracking.tsx      # All-branch live map
│   │   └── AuditLog.tsx            # Audit log viewer
│   │
│   ├── branch/
│   │   ├── BranchDashboard.tsx     # Branch stats + charts
│   │   ├── BranchShipments.tsx     # Branch shipments table
│   │   └── BranchTracking.tsx      # Branch partner tracking map
│   │
│   └── delivery/
│       ├── DeliveryDashboard.tsx    # Today's deliveries (mobile-first)
│       ├── DeliveryStatusUpdate.tsx # Delivered/Failed + OTP verification
│       ├── DeliveryMap.tsx          # Route map with stops
│       └── LocationTracker.tsx     # GPS location broadcasting
│
└── pages/
    ├── ForbiddenPage.tsx           # 403 page
    └── NotFoundPage.tsx            # 404 page
```

---

## 🛡️ Role & Permission Matrix

| Feature | Customer | Branch Staff | Delivery Partner | Admin |
|---------|:--------:|:------------:|:----------------:|:-----:|
| View own shipments | ✅ | — | — | ✅ |
| View branch shipments | — | ✅ | — | ✅ |
| View all shipments | — | — | — | ✅ |
| Track shipment (live map) | ✅ | ✅ | ✅ | ✅ |
| View delivery OTP | ✅ | — | — | — |
| Verify OTP & mark delivered | — | — | ✅ | — |
| Update shipment status | — | ✅ | ✅ | ✅ |
| Assign delivery partner | — | ✅ | — | ✅ |
| Manage users (CRUD) | — | — | — | ✅ |
| Manage branches (CRUD) | — | — | — | ✅ |
| View dashboard & charts | ✅ | ✅ | ✅ | ✅ |
| Export CSV | — | ✅ | — | ✅ |
| View audit logs | — | — | — | ✅ |
| Receive notifications | ✅ | ✅ | ✅ | ✅ |
| Share GPS location | — | — | ✅ | — |

---

## 🔌 Backend API Contract

### REST Endpoints

The mock API layer (`src/services/mockApi.ts`) mirrors this contract. Replace the mock implementations with real API calls by updating this file.

#### Auth
```
POST /api/auth/login
  Body: { email: string, password: string, role: UserRole }
  Response: { user: User, token: string }

POST /api/auth/verify
  Headers: Authorization: Bearer <token>
  Response: User
```

#### Shipments
```
GET    /api/shipments                    # All shipments (admin)
GET    /api/shipments?branchId=xxx       # Branch shipments
GET    /api/shipments?customerId=xxx     # Customer shipments
GET    /api/shipments?partnerId=xxx      # Partner assignments
GET    /api/shipments/:id                # Single shipment
GET    /api/shipments/tracking/:trackingId
PATCH  /api/shipments/:id/status         # { status, note? }
PATCH  /api/shipments/:id/assign         # { partnerId }
```

#### Users
```
GET    /api/users
GET    /api/users/:id
POST   /api/users                        # { name, email, phone, password, role, branchId? }
PATCH  /api/users/:id                    # Partial update
PATCH  /api/users/:id/toggle-active
```

#### Branches
```
GET    /api/branches
GET    /api/branches/:id
POST   /api/branches
PATCH  /api/branches/:id
```

#### Notifications
```
GET    /api/notifications?userId=xxx
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/mark-all-read?userId=xxx
```

#### Delivery
```
POST   /api/delivery/verify-otp          # { shipmentId, otp }
POST   /api/delivery/update              # { shipmentId, status, failedReason?, note? }
```

#### Dashboard
```
GET    /api/dashboard/stats?branchId=xxx
GET    /api/dashboard/charts?branchId=xxx
```

#### Audit
```
GET    /api/audit-logs
```

---

### WebSocket / SSE Event Contract

The frontend expects a WebSocket connection at `VITE_WS_URL` streaming Kafka topics:

#### `courier.location.updates`
```json
{
  "type": "location.update",
  "topic": "courier.location.updates",
  "payload": {
    "partnerId": "user-4",
    "partnerName": "Jimmy Jordan",
    "shipmentId": "ship-1",
    "trackingId": "V789456AR123",
    "lat": 39.7412,
    "lng": -104.9876,
    "heading": 180,
    "speed": 30,
    "timestamp": "2025-06-01T14:30:00Z"
  },
  "timestamp": "2025-06-01T14:30:00Z"
}
```

#### `courier.status.updates`
```json
{
  "type": "status.update",
  "topic": "courier.status.updates",
  "payload": {
    "shipmentId": "ship-1",
    "trackingId": "V789456AR123",
    "previousStatus": "IN_TRANSIT",
    "newStatus": "OUT_FOR_DELIVERY",
    "timestamp": "2025-06-01T14:30:00Z",
    "note": "Partner en route"
  },
  "timestamp": "2025-06-01T14:30:00Z"
}
```

#### `courier.notifications`
```json
{
  "type": "notification",
  "topic": "courier.notifications",
  "payload": {
    "id": "notif-123",
    "userId": "user-1",
    "type": "STATUS_UPDATE",
    "title": "Package Out for Delivery",
    "message": "Your package V789456AR123 is out for delivery",
    "shipmentId": "ship-1",
    "trackingId": "V789456AR123",
    "isRead": false,
    "createdAt": "2025-06-01T14:30:00Z"
  },
  "timestamp": "2025-06-01T14:30:00Z"
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.8 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| State Management | Zustand (persisted) |
| Server State | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Maps | React Leaflet + OpenStreetMap |
| Icons | Lucide React |
| Toasts | React Hot Toast |
| HTTP Client | Axios (with interceptors) |
| Utilities | clsx, date-fns, uuid |

---

## 🌙 Dark / Light Mode

The app defaults to dark mode (matching the UI design). Toggle via the sun/moon icon in any layout's header. The preference is persisted in localStorage.

---

## 📱 Responsive Design

- **Customer Portal**: Bottom nav on mobile, sidebar on desktop
- **Delivery Partner Portal**: Mobile-only bottom nav (optimized for phones)
- **Branch Staff Portal**: Collapsible sidebar
- **Admin Portal**: Full sidebar with hamburger toggle on mobile

---

## 🔧 Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001/ws
VITE_APP_NAME=CourierFlow
```

---

## 📝 Plugging in a Real Backend

1. **REST API**: Update `src/services/mockApi.ts` to call the real endpoints using the Axios instance from `src/services/api.ts`
2. **WebSocket**: Replace the mock event simulator in `src/services/socketService.ts` with a real WebSocket connection
3. **Auth**: The JWT interceptor in `api.ts` already attaches the token and handles 401 redirects

---

## License

MIT
