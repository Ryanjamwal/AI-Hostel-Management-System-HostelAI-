import React, { useState } from 'react';
import '../styles/AdminComponents.css';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  message: string;
  timestamp: Date;
  read: boolean;
}

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      message: 'Student admission approved',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
    },
    {
      id: '2',
      type: 'warning',
      message: '3 students with pending complaints',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
    },
    {
      id: '3',
      type: 'info',
      message: 'Monthly report generated',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: true,
    },
    {
      id: '4',
      type: 'danger',
      message: 'Room maintenance urgent - Room 304',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      read: true,
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleClear = () => {
    setNotifications([]);
    setIsOpen(false);
  };

  const getIcon = (type: string): string => {
    const icons: Record<string, string> = {
      success: '✓',
      warning: '⚠',
      danger: '✕',
      info: 'ℹ',
    };
    return icons[type] || 'ℹ';
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="notification-center">
      <button
        className="notification-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-popup">
          <div className="notification-header">
            <h4>Notifications</h4>
            {notifications.length > 0 && (
              <button className="clear-btn" onClick={handleClear}>
                Clear All
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`notification-item notification-${notif.type} ${!notif.read ? 'unread' : ''}`}
                  onClick={() => handleMarkAsRead(notif.id)}
                >
                  <div className="notification-icon">
                    {getIcon(notif.type)}
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">{notif.message}</p>
                    <span className="notification-time">
                      {formatTime(notif.timestamp)}
                    </span>
                  </div>
                  {!notif.read && <div className="read-indicator" />}
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <button className="view-all-btn">View All Notifications</button>
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div
          className="notification-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
