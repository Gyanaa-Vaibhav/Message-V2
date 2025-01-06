import express from 'express';
import dotenv from 'dotenv';
import path from "node:path";
import * as url from "node:url";
import cors from 'cors';
import helmet from "helmet";
import cookieParser from "cookie-parser";
import {Server} from "socket.io";
import * as http from "node:http";
import rateLimiter from "./shared/utils/rateLimiter.js";
import webSocket from "./shared/utils/webSocket.js";


import loginRouter from "./features/Login/routes/LoginRoute.js";
import RegisterRouter from "./features/Register/routes/RegisterRoute.js";
import {decode, sign} from "./shared/utils/jwt.js";



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

app.get('/test',(req, res) => {
    console.log(req.body)
    res.json({success:true,message:'Hello Hi Serve Works'})
});

app.use(sign)
app.use(decode)

app.get('/users',(req,res)=>{
    const users: { name:string,image:string }[] = [{name:'a',image:'2'},{name:'b',image:'2'},{name:'c',image:'2'},{name:'d',image:'2'}]
    res.json({success:true,users})
})

app.get('/message/:user',(req,res)=>{
    const userName:string = req.params.user
    const messages = [
        {user:'a',time:'time',message:'Hello from a'},
        {user:'a',time:'time',message:'Hello from a2'},
        {user:'b',time:'time',message:'Hello from b'},
        {user:'b',time:'time',message:'Hello from b2'},
        {user:'c',time:'time',message:'Hello from c'},
        {user:'c',time:'time',message:'Hello from c2'},
        {user:'d',time:'time',message:'Hello from d'},
        {user:'d',time:'time',message:'Hello from d2'},
    ]

    const msgData:{user:string,time:string,message:string}[] = []

    const sendingMessage = messages.map(m=>{
        if(m.user == userName){
            msgData.push(m)
        }
    })

    res.json({success:true,msgData})
})

// Socket Consumer
webSocket(io);

server.listen(PORT,()=>{
    console.log(`Listening on Port ${PORT}`)
})