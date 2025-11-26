# KidCode Mobile App 📱

Mobilna aplikacja edukacyjna do nauki programowania dla dzieci. Dostępna na iOS i Android dzięki React Native i Expo.

## 🎯 O projekcie

KidCode Mobile to mobilny klient platformy KidCode, który umożliwia:
- 📚 Naukę programowania JavaScript i Python
- 💻 Pisanie i uruchamianie kodu bezpośrednio na telefonie
- 📊 Śledzenie postępów w nauce
- 🚪 Współpracę w pokojach (rooms) z innymi uczniami
- 👨‍🏫 Zarządzanie lekcjami (dla nauczycieli)

## 🚀 Szybki start

### Wymagania
- **Node.js** 18+ (zalecane LTS)
- **npm** lub **yarn**
- **Expo Go** na telefonie (do testowania)
  - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **Backend KidCode** uruchomiony lokalnie lub na serwerze

### 1️⃣ Instalacja zależności

```bash
cd kidcode-mobile
npm install
```

### 2️⃣ Konfiguracja połączenia z backendem

⚠️ **WAŻNE:** Musisz skonfigurować adres IP swojego komputera!

#### Znajdź swoje IP:

**Linux/Mac:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# Wynik: inet 192.168.0.48 netmask...
```

**Windows:**
```cmd
ipconfig
# Szukaj: IPv4 Address. . . : 192.168.0.48
```

#### Edytuj plik konfiguracyjny:

Otwórz `src/config.js` i zmień IP:

```javascript
export const Config = {
  API_URL: 'http://192.168.0.48:4000/api',  // ← ZMIEŃ NA SWOJE IP!
  WS_URL: 'ws://192.168.0.48:4000',
  API_TIMEOUT: 10000,
};
```

### 3️⃣ Uruchomienie backendu

Backend **MUSI** być uruchomiony przed testowaniem aplikacji!

```bash
# W osobnym terminalu
cd backend
npm run dev

