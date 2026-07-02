import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        // Define default options
        duration: 4000,
        style: {
          background: '#ffffff',
          color: '#1e293b', // slate-800
          border: '1px solid #f1f5f9', // slate-100
          borderRadius: '12px', // rounded-xl
          fontSize: '14px',
          fontWeight: 500,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)', // shadow-sm
          padding: '12px 16px',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#2563eb', // blue-600
            secondary: '#ffffff',
          },
          style: {
            borderLeft: '4px solid #2563eb',
          }
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444', // red-500
            secondary: '#ffffff',
          },
          style: {
            borderLeft: '4px solid #ef4444',
          }
        },
      }}
    />
  )
}
export { toast } from 'react-hot-toast'
