import {HandelMessageFromNewUser} from "./handelMessagesTypes.ts";

export default async function handelMessageFromNewUser ({ message, setUsersList, usersList, from }:HandelMessageFromNewUser){
    // Added user to the UserList object if already not available
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
}