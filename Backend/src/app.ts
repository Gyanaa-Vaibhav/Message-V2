import express from 'express';
import dotenv from 'dotenv';
import path from "node:path";
import * as url from "node:url";
import cors from 'cors';
import helmet from "helmet";
import cookieParser from "cookie-parser";
import {Server} from "socket.io";
import * as http from "node:http";
import rateLimiter from "./config/utils/rateLimiter.js";
import webSocket from "./config/WebSocket/webSocket.js";


import loginRouter from "./features/Login/routes/LoginRoute.js";
import RegisterRouter from "./features/Register/routes/RegisterRoute.js";
import {decode, refreshToken, sign, verifyToken} from "./config/utils/jwt.js";
import {getUser, getUserList,getUnreadCounts,getChatUsersLastMessage,getChatUsers} from "./config/DataBase/dbExports.js";


dotenv.config();
const app = express();
const PORT: number = Number(process.env.SERVER_PORT) || 9999;
export const server = http.createServer(app)
const io = new Server(server,{
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true,
    },
})
const __filename: string = url.fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename)
// TODO Change Path to /var/www/html when in production
export const homeDir: string = process.env.SERVER_PORT
    ? path.join(__dirname,'..','..','Frontend','dist')
    : path.join(__dirname,'..','..');

// Rate Limiter
// app.use(rateLimiter)

// MiddleWear
app.set('proxy',1)
// app.use(cors())
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.join(homeDir)))

// Routes
app.use('/login',loginRouter)
app.use('/register',RegisterRouter)
app.get('/users/:id', async (req,res)=>{
    const {id} = req.params;
    const [users] = await getUser({user_id:Number(id)})
    const [usersData] = await getUserList(users.username)
    res.json({success:true,usersData})
})
app.get('/refreshToken',refreshToken)

app.use(sign)
app.use(verifyToken)
app.get('/me',async (req,res)=>{
    const [user] = await getUser({user_id:req.body.user.user_id})
    res.json({success:true,user})
})

app.get('/usersChat', async (req, res) => {
    const user = req.body.user || 'alice';

    try {
        // Fetch all users the current user has chatted with
        const users = await getChatUsers(user.user_id);

        // Fetch unread counts
        const unreadCounts = await getUnreadCounts(user.user_id);

        // Create a map of unread counts for easy lookup
        const unreadMap = unreadCounts.reduce((map, row) => {
            map[row.sender_id] = row.unread_count;
            return map;
        }, {});

        // Fetch the last message for each user and append unread counts
        const Data = await Promise.all(
            users?.map(async (m) => {
                const [des] = await getChatUsersLastMessage(user.user_id, m.recipient_id);

                // Append the unread count to the user data
                des.unread_count = unreadMap[m.recipient_id] || 0;
                return des;
            })
        );

        res.json({ success: true, users: Data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


app.post('/users', async (req,res)=>{
    const username = req.body.search;
    const users = await getUserList(username)
    res.json({success:true,users})
})

app.get('/verifyToken',(req,res)=>{
    res.json({success:true})
})

// Socket Consumer
webSocket(io);
// TODO add GLOBAL ERROR Handler

server.listen(PORT,()=>{
    console.log(`Listening on Port ${PORT}`)
})