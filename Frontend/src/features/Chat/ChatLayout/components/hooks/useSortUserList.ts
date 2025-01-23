import React from "react";
import {useUserContext} from "../../../ChatBox/ChatContext.tsx";

export default function useSortUserList(){
    const { setUsersList, messages } = useUserContext();

    React.useEffect(()=>{
        setUsersList(prev=>{
            return prev.sort((a,b)=>{
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            })
        })
    },[messages, setUsersList])
}