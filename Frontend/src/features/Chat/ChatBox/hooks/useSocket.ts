import React from "react";
import {io, Socket} from "socket.io-client";
import {Message, MessageData} from "../types/ChatBox.ts";
import {handleSendMessage} from "../utils/handelMessage.ts";
import {User} from "../../ChatLayout/types/ChatLayout.ts";
import {useUserContext} from "../ChatContext.tsx";

const SOCKET_URL  = import.meta.env.VITE_SERVER_IP

type Props = {
    activeUserId: number
    userId:number,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setNewMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
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

export default function useSocket({activeUserId,setMessages,setNewMessage}:Props){
    const socket = useSocketInstance()
    const { userId, setUsersList} = useUserContext();

    React.useEffect(()=>{
        // Registering Socket User
        if (socket && activeUserId) {
            socket.emit('register', activeUserId);
        }
    },[activeUserId, socket])

    React.useEffect(() => {
        // Fetching User Chats
        if (socket){
            console.log("Selected User",userId,"Logged In User",activeUserId)

            const handleUserChats = (message: Message[]) => {
                setMessages(message);
            };

            socket.on(`userChats`,handleUserChats)

            socket.emit('getMessage', {userId,activeUserId})

            return()=>{
                socket.off(`userChats`,handleUserChats)
            }
        }
    }, [userId, socket, activeUserId, setMessages]);

    React.useEffect(() => {
        if (!socket) return;

        const handleIncomingMessage = (messageData: MessageData) => {
            console.log("From Socket", messageData);
            setNewMessage(true)
            handleSendMessage({ messageData, userId, setMessages, setUsersList});
        };

        socket.on('sendMessage', handleIncomingMessage);

        return () => {
            socket.off('sendMessage', handleIncomingMessage);
        };
    }, [setMessages, setNewMessage, setUsersList, socket, userId]);

    return socket
}