import { toast } from 'react-hot-toast'

export const notifications = {
  success: (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: 'white',
        borderRadius: '8px',
        padding: '12px 16px',
      },
      icon: '✅',
    })
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: 'white',
        borderRadius: '8px',
        padding: '12px 16px',
      },
      icon: '❌',
    })
  },

  warning: (message: string) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#f59e0b',
        color: 'white',
        borderRadius: '8px',
        padding: '12px 16px',
      },
      icon: '⚠️',
    })
  },

  info: (message: string) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#3b82f6',
        color: 'white',
        borderRadius: '8px',
        padding: '12px 16px',
      },
      icon: 'ℹ️',
    })
  },

  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#6b7280',
        color: 'white',
        borderRadius: '8px',
        padding: '12px 16px',
      },
    })
  },

  dismiss: (toastId: string) => {
    toast.dismiss(toastId)
  },

  dismissAll: () => {
    toast.dismiss()
  }
}

export default notifications
