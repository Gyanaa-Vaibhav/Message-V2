import React from "react";
import {User} from "../../types/ChatLayout.ts";
import {useUserContext} from "../../../ChatBox/ChatContext.tsx";

export default function useResetUnreadCount(){
    const {setUsersList,userId} = useUserContext()

    React.useEffect(() => {
        /*
            Makes the user_count : 0 if the message is
            received by current user
            and Resets the userCount to clicked user
        */
        setUsersList((prev) => {
            const data: User[] = [];
            let hasChanged = false;

            prev.forEach((m) => {
                if (m.recipient_id === userId && m.unread_count > 0) {
                    // Reset unread_count for active user
                    data.push({ ...m, unread_count: 0 });
                    // Mark that a change occurred
                    hasChanged = true;
                } else {
                    // Keep other users unchanged
                    data.push(m);
                }
            });
            // Only update the state if changes were made
            return hasChanged ? data : prev;
        });
    },[setUsersList, userId])
}