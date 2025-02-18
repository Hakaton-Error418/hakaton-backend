import { gql } from "apollo-server-express";

export const typeDefs = gql`
    type User {
        id: ID!
        email: String!
        userName: String!
        avatar: String
        rating: Int
        token: String
        quests: [Quest]
    }

    type Quest {
        id: ID!
        name: String!
        description: String
        picture: String
        tasks: [Task]
        time: Int!
    }

    type Task {
        id: ID!
        description: String
        type: String!
        picture: String
        openAnswer: String
        checkAnswer: [Answer]
        time: Int!
    }

    type Answer {
        answer: String!
        isCorrect: Boolean!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Query {
        getUser(id: ID!): User
        getUsers: [User]
        getQuests: [Quest]
    }

    type Mutation {
        registerUser(
            email: String!
            userName: String!
            password: String!
        ): AuthPayload
        loginUser(email: String!, password: String!): AuthPayload

        createQuest(
            userId: ID!
            name: String!
            description: String
            picture: String
        ): Quest
        addTask(
            userId: ID!
            questId: ID!
            description: String
            type: String!
            picture: String
            time: Int!
            openAnswer: String
        ): Task
        addAnswer(
            userId: ID!
            questId: ID!
            taskId: ID!
            answer: String!
            isCorrect: Boolean!
        ): Task

        deleteQuest(id: ID!): String
        deleteTask(id: ID!): String
        deleteAnswer(taskId: ID!, answerId: ID!): String
    }
`;
