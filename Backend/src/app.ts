import express from 'express';
import dotenv from 'dotenv';
import path from "node:path";
import * as url from "node:url";
import cors from 'cors';
import helmet from "helmet";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const PORT: string = process.env.SERVER_PORT || '9999'
const __filename: string = url.fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename)
// TODO Change Path to /var/www/html when in production
export const homeDir: string = process.env.SERVER_PORT
    ? path.join(__dirname,'..','..','Frontend','dist')
    : path.join(__dirname,'..','..');

app.use(cors())
app.use(helmet())
app.use(cookieParser())
app.use(express.json())

app.use(express.static(path.join(homeDir)))

app.get('/test',(req, res) => {
    console.log('Hello')
    res.send('Hello Hi Serve Works')
});


app.listen(PORT,()=>{
    console.log(`Listening on Port ${PORT}`)
})