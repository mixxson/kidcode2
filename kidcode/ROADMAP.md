# KidCode – Roadmap Platformy

**Wersja:** 1.0  
**Data utworzenia:** 25 listopada 2025  
**Język:** Polski

---

## 🎯 Wizja Produktu

KidCode to interaktywna platforma edukacyjna do nauki programowania dla dzieci, która umożliwia:
- **Uczniom** – pisanie i uruchamianie kodu (Python, JavaScript) w przeglądarce
- **Nauczycielom** – monitoring i edycję kodu uczniów w czasie rzeczywistym
- **Współpracę** – synchronizację zmian między nauczycielem a uczniem w dedykowanych pokojach (rooms)

---

## 🗒️ Notatki z realizacji (Progress)

Data: 25 listopada 2025

### ✅ Zrealizowane
- **JWT Auth:** Zaimplementowano z rolami (admin/teacher/student), endpointy: register/login/me, zmiana ról dla admina.
- **Socket.IO Backend:** HTTP server + integracja, middleware autentykacji JWT, eventy: `room:join`, `room:leave`, `code:update`, `cursor:update`.
- **Rooms System:** `roomsController`, `rooms.json`, trasy REST: list/get/create/join/delete z kontrolą dostępu.
- **Socket.IO Client:** `src/services/socketService.js` (połączenie, join/leave, wysyłka/odbiór zmian kodu).
- **SocketContext:** React Context z auto-reconnect, debouncing (500ms), SyncStatus component.
- **Chakra UI v3:** Zainstalowano i skonfigurowano `ChakraProvider` z `defaultSystem`.
- **Monaco Editor:** Dodano `@monaco-editor/react`, utworzono `CodeRoom.jsx` z real-time sync kodu.
- **JavaScript Execution:** Web Worker sandbox z timeout, console.log capture, error handling.
- **Python Execution:** Pyodide (CDN) z stdout/stderr capture, async execution.
- **Editor.jsx:** Universal editor z auto-save, language detection, progress persistence.
- **Lessons System:** Enhanced lessons page z filters, difficulty badges, language indicators.
- **RoomsList:** Strona listy pokoi z filtrowaniem według roli (teacher/student), przycisk tworzenia dla nauczycieli.
- **RoomCreate:** Strona tworzenia pokoju z dropdown wyboru ucznia, auto-generowana nazwa pokoju.
- **Navigation:** Dodano link "Pokoje" w navbar dla zalogowanych użytkowników.
- **Auth Fix:** Login/Register teraz przeładowują stronę (`window.location.href`) aby odświeżyć stan użytkownika.
- **Admin Guard:** Strona Admin sprawdza localStorage przed renderowaniem, obsługuje language field.
- **Student UI:** Cleaned up Home page - hide admin actions from students, role-based UI.
- **README:** Zaktualizowano z instrukcjami JWT i .env; skrypt `run-all.sh` dla Linux.
- **Real-time Sync Optimization:** Zwiększono debouncing do 500ms, dodano debouncedSaveRoom na backendzie (1s), powiększono Socket.IO buffers i timeouts.
- **SyncStatus Component:** Nowy komponent zastępujący ConnectionStatus - pokazuje "Synchronizacja..." podczas wysyłania kodu, "Łączenie z serwerem..." przy reconnect, "Brak połączenia" tylko przy faktycznym błędzie.
- **Editor Always Editable:** Usunięto readOnly mode - editor zawsze dostępny, synchronizacja w tle.

### 🔧 W trakcie
- Brak - Milestone 2, 3 i 4 zakończone! Gotowe do Milestone 5 (Testing) lub 6 (Deployment).

### 📋 Następne kroki
1. ✅ ~~Dodać Context dla Socket + reconnect/error handling~~ — ZROBIONE
2. ✅ ~~Implementować JS Executor (Web Worker sandbox)~~ — ZROBIONE
3. ✅ ~~Dodać Pyodide dla Python execution~~ — ZROBIONE
4. ✅ ~~Output Panel z przyciskiem Run~~ — ZROBIONE
5. ✅ ~~Stworzyć stronę RoomCreate dla nauczycieli~~ — ZROBIONE
6. ✅ ~~Debouncing dla synchronizacji kodu (500ms)~~ — ZROBIONE
7. ✅ ~~Optymalizacja synchronizacji (backend debouncing, increased buffers)~~ — ZROBIONE
8. ✅ ~~Naturalny sync indicator (SyncStatus component)~~ — ZROBIONE
9. ✅ ~~UI/UX improvements (Milestone 3) - Layout, Nawigacja, Animacje~~ — ZROBIONE
10. ✅ ~~Dashboard dla nauczycieli (Milestone 4)~~ — ZROBIONE
11. 🧪 **NASTĘPNE:** Testing i stabilizacja (Milestone 5) lub 🚀 Deployment (Milestone 6)
12. 👆 Collaborative cursors w Monaco Editor (Optional - Milestone 7)

