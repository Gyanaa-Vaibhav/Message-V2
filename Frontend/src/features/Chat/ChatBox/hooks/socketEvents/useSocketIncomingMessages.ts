import React from "react";
import {MessageData} from "../../types/ChatBox.ts";
import { Socket } from "socket.io-client";
import {DefaultEventsMap} from '@socket.io/component-emitter'
import {useUserContext} from "../../ChatContext.tsx";
import {handleReceiveMessage} from "../../utils/utilsExport.ts";

type Props = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
    setIsUserTyping: React.Dispatch<React.SetStateAction<boolean>>;
    setNewMessage: (value: React.SetStateAction<boolean>) => void
}


export default function useSocketIncomingMessages({socket,setNewMessage,setIsUserTyping}:Props){
    const { userId, setUsersList,setMessages ,usersList} = useUserContext();
    React.useEffect(() => {
        if (!socket) return;

        // Handling messages
        const handleIncomingMessage = (messageData: MessageData) => {
            if(Number(messageData.from) === userId){
                socket.emit('inChat')
                setNewMessage(true)
            }
            setIsUserTyping(false);
            handleReceiveMessage({messageData, userId, setMessages, setUsersList, usersList}).then(r => r);
        };

        socket.on('sendMessage', handleIncomingMessage);

        return () => {
            socket.off('sendMessage', handleIncomingMessage);
        };
    }, [setIsUserTyping, setMessages, setNewMessage, setUsersList, socket, userId]);
}