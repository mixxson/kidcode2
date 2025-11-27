# System Śledzenia Postępów

## Opis
System śledzenia postępów pozwala każdemu użytkownikowi zapisywać status ukończenia każdej lekcji. Sprawia to, że nauka jest bardziej interaktywna i motywująca.

## Statusy lekcji
- **🆕 Nowa (new)** - lekcja jeszcze nie rozpoczęta
- **⏳ W trakcie (in-progress)** - lekcja rozpoczęta, ale nie ukończona
- **✅ Zakończona (completed)** - lekcja całkowicie ukończona

## Funkcjonalność

### Backend API
**Endpointy:**
- `GET /api/progress` - pobrać cały postęp użytkownika
- `GET /api/progress/statistics` - pobrać statystyki (liczba nowych/w trakcie/ukończonych)
- `GET /api/progress/:lessonId` - pobrać postęp konkretnej lekcji
- `PUT /api/progress/:lessonId` - zaktualizować status lekcji (body: `{status: "new"|"in-progress"|"completed"}`)

**Automatyczne znaczniki czasu:**
- `startedAt` - ustawiany przy pierwszym przejściu do statusu "in-progress"
- `completedAt` - ustawiany przy przejściu do statusu "completed"
- `updatedAt` - aktualizowany przy każdej zmianie

**Przechowywanie:**
- Plik: `/backend/src/data/progress.json`
- Struktura: tablica obiektów `{userId, lessonId, status, startedAt, completedAt, createdAt, updatedAt}`

### Frontend

#### Страница Lessons (`/lessons`)
- **Вкладки фильтрации:**
  - 📚 Wszystkie - все лекции
  - 🆕 Nowe - только новые
  - ⏳ W trakcie - лекции в процессе
  - ✅ Zakończone - завершённые лекции

- **Бейджи статусов** на каждой карточке лекции
- **Динамические кнопки:**
  - "Rozpocznij →" для новых лекций
  - "Kontynuuj →" для начатых
  - "Powtórz" для завершённых

#### Strona Lesson (`/lessons/:id`)
- **Znacznik statusu** w nagłówku
- **Automatyczna aktualizacja:**
  - Przy naciśnięciu "Rozpocznij kodowanie" status zmienia się na "in-progress"
- **Przycisk "Oznacz jako zakończoną"** do ręcznego ukończenia
- **Wskaźnik ukończenia:** "🎉 Lekcja ukończona!" dla ukończonych

#### Strona główna (`/`)
**Dla studentów dodana statystyka:**
```
📚 Wszystkich lekcji: X
🆕 Nowych: X
⏳ W trakcie: X
✅ Ukończonych: X
```

## Użytkowanie

### Dla użytkownika:
1. Przejść na stronę `/lessons`
2. Wybrać lekcję i nacisnąć "Rozpocznij"
3. Status automatycznie zmieni się na "W trakcie"
4. Po ukończeniu nacisnąć "Oznacz jako zakończoną"
5. Używać zakładek do filtrowania lekcji według statusu

### Dla programisty:
```javascript
import { progressAPI } from '../services/api'

// Pobrać postęp użytkownika
const res = await progressAPI.getUserProgress()
const progress = res.data.progress

// Zaktualizować status lekcji
await progressAPI.updateLessonProgress(lessonId, 'completed')

// Pobrać statystyki
const statsRes = await progressAPI.getStatistics()
const stats = statsRes.data.statistics // {total, new, inProgress, completed}
```

## Szczegóły techniczne

### Wymagania:
- Użytkownik musi być zalogowany (JWT token w localStorage)
- Middleware `auth.verifyToken` sprawdza token na wszystkich endpointach

### Walidacja:
- Status musi być jednym z: `"new"`, `"in-progress"`, `"completed"`
- Przy nieprawidłowym statusie API zwróci 400 Bad Request

### Bezpieczeństwo:
- Każdy użytkownik widzi tylko swój postęp
- userId jest pobierane z tokena JWT (req.user.id)
- Niemożliwe jest zmienienie postępu innego użytkownika

## Przyszłe ulepszenia:
- [ ] Procent ukończenia każdej lekcji
- [ ] Timer czasu spędzonego na lekcji
- [ ] Osiągnięcia i nagrody
- [ ] Wykres postępów po tygodniach/miesiącach
- [ ] Eksport statystyk
