import ChatBox from "./ChatBox/mainComponents/ChatBox.tsx";
import ChatLayout from "./ChatLayout/mainComponents/ChatLayout.tsx";
import './MainChat.css'
import React from "react";
import {UserProvider} from "./ChatBox/ChatContext.tsx";
import {useAuthFetch} from "./ChatLayout/components/hooks/hooksExport.ts";

export default function MainChat() {
    const [success] = useAuthFetch()

    React.useEffect(() => {
        if(!success) {
            return;
        }
        const token = localStorage.getItem('accessToken');
        if (token) {
            fetch('http://localhost:5172/me', {
                headers: { Authorization: `Bearer ${token}` },
                credentials:'include',
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("Me Data",data)
                    if (data?.user) {
                        localStorage.setItem('activeUserId',data.user.user_id)
                        localStorage.setItem('activeUser',data.user.username)
                        localStorage.setItem('activeUserEmail',data.user.email)
                    }
                });
        }
    }, [success]);

    if(!success){
        return (
            <h1>Loading...</h1>
        )
    }

    return(
        <>
            <UserProvider>
            <div className='chat-screen'>
                <ChatLayout/>
                <ChatBox/>
            </div>
            </UserProvider>
        </>
    )
}