## �📋 Roadmap – Etapy Realizacji

### ✅ **Etap 0: Fundament (GOTOWE)**

**Status:** Zrealizowane  
**Czas realizacji:** Zakończone

- [x] Struktura projektu (backend Node.js/Express + frontend React/Vite)
- [x] System autentykacji JWT z rolami (`admin`, `teacher`, `student`)
- [x] CRUD dla lekcji (tylko dla nauczycieli/adminów)
- [x] Przechowywanie danych w plikach JSON
- [x] Podstawowe API endpoints
- [x] Skrypt uruchomieniowy dla Linux (`run-all.sh`)

---

### 🔧 **Etap 1: Real-Time Infrastructure**

**Priorytet:** Wysoki  
**Czas realizacji:** 2-3 tygodnie  
**Cel:** Implementacja synchronizacji w czasie rzeczywistym

#### 1.1 WebSocket Infrastructure
- [x] **Backend: Socket.IO Setup**
  - [x] Dodać `socket.io` do `backend/package.json`
  - [x] Stworzyć `backend/src/sockets/index.js` – główny handler WebSocket
  - [x] Zintegrować Socket.IO z Express server
  - [x] Implementować middleware autentykacji dla socket connections

- [ ] **Frontend: Socket.IO Client**
  - [x] Dodać `socket.io-client` do `frontend/package.json`
  - [x] Stworzyć `frontend/src/services/socketService.js` – wrapper dla socket klienta
  - [ ] Stworzyć React Context dla socket connections
  - [ ] Implementować auto-reconnect i error handling

#### 1.2 System Pokoi (Rooms) ✅
- [x] **Backend: Rooms Management**
  - [x] Stworzyć `backend/src/controllers/roomsController.js`
  - [x] API endpoints:
    - [x] `POST /api/rooms` – utworzenie pokoju przez nauczyciela
    - [x] `GET /api/rooms` – lista pokoi (filtrowane według roli)
    - [x] `GET /api/rooms/:id` – szczegóły pokoju
    - [x] `POST /api/rooms/:id/join` – dołączenie do pokoju
    - [x] `DELETE /api/rooms/:id` – usunięcie pokoju
    - [x] `GET /api/users/students` – endpoint dla dropdown wyboru uczniów
  - [x] Przechowywanie: `backend/src/data/rooms.json`
  - Struktura pokoju:
    ```json
    {
      "id": 1,
      "name": "Pokój Ucznia Jan - Lekcja 1",
      "teacherId": 2,
      "studentId": 3,
      "lessonId": 5,
      "language": "python",
      "code": "print('Hello')",
      "createdAt": "2025-11-25T10:00:00Z",
      "active": true
    }
    ```

- [x] **Frontend: Rooms UI**
  - [x] Stworzyć `frontend/src/pages/RoomsList.jsx`
  - [x] Stworzyć `frontend/src/pages/RoomCreate.jsx` z dropdown wyboru uczniów
  - [x] Routing: `/rooms`, `/rooms/:id`, `/rooms/new`

#### 1.3 Synchronizacja Kodu ✅
- [x] **Backend: Code Sync Logic**
  - [x] Socket handlers w `backend/src/sockets/index.js`
  - Socket events:
    - [x] `code:update` – zmiana kodu (emit od klienta + broadcast)
    - [x] `room:join` – dołączenie do pokoju z callback (room data)
    - [x] `room:leave` – opuszczenie pokoju
    - [x] `cursor:update` – pozycja kursora (prepared, not used yet)
    - [ ] `selection:change` – zaznaczenie tekstu (TODO)
  - [x] Debouncing dla zapisów do pliku (1000ms) - `debouncedSaveRoom`
  - [x] Instant broadcast do innych użytkowników (low latency)
  - [x] Zwiększone buffers: `maxHttpBufferSize: 1e8`, `pingTimeout: 60000`

- [x] **Frontend: Code Editor Integration**
  - [x] Wybrać edytor: **Monaco Editor** (VSCode)
  - [x] Dodać `@monaco-editor/react`
  - [x] Stworzyć `frontend/src/pages/CodeRoom.jsx` (z edytorem)
  - [x] Bindować zmiany kodu do socket events (`code:update`)
  - [x] Debouncing wysyłki (500ms) w `SocketContext`
  - [x] `isRemoteUpdate` flag - zapobiega pętlom synchronizacji
  - [x] Editor zawsze edytowalny (readOnly: false)
  - [ ] Pokazywać kursory innych użytkowników (TODO - Milestone 3)
  - [x] Syntax highlighting dla Python i JavaScript (Monaco wbudowany)
  - [x] Language switching z resetem kodu do szablonu

