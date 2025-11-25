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
- **SocketContext:** React Context z auto-reconnect, debouncing (100ms), ConnectionStatus component.
- **Chakra UI v3:** Zainstalowano i skonfigurowano `ChakraProvider` z `defaultSystem`.
- **Monaco Editor:** Dodano `@monaco-editor/react`, utworzono `CodeRoom.jsx` z real-time sync kodu.
- **JavaScript Execution:** Web Worker sandbox z timeout, console.log capture, error handling.
- **Python Execution:** Pyodide (CDN) z stdout/stderr capture, async execution.
- **Editor.jsx:** Universal editor z auto-save, language detection, progress persistence.
- **Lessons System:** Enhanced lessons page z filters, difficulty badges, language indicators.
- **RoomsList:** Strona listy pokoi z filtrowaniem według roli (teacher/student), przycisk tworzenia dla nauczycieli.
- **RoomCreate:** Strona tworzenia pokoju z wyborem ucznia, języka i nazwy (dla teachers/admins).
- **Navigation:** Dodano link "Pokoje" w navbar dla zalogowanych użytkowników.
- **Auth Fix:** Login/Register teraz przeładowują stronę (`window.location.href`) aby odświeżyć stan użytkownika.
- **Admin Guard:** Strona Admin sprawdza localStorage przed renderowaniem, obsługuje language field.
- **Student UI:** Cleaned up Home page - hide admin actions from students, role-based UI.
- **README:** Zaktualizowano z instrukcjami JWT i .env; skrypt `run-all.sh` dla Linux.

### 🔧 W trakcie
- Brak - wszystkie zadania z Milestone 2 zakończone!

### 📋 Następne kroki
1. ✅ ~~Dodać Context dla Socket + reconnect/error handling~~ — ZROBIONE
2. ✅ ~~Implementować JS Executor (Web Worker sandbox)~~ — ZROBIONE
3. ✅ ~~Dodać Pyodide dla Python execution~~ — ZROBIONE
4. ✅ ~~Output Panel z przyciskiem Run~~ — ZROBIONE
5. ✅ ~~Stworzyć stronę RoomCreate dla nauczycieli~~ — ZROBIONE
6. ✅ ~~Debouncing dla synchronizacji kodu~~ — ZROBIONE
7. Dashboard dla nauczycieli (monitoring aktywnych sesji).
8. Collaborative cursors w Monaco Editor.
9. UI/UX improvements (Milestone 3).
10. Teacher dashboard (Milestone 4).

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

#### 1.2 System Pokoi (Rooms)
- [ ] **Backend: Rooms Management**
  - [ ] Stworzyć `backend/src/models/Room.js` – model pokoju
  - [x] Stworzyć `backend/src/controllers/roomsController.js`
  - [x] API endpoints:
    - [x] `POST /api/rooms` – utworzenie pokoju przez nauczyciela
    - [x] `GET /api/rooms` – lista pokoi (filtrowane według roli)
    - [x] `GET /api/rooms/:id` – szczegóły pokoju
    - [x] `POST /api/rooms/:id/join` – dołączenie do pokoju
    - [x] `DELETE /api/rooms/:id` – usunięcie pokoju
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

- [ ] **Frontend: Rooms UI**
  - [x] Stworzyć `frontend/src/pages/RoomsList.jsx`
  - [ ] Stworzyć `frontend/src/pages/RoomCreate.jsx` (tylko dla nauczycieli)
  - [ ] Stworzyć `frontend/src/components/RoomCard.jsx`
  - [x] Routing: `/rooms`, `/rooms/:id`

#### 1.3 Synchronizacja Kodu
- [ ] **Backend: Code Sync Logic**
  - [ ] Stworzyć `backend/src/sockets/handlers/codeSync.js`
  - Socket events (stan):
    - [x] `code:update` – zmiana kodu (emit od klienta)
    - [x] `code:broadcast` – rozesłanie do pokoju (broadcast)
    - [x] `cursor:position` – pozycja kursora użytkownika
    - [ ] `selection:change` – zaznaczenie tekstu
  - [ ] Implementować debouncing (50-100ms) dla zmian kodu
  - [ ] Operational Transform lub CRDT dla conflict resolution (opcjonalnie: biblioteka Yjs)

- [ ] **Frontend: Code Editor Integration**
  - [x] Wybrać edytor: **Monaco Editor** (VSCode)
  - [x] Dodać `@monaco-editor/react`
  - [x] Stworzyć `frontend/src/pages/CodeRoom.jsx` (z edytorem)
  - [x] Bindować zmiany kodu do socket events (`code:update`, `code:remote-update`)
  - [ ] Pokazywać kursory innych użytkowników (collaborative cursors)
  - [x] Syntax highlighting dla Python i JavaScript (Monaco wbudowany)

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

