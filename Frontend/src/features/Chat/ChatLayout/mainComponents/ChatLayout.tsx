import '../mainStyles/ChatLayout.css';
import SearchBar from "./SearchBar.tsx";
import React from "react";
import {User, UserSearch} from "../types/ChatLayout.ts";
import {useUserContext} from "../../ChatBox/ChatContext.tsx";
import useChatFetch from "../utils/useChatFetch.ts";
import useUnreadMessages from "../utils/useUnreadMessages.ts";
import UserProfile from "../components/UserProfile.tsx";
import SearchUserProfile from "../components/SearchUserProfile.tsx";

const ChatLayout = () => {

    // Custom Hooks
    useChatFetch()
    useUnreadMessages()

    // Global Context
    const { userId, setUserId, user, setUser, usersList, setUsersList } = useUserContext();

    // Custom States
    const [searching,setSearching] = React.useState<boolean>(false);
    const [searchData,setSearchData] = React.useState<UserSearch[]>([]);
    const [firstSearch,setFirstSearch] = React.useState<boolean>(false);

    // Custom Objects
    const handelUserAddObject = {searching,setUsersList,setUser,usersList,setUserId,setSearching,setSearchData}

    React.useEffect(()=>{
        if(!firstSearch) if(searching) setFirstSearch(true)
    },[firstSearch, searching])

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


    return (
        <>
            <aside className='chat-layout'>
                <SearchBar setSearching={setSearching} setSearchData={setSearchData} searching={searching}/>
                {!searching
                    ? <>
                        <div key={'AI'} className='user-chat'>
                            <div className='profile-image'>
                                <svg
                                    width="24px"
                                    height="24px"
                                    fill="#000000"
                                    viewBox="0 -960 960 960"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M160-360q-50 0-85-35t-35-85q0-50 35-85t85-35v-80q0-33 23.5-56.5T240-760h120q0-50 35-85t85-35q50 0 85 35t35 85h120q33 0 56.5 23.5T800-680v80q50 0 85 35t35 85q0 50-35 85t-85 35v160q0 33-23.5 56.5T720-120H240q-33 0-56.5-23.5T160-200v-160Zm200-80q25 0 42.5-17.5T420-500q0-25-17.5-42.5T360-560q-25 0-42.5 17.5T300-500q0 25 17.5 42.5T360-440Zm240 0q25 0 42.5-17.5T660-500q0-25-17.5-42.5T600-560q-25 0-42.5 17.5T540-500q0 25 17.5 42.5T600-440ZM320-280h320v-80H320v80Zm-80 80h480v-480H240v480Zm240-240Z"/>
                                </svg>
                            </div>
                            <div className='user-details'>
                                <div className='user-name'>
                                    <h4>AI</h4>
                                    <p>12:00</p>
                                </div>
                                <p>Last Sent Text/Message</p>
                            </div>
                        </div>
                        {usersList.map((m,i) =>
                            <UserProfile
                                m={m}
                                key={i}
                                user={user}
                                userId={userId}
                                setUser={setUser}
                                setUserId={setUserId}
                            />
                        )}
                    </>
                    : searchData.map((m,i)=>(
                        <SearchUserProfile
                            m={m}
                            key={i}
                            handelUserAddObject={handelUserAddObject}
                        />
                        )
                    )
                }
            </aside>
        </>
    );
}

export default ChatLayout;
