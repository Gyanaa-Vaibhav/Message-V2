import ChatBox from "./ChatBox/components/ChatBox.tsx";
import ChatLayout from "./ChatLayout/components/ChatLayout.tsx";
import './MainChat.css'
import React from "react";

export default function MainChat() {
    const [activeUser, setActiveUser] = React.useState<string>('');
    const [activeUserId, setActiveUserId] = React.useState<number>(NaN);
    const [selectedUser, setSelectedUser] = React.useState<string>('');
    const [selectedUserId, setSelectedUserId] = React.useState<number>(NaN);

    React.useEffect(() => {
        const token = localStorage.getItem('auth');
        if (token) {
            fetch('http://localhost:5172/me', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data?.user?.user) {
                        setActiveUserId(Number(data.user.userId))
                        setActiveUser(data.user.user);
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
                    activeUser={activeUser}
                    activeUserId={activeUserId}
                    userId={selectedUserId}
                />
            </div>
        </>
    )
}