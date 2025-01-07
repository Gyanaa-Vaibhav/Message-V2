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

type Message = {
    message:string,
    sender:string,
    recipient:string,
    time:string
}

const ChatBox = ({user,activeUser}:Props) => {
    const [socket,setSocket] = React.useState<Socket | null>(null);
    const [outGoingMessage,setOutGoingMessage] = React.useState<string>('');
    const [messages,setMessages] = React.useState<string[]>([]);

    const sendMessage = () => {
        if (socket && outGoingMessage) {
            socket.emit('message', { message: outGoingMessage, to: user });
            setMessages((prev) => [...prev, `You: ${outGoingMessage}`]);
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

        return ()=>{
            server.close()
        }
    },[])

    React.useEffect(() => {
        if (!socket) return;

        const handleSendMessage = ({ message, from }:any) => {
            console.log(`Message received from ${from}: ${message}`);
            if (from === user) {
                setMessages((prev) => [...prev, message]);
            }
        };

        socket.on('sendMessage', handleSendMessage);

        return () => {
            socket.off('sendMessage', handleSendMessage);
        };
    }, [socket, user]);

    React.useEffect(() => {
        if (socket && activeUser) {
            socket.emit('register', activeUser);
        }
    }, [socket, activeUser]);

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
                if(!data.success) return
                const jsxMsg = data.message.map((m:Message)=> {
                const time = new Date(m.time).toLocaleTimeString()
                    console.log((m.sender).toLowerCase() === activeUser ? 'self' : '')
                    setMessages(prev => [...prev, m.message])
                    return(
                        <div key={m.message} className={`message ${(m.sender).toLowerCase() === activeUser ? 'self' : ''}`}>
                            <div className='message-bubble'>
                                <div className='message-user-info'>
                                    <p className='user'>{m.sender}</p>
                                    <p className='time'>{time.slice(0,-3)}</p>
                                </div>
                                <p className='user-message'>{m.message}</p>
                            </div>
                        </div>
                    )
                })
                setMessages(jsxMsg)
            })
    },[user,token])

    return (
        <>
            <StarAnimation/>
            <UploadHandler socket={socket}>
                <div className='chat-container'>
                    <>
                        <div className='message-bubble'>
                            <div className='message-user-info'>
                                <p className='user'>User</p>
                                <p className='time'>12:00</p>
                            </div>
                            <p className='message'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, animi at consequuntur dicta earum eos .</p>
                        </div>
                    </>
                    {messages.map((m)=><>{m}</>)}
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
