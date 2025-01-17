/**
 * useSocket
 *
 * A global Socket function to initialize and use socket listeners
 * @function {useSocketInstance} Initializes the socket object and returns it
 */
import React from "react";
import {io, Socket} from "socket.io-client";
import {Message, MessageData, TypingFormat} from "../types/ChatBox.ts";
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
    setIsUserTyping: React.Dispatch<React.SetStateAction<boolean>>;
    setIsUserTypingId: React.Dispatch<React.SetStateAction<number>>;
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

export default function useSocket({activeUserId,setMessages,setNewMessage,setIsUserTyping,setIsUserTypingId}:Props){
    const socket = useSocketInstance()
    const { userId, setUsersList} = useUserContext();

    React.useEffect(()=>{
        // Registering Socket User
        if (socket && activeUserId) {
            socket.emit('register', activeUserId);
        }
    },[activeUserId, socket])

    React.useEffect(() => {
        if(!socket) return;

        // Fetching User Chats List
        const handleUserChats = (message: Message[]) => {
            setMessages(message);
        };

        socket.on(`userChats`,handleUserChats)

        socket.emit('getMessage', {userId,activeUserId})

        return()=>{
            socket.off(`userChats`,handleUserChats)
        }
    }, [userId, socket, activeUserId, setMessages]);

    React.useEffect(() => {
        if (!socket) return;

        // Handling messages
        const handleIncomingMessage = (messageData: MessageData) => {
            if(Number(messageData.from) === userId){
                setNewMessage(true)
            }
            setIsUserTyping(false);
            handleSendMessage({ messageData, userId, setMessages, setUsersList});
        };

        socket.on('sendMessage', handleIncomingMessage);

        return () => {
            socket.off('sendMessage', handleIncomingMessage);
        };
    }, [setIsUserTyping, setMessages, setNewMessage, setUsersList, socket, userId]);


    React.useEffect(() => {
            if (!socket) return;

            const handleTypingUser = (user: TypingFormat) => {
                if(Number(user.from) === userId){
                    setIsUserTypingId(Number(user.from));
                    setIsUserTyping(true);
                }
            };

            const handleTypingUserOff = () => {
                console.log('Off')
                setIsUserTypingId(NaN);
                setIsUserTyping(false);
            };

            socket.on('userTypingOn', handleTypingUser);
            socket.on('userTypingOff', handleTypingUserOff);

            return () => {
                socket.off('userTypingOn', handleTypingUser);
                socket.off('userTypingOff', handleTypingUserOff);
            };
        }, [setIsUserTyping, setIsUserTypingId, socket, userId]);

    return socket
}