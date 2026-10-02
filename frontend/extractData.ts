import { mockUsers, mockBranches, mockShipments, mockNotifications } from './src/mocks/data';
import fs from 'fs';

fs.writeFileSync('../Backend/prisma/seed-data.json', JSON.stringify({
  users: mockUsers,
  branches: mockBranches,
  shipments: mockShipments,
  notifications: mockNotifications
}, null, 2));
