import '../styles/ChatLayout.css';
import SearchBar from "./SearchBar.tsx";
import React from "react";
import Account_img from '/svg/account_circle_icon.svg?url'
import {User, UserSearch} from "../types/ChatLayout.ts";
import {useUserContext} from "../../ChatBox/ChatContext.tsx";

const ChatLayout = () => {

    // Global Context
    const { userId, setUserId, user, setUser, usersList, setUsersList,messages,setMessages } = useUserContext();

    // Custom States
    const [searching,setSearching] = React.useState<boolean>(false);
    const [searchData,setSearchData] = React.useState<UserSearch[]>([]);
    const [firstSearch,setFirstSearch] = React.useState<boolean>(false);
    React.useEffect(()=>{
        if(!firstSearch) if(searching) setFirstSearch(true)
    },[firstSearch, searching])

    React.useEffect(()=>{
        const token = localStorage.getItem('accessToken')
        setUsersList([])
        fetch('http://localhost:5172/usersChatT',{
            method:'GET',
            headers:{
                'authorization' : `Bearer ${token}`
            }
        })
            .then(res=>res.json())
            .then(data => {
                setUsersList(data.users)
            })
    },[setUsersList])

    React.useEffect(() => {
        const userExists = usersList.some((m) => m.message === undefined);
        // Makes the user_count : 0 if the message is received by current user
        if(!userExists) return
        console.log('running')
        setUsersList((prev) => {
            const data: User[] = [];
            let hasChanged = false;

            prev.forEach((m) => {
                if (m.message === undefined) return;
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
    },[usersList, setUsersList, userId, firstSearch])

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

    const handleUserClick = React.useCallback((username: string, id: number) => {
        if (user === username) return;

        setUser(username)
        setUserId(id)

    },[user, setUser, setUserId]);

    function handelUserAdd(username: string,id:number){
        if(searching) {
            const userExists = usersList.some(m => m.recipient_id === id);

            setUsersList(prev=> {
                if (userExists) return [...prev]
                return [
                    {
                        recipient_username: username,
                        recipient_id: id,
                        timestamp:new Date().toISOString(),
                        message:'Start A new conservation',
                        profile_picture:'',
                        unread_count:0,
                        seen:undefined,
                        name:'',
                    }, ...prev]
            })
        }
        setUser(username)
        setUserId(id)
        setSearchData([]);
        setSearching(false);
    }


    return (
        <>
            <aside className='chat-layout'>
                <SearchBar setSearching={setSearching} setSearchData={setSearchData} searching={searching}/>
                {!searching
                    ?
                    <>
                        <div key={'AI'} className='user-chat'>
                            <div className='profile-image'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M160-360q-50 0-85-35t-35-85q0-50 35-85t85-35v-80q0-33 23.5-56.5T240-760h120q0-50 35-85t85-35q50 0 85 35t35 85h120q33 0 56.5 23.5T800-680v80q50 0 85 35t35 85q0 50-35 85t-85 35v160q0 33-23.5 56.5T720-120H240q-33 0-56.5-23.5T160-200v-160Zm200-80q25 0 42.5-17.5T420-500q0-25-17.5-42.5T360-560q-25 0-42.5 17.5T300-500q0 25 17.5 42.5T360-440Zm240 0q25 0 42.5-17.5T660-500q0-25-17.5-42.5T600-560q-25 0-42.5 17.5T540-500q0 25 17.5 42.5T600-440ZM320-280h320v-80H320v80Zm-80 80h480v-480H240v480Zm240-240Z"/></svg>
                            </div>
                            <div className='user-details'>
                                <div className='user-name'>
                                    <h4>AI</h4>
                                    <p>12:00</p>
                                </div>
                                <p>Last Sent Text/Message</p>
                            </div>
                        </div>
                        {usersList.map((m) => {
                            const date = new Date(m.timestamp)
                            const hours = String(date.getHours()).padStart(2, '0');
                            const minutes = String(date.getMinutes()).padStart(2, '0');
                            const time = `${hours}:${minutes}`;

                            return(
                                <div
                                    key={`${m.recipient_id}-${m.timestamp}`}
                                    onClick={()=> {
                                        handleUserClick(m.recipient_username,m.recipient_id)
                                    }}
                                    className={`user-chat${userId === m.recipient_id ? ' selected' : ''}${isNaN(new Date(date).getTime()) ? ' new-user-chat' : ''}`
                                    }
                                >
                                    <div className='profile-image'>
                                        <img src={m.profile_picture ? m.profile_picture :Account_img} alt="User Polfile Image"/>
                                    </div>
                                    <div className='user-details'>
                                        <div className='user-name'>
                                            <h4>{m.recipient_username}</h4>
                                            <p id={Number(m.unread_count) > 0 ? 'unread-time' : ''}>{isNaN(new Date(date).getTime()) ? '' :time}</p>
                                        </div>
                                        <div className="chat-box-message-container">
                                            <p className="user-chat-last-message">{m.message}</p>
                                            {Number(m.unread_count) > 0 && userId !== m.recipient_id && (
                                                <div className="chat-box-new-message-indicator">
                                                    <div className="indicator-dot">
                                                        <svg
                                                            width="15px"
                                                            height="15px"
                                                            viewBox="-2.88 -2.88 21.76 21.76"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="#00a884"
                                                            className="bi bi-circle-fill"
                                                            stroke="#00a884"
                                                        >
                                                            <circle cx="8" cy="8" r="8"></circle>
                                                        </svg>
                                                        {Number(m.unread_count) > 0 && (
                                                            <span className={`message-count ${Number(m.unread_count) <= 9 ? 'l_9' : ''}`}>{Number(m.unread_count) >= 10 ? '9+' : Number(m.unread_count)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        }
                    </>
                    : searchData.map(m=>(
                            <div
                                key={m.user_id}
                                onClick={()=> handelUserAdd(m.username,m.user_id)}
                                className={'user-chat-search'}
                            >
                                <div className='profile-image'>
                                    <img src={Account_img} alt="U"/>
                                </div>
                                <div className='user-details'>
                                    <div className='user-name'>
                                        <h4>{m.username}</h4>
                                    </div>
                                </div>
                            </div>
                        )
                    )
                }
            </aside>
        </>
    );
}

export default ChatLayout;
