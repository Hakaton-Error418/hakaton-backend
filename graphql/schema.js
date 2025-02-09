import { gql } from 'apollo-server-express';

export const typeDefs = gql`
type User {
  id: ID!
  email: String!
  userName: String!
  avatar: String
  rating: Int
  history: [ID]
  quests: [ID]
  token: String
}

type AuthPayload {
  token: String!
  user: User!
}


  type Query {
    getUser(id: ID!): User
    getUsers: [User]
  }


type Mutation {
  registerUser(email: String!, userName: String!, password: String!): AuthPayload
  loginUser(email: String!, password: String!): AuthPayload
}
`;

