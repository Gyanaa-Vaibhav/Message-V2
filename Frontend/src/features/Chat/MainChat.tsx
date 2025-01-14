import ChatBox from "./ChatBox/components/ChatBox.tsx";
import ChatLayout from "./ChatLayout/components/ChatLayout.tsx";
import './MainChat.css'
import React from "react";

export default function MainChat() {
    const [activeUser, setActiveUser] = React.useState<string>('');
    const [activeUserId, setActiveUserId] = React.useState<number>(NaN);
    const [activeUserEmail, setActiveUserEmail] = React.useState<string>('');
    const [selectedUser, setSelectedUser] = React.useState<string>('');
    const [selectedUserId, setSelectedUserId] = React.useState<number>(NaN);

    React.useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            fetch('http://localhost:5172/me', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data)
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
            <div className='chat-screen'>
                <ChatLayout
                    setUser={setSelectedUser}
                    selectedUser={selectedUser}
                    setSelectedUserId={setSelectedUserId}
                />
                <ChatBox
                    user={selectedUser}
                    userEmail={activeUserEmail}
                    activeUser={activeUser}
                    activeUserId={activeUserId}
                    userId={selectedUserId}
                />
            </div>
        </>
    )
}