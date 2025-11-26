# ✅ Checklist testowania - KidCode Mobile

Użyj tej listy aby przetestować wszystkie funkcje aplikacji przed deploymentem.

## 📝 Przed rozpoczęciem

- [ ] Backend uruchomiony: `cd backend && npm run dev`
- [ ] IP skonfigurowane w `src/config.js`
- [ ] Mobile app uruchomiona: `cd kidcode-mobile && npm start`
- [ ] Telefon/emulator połączony i app załadowana

## 🔐 Autoryzacja

### Rejestracja
- [ ] Otwórz ekran Register
- [ ] Wprowadź email: `test@test.com`
- [ ] Wprowadź hasło: `test123`
- [ ] Wybierz rolę: Student
- [ ] Kliknij "Zarejestruj"
- [ ] ✅ Powinno przekierować do Home

### Test ról
- [ ] Wyloguj się
- [ ] Zarejestruj jako Teacher z admin key: `admin123`
- [ ] ✅ Powinno zadziałać
- [ ] Sprawdź czy widzisz dodatkowe opcje (Create room, Edit lesson)

### Logowanie
- [ ] Wyloguj się
- [ ] Wprowadź email i hasło
- [ ] Kliknij "Zaloguj"
- [ ] ✅ Powinno przekierować do Home

### Persystencja sesji
- [ ] Zamknij aplikację (force close)
- [ ] Otwórz ponownie
- [ ] ✅ Powinno automatycznie zalogować (token z AsyncStorage)

## 🏠 Strona główna

### Podstawowe elementy
- [ ] Widoczne powitanie: "Witaj, [email]!"
- [ ] 4 karty statystyk (Wszystkie/Nowe/W trakcie/Ukończone)
- [ ] Sekcja "Pokoje współpracy" z licznikiem
- [ ] Lista ostatnich 5 lekcji
- [ ] Przycisk "Zobacz wszystkie lekcje"

### Interakcje
- [ ] Kliknij "Zobacz pokoje" → przekierowuje do Rooms
- [ ] Kliknij na lekcję → przekierowuje do LessonDetail
- [ ] Kliknij "Zobacz wszystkie lekcje" → przekierowuje do Lessons
- [ ] Przeciągnij w dół (pull-to-refresh) → odświeża dane

## 📚 Lekcje

### Lista lekcji
- [ ] Widoczne wszystkie lekcje z backendu
- [ ] 4 tabs: Wszystkie / Nowe / W trakcie / Ukończone
- [ ] Każda lekcja ma: tytuł, difficulty, język, czas
- [ ] Status badge (🆕 Nowa / ⏳ W trakcie / ✅ Zakończona)

### Filtry
- [ ] Kliknij "Nowe" → pokazuje tylko nowe lekcje
- [ ] Kliknij "W trakcie" → pokazuje tylko w trakcie
- [ ] Kliknij "Ukończone" → pokazuje tylko ukończone
- [ ] Liczby w tabs się zgadzają ze statystykami

### Interakcje
- [ ] Kliknij na lekcję → przekierowuje do LessonDetail
- [ ] Przeciągnij w dół → odświeża listę

## 📖 Szczegóły lekcji

### Wyświetlanie
- [ ] Tytuł lekcji
- [ ] Status badge (Nowa/W trakcie/Zakończona)
- [ ] Difficulty badge (kolor odpowiada poziomowi)
- [ ] Czas trwania i język
- [ ] Treść HTML wyświetla się poprawnie (WebView)
- [ ] Headings, listy, code blocks formatowane

### Przyciski
- [ ] Dla nowej lekcji: "💻 Rozpocznij kodowanie"
- [ ] Dla rozpoczętej: "💻 Kontynuuj kodowanie"
- [ ] Przycisk "✅ Oznacz jako zakończoną" (jeśli nie completed)
- [ ] Dla ukończonej: badge "🎉 Lekcja ukończona!"

### Akcje
- [ ] Kliknij "Rozpocznij kodowanie" → przekierowuje do Editor
- [ ] Kliknij "Oznacz jako zakończoną" → zmienia status
- [ ] ✅ Alert: "🎉 Gratulacje! Lekcja oznaczona jako zakończona!"
- [ ] Status się zmienia na "✅ Zakończona"

### Admin/Teacher
- [ ] Zaloguj jako Teacher
- [ ] Widoczne przyciski: "✏️ Edytuj lekcję" i "🗑️ Usuń"
- [ ] Kliknij "Usuń" → pojawia się alert potwierdzający
- [ ] (Nie usuwaj faktycznie lekcji w teście!)

## 💻 Edytor kodu

### Wyświetlanie
- [ ] Tytuł lekcji w headerze
- [ ] Badge języka (💻 JavaScript / 🐍 Python)
- [ ] Edytor z starter code
- [ ] Panel wyników (czarne tło)
- [ ] Przyciski: "▶️ Uruchom" i "🔄 Reset"
- [ ] Przycisk "✅ Zakończ lekcję"

### JavaScript - Testy
Test 1: Console.log
```javascript
console.log('Hello, World!')
```
- [ ] Kliknij "Uruchom"
- [ ] ✅ Wynik: "Hello, World!"

Test 2: Zmienne
```javascript
const name = 'Anna'
const age = 10
console.log(name + ' ma ' + age + ' lat')
```
- [ ] ✅ Wynik: "Anna ma 10 lat"

Test 3: Pętla
```javascript
for (let i = 1; i <= 5; i++) {
  console.log('Krok ' + i)
}
```
- [ ] ✅ Wynik: 5 linii "Krok 1" ... "Krok 5"

Test 4: Błąd składniowy
```javascript
console.log('test'
```
- [ ] ✅ Wynik: "❌ Błąd wykonania: ..."

