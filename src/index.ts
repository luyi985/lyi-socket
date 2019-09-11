import express from 'express';
import * as http from 'http';
import WebSocket from 'ws';
import { join } from 'path';
const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const data: Array<string> = [];

const broadCast = () => {
	wss.clients.forEach(c => {
		c.send(JSON.stringify(data));
	});
};

app.use(
	express.static(join(process.cwd(), 'public'), {
		index: ['index.html', 'index.htm'],
		maxAge: 10000,
	}),
);

wss.on('connection', (ws: WebSocket) => {
	ws.on('message', (message: string) => {
		data.push(message);
		broadCast();
	});
	ws.send(JSON.stringify(data));
});

server.listen(process.env.PORT || 8999, () => {
	console.log(server.address());
});
