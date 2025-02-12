import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Quest, User } from "../models/User.js";

const { JWT_SECRET } = process.env;

const resolvers = {
    Query: {
        getUser: async (_, { id }) => {
            try {
                return await User.findById(id);
            } catch (error) {
                throw new Error("Ошибка получения пользователя");
            }
        },
        getUsers: async () => {
            try {
                return await User.find()
                    .populate({
                        path: "quests",
                        populate: { path: "tasks" },
                    })
                    .lean()
                    .then(users =>
                        users.map(user => ({
                            ...user,
                            id: user._id.toString(),
                            quests: user.quests.map(quest => ({
                                ...quest,
                                id: quest._id.toString(),
                                tasks: quest.tasks.map(task => ({
                                    ...task,
                                    id: task._id.toString(),
                                })),
                            })),
                        }))
                    );
            } catch (error) {
                throw new Error("Ошибка получения списка пользователей");
            }
        },
        getQuests: async () => {
            try {
                return await Quest.find().populate({
                    path: "tasks",
                    populate: { path: "checkAnswer" },
                });
            } catch (error) {
                throw new Error("Ошибка получения списка квестов");
            }
        },
    },

    Mutation: {
        registerUser: async (_, { email, userName, password }) => {
            try {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    throw new Error("Email уже используется");
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = new User({
                    email,
                    userName,
                    password: hashedPassword,
                });

                const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
                    expiresIn: "7d",
                });

                newUser.token = token;
                await newUser.save();

                return { token, user: newUser };
            } catch (error) {
                throw new Error("Ошибка регистрации");
            }
        },

        loginUser: async (_, { email, password }) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    throw new Error("Пользователь не найден");
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    throw new Error("Неверный пароль");
                }

                const newToken = jwt.sign({ id: user._id }, JWT_SECRET, {
                    expiresIn: "7d",
                });

                user.token = newToken;
                await user.save();

                return { token: newToken, user };
            } catch (error) {
                throw new Error("Ошибка входа");
            }
        },

        createQuest: async (_, { userId, name, description, picture }) => {
            try {
                const user = await User.findById(userId);
                if (!user) {
                    throw new Error("Пользователь не найден");
                }

                const newQuest = new Quest({
                    name,
                    description,
                    picture,
                    tasks: [],
                });
                await newQuest.save();

                user.quests = user.quests || [];
                user.quests.push(newQuest._id);
                await user.save();

                return newQuest;
            } catch (error) {
                throw new Error("Ошибка создания квеста");
            }
        },

        addTask: async (
            _,
            { questId, description, type, picture, openAnswer }
        ) => {
            try {
                const quest = await Quest.findById(questId);
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
                await quest.save();

                return newTask;
            } catch (error) {
                throw new Error("Ошибка добавления задания");
            }
        },

        addAnswer: async (_, { questId, taskId, answer, isCorrect }) => {
            try {
                const quest = await Quest.findById(questId);
                if (!quest) {
                    throw new Error("Квест не найден");
                }

                const task = quest.tasks.id(taskId);
                if (!task) {
                    throw new Error("Задание не найдено");
                }

                task.checkAnswer.push({ answer, isCorrect });
                await quest.save();

                return task;
            } catch (error) {
                throw new Error("Ошибка добавления ответа");
            }
        },
    },
};

export default resolvers;
