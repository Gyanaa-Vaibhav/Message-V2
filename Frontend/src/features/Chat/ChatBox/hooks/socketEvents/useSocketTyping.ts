import React from "react";
import {TypingFormat} from "../../types/ChatBox.ts";
import { Socket } from "socket.io-client";
import {DefaultEventsMap} from '@socket.io/component-emitter'

type Props = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
    setIsUserTyping: React.Dispatch<React.SetStateAction<boolean>>;
    setIsUserTypingId: React.Dispatch<React.SetStateAction<number>>;
    userId:number
}

export default function useSocketTyping({socket,setIsUserTypingId,setIsUserTyping,userId}:Props){
    React.useEffect(() => {
        if (!socket) return;

        const handleTypingUser = (user: TypingFormat) => {
            if(Number(user.from) === userId){
                setIsUserTypingId(Number(user.from));
                setIsUserTyping(true);
            }
        };

        const handleTypingUserOff = () => {
            console.log('Off')
            setIsUserTypingId(NaN);
            setIsUserTyping(false);
        };

        socket.on('userTypingOn', handleTypingUser);
        socket.on('userTypingOff', handleTypingUserOff);

        return () => {
            socket.off('userTypingOn', handleTypingUser);
            socket.off('userTypingOff', handleTypingUserOff);
        };
    }, [setIsUserTyping, setIsUserTypingId, socket, userId]);
}