# Powinno pokazać:
# ✅ Server running on port 4000
```

### 4️⃣ Uruchomienie aplikacji mobilnej

```bash
cd kidcode-mobile
npm start
```

Pojawi się QR code i menu z opcjami:
- **Naciśnij `a`** - uruchom na emulatorze Android
- **Naciśnij `i`** - uruchom na symulatorze iOS (tylko Mac)
- **Naciśnij `w`** - uruchom w przeglądarce
- **Zeskanuj QR** - otwórz w Expo Go na telefonie

### 5️⃣ Testowanie na telefonie

1. Zainstaluj **Expo Go** na telefonie
2. Upewnij się, że telefon i komputer są w **tej samej sieci WiFi**
3. Otwórz Expo Go i zeskanuj QR code
4. Poczekaj na załadowanie aplikacji (pierwsze uruchomienie może trwać 1-2 minuty)

## 📖 Szczegółowa dokumentacja

- **[QUICKSTART.md](./QUICKSTART.md)** - Krok po kroku przewodnik
- **[SETUP_IP.md](./SETUP_IP.md)** - Rozwiązywanie problemów z połączeniem
- **[TESTING.md](./TESTING.md)** - Checklist testowania funkcji
- **[STATUS.md](./STATUS.md)** - Status implementacji (co działa, co nie)

## ✨ Funkcje

### 🔐 Autentykacja i konta
- ✅ **Logowanie** - bezpieczne logowanie z email i hasłem
- ✅ **Rejestracja** - tworzenie konta z wyborem roli:
  - 👨‍🎓 **Student** - dostęp do lekcji i pokojów
  - 👨‍🏫 **Teacher** - tworzenie lekcji i zarządzanie pokojami
  - 👑 **Admin** - pełny dostęp (wymaga admin key: `admin123`)
- ✅ **Persystencja sesji** - automatyczne zapamiętywanie logowania (AsyncStorage)
- ✅ **JWT tokens** - bezpieczna autoryzacja z backend

### 🏠 Strona główna (Home)
- ✅ **Powitanie** - personalizowane powitanie z imieniem użytkownika
- ✅ **Statystyki wizualne** - 4 karty z liczbami:
  - 📚 Wszystkie lekcje
  - 🆕 Nowe lekcje
  - ⏳ W trakcie
  - ✅ Ukończone
- ✅ **Przegląd pokojów** - liczba dostępnych pokojów współpracy
- ✅ **Ostatnie lekcje** - szybki dostęp do 5 ostatnich lekcji
- ✅ **Pull-to-refresh** - odświeżanie danych przeciągnięciem w dół

### 📚 Lekcje
- ✅ **Lista lekcji** - wszystkie dostępne lekcje z backendu
- ✅ **Filtry zaawansowane** - 4 zakładki:
  - 📖 Wszystkie
  - 🆕 Nowe (nigdy nie rozpoczęte)
  - ⏳ W trakcie (rozpoczęte, nie ukończone)
  - ✅ Ukończone
- ✅ **Liczniki** - każda zakładka pokazuje ilość lekcji
- ✅ **Status badges** - kolorowe oznaczenia statusu z emoji
- ✅ **Metadata** - difficulty, język (JS/Python), czas trwania
- ✅ **Pull-to-refresh** - odświeżanie listy

### 📖 Szczegóły lekcji (Lesson Detail)
- ✅ **Treść HTML** - pięknie sformatowana treść lekcji w WebView
- ✅ **Styling** - headings, listy, code blocks, formatowanie
- ✅ **Status tracking** - wyświetlanie obecnego statusu lekcji
- ✅ **Przyciski akcji**:
  - 💻 "Rozpocznij kodowanie" (dla nowych)
  - 💻 "Kontynuuj kodowanie" (dla rozpoczętych)
  - ✅ "Oznacz jako ukończoną"
- ✅ **Metadata badges** - difficulty, język, czas
- ✅ **Panel admina** - edycja i usuwanie (tylko teacher/admin)
- ✅ **Pull-to-refresh**

### 💻 Edytor kodu (Editor)
- ✅ **Edytor JavaScript** - TextInput z monospace font
- ✅ **Uruchamianie kodu** - przycisk ▶️ "Uruchom"
- ✅ **Panel wyników** - czarne tło, monospace output
- ✅ **console.log support** - przechwytywanie i wyświetlanie logów
- ✅ **Obsługa błędów** - wyświetlanie błędów składni i runtime
- ✅ **Reset** - przywrócenie kodu startowego
- ✅ **Progress tracking** - automatyczna zmiana statusu:
  - 🆕 new → ⏳ in-progress (przy pierwszym uruchomieniu)
  - ⏳ in-progress → ✅ completed (przycisk "Zakończ")
- ✅ **KeyboardAvoidingView** - klawiatura nie zasłania kodu
- ⚠️ **Python** - nie działa (wymaga backend integration lub Pyodide)

### 🚪 Pokoje (Rooms)
- ✅ **Lista pokoi** - wszystkie aktywne pokoje
- ✅ **Karty pokoi** - nazwa, twórca, uczestnicy, język
- ✅ **Active badge** - zielona kropka przy aktywnych
- ✅ **Dołączanie** - przycisk "Dołącz" z potwierdzeniem
- ✅ **Tworzenie** - przycisk "Utwórz pokój" (teacher/admin)
- ✅ **Empty state** - przyjazny komunikat gdy brak pokoi
- ✅ **Pull-to-refresh**

### 🎮 Pokój współpracy (CodeRoom)
- ✅ **Wejście do pokoju** - nawigacja z listy pokoi
- ✅ **Header** - nazwa pokoju, twórca, przycisk "Opuść"
- ✅ **Uczestnicy** - lista obecnych użytkowników
- ✅ **Edytor kodu** - wspólny edytor (lokalnie)
- ✅ **Uruchamianie** - wykonywanie kodu JavaScript
- ✅ **Panel wyników** - output dla każdego użytkownika
- ⚠️ **Real-time sync** - NIE zaimplementowany jeszcze
  - Komunikat: "Synchronizacja w czasie rzeczywistym nie jest jeszcze zaimplementowana"
  - Kod jest lokalny dla każdego użytkownika
  - TODO: Socket.IO integration

### 👤 Profil użytkownika (Profile)
- ✅ **Avatar** - pierwsza litera email
- ✅ **Informacje** - email i rola
- ✅ **Badge roli** - kolorowy z emoji:
  - 👨‍🎓 Student (niebieski)
  - 👨‍🏫 Nauczyciel (zielony)
  - 👑 Administrator (żółty)
- ✅ **Statystyki** - 4 karty w gridzie:
  - Wszystkie lekcje
  - W trakcie
  - Ukończone
  - Procent postępu (obliczany automatycznie)
- ✅ **Sekcja ustawień**:
  - ℹ️ O aplikacji
  - 🌙 Tryb ciemny (placeholder)
  - 🔔 Powiadomienia (placeholder)
  - 🌐 Język (placeholder)
  - 🔐 Zmień hasło (placeholder)
- ✅ **Wylogowanie** - z potwierdzeniem

### 🧭 Nawigacja
- ✅ **Bottom Tabs** - 4 główne zakładki:
  - 🏠 Home
  - 📚 Lekcje
  - 🚪 Pokoje
  - 👤 Profil
- ✅ **Stack Navigation** - ekrany szczegółowe:
  - LessonDetail
  - Editor
  - CodeRoom
- ✅ **Auth Stack** - Login → Register (dla niezalogowanych)
- ✅ **Conditional rendering** - automatyczne przełączanie Auth/Main
- ✅ **Header styling** - fioletowy (#667eea) z białym tekstem
- ✅ **Back button** - ← w każdym szczegółowym ekranie

## 🚧 Planowane funkcje (TODO)

### Wysoki priorytet
- [ ] **Socket.IO w CodeRoom** - prawdziwa synchronizacja kodu w czasie rzeczywistym
- [ ] **Python executor** - uruchamianie kodu Python (backend integration)
- [ ] **Powiadomienia push** - notyfikacje o nowych lekcjach

### Średni priorytet  
- [ ] **Admin panel** - zarządzanie lekcjami przez mobile
- [ ] **Room management** - tworzenie i edycja pokoi
- [ ] **Tryb offline** - cache'owanie lekcji lokalnie

### Niski priorytet
- [ ] **Dark mode** - ciemny motyw
- [ ] **Lokalizacja** - tłumaczenie na angielski
- [ ] **Syntax highlighting** - kolorowanie składni kodu
- [ ] **Code completion** - podpowiedzi podczas pisania
- [ ] **Achievements** - osiągnięcia i badges

### 📅 Planowane

- [ ] Push notifications
- [ ] Offline mode (cache lekcji)
- [ ] Dark mode
- [ ] Gamification (punkty, badges)

## 🗂️ Struktura Projektu

```
kidcode-mobile/
├── App.js                    # Entry point
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js   # React Navigation setup
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── HomeScreen.js
│   │   └── LessonsScreen.js
│   ├── context/
│   │   └── AuthContext.js    # Auth state management
│   └── services/
│       └── api.js            # Axios API client
└── package.json
```

## 🔧 Stack Technologiczny

- **Framework:** React Native + Expo
- **Navigation:** React Navigation (Stack + Bottom Tabs)
- **State:** React Context API
- **Storage:** AsyncStorage
- **HTTP Client:** Axios
- **Backend:** Node.js Express (ten sam co web!)

## � Integracja z API

### Konfiguracja
Edytuj `src/config.js`:

```javascript
export const Config = {
  API_URL: 'http://192.168.0.48:4000/api',  // Backend API
  WS_URL: 'ws://192.168.0.48:4000',          // WebSocket (future)
  API_TIMEOUT: 10000,                        // 10 sekund
};
```

### Dostępne endpointy

#### Autentykacja (`/api/auth`)
- `POST /api/auth/register` - Rejestracja nowego użytkownika
- `POST /api/auth/login` - Logowanie
- `GET /api/auth/me` - Pobierz dane zalogowanego użytkownika

#### Lekcje (`/api/lessons`)
- `GET /api/lessons` - Lista wszystkich lekcji
- `GET /api/lessons/:id` - Szczegóły lekcji
- `POST /api/lessons` - Utwórz lekcję (teacher/admin)
- `PUT /api/lessons/:id` - Edytuj lekcję (teacher/admin)
- `DELETE /api/lessons/:id` - Usuń lekcję (teacher/admin)

#### Postępy (`/api/progress`)
- `GET /api/progress` - Postępy zalogowanego użytkownika
- `GET /api/progress/lesson/:lessonId` - Postęp w konkretnej lekcji
- `POST /api/progress/lesson/:lessonId` - Zaktualizuj status lekcji
- `GET /api/progress/statistics` - Statystyki (all, new, in-progress, completed)

#### Pokoje (`/api/rooms`)
- `GET /api/rooms` - Lista pokojów
- `GET /api/rooms/:id` - Szczegóły pokoju
- `POST /api/rooms` - Utwórz pokój (teacher/admin)
- `PUT /api/rooms/:id` - Edytuj pokój
- `DELETE /api/rooms/:id` - Usuń pokój

### Interceptory

**Request Interceptor** - automatycznie dodaje token:
```javascript
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('kidcode_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Response Interceptor** - obsługa błędów:
```javascript
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Wyloguj użytkownika
    }
    return Promise.reject(error);
  }
);
```

## 🧪 Testowanie

### Testowanie lokalne

1. **Backend**:
```bash
cd backend
npm run dev
# Sprawdź: curl http://192.168.0.48:4000/api/health
```

2. **Mobile app**:
```bash
cd kidcode-mobile
npm start
```

3. **Na telefonie**:
   - Zeskanuj QR w Expo Go
   - Lub naciśnij `a` dla emulatora Android
   - Lub naciśnij `i` dla symulatora iOS (Mac)

### Konta testowe

Po uruchomieniu możesz zarejestrować:

**Student:**
- Email: `student@test.com`
- Password: `test123`
- Role: Student

**Teacher:**
- Email: `teacher@test.com`
- Password: `test123`
- Role: Teacher
- Admin key: `admin123`

**Admin:**
- Email: `admin@test.com`
- Password: `test123`
- Role: Admin
- Admin key: `admin123`

### Checklist testowania

Sprawdź [TESTING.md](./TESTING.md) - kompletna lista funkcji do przetestowania.

## 🔧 Troubleshooting

### ❌ "Network Error" / "Connection refused"

**Przyczyny:**
1. Backend nie jest uruchomiony
2. Złe IP w `src/config.js`
3. Telefon i komputer w różnych sieciach WiFi
4. Firewall blokuje port 4000

**Rozwiązanie:**
```bash
# 1. Sprawdź backend
curl http://192.168.0.48:4000/api/health
# Powinno zwrócić: {"status":"ok","service":"kidcode-backend"}

# 2. Sprawdź IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# 3. Tymczasowo wyłącz firewall (Linux)
sudo ufw disable

# 4. Upewnij się że oba urządzenia w tej samej WiFi
```

Więcej w [SETUP_IP.md](./SETUP_IP.md)

### ❌ "Unable to resolve module"

```bash
cd kidcode-mobile
rm -rf node_modules package-lock.json
npm install
npm start
```

### ❌ App crashuje

1. W Expo: potrząśnij telefonem → "Reload"
2. Lub w terminalu: naciśnij `r`
3. Sprawdź czerwone błędy w terminalu

### ❌ "Packages should be updated"

Możesz zignorować to ostrzeżenie lub zaktualizować:
```bash
npx expo install react-native-webview
```

### ❌ Python nie działa w edytorze

**To normalne!** Python executor nie jest jeszcze zaimplementowany w wersji mobilnej.
- ✅ JavaScript działa
- ❌ Python wymaga backend integration
- Komunikat jest wyświetlany użytkownikowi

## 📊 Status projektu

**Gotowe (~90%):**
- ✅ 8 ekranów w pełni funkcjonalnych
- ✅ Nawigacja (Auth + Main Tabs + Details)
- ✅ API integration z AsyncStorage
- ✅ Progress tracking (new → in-progress → completed)
- ✅ Pull-to-refresh na wszystkich ekranach

**TODO (~10%):**
- 🚧 Socket.IO real-time sync w CodeRoom
- 🚧 Python executor
- 🚧 Push notifications
- 🚧 Dark mode
- 🚧 Offline mode

Zobacz [STATUS.md](./STATUS.md) dla szczegółów.

## 🚀 Deployment (Produkcja)

### Android APK

```bash
# Zainstaluj EAS CLI
npm install -g eas-cli

# Login do Expo
eas login

# Konfiguracja
eas build:configure

# Build APK
eas build --platform android --profile preview

# Download APK i zainstaluj na telefonie
```

### iOS (wymaga Mac + Apple Developer Account)

```bash
eas build --platform ios --profile preview
```

### Publikacja w Store

```bash
# Google Play
eas submit --platform android

# App Store
eas submit --platform ios
```

## 📚 Dodatkowe zasoby

### Dokumentacja
- [React Navigation](https://reactnavigation.org/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

### Backend
- Główny projekt: `../backend/`
- Web version: `../frontend/`

## 🤝 Contributing

1. Fork projektu
2. Stwórz branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Otwórz Pull Request

## 📝 License

Ten projekt jest częścią KidCode - platformy edukacyjnej do nauki programowania.

## 👥 Autorzy

**KidCode Team** - Mobilna aplikacja edukacyjna

---

## 🎯 Szybkie linki

- 📱 [QUICKSTART.md](./QUICKSTART.md) - Jak zacząć w 5 minut
- 🔧 [SETUP_IP.md](./SETUP_IP.md) - Problemy z połączeniem?
- ✅ [TESTING.md](./TESTING.md) - Co testować?
- 📊 [STATUS.md](./STATUS.md) - Co działa?

---

**Miłej nauki programowania! 🚀**

Aplikacja mobilna używa **dokładnie tego samego backend API** co aplikacja webowa:

```
Backend: http://YOUR_IP:4000/api
WebSocket: ws://YOUR_IP:4000 (future)
```

### Endpoints:
- `POST /auth/login` - Logowanie
- `POST /auth/register` - Rejestracja
- `GET /lessons` - Lista lekcji
- `GET /progress` - Progress użytkownika
- `GET /progress/statistics` - Statystyki
- `GET /rooms` - Lista pokoi

## 🐛 Debugowanie

### Expo DevTools
```bash
npm start
# Naciśnij 'd' dla developer menu
# Naciśnij 'j' dla debugger
```

### React Native Debugger
1. Zainstaluj [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
2. Uruchom aplikację
3. W Expo DevTools włącz "Debug remote JS"

### Logi
```bash
# Android
npx react-native log-android

# iOS
npx react-native log-ios
```

## 📦 Build dla Production

### Android APK
```bash
# Build APK
eas build --platform android --profile preview

# Zainstaluj na urządzeniu
adb install build.apk
```

### iOS App
```bash
# Wymaga Apple Developer Account ($99/rok)
eas build --platform ios --profile production
```

## 🔐 Bezpieczeństwo

- JWT tokens przechowywane w AsyncStorage (bezpieczne)
- Hasła nigdy nie są przechowywane lokalnie
- HTTPS w produkcji (required by app stores)
- Walidacja wszystkich inputów

## 🎨 Design Guidelines

- **Kolory:**
  - Primary: `#667eea` (fioletowy)
  - Secondary: `#764ba2` (ciemny fiolet)
  - Success: `#4CAF50` (zielony)
  - Info: `#2196F3` (niebieski)
  - Gray: `#999`

- **Fonty:**
  - System default (San Francisco na iOS, Roboto na Android)
  - Bold dla nagłówków
  - Regular dla treści

- **Spacing:**
  - Padding: 16px standardowy
  - Margin: 8-24px
  - Border radius: 8-12px

## 🚀 Deployment

### TestFlight (iOS)
1. Zbuduj app: `eas build --platform ios`
2. Upload do App Store Connect
3. Dodaj testerów w TestFlight
4. Wyślij zaproszenia

### Google Play (Android)
1. Zbuduj AAB: `eas build --platform android --profile production`
2. Upload do Google Play Console
3. Utwórz Internal Testing track
4. Dodaj testerów

## 📚 Dokumentacja

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native](https://reactnative.dev/)

## 🤝 Contributing

1. Fork repo
2. Stwórz branch: `git checkout -b feature/mobile-feature`
3. Commit: `git commit -m 'Add mobile feature'`
4. Push: `git push origin feature/mobile-feature`
5. Otwórz Pull Request

## 📄 License

MIT License

---

**Autor:** KidCode Team  
**Data:** 26 listopada 2025  
**Wersja:** 0.1.0 (MVP)
