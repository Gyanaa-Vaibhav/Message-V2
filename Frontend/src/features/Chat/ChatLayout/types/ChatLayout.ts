// types for ChatLayout
import {Dispatch, SetStateAction} from "react";

type User = {
    seen: boolean|undefined;
    // name: string;
    message: string;
    recipient_username:string,
    timestamp: string;
    recipient_id:number;
    profile_picture:string,
    unread_count:number,
    public_key:string
};


type Props = {
    setUser: Dispatch<SetStateAction<string>>;
    user: string;
    setUserId:Dispatch<SetStateAction<number>>;
    userId:number;
    setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
    usersList: User[];
};

type UserSearch = {
    username: string;
    user_id:number,
    public_key:string,
}

export type {User,Props,UserSearch}