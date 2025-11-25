# Як додати іконки з Figma

## Варіант 1: Копіювання SVG коду (рекомендовано)

1. **Відкрийте Figma** і знайдіть потрібну іконку
2. **Виберіть іконку** (клікніть на неї)
3. **Скопіюйте SVG код:**
   - Натисніть правою кнопкою миші на іконку
   - Виберіть "Copy/Paste as" → "Copy as SVG"
   - АБО виберіть іконку і натисніть `Ctrl+C`, потім `Ctrl+Shift+V` (Copy as SVG)
4. **Відкрийте файл `src/components/Icons/Icons.tsx`**
5. **Знайдіть відповідний компонент іконки** (наприклад, `HeartIcon`)
6. **Замініть SVG код всередині компонента** на скопійований з Figma

### Приклад:

**Було:**
```tsx
export const HeartIcon = ({ filled = false, className = '' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? '#3470ff' : 'none'}
    stroke={filled ? '#3470ff' : '#101828'}
    strokeWidth="2"
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
```

**Після копіювання з Figma:**
```tsx
export const HeartIcon = ({ filled = false, className = '' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? '#3470ff' : 'none'}
    stroke={filled ? '#3470ff' : '#101828'}
    strokeWidth="2"
    className={className}
  >
    {/* Вставте тут SVG код з Figma */}
    <path d="..." /> {/* Код з Figma */}
  </svg>
);
```

## Варіант 2: Експорт SVG файлів

1. **В Figma:**
   - Виберіть іконку
   - Натисніть "Export" (праворуч)
   - Виберіть формат **SVG**
   - Натисніть "Export [назва-іконки]"

2. **Збережіть файл:**
   - Створіть папку `src/components/Icons/svg/` (якщо її немає)
   - Збережіть SVG файл туди з описовою назвою (наприклад, `heart.svg`)

3. **Відкрийте SVG файл** в текстовому редакторі і скопіюйте код всередині `<svg>...</svg>` в компонент `Icons.tsx`

## Список іконок, які потрібно оновити:

- ✅ `HeartIcon` - іконка серця (заповнена/порожня)
- ✅ `LocationPinIcon` - іконка локації
- ✅ `CheckIcon` - галочка (зелена)
- ✅ `CalendarIcon` - календар
- ✅ `CarIcon` - автомобіль
- ✅ `FuelIcon` - паливо
- ✅ `GearIcon` - шестерня
- ✅ `ChevronDownIcon` - стрілка вниз (для dropdown)

## Важливо:

- Зберігайте `className` prop для стилізації
- Зберігайте `fill` та `stroke` props, якщо вони використовуються
- Перевірте `viewBox` - він має відповідати розміру іконки в Figma
- Якщо іконка має кольори з Figma, замініть їх на `currentColor` або CSS змінні

