import React from "react";
import {User, UserSearch} from "../types/ChatLayout.ts";

type Props = {
    searching: boolean,
    username:string,
    id:number,
    setUsersList: (value: React.SetStateAction<User[]>) => void,
    setUser: (value: React.SetStateAction<{
        name: string,
        img: string
    }>) => void,
    usersList: User[],
    setUserId: (value: React.SetStateAction<number>) => void,
    setSearchData: (value: React.SetStateAction<UserSearch[]>) => void,
    setSearching: (value: React.SetStateAction<boolean>) => void,
}

export function handelUserAdd(props:Props){
    const {searching,setUsersList,username,id,setUser,usersList,setUserId,setSearching,setSearchData} = props
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
    setUser({name:username,img:''})
    setUserId(id)
    setSearchData([]);
    setSearching(false);
}