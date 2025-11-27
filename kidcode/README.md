# KidCode 🚀

**Platforma edukacyjna do nauki programowania dla dzieci**

Kompleksowy system składający się z backendu (Node.js + Express), aplikacji webowej (React + Vite) oraz aplikacji mobilnej (React Native + Expo).

---

## 📱 Dostępne platformy

- **🌐 Web App** - aplikacja webowa (desktop)
- **📱 Mobile App** - aplikacja mobilna (iOS/Android)
- **🖥️ Backend API** - wspólny backend dla obu platform

---

## 🎯 Funkcje

### Dla uczniów (Students)
- 📚 Interaktywne lekcje programowania (JavaScript, Python)
- 💻 Edytor kodu z uruchamianiem w przeglądarce
- 📊 Śledzenie postępów (nowe/w trakcie/ukończone)
- 🚪 Pokoje współpracy z innymi uczniami
- 👤 Profil z statystykami

### Dla nauczycieli (Teachers)
- ✏️ Tworzenie i edycja lekcji
- 🚪 Zarządzanie pokojami współpracy
- 👥 Monitorowanie postępów uczniów
- 📊 Dashboard nauczyciela

### Dla administratorów (Admins)
- 👑 Pełny dostęp do systemu
- 👥 Zarządzanie użytkownikami i rolami
- 🔧 Konfiguracja systemu

---

## 🚀 Szybki start

### Wymagania
- **Node.js** 18+ i npm
- **Git**
- Dla mobile: **Expo Go** na telefonie

### 1️⃣ Instalacja

```bash
# Sklonuj repozytorium
git clone https://github.com/mixxson/kidcode2.git
cd kidcode2/kidcode

# Zainstaluj zależności dla wszystkich projektów
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd kidcode-mobile && npm install && cd ..
```

### 2️⃣ Konfiguracja

#### Backend (.env)
Utwórz plik `backend/.env` na podstawie `backend/.env.example`:

```env
JWT_SECRET=twoj_super_tajny_sekret_jwt
ADMIN_KEY=admin123
PORT=4000
```

#### Mobile (config.js)
Edytuj `kidcode-mobile/src/config.js` i zmień IP na swoje:

```javascript
export const Config = {
  API_URL: 'http://192.168.0.48:4000/api',  // ← ZMIEŃ NA SWOJE IP!
  // ...
};
```

### 3️⃣ Uruchomienie

#### Opcja A: Wszystko naraz (Linux/Mac)

```bash
# Nadaj uprawnienia i uruchom
chmod +x run-all.sh
./run-all.sh
```

Skrypt uruchomi:
- ✅ Backend na porcie **4000**
- ✅ Frontend na porcie **5173**

#### Opcja B: Ręcznie

**Backend:**
```bash
cd backend
npm run dev
# Server running on http://localhost:4000
```

**Frontend Web:**
```bash
cd frontend
npm run dev
# Web app on http://localhost:5173
```

**Mobile App:**
```bash
cd kidcode-mobile
npm start
# Zeskanuj QR code w Expo Go
```

---

## 📂 Struktura projektu

