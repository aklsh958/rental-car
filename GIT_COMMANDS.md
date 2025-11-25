# Команди для підключення до GitHub

Виконайте ці команди по черзі в терміналі (PowerShell або Git Bash):

## 1. Ініціалізуйте git репозиторій:
```bash
git init
```

## 2. Додайте всі файли:
```bash
git add .
```

## 3. Зробіть перший коміт:
```bash
git commit -m "Initial commit: RentalCar project setup with Next.js, TypeScript, Zustand"
```

## 4. Перейменуйте гілку на main (якщо потрібно):
```bash
git branch -M main
```

## 5. Підключіть віддалений репозиторій:
```bash
git remote add origin https://github.com/aklsh958/rental-car.git
```

## 6. Завантажте код на GitHub:
```bash
git push -u origin main
```

---

## Якщо виникнуть проблеми:

### Якщо git не встановлений:
Завантажте з https://git-scm.com/download/win

### Якщо потрібно налаштувати ім'я та email:
```bash
git config --global user.name "Ваше Ім'я"
git config --global user.email "ваш.email@example.com"
```

### Якщо при push виникне помилка про авторизацію:
GitHub тепер вимагає Personal Access Token замість пароля.
1. Перейдіть: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Створіть новий token з правами `repo`
3. Використайте token замість пароля при push

