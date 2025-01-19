import React from "react";
import {useUserContext} from "../../ChatBox/ChatContext.tsx";

export default function useUnreadMessages(){
    const { userId, usersList, setUsersList,messages,setMessages } = useUserContext();

    React.useEffect(() => {
        if (!userId || usersList.length === 0) return; // Ensure valid userId and non-empty usersList

        // Find the clicked user
        const clickedUser = usersList.find((user) => user.recipient_id === userId);
        if (!clickedUser) return

        // Get unread messages count
        const unreadCount = clickedUser.unread_count || 0;
        // Process unread messages only if unreadCount > 0
        setMessages((prevMessages) => {
            // to prevent from rendering to everyone
            const userExists = prevMessages.some((m) => m.userId === userId);
            // without this the loop evaluates the old messages form old user
            for (let i = 0; i <= 1; i++) {
                if (prevMessages.length > 0 && !userExists) continue;
                // if unread is more than 1 because when the message is sent it is counted to 1 so to prevent it start from 1
                if (unreadCount > 1) {
                    const splitIndex = prevMessages.length - unreadCount;
                    const remainingMessages = prevMessages.slice(0, splitIndex);
                    const unreadMessages = prevMessages.slice(splitIndex);
                    const systemMessage = {
                        timestamp:'',
                        userId: -100,
                        activeUserId:-100,
                        message: `${unreadCount} Unread Messages`,
                        system: true,
                        seen:true,
                    };

                    return [...remainingMessages, systemMessage, ...unreadMessages];
                }
            }
            return prevMessages;
        });

        // Reset unread_count only if necessary
        const updatedUsersList = usersList.map((user) =>
            user.recipient_id === userId && user.unread_count > 0
                ? { ...user, unread_count: 0 }
                : user
        );

        // Compare the updated usersList with the current one to avoid unnecessary updates
        if (JSON.stringify(usersList) !== JSON.stringify(updatedUsersList)) {
            setUsersList(updatedUsersList);
        }
    }, [messages]);
}