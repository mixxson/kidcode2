// Konfiguracja aplikacji
// Zmień API_URL na IP swojego komputera w sieci lokalnej

// Jak znaleźć swoje IP:
// Linux/Mac: ifconfig | grep "inet " | grep -v 127.0.0.1
// Windows: ipconfig (szukaj IPv4 Address)
// Przykład: 192.168.1.100, 192.168.0.105, 10.0.0.5

export const Config = {
  // ⚠️ ZMIEŃ TO NA SWOJE IP! ⚠️
  API_URL: 'http://192.168.0.48:4000/api',
  
  // WebSocket URL (dla przyszłych funkcji real-time)
  WS_URL: 'ws://192.168.0.48:4000',
  
  // Timeouts
  API_TIMEOUT: 10000, // 10 seconds
  
  // App info
  APP_NAME: 'KidCode',
  APP_VERSION: '0.1.0',
};

export default Config;
