// socketHandlers.ts
import {Message, MessageData} from "../types/ChatBox.ts";
import React from "react";
import {Socket} from "socket.io-client";
import {User} from "../../ChatLayout/types/ChatLayout.ts";

type Props = {
    messageData : MessageData,
    userId:number
    setMessages:React.Dispatch<React.SetStateAction<Message[]>>
    setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
}

const handleSendMessage = ({messageData, userId, setMessages,setUsersList}:Props) => {
    const { message, from } = messageData;
    const timestamp = new Date().toISOString();
    setUsersList((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
            return chat.recipient_id === Number(from)
                ? {
                ...chat,
                    message: message.message,
                    timestamp,
                    seen:false,
                }
                : chat
        })
        return updatedChats.sort(function(x, y){
            // return new Date(y.timestamp) - new Date(x.timestamp)
            return y.timestamp.localeCompare(x.timestamp);
        })
    })
    if (Number(from) === userId) {
        setMessages((prev) => [...prev, message]);
    }
};

type SendMessageParams = {
    socket: Socket | null;
    outGoingMessage: string;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    activeUser: string;
    // user: string;
    setOutGoingMessage: React.Dispatch<React.SetStateAction<string>>;
    textareaRef:React.RefObject<HTMLTextAreaElement>;
    userId:number;
    activeUserId:number;
    setNewMessage:React.Dispatch<React.SetStateAction<boolean>>;
    setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
};

const sendMessage = (props: SendMessageParams) => {
    const {socket, outGoingMessage, setMessages, setOutGoingMessage,textareaRef,activeUserId,userId,setNewMessage,setUsersList} = props
    console.log(activeUserId,userId)
    if (socket && outGoingMessage) {
        const timestamp = new Date().toISOString();
        const message: Message = {
            message: outGoingMessage,
            activeUserId:activeUserId,
            userId:userId,
            timestamp:timestamp,
        };

        setUsersList((prevChats) => {
            const updatedChats = prevChats.map((chat) => {
                return chat.recipient_id === userId
                    ? {
                        ...chat,
                        message: message.message,
                        timestamp,
                    }
                    : chat
            })
            return updatedChats.sort(function(x, y){
                // return new Date(y.timestamp) - new Date(x.timestamp)
                return y.timestamp.localeCompare(x.timestamp);
            })
        })
        // Emit the message to the server
        socket.emit('message', { message, to: userId });

        // Update the messages state with the new message
        setMessages((prev) => [...prev, message]);

        // Clear the outgoing message input field
        setOutGoingMessage('');
        setNewMessage(true);
        if(textareaRef.current) textareaRef.current.style.height = '1.5em';
    }
};

type HandleInputChange = {
    event:React.ChangeEvent<HTMLTextAreaElement>,
    setOutGoingMessage: React.Dispatch<React.SetStateAction<string>>
}
const handleInputChange = ({event,setOutGoingMessage}:HandleInputChange) => {
    const textarea = event.target;
    setOutGoingMessage(textarea.value);

    textarea.style.height=`auto`

    // Resize the textarea to fit the content
    if (textarea.scrollHeight > textarea.clientHeight) {
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 4 * 1.5 * parseFloat(getComputedStyle(textarea).fontSize))}px`;
    }
};

export {handleSendMessage,sendMessage,handleInputChange}