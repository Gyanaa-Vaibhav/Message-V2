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
    const [userChat, setUserChat] = React.useState<JSX.Element[]>([]);
    const [seen, setSeen] = React.useState<{ [userId: number]: { seen: boolean; count: number } }>({});

    const handleUserClick = React.useCallback((username: string,id:number) => {
        if(user === username) return;

        setSeen((prevSeen) => ({
            ...prevSeen,
            [id]: {
                ...prevSeen[id],
                seen: true,
                count: 0,
            },
        }));

        setUser(username)
        setUserId(id)

    },[user, setUser, setUserId]);

    function handelUserAdd(username: string,id:number){
        if(searching) {
            let userExists = false
            usersList.filter(m => {
                console.log(m.recipient_username,m.recipient_id)
                if(m.recipient_id === id) userExists = true
            })
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setUsersList(prev=> {
                if (userExists) return [...prev]
                return [...prev, {recipient_username: username, recipient_id: id}]
            })
        }
        setSearchData([]);
        setSearching(false);
        console.log(usersList)
    }

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
                setUsersList(data.users)
            })
    },[setUsersList])

    const searchList = searchData.map(m=>{
        return(
            <>
                <div
                    key={m.username}
                    onClick={()=> {
                        setUserId(m.user_id);
                        handelUserAdd(m.username,m.user_id)
                    }}
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
            </>
        )
    })

    React.useEffect(() => {
        setSeen((prevSeen) => {
            const updatedSeen = { ...prevSeen };

            usersList.forEach((m) => {
                // If ID does not Exist Initializing
                if (!updatedSeen[m.recipient_id]) {
                    updatedSeen[m.recipient_id] = {
                        seen: true,
                        count: 0,
                    };

                // Setting seen to false
                }else if (updatedSeen[m.recipient_id].seen){
                    if(userId === m.recipient_id) return
                    updatedSeen[m.recipient_id] = {
                        ...updatedSeen[m.recipient_id],
                        seen: m.seen === undefined,
                        count: updatedSeen[m.recipient_id].count + 1,
                    }

                // Updating the counter
                } else if (!updatedSeen[m.recipient_id].seen) {
                    const sentTime = new Date(m.timestamp).getTime()
                    const now = new Date().getTime()
                    if(!(now - sentTime < 100)) return;
                    updatedSeen[m.recipient_id] = {
                        ...updatedSeen[m.recipient_id],
                        count: updatedSeen[m.recipient_id].count + 1,
                    }
                }
            });
            return updatedSeen;
        });
    }, [userId, usersList]);



    React.useEffect(()=>{
        const userChats:JSX.Element[] = usersList.map(m=> {
            const date = new Date(m.timestamp)
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const time = `${hours}:${minutes}`;

            return(
                <div
                    key={m.name}
                    onClick={()=> {
                        handleUserClick(m.recipient_username,m.recipient_id)
                    }}
                    className={`user-chat
                    ${userId === m.recipient_id ? ' selected' : ''}
                    ${isNaN(date) ? ' new-user-chat' : ''}`
                    }
                >
                    <div className='profile-image'>
                        <img src={m.profile_picture ? m.profile_picture :Account_img} alt="User Polfile Image"/>
                    </div>
                    <div className='user-details'>
                        <div className='user-name'>
                            <h4>{m.recipient_username}</h4>
                            <p id={!seen[m.recipient_id]?.seen ? 'unread-time' : ''}>{isNaN(new Date(date).getTime()) ? '' :time}</p>
                        </div>
                        <div className="chat-box-message-container">
                            <p className="user-chat-last-message">{m.message}</p>
                            {!seen[m.recipient_id]?.seen && userId !== m.recipient_id && (
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
                                        {seen[m.recipient_id]?.count >= 1 && (
                                            <span className={`message-count ${seen[m.recipient_id].count <= 9 ? 'l_9' : ''}`}>{seen[m.recipient_id].count >= 10 ? '9+' : seen[m.recipient_id].count}</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
        })

        setUserChat(userChats)

    }, [seen, handleUserClick,userId, usersList])

    return (
        <>
            <aside className='chat-layout'>
                <SearchBar setSearching={setSearching} setSearchData={setSearchData} searching={searching}/>
                {!searching
                    ?
                    <>
                        <div className='user-chat'>
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
                        {userChat}
                    </>
                    : searchList}
            </aside>
        </>
    );
}

export default ChatLayout;
