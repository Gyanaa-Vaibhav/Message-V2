import {HandleSendMessage} from "./handelMessagesTypes.ts";
import handelMessageFromNewUser from "./handelMessageFromNewUser.ts";

export default async function handleReceiveMessage({ messageData, userId, setMessages, setUsersList, usersList }: HandleSendMessage) {
    const { message, from } = messageData;

    // Added user to the UserList object if already not available
    await handelMessageFromNewUser({message, setUsersList, usersList, from})

    // If message is from the current user Update the message list
    if (Number(from) === userId) {
        setMessages((prev) => [...prev, message]);
    }
}