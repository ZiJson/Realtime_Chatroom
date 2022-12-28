import express from "express";
import { ApolloServer, PubSub } from "apollo-server-express";
import { importSchema } from "graphql-import";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import "dotenv-defaults/config.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import * as fs from 'fs';
import { WebSocketServer } from 'ws'
import {
  createPubSub, createSchema,
  createYoga
} from 'graphql-yoga';
import { useServer } from 'graphql-ws/lib/use/ws'

import ChatBoxModel from "./backend/src/models/chatbox.js";
import Query from "./backend/src/resolvers/Query.js";
import Mutation from "./backend/src/resolvers/Mutation.js";
import Subscription from "./backend/src/resolvers/Subscription.js";
import ChatBox from './backend/src/resolvers/ChatBox.js';
import mongo from "./backend/src/mongo.js";
// import apiRoute from "./backend/route/api.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 80;

const typeDefs = importSchema("./backend/src/schema.graphql");
const pubsub = createPubSub();
const app = express();

app.use(cors());
// app.use("/api", apiRoute);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "build")));
// app.get("/*", function (req, res) {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Subscription,
    ChatBox
  },
  context: {
    ChatBoxModel,
    pubsub,
  },
});
const yoga = createYoga({
  schema: createSchema({
    typeDefs: fs.readFileSync(
      './backend/src/schema.graphql',
      'utf-8'
    ),
    resolvers: {
      Query,
      Mutation,
      Subscription,
      ChatBox
    },
  }),
  context: {
    ChatBoxModel,
    pubsub
  },
  graphiql: {
    subscriptionsProtocol: 'WS',
  }
});

// app.use('/graphql', yoga)
server.applyMiddleware({  app});
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);


mongo.connect();
// const wsServer = new WebSocketServer({
//   server: httpServer,
//   path: yoga.graphqlEndpoint,
// })

// useServer(
//   {
//     execute: (args) => args.rootValue.execute(args),
//     subscribe: (args) => args.rootValue.subscribe(args),
//     onSubscribe: async (ctx, msg) => {
//       const { schema, execute, subscribe, contextFactory, parse, validate } =
//         yoga.getEnveloped({
//           ...ctx,
//           req: ctx.extra.request,
//           socket: ctx.extra.socket,
//           params: msg.payload
//         })
//       const args = {
//         schema,
//         operationName: msg.payload.operationName,
//         document: parse(msg.payload.query),
//         variableValues: msg.payload.variables,
//         contextValue: await contextFactory(),
//         rootValue: {
//           execute,
//           subscribe
//         }
//       }
//       const errors = validate(args.schema, args.document)
//       if (errors.length) return errors
//       return args
//     },
//   },
//   wsServer,
// )
httpServer.listen(port, () => {
  console.log(`🚀 Server Ready at ${port}! 🚀`);
  console.log(`Graphql Port at ${port}${server.subscriptionsPath}`);
});
