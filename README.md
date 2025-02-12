
# Backend - Node.js API
Хоститься все на Render.com він може просипатися 1-2 хвилини
## Опис
Цей репозиторій містить серверну частину проєкту, написану на Node.js з використанням наступних бібліотек:
- Apollo Server
- Express
- Mongoose
- Bcryptjs
- Cloudinary
- Joi
- Multer
- JSON Web Token
- та інших.

## Вимоги
- Node.js 23+ 
- Docker при бажанні

## Установка

### 1. Клонуйте репозиторій:
```bash
git clone https://github.com/Hakaton-Error418/hakaton-backend.git
cd hakaton-backend
```

### 2. Встановіть залежності:
```bash
npm install
# або
yarn install
```

### 3. Створіть файл `.env` для збереження конфіденційних змінних середовища:
```bash
MONGO_URI=mongodb+srv://oleg28193:p8tQDx6KKr0XxHiU@users.ls9mx.mongodb.net/
PORT=5000
JWT_SECRET=a03698b8d1bd286ffcf28c9515ab6c4a617ac5e1f23360b88da39cfa9905c78f
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=didhbrbxs
CLOUDINARY_API_KEY=467318228579133
CLOUDINARY_API_SECRET=R_uHGgxwNH3fu6dgQU8pkEzITiw
```

### 4. Запустіть сервер:
```bash
npm start
# або
yarn start
```

### 5. Запустіть сервер в режимі розробки (з автоматичним перезавантаженням):
```bash
npm run dev
# або
yarn dev
```
Сервер буде доступний за адресою `http://localhost:5000`.

## Docker (якщо використовується)

### 1. Зберіть Docker образ:
```bash
docker build -t hakaton-backend .
```

### 2. Запустіть контейнер:
```bash
docker run -p 4000:4000 hakaton-backend
```

Тепер сервер буде доступний за адресою `http://localhost:4000`.

## Скрипти

- `start`: Запускає сервер.
- `dev`: Запускає сервер в режимі розробки за допомогою `nodemon`.

