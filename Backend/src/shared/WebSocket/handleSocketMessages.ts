import {getChatMessagesByID} from "../DataBase/query.js";
import {DefaultEventsMap, Server as SocketIOServer, Socket} from "socket.io";

type Props = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    io: SocketIOServer;
    userMap: { [p: string]: string }
}

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

export default function handleSocketMessages({socket, io, userMap}:Props){

    socket.on('message', async ({message,to}:MessageProp) => {
        // Getting the sender ID to differentiate indicator in the frontend
        const from = Object.keys(userMap).find((key) => userMap[key] === socket.id);

        if (!from) {
            console.error('Sender not found in userMap');
        }

        // Getting the socket ID of the user to send the message to
        const recipientSocketId = userMap[to];
        if (recipientSocketId) {
            // If user active send message
            io.to(recipientSocketId).emit('sendMessage', { message, from });
        } else {
            // If user offline store to database
            const msg = {message: message.message,userId:message.userId,activeUserId:message.activeUserId,timestamp:message.timestamp}
            // console.log("Message Object",msg)
            // await addToChats(msg)
            console.log(`User ${to} is offline. Message saved to the database.`);
        }
    });

    socket.on('getMessage', async ({userId,activeUserId}:{userId:number,activeUserId:number})=>{
        if(userId && activeUserId){
            const messages = await getChatMessagesByID(activeUserId,userId)
            socket.emit(`userChats`,messages)
        }
    })
}