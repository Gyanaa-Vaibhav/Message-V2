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
    // const [userChat, setUserChat] = React.useState<JSX.Element[]>([]);

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
                console.log(data.users)
                setUsersList(data.users)
            })
    },[setUsersList])

    React.useEffect(() => {
        // Makes the user_count : 0 if the message is received by current user
        setUsersList((prev) => {
            const data: User[] = [];
            let hasChanged = false;

            prev.forEach((m) => {
                if (m.message === undefined) return;

                if (m.recipient_id === userId && m.unread_count > 0) {
                    data.push({ ...m, unread_count: 0 }); // Reset unread_count for active user
                    hasChanged = true; // Mark that a change occurred
                } else {
                    data.push(m); // Keep other users unchanged
                }
            });

            // Only update the state if changes were made
            return hasChanged ? data : prev;
        });
    }, [usersList, userId, setUsersList, setMessages]);


    const handleUserClick = React.useCallback((username: string,id:number) => {
        if(user === username) return;

        setMessages((prevMessages) => {
            const activeUser = usersList.find((user) => user.recipient_id === id);
            console.log(activeUser)
            const unreadCount = activeUser?.unread_count || 0;
            console.log(unreadCount)

            if (unreadCount > 0) {
                const splitIndex = prevMessages.length - unreadCount;

                const remainingMessages = prevMessages.slice(0, splitIndex);
                console.log("Old messages",remainingMessages)
                const unreadMessages = prevMessages.slice(splitIndex);
                console.log("Unread Messages",unreadMessages)

                const systemMessage = {
                    message: "Unread Messages Begin Here",
                    system: true,
                };

                return [...remainingMessages, systemMessage, ...unreadMessages];
            }

            return prevMessages; // No unread messages to process
        });

        setTimeout(()=>{
            setUsersList((prev)=>{
                const data:User[] = [];
                prev.map(m=>{
                    if (m.message === undefined) return;
                    if(m.recipient_id === id){
                        data.push({...m,unread_count:0})
                        return;
                    }
                    return data.push(m);
                })
                return data
            })
        },1000)
        // setUsersList((prev)=>{
        //     const data:User[] = [];
        //     prev.map(m=>{
        //         if (m.message === undefined) return;
        //         if(m.recipient_id === id){
        //             data.push({...m,unread_count:0})
        //             return;
        //         }
        //         return data.push(m);
        //     })
        //     return data
        // })

        setUser(username)
        setUserId(id)

    },[user, setUsersList, setUser, setUserId]);

    function handelUserAdd(username: string,id:number){
        if(searching) {
            const userExists = usersList.some(m => m.recipient_id === id);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setUsersList(prev=> {
                if (userExists) return [...prev]
                return [...prev, {recipient_username: username, recipient_id: id}]
            })
        }
        setSearchData([]);
        setSearching(false);
    }

    const searchList = searchData.map(m=>{
        return(
            <>
                <div
                    key={m.username}
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
            </>
        )
    })

    // React.useEffect(()=>{
    //     const userChats:JSX.Element[] = usersList.map(m=> {
    //         const date = new Date(m.timestamp)
    //         const hours = String(date.getHours()).padStart(2, '0');
    //         const minutes = String(date.getMinutes()).padStart(2, '0');
    //         const time = `${hours}:${minutes}`;
    //
    //         return(
    //             <div
    //                 key={m.name}
    //                 onClick={()=> {
    //                     handleUserClick(m.recipient_username,m.recipient_id)
    //                 }}
    //                 className={`user-chat${userId === m.recipient_id ? ' selected' : ''}${isNaN(new Date(date).getTime()) ? ' new-user-chat' : ''}`
    //                 }
    //             >
    //                 <div className='profile-image'>
    //                     <img src={m.profile_picture ? m.profile_picture :Account_img} alt="User Polfile Image"/>
    //                 </div>
    //                 <div className='user-details'>
    //                     <div className='user-name'>
    //                         <h4>{m.recipient_username}</h4>
    //                         <p id={Number(m.unread_count) > 0 ? 'unread-time' : ''}>{isNaN(new Date(date).getTime()) ? '' :time}</p>
    //                     </div>
    //                     <div className="chat-box-message-container">
    //                         <p className="user-chat-last-message">{m.message}</p>
    //                         {Number(m.unread_count) > 0 && userId !== m.recipient_id && (
    //                             <div className="chat-box-new-message-indicator">
    //                                 <div className="indicator-dot">
    //                                     <svg
    //                                         width="15px"
    //                                         height="15px"
    //                                         viewBox="-2.88 -2.88 21.76 21.76"
    //                                         xmlns="http://www.w3.org/2000/svg"
    //                                         fill="#00a884"
    //                                         className="bi bi-circle-fill"
    //                                         stroke="#00a884"
    //                                     >
    //                                         <circle cx="8" cy="8" r="8"></circle>
    //                                     </svg>
    //                                     {Number(m.unread_count) > 0 && (
    //                                         <span className={`message-count ${Number(m.unread_count) <= 9 ? 'l_9' : ''}`}>{Number(m.unread_count) >= 10 ? '9+' : Number(m.unread_count)}</span>
    //                                     )}
    //                                 </div>
    //                             </div>
    //                         )}
    //                     </div>
    //                 </div>
    //             </div>
    //         )
    //     })
    //
    //     setUserChat(userChats)
    //
    // }, [handleUserClick,userId, usersList])

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
                        {usersList.map((m) => {
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
                    : searchList}
            </aside>
        </>
    );
}

export default ChatLayout;
