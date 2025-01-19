import React from "react";
import {useUserContext} from "../../ChatBox/ChatContext.tsx";

const url = import.meta.env.VITE_SERVER_IP ? import.meta.env.VITE_SERVER_IP+'/usersChat' : '/usersChat';
export default function useChatFetch(){
    const { setUsersList } = useUserContext();

    React.useEffect(()=>{
        const token = localStorage.getItem('accessToken')
        setUsersList([])
        fetch(url,{
            method:'GET',
            headers:{
                'authorization' : `Bearer ${token}`
            },
            credentials:'include'
        })
            .then(res=>res.json())
            .then(data => {
                setUsersList(data.users)
            })
    },[setUsersList])
}