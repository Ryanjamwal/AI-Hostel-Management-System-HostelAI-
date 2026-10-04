// Multi-Channel Notification Engine (In-App, SMS, WhatsApp, Email)

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  priority: 'Critical' | 'Important' | 'Normal';
  channels: ('InApp' | 'SMS' | 'WhatsApp' | 'Email')[];
  timestamp: string;
  read: boolean;
}

class NotificationEngineService {
  private notifications: NotificationItem[] = [
    {
      id: 'NOTIF-01',
      title: '🚨 Emergency Warning',
      message: 'Fire indicator detected in Block B Common Lounge.',
      priority: 'Critical',
      channels: ['InApp', 'SMS', 'WhatsApp'],
      timestamp: 'Just now',
      read: false,
    },
    {
      id: 'NOTIF-02',
      title: '✈️ Leave Approval',
      message: 'Your leave application for Aug 15 - Aug 18 has been approved by Warden.',
      priority: 'Important',
      channels: ['InApp', 'WhatsApp'],
      timestamp: '2 hours ago',
      read: false,
    },
  ];

  getNotifications(): NotificationItem[] {
    return [...this.notifications];
  }

  dispatchNotification(title: string, message: string, priority: 'Critical' | 'Important' | 'Normal', channels: ('InApp' | 'SMS' | 'WhatsApp' | 'Email')[]) {
    const item: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      priority,
      channels,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    this.notifications.unshift(item);
  }
}

export const notificationEngine = new NotificationEngineService();
