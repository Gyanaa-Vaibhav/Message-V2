import {sendMessage} from "./utilsExport.ts";
import {Socket} from "socket.io-client";
import React from "react";
import {Message} from "../types/ChatBox.ts";
import {User} from "../../ChatLayout/types/ChatLayout.ts";

type Props = {
    messageObject:{
        socket: Socket | null;
        outGoingMessage: string;
        setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
        setOutGoingMessage: React.Dispatch<React.SetStateAction<string>>;
        textareaRef:React.RefObject<HTMLTextAreaElement>;
        userId:number;
        activeUserId:number;
        setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
    },
    outGoingMessage:string,
    event: React.KeyboardEvent<HTMLTextAreaElement>
}

export const handleKeyDown = ({event, outGoingMessage, messageObject}:Props) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (outGoingMessage.trim() !== '') {
            sendMessage(messageObject);
        }
    }
};