---

### 🐍 **Etap 2: Code Execution Environment**

**Priorytet:** Wysoki  
**Czas realizacji:** 2-3 tygodnie  
**Cel:** Uruchamianie kodu w przeglądarce

#### 2.1 JavaScript Execution ✅
- [x] **Frontend: JS Sandbox**
  - [x] Stworzyć `frontend/src/services/jsExecutor.js`
  - [x] Użyć `eval()` w Web Worker dla izolacji
  - [x] Przekierować `console.log` do outputu w UI
  - [x] Obsłużyć timeout (max 5s wykonania)
  - [x] Obsłużyć błędy runtime

#### 2.2 Python Execution ✅
- [x] **Wybór rozwiązania: Pyodide (WASM w przeglądarce)**
  - [x] Ładowanie Pyodide z CDN (jsdelivr v0.26.4)
  - [x] Stworzyć `frontend/src/services/pythonExecutor.js`
  - [x] Ładować Pyodide runtime dynamicznie (script tag injection)
  - [x] Przekierować stdout/stderr do UI (io.StringIO)
  - [x] Async execution z error handling

- [x] **Frontend: Output Panel**
  - [x] Stworzyć `frontend/src/components/OutputPanel.jsx`
  - [x] Pokazywać stdout, stderr, błędy
  - [x] Czyszczenie outputu przed każdym uruchomieniem
  - [x] Przycisk "Run Code" / "Uruchom Kod" w CodeRoom
  - [x] Support dla obu języków (JS i Python)

#### 2.3 Bezpieczeństwo
- [ ] Zaimplementować rate limiting dla wykonania kodu
- [ ] Timeout execution (max 5-10s)
- [ ] Memory limits (jeśli backend sandbox)
- [ ] Blacklisting niebezpiecznych operacji (file I/O, network)

---

### 🎨 **Etap 3: UI/UX – Modern Design**

**Priorytet:** Średni  
**Czas realizacji:** 2 tygodnie  
**Cel:** Piękny, przyjazny interfejs

#### 3.1 Design System
- [x] **Wybór biblioteki UI:**
  - ✅ **Chakra UI v3** – wybrany i zainstalowany
  - Komponenty: Box, Flex, Button, Badge, Heading, HStack, VStack, Spacer, Text, Spinner

- [x] **Instalacja i konfiguracja:**
  - [x] Zainstalowano: `@chakra-ui/react @emotion/react @emotion/styled framer-motion`
  - [x] Skonfigurowano `ChakraProvider` z `defaultSystem` w `main.jsx`
  - [ ] Stworzyć własny theme (kolory, fonty, spacing) – opcjonalnie

#### 3.2 Layout i Nawigacja ✅
- [x] **Global Layout**
  - [x] Stworzyć `frontend/src/components/Layout/Navbar.jsx`
  - [x] Stworzyć `frontend/src/components/Layout/Layout.jsx`
  - [x] Logo gradient, menu, user dropdown z rolą
  - [x] Responsive design (mobile hamburger menu, tablet, desktop)

- [ ] **Routing**
  - Dodać `react-router-dom` (już zainstalowane)
  - Struktura:
    ```
    / – Landing page (logowanie/rejestracja)
    /dashboard – Dashboard (różny dla ucznia/nauczyciela)
    /lessons – Lista lekcji
    /lessons/:id – Szczegóły lekcji
    /rooms – Lista pokoi
    /rooms/:id – Widok pokoju (editor + output)
    /profile – Profil użytkownika
    ```

#### 3.3 Widok Pokoju (Code Room)
- [ ] **Layout Split Screen:**
  - Stworzyć `frontend/src/pages/CodeRoom.jsx`
  - **Lewa strona:** Code Editor (Monaco/CodeMirror)
  - **Prawa strona:** Output Panel + Chat (opcjonalnie)
  - **Górny bar:** Nazwa pokoju, język, przycisk "Run", status połączenia
  - **Dolny bar:** Aktywni użytkownicy (avatary nauczyciela i ucznia)

- [ ] **Real-time indicators:**
  - Pokazać status: "Connected" / "Reconnecting..."
  - Pokazać aktywnych użytkowników z kolorowymi kropkami
  - Animated cursor drugiego użytkownika w edytorze

- [ ] **Responsive design:**
  - Na mobile: przełącznik między edytorem a outputem (tabs)
  - Na desktop: split 60/40

