import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import { createServer } from 'http';
import compression from 'compression';
import cors from 'cors';
import { buildSchema } from './schema';

(async () => {
  const app = express();
  const server = new ApolloServer({
    schema: await buildSchema(),
    context: ({ req, res }) => {
      const context = {currentUser: {}};
      context.currentUser = {username: req.headers.username, email: req.headers.email};
      return context;
    },
    validationRules: [depthLimit(7)],
  });
  app.use('*', cors());
  app.use(compression());
  server.applyMiddleware({ 
    app, 
    path: '/graphql' 
  });
  const httpServer = createServer(app);
  httpServer.listen(
    { port: 4000 },
    (): void => console.log(`\n🚀      GraphQL is now running on http://localhost:4000/graphql`));
})();