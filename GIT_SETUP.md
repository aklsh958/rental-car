# Налаштування Git репозиторію

## Важливо!

В ТЗ є вимога: **"Усі зміни закомічені зі зрозумілими повідомленнями"**

Тому потрібно ініціалізувати git репозиторій та зробити коміти.

## Інструкція:

### 1. Відкрийте термінал у папці проєкту

### 2. Ініціалізуйте git репозиторій:
```bash
git init
```

### 3. Додайте всі файли:
```bash
git add .
```

### 4. Зробіть початковий коміт:
```bash
git commit -m "Initial commit: RentalCar project setup with Next.js, TypeScript, Zustand"
```

### 5. (Опціонально) Підключіть віддалений репозиторій:
```bash
git remote add origin <URL_вашого_репозиторію>
git branch -M main
git push -u origin main
```

## Альтернатива через VS Code / Cursor:

1. Відкрийте панель Source Control (Ctrl+Shift+G)
2. Натисніть "Initialize Repository"
3. Додайте всі файли (натисніть "+" біля "Changes")
4. Введіть повідомлення коміту
5. Натисніть "Commit"

## Рекомендовані повідомлення комітів:

- `Initial commit: RentalCar project setup`
- `Add home page with banner and CTA button`
- `Implement catalog page with filtering and pagination`
- `Add car details page with rental form`
- `Implement favorites functionality with localStorage persistence`
- `Add filters component with backend integration`
- `Style components with CSS modules`
- `Add README and documentation`