### Python
- [ ] Wybierz lekcję Python
- [ ] Kliknij "Uruchom"
- [ ] ✅ Wynik: "⚠️ Python nie jest jeszcze obsługiwany w wersji mobilnej..."

### Akcje
- [ ] Kliknij "🔄 Reset" → pojawia się alert
- [ ] Potwierdź → kod wraca do starter code
- [ ] Kliknij "✅ Zakończ lekcję" → pojawia się alert
- [ ] ✅ "🎉 Gratulacje! Lekcja oznaczona jako zakończona!"
- [ ] Wraca do LessonDetail

### Progress tracking
- [ ] Rozpocznij nową lekcję → status zmienia się na "W trakcie"
- [ ] Oznacz jako ukończoną → status zmienia się na "Zakończona"
- [ ] Sprawdź Home → statystyki się aktualizują

## 🚪 Pokoje

### Lista pokoi
- [ ] Widoczne wszystkie pokoje z backendu
- [ ] Każdy pokój ma: nazwę, twórcę, liczbę uczestników
- [ ] Zielona kropka przy aktywnych pokojach
- [ ] Język pokoju (🐍 Python / 📜 JavaScript)

### Puste pokoje
- [ ] Jeśli brak pokoi → "🔍 Brak dostępnych pokoi"
- [ ] Dla studenta: "Poczekaj aż nauczyciel utworzy pokój"
- [ ] Dla teachera: "Utwórz pierwszy pokój..."

### Student
- [ ] Kliknij na pokój → alert "Dołącz do pokoju?"
- [ ] Potwierdź → (obecnie placeholder, CodeRoom nie zaimplementowany)

### Teacher/Admin
- [ ] Widoczny przycisk "➕ Utwórz nowy pokój"
- [ ] Kliknij → alert "Funkcja w przygotowaniu"

### Odświeżanie
- [ ] Przeciągnij w dół → odświeża listę pokoi

## 👤 Profil

### Wyświetlanie
- [ ] Avatar (pierwsza litera email)
- [ ] Email użytkownika
- [ ] Badge roli:
  - Student: 👨‍🎓 Uczeń (niebieski)
  - Teacher: 👨‍🏫 Nauczyciel (zielony)
  - Admin: 👑 Administrator (żółty)

### Statystyki
- [ ] 4 karty:
  - Wszystkie lekcje
  - W trakcie
  - Ukończonych
  - Procent postępu
- [ ] Liczby się zgadzają ze stanem w bazie

### Ustawienia
- [ ] ℹ️ O aplikacji → alert z info o wersji
- [ ] 🌙 Tryb ciemny → alert "Wkrótce"
- [ ] 🔔 Powiadomienia → alert "Wkrótce"
- [ ] 🌐 Język → alert "Wkrótce"
- [ ] 🔐 Zmień hasło → alert "Wkrótce"

### Wylogowanie
- [ ] Kliknij "🚪 Wyloguj się"
- [ ] Alert: "Wylogować się?"
- [ ] Potwierdź → przekierowuje do Login
- [ ] AsyncStorage wyczyszczony (token usunięty)

## 🧭 Nawigacja

### Bottom tabs
- [ ] 4 tabs widoczne: Home, Lekcje, Pokoje, Profil
- [ ] Emoji icons: 🏠 📚 🚪 👤
- [ ] Aktywny tab w kolorze fioletowym (#667eea)
- [ ] Kliknięcie zmienia ekran

### Stack navigation
- [ ] Z Home → LessonDetail → Back działa
- [ ] Z Lessons → LessonDetail → Editor → Back x2 działa
- [ ] Header z tytłem ekranu
- [ ] Przycisk "←" w headerze

### Deep linking (opcjonalne)
- [ ] Nawigacja działa z URL (jeśli skonfigurowane)

## 📱 UX/UI

### Responsywność
- [ ] Wszystkie ekrany wyglądają dobrze na telefonie
- [ ] Tekst czytelny (nie za mały)
- [ ] Przyciski łatwe do kliknięcia (min 44x44)
- [ ] Scrollowanie płynne

### Loading states
- [ ] Podczas ładowania danych → spinner
- [ ] Podczas uruchamiania kodu → "⏳ Uruchamianie..."
- [ ] Nie można kliknąć przycisku podczas loading

### Error handling
- [ ] Błąd sieci → alert z sensownym komunikatem
- [ ] Błąd 404 → "Nie znaleziono"
- [ ] Błąd 401 → wymusza logout (opcjonalne)

### Pull-to-refresh
- [ ] Home, Lessons, Rooms, LessonDetail - wszystkie mają PTR
- [ ] Odświeżanie działa
- [ ] Spinner podczas refresh

## 🐛 Bugi do sprawdzenia

- [ ] App nie crashuje przy szybkim klikaniu
- [ ] Keyboard nie zasłania inputów (KeyboardAvoidingView działa)
- [ ] WebView ładuje treść (nie puste białe pole)
- [ ] Status badges pokazują właściwe kolory
- [ ] Procent postępu poprawnie liczony

## 🎉 Finał

Po przejściu całej listy:
- [ ] Wszystkie podstawowe funkcje działają
- [ ] Nie ma crashów
- [ ] UX jest przyjemne
- [ ] Gotowe do prezentacji/deploymentu

---

## 📊 Wynik testu

**Data**: _____________

**Tester**: _____________

**Device**: _____________

**Wyniku**: _____ / 100 ✅

**Notatki**:
```
_______________________________
_______________________________
_______________________________
```

**Bugi znalezione**:
1. _______________________________
2. _______________________________
3. _______________________________

**Priorytet fixów**:
- 🔴 High: _______________________________
- 🟡 Medium: _______________________________
- 🟢 Low: _______________________________
