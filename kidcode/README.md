# KidCode — учебная платформа для детей

Backend: Node.js + Express, Frontend: React + Vite.

## Быстрый старт (Linux)

1. Установите Node.js 18+ и npm.
2. Запустите скрипт в корне папки `kidcode`:
   - Сделайте исполняемым и запустите:
     ```bash
     chmod +x run-all.sh
     ./run-all.sh
     ```
   Скрипт поставит зависимости и поднимет backend (по умолчанию на 4000) и frontend (Vite, на 5173).

Альтернативно вручную:
- Backend: `cd backend && npm install && npm run dev`
- Frontend: `cd frontend && npm install && npm run dev`

## Аутентификация и роли (JWT)

Роли поддерживаются из коробки: `admin`, `teacher`, `student`.

- Регистрация: `POST /api/auth/register`
  - Тело: `{ "email": "user@example.com", "password": "123456", "role": "teacher?", "adminKey": "..." }`
  - По умолчанию роль `student`.
  - Первый зарегистрированный пользователь автоматически становится `admin`.
  - Чтобы создать `teacher` или `admin`, нужен `ADMIN_KEY` (см. .env).

- Логин: `POST /api/auth/login`
  - Тело: `{ "email": "...", "password": "..." }`
  - Ответ: `{ token, user: { id, email, role, isAdmin } }`

- Текущий пользователь: `GET /api/auth/me` (требуется заголовок `Authorization: Bearer <token>`)

- Смена роли (только admin): `PUT /api/auth/role`
  - Тело: `{ "userId": 2, "role": "teacher" }`

Токены подписываются секретом `JWT_SECRET`. Заполните файл `backend/.env` (см. `backend/.env.example`).

Маршруты для уроков:
- `GET /api/lessons`, `GET /api/lessons/:id` — общедоступные
- `POST|PUT|DELETE /api/lessons` — доступны `teacher` и `admin` (нужен Bearer-токен)

## Переменные окружения

Создайте `backend/.env` на основе `backend/.env.example`:

```
JWT_SECRET=ваш_секрет
ADMIN_KEY=любой_строковый_ключ
PORT=4000
```

## Примечания
- Данные (пока) хранятся в JSON-файлах в `backend/src/data/`.
- Роли для старых записей автоматически нормализуются (если было только `isAdmin`).
