import React from "react";
import {Message, MessageData} from "../../types/ChatBox.ts";
import { Socket } from "socket.io-client";
import {DefaultEventsMap} from '@socket.io/component-emitter'
import {handleSendMessage} from "../../utils/handelMessage.ts";
import {User} from "../../../ChatLayout/types/ChatLayout.ts";

type Props = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
    setIsUserTyping: React.Dispatch<React.SetStateAction<boolean>>;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    userId:number,
    setUsersList: React.Dispatch<React.SetStateAction<User[]>>,
    setNewMessage: (value: React.SetStateAction<boolean>) => void
}


export default function useSocketIncomingMessages({socket,userId,setNewMessage,setIsUserTyping,setMessages,setUsersList}:Props){
    React.useEffect(() => {
        if (!socket) return;

        // Handling messages
        const handleIncomingMessage = (messageData: MessageData) => {
            if(Number(messageData.from) === userId){
                socket.emit('inChat')
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
}