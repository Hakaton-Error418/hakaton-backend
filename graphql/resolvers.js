import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

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
    registerUser: async (_, { email, userName, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email уже используется');
      }

      const newUser = new User({ email, userName, password });

      const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

      newUser.token = token; 
      await newUser.save();

      return { token, user: newUser };
    },

    loginUser: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Пользователь не найден');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Неверный пароль');
      }

      if (user.token) {
        try {
          jwt.verify(user.token, JWT_SECRET); 
          return { token: user.token, user };
        } catch (err) {
          console.log('Токен истек, создаем новый...');
        }
      }

      const newToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      user.token = newToken;
      await user.save();

      return { token: newToken, user };
    }
  }
};

export default resolvers;