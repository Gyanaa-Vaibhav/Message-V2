/**
 * useSocket
 *
 * A global Socket function to initialize and use socket listeners
 * @function {useSocketInstance} Initializes the socket object and returns it
 */
import React from "react";
import {io, Socket} from "socket.io-client";
import {User} from "../../ChatLayout/types/ChatLayout.ts";
import {useUserContext} from "../ChatContext.tsx";
import {
    useSocketUserChat,
    useSocketTyping,
    useSocketIncomingMessages,
    useSocketReadReceipts
} from "./socketEvents/defaultSocketFunctionExport.ts";

const SOCKET_URL  = import.meta.env.VITE_SERVER_IP

type Props = {
    activeUserId: number
    userId:number,
    setNewMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
    setIsUserTyping: React.Dispatch<React.SetStateAction<boolean>>;
    setIsUserTypingId: React.Dispatch<React.SetStateAction<number>>;
};

export function useSocketInstance(activeUserId?:number){
    const [socket,setSocket] = React.useState<Socket | null>(null);

    React.useEffect(()=>{
        const server = io(SOCKET_URL)
        setSocket(server);

        server.on('connect',() =>{
            if (activeUserId) {
                server.emit('register', activeUserId);
                server.emit('deliverMessages',activeUserId)
            }
        })

        return ()=>{
            server.close()
        }
    },[activeUserId])

    return socket
}

export default function useSocket(props:Props){
    const {activeUserId,setNewMessage,setIsUserTyping,setIsUserTypingId} = props
    const { userId,setMessages,usersList, setUsersList} = useUserContext();

    const socket = useSocketInstance(activeUserId)

    // Handel Getting User Chats
    const userChatObject = {socket,setMessages,userId,activeUserId};
    useSocketUserChat(userChatObject);

    // Handel Incoming Messages
    const incomingMessageObject = {socket,setNewMessage,setIsUserTyping,usersList,setUsersList};
    useSocketIncomingMessages(incomingMessageObject)

    // Handel Typing Events
    const typingObject = {socket,setIsUserTypingId,setIsUserTyping,userId};
    useSocketTyping(typingObject)

    const readReceiptObject = {socket,setMessages,activeUserId,userId};
    useSocketReadReceipts(readReceiptObject)

    return socket
}