#### 3.4 Animacje i Feedback ✅
- [x] Dodać `framer-motion` dla animacji (już zainstalowany)
- [x] PageTransition component z fade-in/fade-out
- [x] Toast notifications (Chakra UI Toaster w Login/Register)
- [x] Smooth transitions między stronami (opacity + translateY)
- [ ] Skeleton screens przy ładowaniu danych (TODO - Milestone 4)
- [ ] Loading spinners podczas łączenia z pokojem (już jest w CodeRoom)

#### 3.5 Accessibility (A11y)
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] ARIA labels
- [ ] Contrast ratio zgodny z WCAG 2.1 AA
- [ ] Screen reader support

---

### 📊 **Etap 4: Features dla Nauczycieli**

**Priorytet:** Średni  
**Czas realizacji:** 1-2 tygodnie

#### 4.1 Dashboard Nauczyciela ✅
- [x] Stworzyć `frontend/src/pages/TeacherDashboard.jsx`
- [x] Widżety:
  - [x] StatCard component (reusable)
  - [x] Lista aktywnych pokoi (Table z Chakra UI)
  - [x] Lista uczniów (SimpleGrid z cards)
  - [x] Statystyki: Total Rooms, Active Sessions, Students, Lessons
- [x] Skeleton loading states
- [x] Responsive layout (mobile/tablet/desktop)

#### 4.2 Zarządzanie Uczniami ✅
- [x] **Backend:**
  - [x] Endpoint: `GET /api/users/students` – lista wszystkich uczniów (już istnieje)

- [x] **Frontend:**
  - [x] Wyświetlanie uczniów w Dashboard
  - [x] Badge z rolą ucznia
  - [ ] Możliwość zaproszenia ucznia (TODO - future enhancement)
  - [ ] Podgląd postępów ucznia (TODO - future enhancement)

#### 4.3 Monitoring w Czasie Rzeczywistym
- [ ] Nauczyciel widzi wszystkie aktywne sesje uczniów
- [ ] "Peek mode" – podgląd kodu bez edycji
- [ ] "Takeover mode" – przejęcie kontroli (z powiadomieniem ucznia)

#### 4.4 Chat w Pokoju (opcjonalnie)
- [ ] Socket events: `chat:message`, `chat:typing`
- [ ] Stworzyć `frontend/src/components/Chat.jsx`
- [ ] Zapisywać historię w `backend/src/data/messages.json`

---

### 🧪 **Etap 5: Testing i Stabilizacja**

**Priorytet:** Wysoki  
**Czas realizacji:** 1 tydzień

#### 5.1 Unit Testing
- [ ] **Backend:**
  - Dodać `jest` lub `mocha` + `chai`
  - Testy dla controllers (auth, rooms, lessons)
  - Testy dla middleware (auth, requireRoles)

- [ ] **Frontend:**
  - Dodać `@testing-library/react` + `vitest`
  - Testy komponentów (CodeEditor, OutputPanel, RoomCard)

#### 5.2 Integration Testing
- [ ] Testy WebSocket connections (socket.io-client w testach)
- [ ] Testy end-to-end (Playwright lub Cypress)
  - Scenariusz: logowanie → utworzenie pokoju → edycja kodu → uruchomienie

#### 5.3 Performance Testing
- [ ] Load testing WebSocket (symulacja 50+ równoczesnych połączeń)
- [ ] Memory leaks w edytorze kodu
- [ ] Latency synchronizacji (<100ms)

---

### 🚀 **Etap 6: Deployment i DevOps**

**Priorytet:** Średni  
**Czas realizacji:** 1 tydzień

#### 6.1 Docker Compose
- [ ] Stworzyć `docker-compose.yml` w katalogu głównym
- [ ] Services:
  - `backend` – Node.js Express + Socket.IO
  - `frontend` – Vite (production build serwowany przez nginx)
  - `redis` (opcjonalnie) – session storage dla Socket.IO

#### 6.2 Environment Variables
- [ ] Przejść z JSON files na PostgreSQL (opcjonalnie)
- [ ] Stworzyć `.env.production`
- [ ] Ustawić `JWT_SECRET`, `ADMIN_KEY`, `DATABASE_URL`

#### 6.3 CI/CD
- [ ] GitHub Actions workflow:
  - Linting (ESLint)
  - Unit tests
  - Build frontend i backend
  - Deploy na VPS (DigitalOcean, Hetzner) lub PaaS (Render, Railway)

#### 6.4 Monitoring
- [ ] Dodać logging (Winston lub Pino)
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring (UptimeRobot)

---

### 📱 **Etap 7: Aplikacja Mobilna (iOS & Android)**

**Priorytet:** Wysoki  
**Czas realizacji:** 1-2 tygodnie  
**Cel:** Rozszerzenie platformy na urządzenia mobilne

