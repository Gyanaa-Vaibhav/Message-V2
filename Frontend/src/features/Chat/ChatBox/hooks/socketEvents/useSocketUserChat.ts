import React from "react";
import {Message} from "../../types/ChatBox.ts";
import {Socket} from "socket.io-client";
import {DefaultEventsMap} from "@socket.io/component-emitter";

type Props = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    userId:number,
    activeUserId:number,
}


export default function useSocketUserChat({socket,setMessages,userId,activeUserId}:Props){
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
}