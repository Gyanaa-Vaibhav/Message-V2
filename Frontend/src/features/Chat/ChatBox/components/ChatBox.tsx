import '../styles/ChatBox.css';
import {io, Socket} from 'socket.io-client';
import React from "react";

import StarAnimation from "../../../LandingPage/components/StarAnimation.tsx";
import send from '/svg/send_icon.svg?url'
import UploadHandler from "./UploadHandler.tsx";

const SOCKET_URL  = 'http://localhost:5172'

type Props = {
    user: string;
    activeUser: string;
};

const ChatBox = ({user}:Props) => {
    const [socket,setSocket] = React.useState<Socket | null>(null);
    const [outGoingMessage,setOutGoingMessage] = React.useState<string>('');
    const [messages,setMessages] = React.useState<string[]>([]);

    const sendMessage = () => {
        if (socket && outGoingMessage) {
            socket.emit('message', {message:outGoingMessage,to:user});
            setOutGoingMessage('');
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            sendMessage()
        }
    };

    React.useEffect(()=>{
        const server = io(SOCKET_URL)
        setSocket(server);

        server.on('connect',() =>{
            console.log('Connected to WebSocket server');
        })

        server.emit('register', user);

        return ()=>{
            server.close()
        }
    },[])

    React.useEffect(() => {
        if(!socket) return

        socket.on('sendMessage', ({ message, from }) => {
            console.log(`Message from ${from}: ${message}`);
            if (from === user) {
                setMessages((prev) => [...prev, message]);
            }
        });

        return ()=> {
            socket.off('sendMessage')
        }

    },[socket,user])

    const token = localStorage.getItem('auth')

    React.useEffect(()=>{
        setMessages([])
        if(!user) return
        fetch(`http://localhost:5172/message/${user}`,{
            method:'GET',
            headers:{
                'authorization' : `Bearer ${token}`
            }
        })
            .then(res=>res.json())
            .then(data => {
                console.log("Message Data",data)
                data.message.map((m:{user:string,time:string,message:string})=>setMessages(prev => [...prev,m.message]))
            })
    },[user,token])

    return (
        <>
            <StarAnimation/>
            <UploadHandler socket={socket}>
                <div className='chat-container'>
                    {messages.map((m,i)=><p className='message' key={i}>{m}</p>)}
                </div>
                <div className='input-container'>
                    <div className='message-container'>
                        <input
                            type="text"
                            name="message"
                            id="message"
                            value={outGoingMessage}
                            autoComplete='off'
                            onChange={(event: React.ChangeEvent<HTMLInputElement>)=>setOutGoingMessage(event.target.value)}
                            onKeyDown={handleKeyDown}
                        />

                        <img
                            src={send}
                            alt="Send Arrow"
                            onClick={sendMessage}
                        />
                    </div>
                </div>
            </UploadHandler>
        </>
    );
}

export default ChatBox;