#### 2.2 Python Execution
- [ ] **Wybór rozwiązania:**
  - **Opcja A: Pyodide (WASM w przeglądarce)**
    - Dodać `pyodide` do `frontend/package.json`
    - Stworzyć `frontend/src/services/pythonExecutor.js`
    - Ładować Pyodide runtime przy starcie pokoju
    - Przekierować stdout/stderr do UI
  - **Opcja B: Backend Sandbox (Docker)**
    - Stworzyć `backend/src/services/codeRunner.js`
    - Endpoint: `POST /api/execute`
    - Uruchamiać kod w Docker container (timeout, resource limits)
    - Zwracać output przez WebSocket

- [x] **Frontend: Output Panel**
  - [x] Stworzyć `frontend/src/components/OutputPanel.jsx`
  - [x] Pokazywać stdout, stderr, błędy
  - [x] Czyszczenie outputu przed każdym uruchomieniem
  - [x] Przycisk "Run Code" / "Uruchom Kod" w CodeRoom

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

#### 3.2 Layout i Nawigacja
- [ ] **Global Layout**
  - Stworzyć `frontend/src/components/Layout/Navbar.jsx`
  - Stworzyć `frontend/src/components/Layout/Sidebar.jsx`
  - Logo, menu, user dropdown
  - Responsive design (mobile, tablet, desktop)

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

#### 3.4 Animacje i Feedback
- [ ] Dodać `framer-motion` dla animacji
- [ ] Loading spinners podczas łączenia z pokojem
- [ ] Toast notifications (sukces/błąd)
- [ ] Skeleton screens przy ładowaniu danych
- [ ] Smooth transitions między stronami

#### 3.5 Accessibility (A11y)
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] ARIA labels
- [ ] Contrast ratio zgodny z WCAG 2.1 AA
- [ ] Screen reader support

---

### 📊 **Etap 4: Features dla Nauczycieli**

**Priorytet:** Średni  
**Czas realizacji:** 1-2 tygodnie

#### 4.1 Dashboard Nauczyciela
- [ ] Stworzyć `frontend/src/pages/TeacherDashboard.jsx`
- [ ] Widżety:
  - Lista aktywnych pokoi
  - Lista uczniów (z ostatnią aktywnością)
  - Statystyki: liczba wykonanych lekcji, średni czas

#### 4.2 Zarządzanie Uczniami
- [ ] **Backend:**
  - Endpoint: `GET /api/teacher/students` – lista przypisanych uczniów
  - Endpoint: `POST /api/teacher/invite` – zaproszenie ucznia (email)
  - Model: relacja nauczyciel-uczeń w `teacher_students.json`

- [ ] **Frontend:**
  - Stworzyć `frontend/src/pages/StudentsList.jsx`
  - Możliwość zaproszenia ucznia
  - Podgląd postępów ucznia

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

### 🎁 **Etap 7: Nice-to-Have Features**

**Priorytet:** Niski  
**Czas realizacji:** Rozłożone w czasie

- [ ] **Wersjonowanie kodu:** Historia zmian w pokoju (git-like)
- [ ] **Gamifikacja:** Punkty, odznaki, leaderboard
- [ ] **Multiuser rooms:** Więcej niż 2 osoby w pokoju (dla warsztatów)
- [ ] **Voice chat:** WebRTC dla komunikacji głosowej
- [ ] **Screen sharing:** Nauczyciel pokazuje ekran uczniowi
- [ ] **Code snippets library:** Gotowe przykłady kodu
- [ ] **AI Assistant:** ChatGPT integration dla podpowiedzi (OpenAI API)
- [ ] **Dark mode:** Przełącznik ciemnego motywu
- [ ] **Internationalization (i18n):** Wsparcie wielu języków (polski, angielski, rosyjski)

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
- [x] Real-time sync kodu z debouncing (100ms)
- [x] Socket Context z auto-reconnect
- [x] JavaScript execution (Web Worker sandbox)
- [x] Python execution (Pyodide via CDN)
- [x] Output panel
- [x] Enhanced Editor with language support
- [x] ConnectionStatus component

### Milestone 3 (2 tygodnie)
- 🎨 UI/UX redesign (Chakra/Mantine)
- 🎨 Responsive layout
- 🎨 Animacje i feedback

### Milestone 4 (1 tydzień)
- 📊 Dashboard dla nauczycieli
- 📊 Lista uczniów
- 🧪 Testing

### Milestone 5 (1 tydzień)
- 🚀 Docker Compose
- 🚀 Deployment na VPS
- 🚀 CI/CD pipeline

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

**Ostatnia aktualizacja:** 25 listopada 2025  
**Autor roadmapu:** GitHub Copilot + Zespół KidCode