#### 7.1 Mobile App Setup
- [ ] **Technology Stack:**
  - [ ] React Native + Expo (framework mobilny)
  - [ ] React Navigation (nawigacja w aplikacji)
  - [ ] React Native Paper lub NativeBase (UI komponenty)
  - [ ] AsyncStorage (lokalny storage, zamiennik localStorage)
  - [ ] Expo Notifications (push notifications)

- [ ] **Project Setup:**
  ```bash
  npx create-expo-app kidcode-mobile
  cd kidcode-mobile
  npm install axios react-navigation @react-navigation/native-stack
  npm install @react-native-async-storage/async-storage
  ```

#### 7.2 Screens (Ekrany) - Konwersja z Web
- [ ] **Authentication Screens:**
  - [ ] LoginScreen.js (port z Login.jsx)
  - [ ] RegisterScreen.js (port z Register.jsx)
  - [ ] SplashScreen.js (loading initial data)

- [ ] **Main Screens:**
  - [ ] HomeScreen.js (port z Home.jsx)
  - [ ] LessonsScreen.js (lista lekcji z progress tracking)
  - [ ] LessonDetailScreen.js (szczegóły lekcji)
  - [ ] RoomsScreen.js (lista pokoi)
  - [ ] CodeRoomScreen.js (uproszczona wersja - bez Monaco Editor)

- [ ] **Profile & Settings:**
  - [ ] ProfileScreen.js (profil użytkownika)
  - [ ] SettingsScreen.js (ustawienia: notifications, dark mode)

#### 7.3 Core Features - Mobile Adaptation
- [ ] **API Integration:**
  - [ ] Skopiować `services/api.js` z web (95% identyczny kod!)
  - [ ] Zamienić `localStorage` → `AsyncStorage`
  - [ ] Obsłużyć network errors (offline mode)

- [ ] **Code Editor:**
  - [ ] **OPCJA A:** Prosty TextInput (multi-line) dla prostych zadań
  - [ ] **OPCJA B:** react-native-code-editor (lekki syntax highlighting)
  - [ ] **OPCJA C:** WebView z Monaco Editor (jeśli potrzebna pełna funkcjonalność)
  - [ ] Syntax highlighting dla Python i JavaScript
  - [ ] Auto-indent i code formatting

- [ ] **Code Execution:**
  - [ ] JavaScript: WebView z eval() (podobnie jak w web)
  - [ ] Python: Pyodide przez WebView lub backend execution
  - [ ] Output display z scrollable log

- [ ] **Real-time Sync:**
  - [ ] Socket.IO client (dokładnie taki sam jak w web!)
  - [ ] Background sync (nawet gdy app w tle)
  - [ ] Reconnection handling

#### 7.4 Mobile-Specific Features
- [ ] **Push Notifications:**
  - [ ] Expo Notifications setup
  - [ ] Backend: endpoint do rejestracji device tokens
  - [ ] Notifications types:
    - [ ] Nauczyciel zaprasza do pokoju
    - [ ] Nowa lekcja dostępna
    - [ ] Reminder: "Wróć do nauki!" (daily/weekly)
    - [ ] Osiągnięcie odblokowane (gamification)

- [ ] **Offline Mode:**
  - [ ] Cache lekcji w AsyncStorage
  - [ ] Możliwość czytania lekcji offline
  - [ ] Sync progress gdy wraca połączenie
  - [ ] Queue dla offline edits

- [ ] **Native Features:**
  - [ ] Camera (dla avatar upload - future)
  - [ ] Share feature (udostępnij postęp)
  - [ ] Haptic feedback (wibracje przy akcjach)
  - [ ] Dark mode (system preference)

#### 7.5 Navigation Structure
```
App.js
├─ AuthStack (gdy nie zalogowany)
│  ├─ LoginScreen
│  └─ RegisterScreen
└─ MainStack (gdy zalogowany)
   ├─ TabNavigator (bottom tabs)
   │  ├─ HomeTab (HomeScreen)
   │  ├─ LessonsTab (LessonsScreen)
   │  ├─ RoomsTab (RoomsScreen)
   │  └─ ProfileTab (ProfileScreen)
   └─ StackNavigator (modal screens)
      ├─ LessonDetailScreen
      ├─ CodeRoomScreen
      └─ SettingsScreen
```

#### 7.6 UI/UX Mobile Design
- [ ] **Bottom Tab Navigation:**
  - [ ] Home �
  - [ ] Lekcje 📚
  - [ ] Pokoje 🚪
  - [ ] Profil 👤

- [ ] **Gestures:**
  - [ ] Swipe do cofnięcia (iOS standard)
  - [ ] Pull-to-refresh dla list
  - [ ] Long-press dla akcji kontekstowych

