// socketHandlers.ts
import {Message} from "../../types/ChatBox.ts";
import {
    SendMessageParams
} from "./handelMessagesTypes.ts";
import {encryptMessage} from "../../../../../shared/messageEncryption/messageEncryptionExports.ts";

const sendMessage = (props: SendMessageParams) => {
    const {socket, outGoingMessage, setMessages, setOutGoingMessage,textareaRef,activeUserId,userId,setUsersList} = props
    if(!socket || !outGoingMessage || !textareaRef.current) return
    const timestamp = new Date().toISOString();

    const encryptedMessage = encryptMessage(outGoingMessage)
    const message: Message = {
        message: encryptedMessage,
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
                    // Setting last message to the recent message
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

    // Checks if message is sent to self
    const self = message.activeUserId === message.userId
    // if the user is sending to self no need to update the Messages State
    if(!self) setMessages((prev) => [...prev, {...message}]);

    // Clear the outgoing message input field
    setOutGoingMessage('');
    textareaRef.current.style.height = '1.5em';
}

export {sendMessage}