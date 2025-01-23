import React from "react";
import {User, UserSearch} from "../types/ChatLayout.ts";

type Props = {
    searching: boolean,
    username:string,
    id:number,
    public_key:string,
    setUsersList: (value: React.SetStateAction<User[]>) => void,
    setUser: (value: React.SetStateAction<{
        name: string,
        img: string
    }>) => void,
    usersList: User[],
    setUserId: (value: React.SetStateAction<number>) => void,
    setSearchData: (value: React.SetStateAction<UserSearch[]>) => void,
    setSearching: (value: React.SetStateAction<boolean>) => void,
    searchData: UserSearch[],
    setUserPublicKey: React.Dispatch<React.SetStateAction<string>>
}

export function handelUserAdd(props:Props){
    const {searching,setUsersList,username,id,usersList,setSearching,setSearchData,searchData,public_key,setUserPublicKey,setUser,setUserId} = props
    if(searching) {
        const userExists = usersList.some(m => m.recipient_id === id);
        const userData = searchData.find(m=> m.user_id === id)
        if(!userData) return

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
                    public_key:userData.public_key,
                }, ...prev]
        })
    }
    setUser({name:username,img:''})
    setUserId(id)
    setUserPublicKey(public_key)
    setSearchData([]);
    setSearching(false);
}