- [ ] **Responsive:**
  - [ ] Portrait mode (primary)
  - [ ] Landscape mode (dla code editor)
  - [ ] Tablet support (split screen)

#### 7.7 Testing
- [ ] **iOS Testing:**
  - [ ] Expo Go app (development)
  - [ ] TestFlight (beta testing)
  - [ ] App Store submission

- [ ] **Android Testing:**
  - [ ] Expo Go app (development)
  - [ ] APK build (internal testing)
  - [ ] Google Play Console (beta/production)

#### 7.8 Deployment
- [ ] **iOS:**
  - [ ] Apple Developer Account ($99/rok)
  - [ ] EAS Build (Expo Application Services)
  - [ ] App Store Connect setup
  - [ ] Screenshots i metadata
  - [ ] Submit do App Store Review

- [ ] **Android:**
  - [ ] Google Play Console ($25 jednorazowo)
  - [ ] EAS Build dla Android
  - [ ] Play Store listing
  - [ ] Screenshots i metadata
  - [ ] Submit do Google Play Review

#### 7.9 Performance & Optimization
- [ ] Lazy loading dla screens
- [ ] Image optimization (compress avatars)
- [ ] Code splitting
- [ ] Memory management (cleanup listeners)
- [ ] Battery optimization (limit background sync)

---

### �🎁 **Etap 8: Nice-to-Have Features**

**Priorytet:** Niski  
**Czas realizacji:** Rozłożone w czasie

- [ ] **Wersjonowanie kodu:** Historia zmian w pokoju (git-like)
- [ ] **Gamifikacja:** Punkty, odznaki, leaderboard
- [ ] **Multiuser rooms:** Więcej niż 2 osoby w pokoju (dla warsztatów)
- [ ] **Voice chat:** WebRTC dla komunikacji głosowej
- [ ] **Screen sharing:** Nauczyciel pokazuje ekran uczniowi
- [ ] **Code snippets library:** Gotowe przykłady kodu
- [ ] **AI Assistant:** ChatGPT integration dla podpowiedzi (OpenAI API)
- [ ] **Dark mode:** Przełącznik ciemnego motywu (WEB + MOBILE)
- [ ] **Internationalization (i18n):** Wsparcie wielu języków (polski, angielski, rosyjski)
- [ ] **Apple Watch app:** Quick stats i notifications
- [ ] **Widget iOS/Android:** Daily lesson reminder na home screen

---

## 🛠️ Stack Technologiczny

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **WebSocket:** Socket.IO
- **Auth:** JWT (jsonwebtoken)
- **Hashing:** bcryptjs
- **Database:** JSON files → PostgreSQL (długoterminowo)
- **Code Execution:** Docker sandbox lub Pyodide (WASM)

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **UI Library:** Chakra UI / Mantine
- **Code Editor:** Monaco Editor (@monaco-editor/react)
- **WebSocket:** socket.io-client
- **State Management:** React Context / Zustand (jeśli potrzeba)
- **Routing:** react-router-dom
- **Styling:** Emotion / Tailwind CSS
- **Animations:** Framer Motion
- **Python:** Pyodide (WASM)

### DevOps
- **Containerization:** Docker, Docker Compose
- **CI/CD:** GitHub Actions
- **Hosting:** VPS (Ubuntu 22.04) / PaaS (Render, Railway)
- **Reverse Proxy:** nginx
- **SSL:** Let's Encrypt (Certbot)

---

## 📐 Architektura Systemu

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Vite)                  │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────┐             │
│  │  Login/    │  │  Dashboard  │  │  Code Room   │             │
│  │  Register  │  │  (Teacher/  │  │  (Editor +   │             │
│  │            │  │   Student)  │  │   Output)    │             │
│  └────────────┘  └─────────────┘  └──────────────┘             │
│         │                │                  │                    │
│         └────────────────┴──────────────────┘                    │
│                          │                                       │
│                    Socket.IO Client                              │
│                    HTTP (Axios)                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ (HTTPS + WSS)
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                   │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐        │
│  │  REST API   │  │  Socket.IO   │  │  Code Runner    │        │
│  │  (Auth,     │  │  (Real-time  │  │  (Docker/       │        │
│  │   Rooms,    │  │   Sync)      │  │   Pyodide)      │        │
│  │   Lessons)  │  │              │  │                 │        │
│  └─────────────┘  └──────────────┘  └─────────────────┘        │
│         │                │                  │                    │
│         └────────────────┴──────────────────┘                    │
│                          │                                       │
│                    JSON Storage                                  │
│              (users.json, rooms.json, lessons.json)              │
│                 (późniejsza migracja na PostgreSQL)              │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🏁 Milestones – Quick Wins

