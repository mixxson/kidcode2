import React from 'react'
import { useSocket } from '../context/SocketContext'

export default function ConnectionStatus() {
  const { isConnected, isReconnecting, connectionError } = useSocket()

  // Don't show anything when connected or when user is not logged in
  const token = localStorage.getItem('kidcode_token')
  if (isConnected || !token) return null

  return (
    <div style={{
      position: 'fixed',
      top: 16,
      right: 16,
      zIndex: 1000,
      padding: '12px 16px',
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      fontWeight: 500,
      background: isReconnecting ? '#fef3c7' : '#fee2e2',
      color: isReconnecting ? '#92400e' : '#991b1b',
      border: `2px solid ${isReconnecting ? '#fbbf24' : '#ef4444'}`,
      animation: 'slideIn 0.3s ease-out'
    }}>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      {isReconnecting ? (
        <>
          <div style={{
            width: 16,
            height: 16,
            border: '2px solid #fbbf24',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <span>Łączenie z serwerem...</span>
        </>
      ) : (
        <>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <span>
            {connectionError || 'Brak połączenia z serwerem'}
          </span>
        </>
      )}
    </div>
  )
}
