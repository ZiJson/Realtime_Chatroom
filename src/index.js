import "./index.css";
// import "antd/dist/antd.css";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  ApolloClient, InMemoryCache, ApolloProvider,
  split, HttpLink
} from '@apollo/client';
import { getMainDefinition } from
  '@apollo/client/utilities';
import { GraphQLWsLink } from
  '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { ChatProvider } from
  "./containers/hooks/useChat.js"
import App from "./containers/App.js";
import reportWebVitals from "./reportWebVitals.js"
import { WebSocketLink } from "apollo-link-ws";
const url = new URL("/graphql", window.location.href);

const httpLink = new HttpLink({
  uri: url.href
});
// const wsLink = new GraphQLWsLink(createClient({
//   url: url.href.replace("http", "ws"),
//   options: {
//     lazy: true,
//   },
  
//   options: { reconnect: true },
// }))
const wsLink = new WebSocketLink({
  // uri: `ws://localhost:5000/graphql`,
  uri: url.href.replace("http", "ws"),
  options: { 
    reconnect: true,
    lazy: true,
   },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache().restore({}),
});
const root =
  ReactDOM.createRoot(document.getElementById("root")
  );
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ChatProvider><App /></ChatProvider>
    </ApolloProvider>
  </React.StrictMode>
);
reportWebVitals()
