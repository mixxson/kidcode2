# 🚀 Szybki Start - KidCode Mobile

## Krok po kroku

### 1️⃣ Backend (musi być uruchomiony NAJPIERW!)

```bash
# Terminal 1
cd backend
npm install  # jeśli jeszcze nie instalowałeś
npm run dev

# Powinno pokazać:
# ✅ Server running on port 4000
```

### 2️⃣ Znajdź swoje IP

```bash
# Linux/Mac:
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows:
ipconfig

# Przykład wyniku: 192.168.1.100
```

### 3️⃣ Skonfiguruj IP w mobile app

Otwórz: `kidcode-mobile/src/config.js`

```javascript
export const Config = {
  API_URL: 'http://192.168.1.100:4000/api',  // <-- ZMIEŃ TO!
  // ...
};
```

Zamień `192.168.1.100` na SWOJE IP z kroku 2.

### 4️⃣ Uruchom mobile app

```bash
# Terminal 2
cd kidcode-mobile
npm install  # jeśli jeszcze nie instalowałeś
npm start
```

### 5️⃣ Testuj na telefonie

**Opcja A: Expo Go (zalecane dla początku)**
1. Zainstaluj **Expo Go** z App Store / Google Play
2. Zeskanuj QR code który pokazał się w terminalu
3. Poczekaj aż załaduje się aplikacja

**Opcja B: Emulator**
- Android: naciśnij `a` w terminalu Expo
- iOS (tylko Mac): naciśnij `i` w terminalu Expo

### 6️⃣ Przetestuj funkcje

1. **Rejestracja**:
   - Email: `test@test.com`
   - Hasło: `test123`
   - Rola: Student (lub Teacher z admin key: `admin123`)

2. **Strona główna**:
   - Zobacz statystyki
   - Sprawdź ostatnie lekcje
   - Kliknij "Zobacz wszystkie lekcje"

3. **Lekcje**:
   - Filtruj po statusie (Wszystkie/Nowe/W trakcie/Ukończone)
   - Kliknij na lekcję

4. **Szczegóły lekcji**:
   - Przeczytaj treść
   - Kliknij "Rozpocznij kodowanie"

5. **Edytor**:
   - Napisz kod JavaScript
   - Naciśnij "▶️ Uruchom"
   - Zobacz wyniki
   - Oznacz jako ukończoną

6. **Pokoje**:
   - Zobacz listę dostępnych pokoi
   - (Tworzenie pokoi - wkrótce)

7. **Profil**:
   - Zobacz swoje statystyki
   - Sprawdź ustawienia
   - Wyloguj się

## 🔧 Troubleshooting

### ❌ "Network Error" lub "Connection refused"

**Problem**: App nie może połączyć się z backend

**Rozwiązanie**:
1. Sprawdź czy backend działa: `curl http://TWOJE_IP:4000/api/health`
2. Sprawdź IP w `src/config.js` - czy jest poprawne?
3. Sprawdź czy telefon i komputer są w **tej samej WiFi**
4. Tymczasowo wyłącz firewall: 
   ```bash
   # Linux:
   sudo ufw disable
   # Mac:
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off
   ```

### ❌ "Unable to resolve module"

**Problem**: Brakuje dependencies

**Rozwiązanie**:
```bash
cd kidcode-mobile
rm -rf node_modules package-lock.json
npm install
npm start
```

### ❌ App się crashuje po załadowaniu

**Problem**: Błąd w kodzie lub złe dane z API

**Rozwiązanie**:
1. W Expo: potrząśnij telefonem i wybierz "Reload"
2. Lub w terminalu: naciśnij `r` (reload)
3. Sprawdź logi w terminalu - czerwone błędy

### ❌ Nie mogę zarejestrować się jako teacher

**Problem**: Admin key niepoprawny

**Rozwiązanie**: 
- Admin key to: `admin123` (zdefiniowany w backend)
- Upewnij się że wpisujesz dokładnie to hasło

### ❌ Python kod nie działa w edytorze

**Problem**: Python executor nie jest jeszcze zaimplementowany w mobile

**Rozwiązanie**:
- Używaj **tylko JavaScript** w wersji mobilnej
- Python działa tylko w wersji web (desktop)
- Komunikat o tym jest wyświetlany przy próbie uruchomienia Python

## 📊 Co powinno działać?

### ✅ Funkcjonalne (90% gotowe):
- [x] Rejestracja i logowanie
- [x] Strona główna ze statystykami
- [x] Lista lekcji z filtrami
- [x] Szczegóły lekcji (treść HTML)
- [x] Edytor JavaScript
- [x] Lista pokoi
- [x] Profil użytkownika
- [x] Progress tracking (new → in-progress → completed)
- [x] Pull-to-refresh na wszystkich ekranach

### 🚧 W przygotowaniu (10%):
- [ ] CodeRoom - rzeczywista współpraca
- [ ] Python executor w mobile
- [ ] Push notifications
- [ ] Offline mode
- [ ] Dark mode

## 🎯 Następne kroki

1. **Testuj podstawowe funkcje** - przejdź przez cały flow (rejestracja → lekcje → edytor → profil)
2. **Zgłoś bugi** - jeśli coś nie działa, zapisz błąd z terminala
3. **Feedback** - co można poprawić? Czego brakuje?

## 🚀 Deploy (produkcja)

Gdy wszystko działa lokalnie:

```bash
# Build dla Android
npm run build:android

# Build dla iOS (tylko Mac)
npm run build:ios

# Albo EAS Build (zalecane):
npx eas build --platform android
npx eas build --platform ios
```

---

**Gotowe!** Masz teraz działającą mobilną aplikację KidCode! 🎉

Jeśli potrzebujesz pomocy, sprawdź:
- `SETUP_IP.md` - szczegółowa instrukcja konfiguracji IP
- `README.md` - pełna dokumentacja projektu
- Backend logs w terminalu - błędy API
- Expo logs - błędy aplikacji