```
kidcode/
├── backend/                 # 🖥️ Backend API (Node.js + Express)
│   ├── src/
│   │   ├── server.js           # Entry point
│   │   ├── controllers/        # Logika biznesowa
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Auth middleware
│   │   ├── sockets/            # Socket.IO (real-time)
│   │   └── data/               # JSON database (users, lessons, rooms, progress)
│   ├── .env.example            # Przykład konfiguracji
│   └── package.json
│
├── frontend/                # 🌐 Web App (React + Vite)
│   ├── src/
│   │   ├── App.jsx             # Main component
│   │   ├── pages/              # Ekrany (Home, Lessons, Editor, etc.)
│   │   ├── components/         # Komponenty wielokrotnego użytku
│   │   ├── services/           # API client, executors
│   │   ├── context/            # React Context (Socket)
│   │   └── styles/             # CSS
│   └── package.json
│
├── kidcode-mobile/          # 📱 Mobile App (React Native + Expo)
│   ├── src/
│   │   ├── screens/            # Ekrany mobilne (8 screens)
│   │   ├── navigation/         # React Navigation
│   │   ├── context/            # Auth context
│   │   ├── services/           # API integration
│   │   └── config.js           # 🔧 API URL (ZMIEŃ IP!)
│   ├── App.js
│   ├── QUICKSTART.md           # Przewodnik mobile
│   ├── SETUP_IP.md             # Konfiguracja IP
│   ├── TESTING.md              # Checklist testowania
│   └── STATUS.md               # Status implementacji
│
├── docs/                    # 📖 Dokumentacja
│   ├── architecture.md         # Architektura systemu
│   ├── install.md              # Instalacja szczegółowa
│   └── progress-tracking.md    # System postępów
│
├── docker/                  # 🐳 Docker setup
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
│
├── run-all.sh               # 🚀 Skrypt uruchamiający (Linux/Mac)
├── run-all.bat              # 🚀 Skrypt uruchamiający (Windows)
├── run-all.ps1              # 🚀 Skrypt uruchamiający (PowerShell)
├── QUICKSTART.md            # Szybki start
├── ROADMAP.md               # Plan rozwoju
└── README.md                # Ten plik
```

---

## 🔐 Autentykacja i role (JWT)

System wspiera 3 role użytkowników:

### Role
- **👨‍🎓 Student** - dostęp do lekcji, pokojów, śledzenie postępów
- **👨‍🏫 Teacher** - wszystko co student + tworzenie lekcji, zarządzanie pokojami
- **👑 Admin** - pełny dostęp + zarządzanie użytkownikami

### API Endpoints

#### Rejestracja
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456",
  "role": "student",
  "adminKey": "admin123"
}
```

**Uwagi:**
- Pierwszy użytkownik automatycznie zostaje **admin**
- Dla `teacher`/`admin` wymagany `ADMIN_KEY` z `.env`
- Domyślna rola: `student`

#### Logowanie
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456"
}
```

**Odpowiedź:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "student",
    "isAdmin": false
  }
}
```

#### Dane użytkownika
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Zmiana roli (admin)
```http
PUT /api/auth/role
Authorization: Bearer <token>

