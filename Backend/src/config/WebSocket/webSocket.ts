// websocket.ts
import { Server as SocketIOServer } from 'socket.io';
import handleSocketMessages from "./handleSocketMessages.js";
import handelSocketTyping from "./handelSocketTyping.js";

type MessageObject = {
    message:string,
    activeUserId:number
    userId:number,
    timestamp:string,
}

type MessageProp = {
    message:MessageObject,
    to:string,
}

export default function webSocket(io: SocketIOServer): void {
    const userMap: { [userId: string]: string } = {};

    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        socket.on('register', (userId: string) => {
            // Storing the socket ID in a map for further use to send message and typing indicator.
            userMap[userId] = socket.id;
            console.log(`User ${userId} registered with socket ID ${socket.id}`);
        });

        // Message Handler
        handleSocketMessages({socket,io,userMap})

        // Typing Handler
        handelSocketTyping({socket,io,userMap})

        socket.on('inChat',()=>{
            socket.broadcast.emit('userInChat')
        })

        socket.on('disconnect', () => {
            console.log(`Disconnected: ${socket.id}`);
            const userId = Object.keys(userMap).find((key) => userMap[key] === socket.id);
            if (userId) {
                delete userMap[userId];
            }
        });
    });
}


// socket.on("fileUpload", (data) => {
//     console.log(data)
//     console.log(`Received file: ${data.fileName}`);
//     // Broadcast the file to all connected clients
//     io.emit("fileReceived", {
//         fileName: data.fileName,
//         fileType: data.fileType,
//         fileData: data.fileData, // Base64-encoded data
//     });
// });