### Milestone 1 (2 tygodnie) ✅ UKOŃCZONE
- [x] Autentykacja (już gotowe)
- [x] WebSocket infrastructure (backend + client wrapper)
- [x] System pokoi (CRUD + uprawnienia)
- [x] Basic code editor (Monaco) + real-time sync
- [x] Chakra UI integration
- [x] RoomsList page

### Milestone 2 (3 tygodnie) — ✅ 100% UKOŃCZONE
- [x] Real-time sync kodu z debouncing (500ms frontend, 1s backend)
- [x] Socket Context z auto-reconnect
- [x] JavaScript execution (Web Worker sandbox)
- [x] Python execution (Pyodide via CDN)
- [x] Output panel
- [x] Enhanced Editor with language support
- [x] SyncStatus component (improved UX)
- [x] Student dropdown selector w RoomCreate
- [x] Optimization: increased buffers, timeouts, always-editable editor
- [x] Bug fixes: sync loop prevention, connection stability

### Milestone 3 (2 tygodnie) — ✅ 100% UKOŃCZONE
- [x] Modern Navbar z logo, navigation, user dropdown, mobile menu
- [x] Layout wrapper component (Container + fullWidth mode)
- [x] Framer Motion animations (page transitions)
- [x] Toast notifications (Chakra UI Toaster)
- [x] Responsive CodeRoom (desktop split, mobile tabs)
- [x] Improved UI/UX with Chakra UI components

### Milestone 4 (1 tydzień) — ✅ 100% UKOŃCZONE
- [x] TeacherDashboard.jsx z statystykami i tabelami
- [x] Statistics widgets (Rooms, Active Sessions, Students, Lessons)
- [x] Active Rooms Table z monitoringiem
- [x] Students list cards
- [x] Route /dashboard w Navbar i App.jsx
- [x] Auto-redirect teachers z Home do Dashboard

### Milestone 5 (1 tydzień)
- 🚀 Docker Compose
- 🚀 Deployment na VPS
- 🚀 CI/CD pipeline

### Milestone 6 (1-2 tygodnie) - 📱 APLIKACJA MOBILNA
- [ ] Expo setup + React Native
- [ ] Konwersja screens z web (Login, Home, Lessons, Rooms)
- [ ] API integration (ten sam backend!)
- [ ] Socket.IO client (real-time sync)
- [ ] Push notifications
- [ ] Offline mode z AsyncStorage
- [ ] Code editor mobilny (TextInput lub WebView)
- [ ] Testing iOS + Android
- [ ] Deployment do App Store i Google Play

---

## 📖 Dokumentacja dla Deweloperów

### Uruchomienie Lokalne

```bash
# Klonowanie repo
git clone https://github.com/mixxson/kidcode2.git
cd kidcode2/kidcode

# Backend setup
cd backend
cp .env.example .env
# Edytuj .env (ustaw JWT_SECRET)
npm install
npm run dev

# Frontend setup (w nowym terminalu)
cd ../frontend
npm install
npm run dev
```

### Struktura Projektu (docelowa)

```
kidcode/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── roomsController.js
│   │   │   ├── lessonsController.js
│   │   │   └── usersController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   └── Room.js
│   │   ├── routes/
│   │   │   └── api.js
│   │   ├── sockets/
│   │   │   ├── index.js
│   │   │   └── handlers/
│   │   │       ├── codeSync.js
│   │   │       └── chat.js
│   │   ├── services/
│   │   │   └── codeRunner.js
│   │   ├── data/
│   │   │   ├── users.json
│   │   │   ├── rooms.json
│   │   │   └── lessons.json
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeEditor.jsx
│   │   │   ├── OutputPanel.jsx
│   │   │   ├── Chat.jsx
│   │   │   └── Layout/
│   │   │       ├── Navbar.jsx
│   │   │       └── Sidebar.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CodeRoom.jsx
│   │   │   ├── RoomsList.jsx
│   │   │   └── TeacherDashboard.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── socketService.js
│   │   │   ├── jsExecutor.js
│   │   │   └── pythonExecutor.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── theme.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
├── README.md
├── ROADMAP.md
└── run-all.sh
```

---

## 🤝 Contributing

1. Fork repo
2. Stwórz branch: `git checkout -b feature/nazwa-funkcji`
3. Commit: `git commit -m 'feat: dodanie nowej funkcji'`
4. Push: `git push origin feature/nazwa-funkcji`
5. Otwórz Pull Request

### Konwencje Commitów
- `feat:` – nowa funkcjonalność
- `fix:` – naprawa błędu
- `docs:` – aktualizacja dokumentacji
- `style:` – formatowanie kodu (bez zmian logicznych)
- `refactor:` – refaktoryzacja kodu
- `test:` – dodanie testów
- `chore:` – zmiany w build tools, dependencje

