# Інструкції з деплойменту

## Vercel

1. Встановіть Vercel CLI (опціонально):
```bash
npm i -g vercel
```

2. Підключіть репозиторій до Vercel:
   - Перейдіть на https://vercel.com
   - Натисніть "New Project"
   - Підключіть ваш GitHub/GitLab/Bitbucket репозиторій
   - Vercel автоматично визначить Next.js проєкт
   - Натисніть "Deploy"

3. Або використайте CLI:
```bash
vercel
```

## Netlify

1. Встановіть Netlify CLI (опціонально):
```bash
npm i -g netlify-cli
```

2. Підключіть репозиторій до Netlify:
   - Перейдіть на https://netlify.com
   - Натисніть "Add new site" → "Import an existing project"
   - Підключіть ваш репозиторій
   - Налаштування build:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Натисніть "Deploy site"

3. Або використайте CLI:
```bash
netlify deploy --prod
```

## Важливо

Після деплойменту переконайтеся, що:
- Всі маршрути працюють коректно
- API запити виконуються успішно
- Фільтрація працює
- Пагінація працює
- Форма оренди відправляється

