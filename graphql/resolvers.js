import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

const { JWT_SECRET } = process.env;

const resolvers = {
  Query: {
    getUser: async (_, { id }) => {
      return await User.findById(id);
    },
    getUsers: async () => {
      return await User.find();
    },
  },

  Mutation: {
    // Регистрация пользователя
    registerUser: async (_, { email, userName, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email уже используется");
      }

      const newUser = new User({ email, userName, password });

      const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "7d" });

      newUser.token = token;
      await newUser.save();

      return { token, user: newUser };
    },

    // Авторизация пользователя
    loginUser: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Пользователь не найден");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Неверный пароль");
      }

      if (user.token) {
        try {
          jwt.verify(user.token, JWT_SECRET);
          return { token: user.token, user };
        } catch (err) {
          console.log("Токен истек, создаем новый...");
        }
      }

      const newToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
      user.token = newToken;
      await user.save();

      return { token: newToken, user };
    },

    // Создание квеста
    createQuest: async (_, { userId, name, description, picture }) => {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Пользователь не найден");
      }

      const newQuest = {
        name,
        description,
        picture,
        tasks: [], // Изначально без заданий
      };

      user.quests.push(newQuest);
      await user.save();

      return newQuest;
    },

    // Добавление задания в квест
    addTask: async (_, { userId, questId, description, type, picture, openAnswer }) => {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Пользователь не найден");
      }

      const quest = user.quests.id(questId);
      if (!quest) {
        throw new Error("Квест не найден");
      }

      const newTask = {
        description,
        type,
        picture,
        openAnswer,
        checkAnswer: [],
      };

      quest.tasks.push(newTask);
      await user.save();

      return newTask;
    },

    // Добавление варианта ответа к заданию
    addAnswer: async (_, { userId, questId, taskId, answer, isCorrect }) => {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Пользователь не найден");
      }

      const quest = user.quests.id(questId);
      if (!quest) {
        throw new Error("Квест не найден");
      }

      const task = quest.tasks.id(taskId);
      if (!task) {
        throw new Error("Задание не найдено");
      }

      task.checkAnswer.push({ answer, isCorrect });
      await user.save();

      return task;
    },
  },
};

export default resolvers;
