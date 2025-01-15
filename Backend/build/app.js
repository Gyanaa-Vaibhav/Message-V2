import express from 'express';
import dotenv from 'dotenv';
import path from "node:path";
import * as url from "node:url";
import cors from 'cors';
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import * as http from "node:http";
import webSocket from "./shared/utils/webSocket.js";
import loginRouter from "./features/Login/routes/LoginRoute.js";
import RegisterRouter from "./features/Register/routes/RegisterRoute.js";
import { sign, verifyToken } from "./shared/utils/jwt.js";
import { getUser, getUserList } from "./shared/DataBase/dbExports.js";
import { getChatUsers, getChatUsersLastMessage } from "./shared/DataBase/getQueries/getChatUsers.js";
dotenv.config();
const app = express();
const PORT = Number(process.env.SERVER_PORT) || 9999;
export const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true,
    },
});
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// TODO Change Path to /var/www/html when in production
export const homeDir = process.env.SERVER_PORT
    ? path.join(__dirname, '..', '..', 'Frontend', 'dist')
    : path.join(__dirname, '..', '..');
// Rate Limiter
// app.use(rateLimiter)
// MiddleWear
app.set('proxy', 1);
// app.use(cors())
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(homeDir)));
// Routes
app.use('/login', loginRouter);
app.use('/register', RegisterRouter);
app.get('/test', (req, res) => {
    res.json({ success: true, message: 'Hello Hi Serve Works' });
});
app.use(sign);
// app.use(decode)
app.use(verifyToken);
app.get('/me', async (req, res) => {
    const [user] = await getUser({ user_id: req.body.user.user_id });
    res.json({ success: true, user });
});
app.get('/usersChat', async (req, res) => {
    const user = req.body.user || 'alice';
    const users = await getChatUsers(user.user_id);
    const Data = await Promise.all(users?.map(async (m) => {
        const [des] = await getChatUsersLastMessage(user.user_id, m.recipient_id);
        return des;
    }));
    res.json({ success: true, users: Data });
});
app.post('/users', async (req, res) => {
    const username = req.body.search;
    const users = await getUserList(username);
    res.json({ success: true, users });
});
// Socket Consumer
webSocket(io);
// TODO add GLOBAL ERROR Handler
server.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});
