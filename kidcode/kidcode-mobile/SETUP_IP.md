# 🔧 Konfiguracja adresu IP dla aplikacji mobilnej

## Dlaczego trzeba zmienić IP?

Aplikacja mobilna (telefon/emulator) nie może używać `localhost` do połączenia z serwerem backend na Twoim komputerze. Należy użyć rzeczywistego adresu IP Twojego komputera w sieci lokalnej.

## Krok 1: Znajdź swój adres IP

### Linux / macOS:

```bash
# Sposób 1 (zalecany)
ifconfig | grep "inet " | grep -v 127.0.0.1

# Sposób 2
ip addr show | grep "inet "

# Szukaj linii typu:
# inet 192.168.1.100 netmask 0xffffff00 broadcast 192.168.1.255
```

### Windows:

```cmd
ipconfig

# Szukaj linii:
# IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

### Wynik:
Twój IP będzie wyglądał mniej więcej tak:
- `192.168.1.100`
- `192.168.0.105`
- `10.0.0.25`
- `172.16.0.50`

## Krok 2: Zaktualizuj konfigurację

Otwórz plik **`src/config.js`** i zmień IP:

```javascript
export const Config = {
  // ⚠️ ZMIEŃ TO NA SWOJE IP! ⚠️
  API_URL: 'http://192.168.1.100:4000/api',  // <-- TUTAJ!
  WS_URL: 'ws://192.168.1.100:4000',
  ...
};
```

### Przykład:
Jeśli Twój IP to: `192.168.0.105`, to:

```javascript
API_URL: 'http://192.168.0.105:4000/api',
```

## Krok 3: Sprawdź połączenie

### Upewnij się, że backend jest uruchomiony:

```bash
cd ../backend
npm run dev

# Powinno pokazać:
# Server running on port 4000
# SocketIO listening on port 4000
```

### Sprawdź dostępność z sieci:

```bash
# Z Twojego komputera:
curl http://TWOJE_IP:4000/api/health

# Powinno zwrócić:
# {"status":"ok","service":"kidcode-backend"}
```

## Krok 4: Uruchom aplikację mobilną

```bash
cd kidcode-mobile
npm start
```

Następnie:
- Zeskanuj kod QR w aplikacji Expo Go
- Lub naciśnij `a` dla emulatora Android
- Lub naciśnij `i` dla symulatora iOS

## Problemy i rozwiązania

### ❌ "Network Error" lub "Connection refused"

**Przyczyny:**
1. Backend nie jest uruchomiony
2. Nieprawidłowy adres IP
3. Firewall blokuje port 4000
4. Telefon i komputer są w różnych sieciach

**Rozwiązanie:**
```bash
# 1. Sprawdź backend
cd backend && npm run dev

# 2. Sprawdź IP ponownie
ifconfig | grep "inet " | grep -v 127.0.0.1

# 3. Wyłącz firewall (tymczasowo do testów):
# Linux:
sudo ufw disable
# macOS:
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off

# 4. Upewnij się, że oba urządzenia są w tej samej sieci WiFi
```

### ❌ "Request timeout"

**Rozwiązanie:**
- Zwiększ timeout w `src/config.js`:
```javascript
API_TIMEOUT: 30000, // 30 sekund
```

### ❌ "Unable to resolve host"

**Rozwiązanie:**
- Sprawdź pisownię IP
- Upewnij się, że nie ma literówek w `src/config.js`
- Zrestartuj Expo: `npm start` → `r` (reload)

## Szybki test

Po skonfigurowaniu IP, sprawdź czy wszystko działa:

1. **Backend działa:**
   ```bash
   curl http://TWOJE_IP:4000/api/health
   ```

2. **Możesz się zarejestrować:**
   ```bash
   curl -X POST http://TWOJE_IP:4000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"test123"}'
   ```

3. **App łączy się:**
   - Otwórz app
   - Spróbuj się zarejestrować
   - Jeśli widzisz "Błąd logowania" - backend działa!
   - Jeśli widzisz "Network Error" - problemy z połączeniem

## Dodatkowe wskazówki

### Do rozwoju na emulatorze:

**Android Emulator:**
- Możesz używać `10.0.2.2` zamiast rzeczywistego IP
- To specjalny alias dla localhost hosta

**iOS Simulator:**
- Możesz używać `localhost` lub rzeczywisty IP
- Oba warianty działają

### Do testowania na prawdziwym urządzeniu:

- **Obowiązkowo** używaj rzeczywistego IP (nie localhost!)
- Telefon i komputer **muszą być w tej samej sieci WiFi**
- Jeśli używasz Mobile Data - nie będzie działać (potrzebny VPN lub ngrok)

## Wariant alternatywny: ngrok

Jeśli nie możesz połączyć się przez sieć lokalną, użyj ngrok:

```bash
# Zainstaluj ngrok
npm install -g ngrok

# Uruchom backend na porcie 4000
cd backend && npm run dev

# W innym terminalu:
ngrok http 4000

# Skopiuj URL typu: https://abc123.ngrok.io
# I użyj w config.js:
API_URL: 'https://abc123.ngrok.io/api',
```

---

Gotowe! Teraz Twoja aplikacja mobilna może połączyć się z backend! 🎉
