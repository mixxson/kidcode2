import React from 'react'
import { useSocket } from '../context/SocketContext'

export default function SyncStatus() {
  const { isConnected, isReconnecting, connectionError, isSyncing } = useSocket()

  // Don't show anything when user is not logged in
  const token = localStorage.getItem('kidcode_token')
  if (!token) return null

  // Show syncing indicator (has priority over connection issues)
  if (isSyncing) {
    return (
      <div style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        padding: '8px 12px',
        borderRadius: 6,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 13,
        fontWeight: 500,
        background: '#f0f9ff',
        color: '#0369a1',
        border: '1px solid #bae6fd',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        
        <div style={{
          width: 12,
          height: 12,
          border: '2px solid #0ea5e9',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite'
        }} />
        <span>Synchronizacja...</span>
      </div>
    )
  }

  // Show reconnecting indicator (only if not syncing)
  if (isReconnecting) {
    return (
      <div style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1000,
        padding: '10px 14px',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 14,
        fontWeight: 500,
        background: '#fef3c7',
        color: '#92400e',
        border: '2px solid #fbbf24',
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
        `}</style>
        
        <div style={{
          width: 16,
          height: 16,
          border: '2px solid #fbbf24',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span>Łączenie z serwerem...</span>
      </div>
    )
  }

  // Show disconnected error only if really disconnected and not syncing/reconnecting
  if (!isConnected && !isSyncing && !isReconnecting && connectionError) {
    return (
      <div style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1000,
        padding: '10px 14px',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 14,
        fontWeight: 500,
        background: '#fee2e2',
        color: '#991b1b',
        border: '2px solid #ef4444',
        animation: 'slideIn 0.3s ease-out'
      }}>
        <span style={{ fontSize: 18 }}>⚠️</span>
        <span>{connectionError || 'Brak połączenia z serwerem'}</span>
      </div>
    )
  }

  return null
}
