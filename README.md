# TanymKids

Интерактивное веб-приложение с Computer Vision для детей 2–7 лет с ЗПР (задержка психического развития).

## Возможности

- **ЛФК-зарядка** — отслеживание крупной моторики через MediaPipe Pose (руки вверх, наклоны, присед, баланс)
- **Пальчиковая гимнастика** — распознавание жестов через MediaPipe Hands (коза, кольцо, ладонь-кулак)
- **Геймификация** — звёзды, streak, виртуальный питомец
- **Родительский кабинет** — статистика занятий (пока localStorage, Supabase — в следующей фазе)

## Стек

- Next.js 16 + TypeScript + Tailwind CSS 4
- MediaPipe Tasks Vision (Pose + Hands)
- Web Speech API для голосовых подсказок
- Supabase (планируется для auth и облачной статистики)

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

**Важно:** для работы камеры нужен HTTPS или `localhost`. На телефоне используйте HTTPS-туннель (например, ngrok) или деплой на Vercel.

## Структура

```
src/
├── app/           # Страницы (kid, parent, landing)
├── components/    # UI, CV, упражнения, геймификация
├── hooks/         # Камера, MediaPipe, сессии
├── lib/           # CV, evaluators, analytics
├── data/          # JSON-конфиги упражнений
└── types/         # TypeScript типы
```

## Добавление упражнения

1. Добавьте запись в `src/data/exercises/lfk.json` или `hands.json`
2. Создайте evaluator в `src/lib/exercises/lfk/` или `hands/`
3. Зарегистрируйте в `index.ts` соответствующего модуля

## Переменные окружения

Скопируйте `.env.example` в `.env.local` и заполните при подключении Supabase.

## Лицензия

Private — zhaolushka/tanymkids
