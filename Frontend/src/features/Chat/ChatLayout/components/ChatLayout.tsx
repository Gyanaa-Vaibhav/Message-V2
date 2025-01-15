import '../styles/ChatLayout.css';
import SearchBar from "./SearchBar.tsx";
import React from "react";
import Account_img from '/svg/account_circle_icon.svg?url'
import {UserSearch} from "../types/ChatLayout.ts";
import {useUserContext} from "../../ChatBox/ChatContext.tsx";

const ChatLayout = () => {

    const { userId, setUserId, user, setUser, usersList, setUsersList } = useUserContext();

    const [searching,setSearching] = React.useState<boolean>(false);
    const [searchData,setSearchData] = React.useState<UserSearch[]>([]);

    const handleUserClick = (username: string,id?:number) => {
        if(user === username) return;
        setUser(username)
        if(id) setUserId(id)
        setSearchData([]);
    };

    React.useEffect(()=>{
        const token = localStorage.getItem('accessToken')
        setUsersList([])
        fetch('http://localhost:5172/usersChat',{
            method:'GET',
            headers:{
                'authorization' : `Bearer ${token}`
            }
        })
            .then(res=>res.json())
            .then(data => {
                console.log(data.users)
                setUsersList(data.users)
            })
    },[])

    const searchList = searchData.map(m=>{
        return(
            <>
                <div
                    key={m.username}
                    onClick={()=> {
                        setUserId(m.user_id);
                        handleUserClick(m.username,m.user_id)
                    }}
                    className={'user-chat-search'}
                >
                    <img src={Account_img} alt="U"/>
                    <div className='user-details'>
                        <div className='user-name'>
                            <h4>{m.username}</h4>
                        </div>
                    </div>
                </div>
            </>
        )
    })

    const userChat:JSX.Element[] = usersList.map(m=> {
        const date = new Date(m.timestamp)
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const time = `${hours}:${minutes}`;
        return(
            <div
                key={m.name}
                onClick={()=> {
                    setUserId(m.recipient_id);
                    handleUserClick(m.recipient_username)
                }}
                className={`user-chat ${userId === m.recipient_id ? 'selected' : ''}`}
            >
                <img src={m.profile_picture ? m.profile_picture :Account_img} alt="User Polfile Image"/>
                <div className='user-details'>
                    <div className='user-name'>
                        <h4>{m.recipient_username}</h4>
                        <p>{time}</p>
                    </div>
                    <p className='user-chat-last-message'>{m.message}</p>
                </div>
            </div>
        )
    })

    return (
        <>
            <aside className='chat-layout'>
                <SearchBar setSearching={setSearching} setSearchData={setSearchData} searching={searching}/>
                {!searching
                    ?
                    <>
                        <div className='user-chat'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M160-360q-50 0-85-35t-35-85q0-50 35-85t85-35v-80q0-33 23.5-56.5T240-760h120q0-50 35-85t85-35q50 0 85 35t35 85h120q33 0 56.5 23.5T800-680v80q50 0 85 35t35 85q0 50-35 85t-85 35v160q0 33-23.5 56.5T720-120H240q-33 0-56.5-23.5T160-200v-160Zm200-80q25 0 42.5-17.5T420-500q0-25-17.5-42.5T360-560q-25 0-42.5 17.5T300-500q0 25 17.5 42.5T360-440Zm240 0q25 0 42.5-17.5T660-500q0-25-17.5-42.5T600-560q-25 0-42.5 17.5T540-500q0 25 17.5 42.5T600-440ZM320-280h320v-80H320v80Zm-80 80h480v-480H240v480Zm240-240Z"/></svg>
                            <div className='user-details'>
                                <div className='user-name'>
                                    <h4>AI</h4>
                                    <p>12:00</p>
                                </div>
                                <p>Last Sent Text/Message</p>
                            </div>
                        </div>
                        {userChat}
                    </>
                    : searchList}
            </aside>
        </>
    );
}

export default ChatLayout;