---

## 📞 Kontakt i Wsparcie

- **GitHub Issues:** https://github.com/mixxson/kidcode2/issues
- **Email:** support@kidcode.example (przykład)

---

## 📝 Licencja

MIT License (lub inna – do ustalenia)

---

## 🎨 Design Mockups (TODO)

- [ ] Stworzyć mockupy w Figma
- [ ] Landing page
- [ ] Dashboard (teacher/student)
- [ ] Code Room UI

---

**Ostatnia aktualizacja:** 26 listopada 2025  
**Autor roadmapu:** GitHub Copilot + Zespół KidCode

---

## 🎉 Aktualne osiągnięcia (26 listopada 2025)

### Milestone 2 - UKOŃCZONE! 🚀

Platforma KidCode ma teraz w pełni funkcjonalną synchronizację w czasie rzeczywistym:

✅ **Real-time Collaboration**
- Nauczyciel i uczeń mogą jednocześnie edytować kod w tym samym pokoju
- Synchronizacja z debouncing (500ms) zapobiega przeciążeniu sieci
- Backend queue dla zapisów do pliku (1s) - instant broadcast, delayed persistence
- Stabilne połączenie dzięki zwiększonym bufferom i timeout'om Socket.IO

✅ **Code Execution**
- JavaScript: Web Worker sandbox z console.log capture
- Python: Pyodide (WASM) z stdout/stderr redirect
- Output panel z error handling dla obu języków

✅ **User Experience**
- SyncStatus component - naturalny indicator "Synchronizacja..."
- Editor zawsze dostępny (brak read-only mode)
- Smooth UI bez irytujących powiadomień o połączeniu
- Auto-reconnect w tle bez przerywania pracy

✅ **Teacher Tools**
- Student dropdown w RoomCreate
- Auto-generowane nazwy pokoi
- Lista pokoi z filtrowaniem po roli

**Następny krok:** Milestone 5 - Testing & Stabilization lub Milestone 6 - Deployment & DevOps

---

## 🎉 Milestone 4 - UKOŃCZONE! 📊 (26 listopada 2025)

### Zrealizowane funkcje Teacher Dashboard:

✅ **Dashboard Layout**
- Modern TeacherDashboard.jsx z Chakra UI components
- 4 Statistics Cards: Total Rooms, Active Sessions, Students, Lessons
- Responsive grid layout (1/2/4 columns based on screen size)
- Skeleton loading states dla lepszego UX

✅ **Active Rooms Management**
- Table z wszystkimi pokojami nauczyciela
- Kolumny: Nazwa, Uczeń, Język, Status, Akcje
- Badge indicators dla języka (Python/JavaScript)
- Status badges (Aktywny/Nieaktywny)
- Quick "Otwórz" button do przejścia do pokoju

✅ **Students Overview**
- SimpleGrid z student cards
- Display email i ID ucznia
- Role badge (Uczeń)
- Empty state gdy brak uczniów

✅ **Navigation & UX**
- Dashboard link w Navbar (desktop + mobile)
- Visible tylko dla teachers i admins
- Auto-redirect z Home page dla teachers
- Quick action button: "+ Nowy Pokój"

**Rezultat:** Nauczyciele mają teraz centralny dashboard do zarządzania pokojami i monitorowania uczniów! 🚀

---

## 🎉 Milestone 3 - UKOŃCZONE! 🎨 (26 listopada 2025)

### Zrealizowane funkcje UI/UX:

✅ **Modern Navigation**
- Nowy Navbar component z gradient logo, sticky positioning
- User dropdown menu z wyświetlaniem roli (Admin/Nauczyciel/Uczeń)
- Responsive mobile menu (hamburger) z pełną funkcjonalnością
- Active link highlighting

✅ **Layout System**
- Layout wrapper z Container i fullWidth mode
- Consistent spacing i padding
- Chakra UI integration w całej aplikacji

✅ **Animations & Transitions**
- PageTransition component z framer-motion
- Smooth fade-in/fade-out przy zmianie stron
- Subtle translateY animations

✅ **Toast Notifications**
- Chakra UI Toaster setup
- Success notifications w Login/Register
- Error handling z user-friendly messages
- Top-right placement z auto-dismiss

✅ **Responsive Design**
- CodeRoom: Desktop split-screen 60/40
- CodeRoom: Mobile tabs (Edytor/Wynik)
- Adaptive button sizes (xs/sm/md)
- Breakpoints: base (mobile), md (tablet), lg (desktop)

**Rezultat:** Platforma ma teraz nowoczesny, profesjonalny wygląd z płynną nawigacją i responsywnym interfejsem! 🚀
