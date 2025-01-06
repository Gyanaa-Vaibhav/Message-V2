// websocket.ts
import { Server as SocketIOServer } from 'socket.io';

export default function webSocket(io: SocketIOServer): void {
    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        socket.on('message', ({message,to}) => {
            console.log('Received message:', message);
            console.log(to)
            io.emit('sendMessage', {message,to});
        });

        socket.on("fileUpload", (data) => {
            console.log(data)
            console.log(`Received file: ${data.fileName}`);
            // Broadcast the file to all connected clients
            io.emit("fileReceived", {
                fileName: data.fileName,
                fileType: data.fileType,
                fileData: data.fileData, // Base64-encoded data
            });
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}
