import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

export interface Notification {
  id: string
  title: string
  description: string
  type: 'success' | 'info' | 'warning' | 'error'
  timestamp: string
  read: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (title: string, description: string, type?: Notification['type']) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Storage key is user-specific so candidates and recruiters don't mix notifications
  const storageKey = user ? `jobsphere_notifications_${user.id}` : 'jobsphere_notifications_guest'

  // Load from localStorage on mount / user change
  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        setNotifications(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse notifications from localStorage', e)
        setNotifications([])
      }
    } else {
      setNotifications([])
    }
  }, [storageKey])

  // Save to localStorage whenever notifications change
  const saveNotifications = (newNotifications: Notification[]) => {
    setNotifications(newNotifications)
    localStorage.setItem(storageKey, JSON.stringify(newNotifications))
  }

  const addNotification = (
    title: string,
    description: string,
    type: Notification['type'] = 'info'
  ) => {
    // 1. Create a new notification item
    const newNotif: Notification = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      description,
      type,
      timestamp: new Date().toISOString(),
      read: false,
    }

    // 2. Prepend to list
    const updated = [newNotif, ...notifications].slice(0, 50) // Cap at 50 history entries
    saveNotifications(updated)

    // 3. Trigger animated hot-toast
    if (type === 'success') {
      toast.success(title + ': ' + description)
    } else if (type === 'error') {
      toast.error(title + ': ' + description)
    } else {
      toast(title + ': ' + description, {
        icon: '🔔',
      })
    }
  }

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    saveNotifications(updated)
  }

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }))
    saveNotifications(updated)
  }

  const clearAll = () => {
    saveNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
