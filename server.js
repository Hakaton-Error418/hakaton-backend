import { ApolloServer } from '@apollo/server';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { expressMiddleware } from '@apollo/server/express4';
import dotenv from 'dotenv';
import upload from './upload.js'; 
import { typeDefs } from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';
import {User} from './models/User.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { MONGO_URI, PORT } = process.env;

// Создаем Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
  csrfPrevention: false,
});

await server.start();

app.use(
  "/graphql",
  cors(),
  express.json(),
  expressMiddleware(server)
);

// **Эндпоинт для загрузки аватаров в Cloudinary**
app.post("/upload-avatar/:userId", upload.single("avatar"), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.avatar = req.file.path; // URL загруженного изображения
    await user.save();

    res.json({ avatarUrl: user.avatar });
  } catch (error) {
    res.status(500).json({ message: "Ошибка загрузки аватара", error });
  }
});

// Подключение к MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('DB connected');
    app.listen(PORT || 5000, () => {
      console.log(`Server is running at http://localhost:${PORT || 5000}/graphql`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
