import {DefaultEventsMap, Server as SocketIOServer, Socket} from "socket.io";

type Props = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    io: SocketIOServer;
    userMap: { [p: string]: string }
}

export default function handelSocketTyping({socket, io, userMap}:Props){
    socket.on('typing',({to})=>{
        // Getting the sender ID to differentiate indicator in the frontend
        const from = Object.keys(userMap).find((key) => userMap[key] === socket.id);

        // Getting the socket ID of the user to send the message to
        const recipientSocketId = userMap[to];

        if (recipientSocketId) {
            // If user offline store to database
            io.to(recipientSocketId).emit('userTypingOn', { typing:'true' , from });
        }
    })

    socket.on('typingOff',({to})=>{
        // Getting the sender ID to differentiate indicator in the frontend
        const from = Object.keys(userMap).find((key) => userMap[key] === socket.id);

        // Getting the socket ID of the user to send the message to
        const recipientSocketId = userMap[to];

        if (recipientSocketId) {
            // If user offline store to database
            io.to(recipientSocketId).emit('userTypingOff', { typing:'true' , from });
        }
    })
}