import { ApolloServer } from '@apollo/server';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { expressMiddleware } from '@apollo/server/express4';
import {typeDefs} from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';

const app = express();
app.use(cors());
app.use(express.json());
const {MONGO_URI} = process.env

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

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('DB connected');
    app.listen(process.env.PORT || 3001, () => {
      console.log(`Server is running at http://localhost:5000/graphql`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

