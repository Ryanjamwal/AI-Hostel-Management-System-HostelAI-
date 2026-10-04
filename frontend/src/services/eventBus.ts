// Centralized Event-Driven Architecture EventBus for HostelAI

export type HostelEventType =
  | 'StudentRegistered'
  | 'RoomAllocated'
  | 'ComplaintCreated'
  | 'PaymentReceived'
  | 'VisitorEntered'
  | 'EmergencyTriggered'
  | 'MaintenancePredicted'
  | 'TelemetryAlert';

export interface HostelEventPayload {
  type: HostelEventType;
  payload: any;
  timestamp: string;
  source: string;
}

type EventCallback = (event: HostelEventPayload) => void;

class EventBusService {
  private listeners: Map<HostelEventType, Set<EventCallback>> = new Map();

  on(eventType: HostelEventType, callback: EventCallback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);
  }

  off(eventType: HostelEventType, callback: EventCallback) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType)!.delete(callback);
    }
  }

  emit(eventType: HostelEventType, payload: any, source: string = 'System') {
    const event: HostelEventPayload = {
      type: eventType,
      payload,
      timestamp: new Date().toISOString(),
      source,
    };

    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType)!.forEach(cb => cb(event));
    }
  }
}

export const eventBus = new EventBusService();
