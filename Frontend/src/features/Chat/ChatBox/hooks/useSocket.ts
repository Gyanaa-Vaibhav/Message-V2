import React from "react";
import {io, Socket} from "socket.io-client";
import {Message, MessageData} from "../types/ChatBox.ts";
import {handleSendMessage} from "../utils/handelMessage.ts";

const SOCKET_URL  = import.meta.env.VITE_SERVER_IP

type Props = {
    activeUserId: number
    userId:number,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setNewMessage: React.Dispatch<React.SetStateAction<boolean>>,
};

export function useSocketInstance(){
    const [socket,setSocket] = React.useState<Socket | null>(null);

    React.useEffect(()=>{
        const server = io(SOCKET_URL)
        setSocket(server);

        server.on('connect',() =>{
            console.log('Connected to WebSocket server');
        })

        return ()=>{
            server.close()
        }
    },[])

    return socket
}

export default function useSocket({activeUserId,userId,setMessages,setNewMessage}:Props){
    const socket = useSocketInstance()

    React.useEffect(()=>{
        // Registering Socket User
        if (socket && activeUserId) {
            socket.emit('register', activeUserId);
        }
    },[activeUserId, socket])

    React.useEffect(() => {
        // Fetching User Chats
        if (socket){
            console.log(userId,activeUserId)
            socket.on(`userChats`,(message:Message[])=>{
                setMessages(message)
            })

            socket.emit('getMessage', {userId,activeUserId})
        }
    }, [userId, socket, activeUserId, setMessages]);

    React.useEffect(() => {
        if (!socket) return;

        socket.on('sendMessage', (messageData: MessageData) => {
            setNewMessage(true)
            console.log("From Socket",messageData);
            handleSendMessage({messageData, userId, setMessages});
        });

        return () => {
            socket.off('sendMessage', handleSendMessage);
        };
    }, [setMessages, setNewMessage, socket, userId]);

    return socket
}