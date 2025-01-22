import React from "react";
import {Socket} from "socket.io-client";
import {DefaultEventsMap} from "@socket.io/component-emitter";
import {Message} from "../../types/ChatBox.ts";

type Props = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    userId:number,
    activeUserId:number,
    messages: Message[]
}

export default function useSocketReadReceipts({socket,setMessages,activeUserId,userId,messages}:Props){
    React.useEffect(()=>{
        if (!socket) return
        socket.on('delivered',()=>{
            setMessages(prev=>{
                return prev.map(m => {
                    if(m.seen !== null) return m;
                    return {...m,seen:false}
                })
            })
        })

        socket.on('deliveredOnLogin',(data)=>{
            console.log('some one logged')
            const currentUser = messages.some((m)=> m.userId === data.user_id)
            if(currentUser){
                setMessages(prev=>{
                    return prev.map(m => {
                        if(m.seen !== null) return m;
                        return {...m,seen:false}
                    })
                })
            }
        })

        socket.on('userSeen',(prop)=>{
            setMessages(prev=>{
                return prev.map(m => {
                    if(!(m.userId === prop.userId && m.activeUserId === prop.activeUserId || m.userId === prop.activeUserId && m.activeUserId === prop.userId)) return m;
                    return {...m,seen:true}
                })
            })
        })

        socket.on('userInChat',()=>{
            setMessages(prev=>{
                return prev.map(m => {
                    return {...m,seen:true}
                })
            })
        })
    },[activeUserId, setMessages, socket, userId])
}