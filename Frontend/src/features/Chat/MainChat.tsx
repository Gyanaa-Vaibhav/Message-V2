import ChatBox from "./ChatBox/components/ChatBox.tsx";
import ChatLayout from "./ChatLayout/components/ChatLayout.tsx";
import './MainChat.css'
import React from "react";
import {UserProvider} from "./ChatBox/ChatContext.tsx";

export default function MainChat() {
    const [activeUser, setActiveUser] = React.useState<string>('');
    const [activeUserId, setActiveUserId] = React.useState<number>(NaN);
    const [activeUserEmail, setActiveUserEmail] = React.useState<string>('');

    React.useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            fetch('http://localhost:5172/me', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("Me",data)
                    if (data?.user) {
                        setActiveUserId(Number(data.user.user_id))
                        setActiveUser(data.user.user);
                        setActiveUserEmail(data.user.email)
                    }
                });
        }
    }, []);

    return(
        <>
            <UserProvider>
            <div className='chat-screen'>
                <ChatLayout/>
                <ChatBox
                    userEmail={activeUserEmail}
                    activeUser={activeUser}
                    activeUserId={activeUserId}
                />
            </div>
            </UserProvider>
        </>
    )
}