// import http from 'http';
// import express from 'express';
// import dotenv from "dotenv-defaults";
// import mongoose from 'mongoose';
// import WebSocket from 'ws';
// import { WebSocketServer } from 'ws'
// import wsConnect from './wsConnect.js'
import mongo from './mongo.js';
// import GraphQL server
import server from './server';

mongo.connect();
    
const port = process.env.PORT || 4000;
server.listen({port}, () => {
console.log(`Listening on http://localhost:${port}`);
});

// const app = express()
// const server = http.createServer(app)
// const wss = new WebSocketServer({ server })
// const db = mongoose.connection

// db.once('open', () => {
//     console.log("MongoDB connected!");
//     wss.on('connection', (ws) => {
//         console.log('server connection');
//         // ws.on('message', function incoming(message) {
//         //     console.log('received: %s', message);
//         //     console.log("send:",JSON.parse(message))
//         //     ws.send(message);
//         //   });
//         ws.box = '';
//         wsConnect.onMessage(ws,wss); 
//         // Define WebSocket connection logic

//     });
// });

