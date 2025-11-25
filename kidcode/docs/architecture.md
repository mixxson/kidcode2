# Architektura (PL)

Projekt jest podzielony na dwie główne części:

- `backend/` — API napisane w Node.js + Express. Dostarcza dane lekcji i punktów API do integracji z frontendem.
- `frontend/` — aplikacja React (Vite). Interfejs użytkownika dla dzieci: lista lekcji, proste interakcje i ćwiczenia.

Dalsze kierunki rozwoju:
- Dodanie bazy danych (SQLite/Postgres) i modelu użytkownika.
- System uwierzytelniania (np. JWT) i profile uczniów.
- Interaktywne zadania z edytorem kodu i automatyczną walidacją.
- Poziomy trudności i nagrody (gamifikacja).
