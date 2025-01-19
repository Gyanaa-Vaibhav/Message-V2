import {handelUserAdd} from "../utils/handelUserAdd.ts";
import Account_img from '/svg/account_circle_icon.svg?url'
import {User, UserSearch} from "../types/ChatLayout.ts";
import React from "react";

type Props = {
    m: UserSearch,
    handelUserAddObject: {
        searching: boolean,
        setUsersList: React.Dispatch<React.SetStateAction<User[]>>,
        setUser: React.Dispatch<React.SetStateAction<{
            name: string,
            img: string
        }>>,
        usersList: User[],
        setSearching: React.Dispatch<React.SetStateAction<boolean>>,
        setUserId: React.Dispatch<React.SetStateAction<number>>,
        setSearchData: React.Dispatch<React.SetStateAction<UserSearch[]>>,
    }
}

export default function SearchUserProfile({m,handelUserAddObject}:Props){
    return(
        <div
            onClick={()=> handelUserAdd({username:m.username,id: m.user_id,...handelUserAddObject})}
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
}