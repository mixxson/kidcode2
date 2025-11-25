# KidCode - Szybki start

## 🚀 Uruchomienie

### Backend
```bash
cd backend
cp .env.example .env
# Edytuj .env: ustaw JWT_SECRET i ADMIN_KEY
npm install
npm run dev
```

Backend: http://localhost:4000

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

**Lub użyj skryptu:**
```bash
chmod +x run-all.sh
./run-all.sh
```

---

## 👤 Pierwsze kroki

### 1. Rejestracja pierwszego admina
- Otwórz http://localhost:5173/register
- Wprowadź email i hasło
- **Pierwszy użytkownik automatycznie staje się adminem**
- Zostaniesz zalogowany automatycznie

### 2. Dodanie nauczyciela
Jako admin:
- Zarejestruj nowego użytkownika z kluczem admina (ADMIN_KEY z .env)
- Lub zmień rolę użytkownika przez API:
```bash
curl -X PUT http://localhost:4000/api/auth/role \
  -H "Authorization: Bearer <token_admina>" \
  -H "Content-Type: application/json" \
  -d '{"userId": 2, "role": "teacher"}'
```

### 3. Dodanie ucznia
- Zarejestruj użytkownika bez ADMIN_KEY
- Domyślnie będzie miał rolę `student`

---

## 📚 Funkcje

### Lekcje (Admin/Teacher)
- Przejdź do **Admin** (w menu) → utwórz lekcję
- Edytuj tytuł, poziom, czas, treść i starter code
- Dostęp: tylko admins i teachers

### Pokoje kodowania (Rooms)
1. **Zaloguj się jako teacher/admin**
2. Kliknij **Pokoje** → **+ Nowy pokój**
3. Podaj:
   - Nazwę pokoju (np. "Pokój Ucznia Jan - Lekcja 1")
   - ID ucznia (znajdziesz w `backend/src/data/users.json`)
   - Język (JavaScript lub Python)
4. Kliknij **Utwórz pokój**

### Współpraca w czasie rzeczywistym
1. Teacher i student otwierają ten sam pokój (np. `/rooms/1`)
2. Zmiany kodu synchronizują się automatycznie
3. Badge pokazuje status połączenia (Connected/Disconnected)
4. Przycisk **Uruchom** wykonuje kod:
   - **JavaScript** — działa natychmiast (Web Worker)
   - **Python** — TODO (będzie Pyodide)

---

## 🗂️ Struktura danych

### `backend/src/data/users.json`
```json
[
  {
    "id": 1,
    "email": "admin@example.com",
    "passwordHash": "$2a$08$...",
    "role": "admin",
    "isAdmin": true
  },
  {
    "id": 2,
    "email": "teacher@example.com",
    "passwordHash": "$2a$08$...",
    "role": "teacher",
    "isAdmin": false
  },
  {
    "id": 3,
    "email": "student@example.com",
    "passwordHash": "$2a$08$...",
    "role": "student",
    "isAdmin": false
  }
]
```

### `backend/src/data/rooms.json`
```json
[
  {
    "id": 1,
    "name": "Pokój Ucznia Jan - Lekcja 1",
    "teacherId": 2,
    "studentId": 3,
    "lessonId": null,
    "language": "javascript",
    "code": "console.log('Hello')",
    "createdAt": "2025-11-25T12:00:00Z",
    "active": true
  }
]
```

---

## 🔑 API Endpoints

### Auth
- `POST /api/auth/register` — rejestracja (body: email, password, adminKey?, role?)
- `POST /api/auth/login` — logowanie (body: email, password)
- `GET /api/auth/me` — obecny użytkownik (wymaga tokena)
- `PUT /api/auth/role` — zmiana roli (admin only)

### Rooms
- `GET /api/rooms` — lista pokoi (filtrowane według roli)
- `GET /api/rooms/:id` — szczegóły pokoju
- `POST /api/rooms` — utworzenie pokoju (teacher/admin)
- `POST /api/rooms/:id/join` — dołączenie do pokoju
- `DELETE /api/rooms/:id` — usunięcie pokoju (teacher/admin)

### Lessons
- `GET /api/lessons` — lista lekcji (publiczne)
- `GET /api/lessons/:id` — szczegóły lekcji
- `POST /api/lessons` — utworzenie (teacher/admin)
- `PUT /api/lessons/:id` — edycja (teacher/admin)
- `DELETE /api/lessons/:id` — usunięcie (teacher/admin)

---

## 🐛 Typowe problemy

### Biały ekran po zalogowaniu
- **Rozwiązane:** Login/Register używają `window.location.href = '/'` zamiast `navigate('/')`

### "No token" przy próbie dostępu do pokoi
- Upewnij się, że zalogowałeś się poprawnie
- Sprawdź localStorage w DevTools → `kidcode_token` i `kidcode_user`

### Nie widzę linku "Pokoje"
- Musisz być zalogowany (jako dowolna rola)

### "Brak pokoi"
- Jako teacher/admin, kliknij **+ Nowy pokój**
- Podaj ID ucznia z `users.json`

---

## 📝 TODO (następne kroki)

- [ ] Python execution (Pyodide)
- [ ] Socket Context z reconnect
- [ ] Debouncing dla code sync
- [ ] Collaborative cursors
- [ ] Dashboard dla nauczycieli
- [ ] Lista uczniów dla teacher
- [ ] Chat w pokoju (opcjonalnie)

---

**Autor:** KidCode Team  
**Data:** 25 listopada 2025
