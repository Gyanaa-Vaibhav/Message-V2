import '../styles/ChatLayout.css';
import SearchBar from "./SearchBar.tsx";
import React, {Dispatch, SetStateAction} from "react";

type User = {
    name: string;
    message: string;
    timestamp: string;
    recipient_id:number;
};

type Props = {
    setUser: Dispatch<SetStateAction<string>>;
    selectedUser: string;
    setSelectedUserId:Dispatch<SetStateAction<number>>;
};

const ChatLayout = ({setUser,selectedUser,setSelectedUserId}:Props) => {
    const [users,setUsers] = React.useState<User[]>([])

    const handleUserClick = (user: string) => {
        setUser(user)
    };


    React.useEffect(()=>{
        const token = localStorage.getItem('auth')
        setUsers([])
        fetch('http://localhost:5172/users',{
            method:'GET',
            headers:{
                'authorization' : `Bearer ${token}`
            }
        })
            .then(res=>res.json())
            .then(data => {
                setUsers(data.users)
            })
    },[])

    const userChat:JSX.Element[] = users.map(m=> {
        const date = new Date(m.timestamp)
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const time = `${hours}:${minutes}`;

        return(
            <div
                key={m.name}
                onClick={()=> {
                    setSelectedUserId(m.recipient_id);
                    handleUserClick(m.name)
                }}
                className={`user-chat ${selectedUser === m.name ? 'selected' : ''}`}
            >
                <img src="url" alt="U"/>
                <div className='user-details'>
                    <div className='user-name'>
                        <h4>{m.name}</h4>
                        <p className='user-chat-last-message'>{m.message}</p>
                    </div>
                    <p>{time}</p>
                </div>
            </div>
        )
    })

    return (
        <>
            <aside className='chat-layout'>
                <SearchBar/>
                <div className='user-chat'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M160-360q-50 0-85-35t-35-85q0-50 35-85t85-35v-80q0-33 23.5-56.5T240-760h120q0-50 35-85t85-35q50 0 85 35t35 85h120q33 0 56.5 23.5T800-680v80q50 0 85 35t35 85q0 50-35 85t-85 35v160q0 33-23.5 56.5T720-120H240q-33 0-56.5-23.5T160-200v-160Zm200-80q25 0 42.5-17.5T420-500q0-25-17.5-42.5T360-560q-25 0-42.5 17.5T300-500q0 25 17.5 42.5T360-440Zm240 0q25 0 42.5-17.5T660-500q0-25-17.5-42.5T600-560q-25 0-42.5 17.5T540-500q0 25 17.5 42.5T600-440ZM320-280h320v-80H320v80Zm-80 80h480v-480H240v480Zm240-240Z"/></svg>
                    <div className='user-details'>
                        <div className='user-name'>
                            <h4>AI</h4>
                            <p>Last Sent Text/Message</p>
                        </div>
                        <p>12:00</p>
                    </div>
                </div>
                {userChat}
            </aside>
        </>
    );
}

export default ChatLayout;
