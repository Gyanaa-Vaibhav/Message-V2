// websocket.ts
import { Server as SocketIOServer } from 'socket.io';

export default function webSocket(io: SocketIOServer): void {
    const userMap: { [userId: string]: string } = {};

    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        socket.on('register', (userId: string) => {
            userMap[userId] = socket.id;
            console.log(`User ${userId} registered with socket ID ${socket.id}`);
        });

        socket.on('message', async ({message,to}) => {
            const from = Object.keys(userMap).find((key) => userMap[key] === socket.id);
            console.log(userMap)
            console.log('Message event received:', { from, to, message });

            if (!from) {
                console.error('Sender not found in userMap');
                return;
            }

            const recipientSocketId = userMap[to];
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('sendMessage', { message, from });
            } else {
                console.log(`User ${to} is offline. Message saved to the database.`);
            }
        });

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