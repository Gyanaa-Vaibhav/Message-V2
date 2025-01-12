// socketHandlers.ts
import {Message, MessageData} from "../types/ChatBox.ts";
import React from "react";
import {Socket} from "socket.io-client";

type Props = {
    messageData : MessageData,
    userId:number
    setMessages:React.Dispatch<React.SetStateAction<Message[]>>
}

const handleSendMessage = ({messageData, userId, setMessages}:Props) => {
    const { message, from } = messageData;
    console.log(message)
    console.log(`Message received from ${from}: ${message}`);

    if (from === userId) {
        setMessages((prev) => [...prev, message]);
    }
};

type SendMessageParams = {
    socket: Socket | null;
    outGoingMessage: string;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    activeUser: string;
    user: string;
    setOutGoingMessage: React.Dispatch<React.SetStateAction<string>>;
    textareaRef:React.RefObject<HTMLTextAreaElement>;
    userId:number;
    activeUserId:number;
    setNewMessage:React.Dispatch<React.SetStateAction<boolean>>;
};

const sendMessage = (props: SendMessageParams) => {
    const {socket, outGoingMessage, setMessages, setOutGoingMessage,textareaRef,activeUserId,userId,setNewMessage} = props
    console.log(activeUserId,userId)
    if (socket && outGoingMessage) {
        const timestamp = new Date().toISOString();
        console.log(timestamp)
        const message: Message = {
            message: outGoingMessage,
            activeUserId:activeUserId,
            userId:userId,
            timestamp:timestamp,
        };

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