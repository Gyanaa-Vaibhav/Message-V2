import {Message, MessageData} from "../../types/ChatBox.ts";
import {User} from "../../../ChatLayout/types/ChatLayout.ts";
import React from "react";
import {Socket} from "socket.io-client";

type HandleSendMessage = {
    messageData : MessageData,
    userId:number,
    usersList: User[],
    setMessages:React.Dispatch<React.SetStateAction<Message[]>>
    setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
}

type SendMessageParams = {
    socket: Socket | null;
    outGoingMessage: string;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    setOutGoingMessage: React.Dispatch<React.SetStateAction<string>>;
    textareaRef:React.RefObject<HTMLTextAreaElement>;
    userId:number;
    activeUserId:number;
    setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
};

type HandleInputChange = {
    event:React.ChangeEvent<HTMLTextAreaElement>,
    setOutGoingMessage: React.Dispatch<React.SetStateAction<string>>
    socket: Socket | null;
    userId:number;
    isUserTyping:boolean
}

type HandelTypingIndicator = {
    socket: Socket | null;
    userId:number;
    isUserTyping:boolean,
}

type HandelMessageFromNewUser = {
    from: number,
    message: Message,
    usersList: User[],
    setUsersList: React.Dispatch<React.SetStateAction<User[]>>,
}

export type {SendMessageParams,HandelTypingIndicator,HandleInputChange,HandleSendMessage,HandelMessageFromNewUser}