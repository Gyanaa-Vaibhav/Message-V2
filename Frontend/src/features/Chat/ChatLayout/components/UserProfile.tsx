import Account_img from '/svg/account_circle_icon.svg?url'
import {User} from "../types/ChatLayout.ts";
import React from "react";
import {useUserContext} from "../../ChatBox/ChatContext.tsx";

type Props = {
    m: User,
}

export default function UserProfile({m}:Props){

    const {userId,setUserId,setUser,user,setUserPublicKey} = useUserContext();

    const handleUserClick = React.useCallback((username: string, id: number,profile_picture:string,public_key:string) => {
        if (user.name === username) return;

        setUser({name:username,img:profile_picture})
        setUserId(id)
        setUserPublicKey(public_key)

    },[user, setUser, setUserId, setUserPublicKey]);

    const date = new Date(m.timestamp)
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;

    return(
        <div
            onClick={()=> {
                handleUserClick(m.recipient_username,m.recipient_id,m.profile_picture,m.public_key)
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
}