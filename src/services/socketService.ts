import { WSEvent, LocationUpdate, StatusUpdate, Notification } from '@/types';
import { mockShipments } from '@/mocks/data';

type EventHandler = (event: WSEvent<any>) => void;

class SocketService {
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private connected: boolean = false;
  private reconnectTimer: number | null = null;
  private heartbeatTimer: number | null = null;
  private simulateTimer: number | null = null;

  connect(token: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.connected = true;
        this.startSimulating();
        resolve();
      }, 500);
    });
  }

  disconnect(): void {
    this.connected = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    if (this.simulateTimer) clearInterval(this.simulateTimer);
  }

  subscribe(topic: string, handler: EventHandler): () => void {
    if (!this.handlers.has(topic)) {
      this.handlers.set(topic, new Set());
    }
    this.handlers.get(topic)!.add(handler);
    
    return () => {
      const topicHandlers = this.handlers.get(topic);
      if (topicHandlers) {
        topicHandlers.delete(handler);
      }
    };
  }

  isConnected(): boolean {
    return this.connected;
  }

  getStatus(): 'connected' | 'connecting' | 'disconnected' {
    return this.connected ? 'connected' : 'disconnected';
  }

  private emit(event: WSEvent<any>) {
    const topicHandlers = this.handlers.get(event.topic);
    if (topicHandlers) {
      topicHandlers.forEach(handler => handler(event));
    }
  }

  private startSimulating(): void {
    this.simulateEvents();
  }

  private simulateEvents(): void {
    let tick = 0;
    
    this.simulateTimer = window.setInterval(() => {
      tick++;

      // Every 3 seconds: location.update
      if (tick % 3 === 0) {
        const activeShipments = mockShipments.filter(s => s.status === 'OUT_FOR_DELIVERY' || s.status === 'IN_TRANSIT');
        activeShipments.forEach(s => {
          if (s.currentLat && s.currentLng) {
            s.currentLat += (Math.random() - 0.5) * 0.001;
            s.currentLng += (Math.random() - 0.5) * 0.001;
            
            const locUpdate: LocationUpdate = {
              partnerId: s.assignedPartnerId || '',
              partnerName: s.assignedPartnerName || '',
              shipmentId: s.id,
              trackingId: s.trackingId,
              lat: s.currentLat,
              lng: s.currentLng,
              timestamp: new Date().toISOString()
            };
            
            this.emit({
              type: 'location.update',
              topic: `shipment.\${s.trackingId}.location`,
              payload: locUpdate,
              timestamp: new Date().toISOString()
            });
          }
        });
      }

      // Every 15 seconds: status.update (mocking randomly)
      if (tick % 15 === 0) {
        const inTransit = mockShipments.find(s => s.status === 'IN_TRANSIT');
        if (inTransit) {
          const update: StatusUpdate = {
            shipmentId: inTransit.id,
            trackingId: inTransit.trackingId,
            previousStatus: inTransit.status,
            newStatus: 'AT_BRANCH',
            timestamp: new Date().toISOString(),
            note: 'Arrived at branch facility'
          };
          this.emit({
            type: 'status.update',
            topic: `shipment.\${inTransit.trackingId}.status`,
            payload: update,
            timestamp: new Date().toISOString()
          });
          
          this.emit({
            type: 'notification',
            topic: `user.\${inTransit.senderId}.notifications`,
            payload: {
              id: `notif-\${Date.now()}`,
              userId: inTransit.senderId,
              type: 'STATUS_UPDATE',
              title: 'Status Updated',
              message: `Shipment \${inTransit.trackingId} is now AT_BRANCH`,
              shipmentId: inTransit.id,
              trackingId: inTransit.trackingId,
              isRead: false,
              createdAt: new Date().toISOString()
            } as Notification,
            timestamp: new Date().toISOString()
          });
        }
      }

      // Every 10 seconds: heartbeat
      if (tick % 10 === 0) {
        this.emit({
          type: 'heartbeat',
          topic: 'system',
          payload: { status: 'ok' },
          timestamp: new Date().toISOString()
        });
      }

    }, 1000);
  }
}

export const socketService = new SocketService();