{
  "userId": 2,
  "role": "teacher"
}
```

### Zabezpieczenia tras

**Publiczne:**
- `GET /api/lessons` - lista lekcji
- `GET /api/lessons/:id` - szczegóły
- `POST /api/auth/*` - auth endpoints

**Wymagana autoryzacja:**
- `GET /api/auth/me`
- `GET /api/progress/*`
- `POST /api/progress/*`

**Tylko Teacher/Admin:**
- `POST /api/lessons`
- `PUT /api/lessons/:id`
- `DELETE /api/lessons/:id`
- `POST /api/rooms`

**Tylko Admin:**
- `PUT /api/auth/role`
- `DELETE /api/users/:id`

---

## 🌐 Frontend Web (React + Vite)

### Uruchomienie
```bash
cd frontend
npm install
npm run dev
```

**Dostępne:** http://localhost:5173

### Funkcje
- ✅ Autentykacja z wyborem roli
- ✅ Dashboard z statystykami
- ✅ Lista lekcji z filtrowaniem
- ✅ Monaco Editor (jak VS Code)
- ✅ Uruchamianie JavaScript i Python (Pyodide)
- ✅ Pokoje współpracy (Socket.IO)
- ✅ Real-time synchronizacja kodu
- ✅ Panel nauczyciela
- ✅ System postępów

### Technologie
- React 18, Vite, Chakra UI v3
- Monaco Editor, Pyodide
- Socket.IO Client, Axios
- React Router

---

## 📱 Mobile App (React Native + Expo)

### Uruchomienie
```bash
cd kidcode-mobile
npm install
npm start
```

**Zeskanuj QR** w Expo Go lub naciśnij `a`/`i`

### Funkcje
- ✅ Autentykacja (login/register)
- ✅ Dashboard z statystykami
- ✅ Lista lekcji z filtrami
- ✅ Szczegóły lekcji (WebView)
- ✅ Edytor JavaScript
- ✅ Pokoje i CodeRoom
- ✅ Profil użytkownika
- ✅ Progress tracking
- ⚠️ Python - nie działa (wymaga backend)
- ⚠️ Real-time sync - przygotowane

### Technologie
- React Native 0.81, Expo ~54
- React Navigation v7
- AsyncStorage, Axios, WebView

### Dokumentacja
- [Mobile README](./kidcode-mobile/README.md)
- [QUICKSTART](./kidcode-mobile/QUICKSTART.md)
- [SETUP_IP](./kidcode-mobile/SETUP_IP.md)
- [TESTING](./kidcode-mobile/TESTING.md)

---

## 🖥️ Backend API

### Uruchomienie
```bash
cd backend
npm run dev
```

**Dostępne:** http://localhost:4000

### Endpointy

**Auth** (`/api/auth`):
- POST `/register`, `/login`
- GET `/me`
- PUT `/role` (admin)

**Lessons** (`/api/lessons`):
- GET `/`, `/:id`
- POST `/` (teacher/admin)
- PUT `/:id`, DELETE `/:id`

**Progress** (`/api/progress`):
- GET `/`, `/lesson/:id`, `/statistics`
- POST `/lesson/:id`

**Rooms** (`/api/rooms`):
- GET `/`, `/:id`
- POST `/`, PUT `/:id`, DELETE `/:id`

**Users** (`/api/users` - admin):
- GET `/`, `/:id`
- DELETE `/:id`

### WebSocket
- Port: 4000
- Events: `join-room`, `code-change`, `cursor-change`

### Baza danych
JSON files: `users.json`, `lessons.json`, `rooms.json`, `progress.json`

---

## 🐳 Docker

```bash
cd docker
docker-compose up
```

---

## 🧪 Testowanie

### Konta testowe

**Admin:**
```json
{"email": "admin@kidcode.com", "password": "admin123"}
```

**Teacher:**
```json
{"email": "teacher@kidcode.com", "password": "teacher123", "role": "teacher", "adminKey": "admin123"}
```

**Student:**
```json
{"email": "student@kidcode.com", "password": "student123"}
```

### API Test
```bash
# Health
curl http://localhost:4000/api/health

# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

---

## 🔧 Konfiguracja

### Backend `.env`
```env
JWT_SECRET=super_tajny_sekret_jwt_2025
ADMIN_KEY=admin123
PORT=4000
```

### Mobile `config.js`
```javascript
export const Config = {
  API_URL: 'http://192.168.0.48:4000/api',
  WS_URL: 'ws://192.168.0.48:4000',
  API_TIMEOUT: 10000,
};
```

---

## 📊 Status

✅ **Gotowe (95%)**
- Backend API z auth i rolami
- Web app - pełna funkcjonalność
- Mobile app - 90% funkcji
- System postępów
- Real-time (web)
- Dokumentacja

🚧 **W trakcie (5%)**
- Real-time sync w mobile
- Python w mobile
- Push notifications
- Prawdziwa baza danych

---

## 📚 Dokumentacja

- [QUICKSTART.md](./QUICKSTART.md)
- [ROADMAP.md](./ROADMAP.md)
- [docs/architecture.md](./docs/architecture.md)
- [Mobile README](./kidcode-mobile/README.md)

---

## 🎯 Szybkie linki

**Web:**
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

**Mobile:**
- [Mobile README](./kidcode-mobile/README.md)
- [QUICKSTART](./kidcode-mobile/QUICKSTART.md)

---

**Powodzenia w nauce! 🚀**
