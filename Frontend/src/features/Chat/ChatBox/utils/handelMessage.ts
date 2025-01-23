// socketHandlers.ts
import {Message, MessageData} from "../types/ChatBox.ts";
import React from "react";
import {Socket} from "socket.io-client";
import {User} from "../../ChatLayout/types/ChatLayout.ts";

type Props = {
    messageData : MessageData,
    userId:number,
    usersList: User[],
    setMessages:React.Dispatch<React.SetStateAction<Message[]>>
    setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
}

const handleSendMessage = async ({ messageData, userId, setMessages, setUsersList, usersList }: Props) => {
    const { message, from } = messageData;
    const timestamp = new Date().toISOString();

    setUsersList((prevUsersList) => {
        const userExist = prevUsersList.some((m) => m.recipient_id === message.activeUserId);

        if (!userExist) {
            console.log('user not found');

            // Temporarily add user with a placeholder until data is fetched
            return [
                {
                    seen: false,
                    message: message.message,
                    recipient_username: 'Loading...',  // Placeholder
                    timestamp,
                    recipient_id: message.activeUserId,
                    profile_picture: '',
                    unread_count: 1,
                    public_key:'Loading...', // Placeholder
                },
                ...prevUsersList
            ];
        } else {
            return prevUsersList.map((chat) =>
                chat.recipient_id === Number(from)
                    ? {
                        ...chat,
                        message: message.message,
                        timestamp,
                        unread_count: Number(chat.unread_count) + 1,
                    }
                    : chat
            );
        }
    });

    // Fetch user data separately after checking existence
    const userExist = usersList.some((m) => m.recipient_id === message.activeUserId);
    if (!userExist) {
        const url = import.meta.env.VITE_SERVER_IP
            ? import.meta.env.VITE_SERVER_IP + `/users/${message.activeUserId}`
            : `/users/${message.activeUserId}`;

        try {
            const res = await fetch(url);
            const data = await res.json();
            const userName = data.usersData.username;
            const profile_picture = data.usersData.profile_picture;
            const public_key = data.usersData.public_key;

            // Update the placeholder entry with the actual data
            setUsersList((currentChats) =>
                currentChats.map((chat) =>
                    chat.recipient_id === message.activeUserId
                        ? {
                            ...chat,
                            recipient_username: userName,
                            profile_picture,
                            public_key,
                        }
                        : chat
                )
            );
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    if (Number(from) === userId) {
        setMessages((prev) => [...prev, message]);
    }
};

export type SendMessageParams = {
    socket: Socket | null;
    outGoingMessage: string;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    setOutGoingMessage: React.Dispatch<React.SetStateAction<string>>;
    textareaRef:React.RefObject<HTMLTextAreaElement>;
    userId:number;
    activeUserId:number;
    setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
};

const sendMessage = (props: SendMessageParams) => {
    const {socket, outGoingMessage, setMessages, setOutGoingMessage,textareaRef,activeUserId,userId,setUsersList} = props
    if (socket && outGoingMessage) {
        const timestamp = new Date().toISOString();
        const message: Message = {
            message: outGoingMessage,
            activeUserId:activeUserId,
            userId:userId,
            timestamp:timestamp,
            seen:null
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

        // if the user is sending to self no need to update the DOM
        if(message.activeUserId !== message.userId){
            // Update the messages state with the new message
            setMessages((prev) => [...prev, {...message}]);
        }

        // Clear the outgoing message input field
        setOutGoingMessage('');
        if(textareaRef.current) textareaRef.current.style.height = '1.5em';
    }
};

export type HandleInputChange = {
    event:React.ChangeEvent<HTMLTextAreaElement>,
    setOutGoingMessage: React.Dispatch<React.SetStateAction<string>>
    socket: Socket | null;
    userId:number;
    isUserTyping:boolean
}

const handleInputChange = ({event,setOutGoingMessage,socket,userId,isUserTyping}:HandleInputChange) => {
    const textarea = event.target;
    setOutGoingMessage(textarea.value);

    textarea.style.height=`auto`

    // Resize the textarea to fit the content
    if (textarea.scrollHeight > textarea.clientHeight) {
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 4 * 1.5 * parseFloat(getComputedStyle(textarea).fontSize))}px`;
    }
    handelTypingIndicator({socket,userId,isUserTyping})
};

type HandelTypingIndicator = {
    socket: Socket | null;
    userId:number;
    isUserTyping:boolean,
}

const typingTimeouts: { [key: number]: NodeJS.Timeout | null } = {};

function handelTypingIndicator({ socket, userId, isUserTyping }: HandelTypingIndicator) {
    // Clear the previous timeout if it exists
    if (typingTimeouts[userId]) {
        clearTimeout(typingTimeouts[userId]);
        typingTimeouts[userId] = null;
    }

    if (!isUserTyping) {
        // Emit "typing" event
        socket?.emit('typing', { to: userId });

        // Set a new timeout to emit "typingOff" after 2500ms
        typingTimeouts[userId] = setTimeout(() => {
            socket?.emit('typingOff', { to: userId });
            typingTimeouts[userId] = null; // Clear the timeout reference
        }, 2500);
    }
}

export {handleSendMessage,sendMessage,handleInputChange}