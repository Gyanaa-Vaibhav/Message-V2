import '../mainStyles/ChatBox.css';
import React, {useRef} from "react";

import StarAnimation from "../../../LandingPage/components/StarAnimation.tsx";
import {Props, Message} from "../types/ChatBox.ts";
import UploadHandler from "./UploadHandler.tsx";
import useSocket from "../hooks/useSocket.ts";
import {handleInputChange, sendMessage} from "../utils/handelMessage.ts";
import decryptPrivateKey from "../../../../shared/decryptPrivateKey.ts";
import {useUserContext} from "../ChatContext.tsx";
import scrollToBottom from "../utils/scrollToBottom.ts";
import UserTyping from "../components/UserTyping.tsx";
import MessagePupUp from "../components/MessagePupUp.tsx";
import MessageInputContainer from "../components/MessageInputContainer.tsx";
import MessageObject from "../components/MessageObject.tsx";

const ChatBox = ({ activeUser,activeUserId,userEmail}:Props) => {

    // Key Verifier
    const key = localStorage.getItem('privateKey')
    try{
        if(key && userEmail) decryptPrivateKey(key,userEmail)
    }catch (e){
        localStorage.removeItem('privateKey')
        window.location.href = '/login'
        console.log(e)
    }

    // Global Context
    const {userId,user,setUsersList,messages,setMessages} = useUserContext()

    // Custom States
    const [outGoingMessage,setOutGoingMessage] = React.useState<string>('');
    // const [messages,setMessages] = React.useState<Message[]>([]);
    const [newMessage, setNewMessage] = React.useState<boolean>(false);
    const [messagePopUp,setMessagePopUp] = React.useState<boolean>(false);
    const [isAtBottom, setIsAtBottom] = React.useState<boolean>(true);
    const [isUserTyping, setIsUserTyping] = React.useState<boolean>(false);
    const [isUserTypingId, setIsUserTypingId] = React.useState<number>(NaN);

    // Socket Initialization
    const socket = useSocket({activeUserId,userId,setNewMessage,setUsersList,setIsUserTyping,setIsUserTypingId});

    // Refs
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const firstLoad = useRef<boolean>(false);

    // Custom Objects
    const messageObject = {socket, outGoingMessage, setMessages, setOutGoingMessage, activeUser,textareaRef,activeUserId,userId,setUsersList}
    const handelChangeObject = {setOutGoingMessage,socket,userId,isUserTyping}
    const scrollToBottomObject = React.useMemo(() => {
        return { isAtBottom, firstLoad, messagesEndRef };
    }, [isAtBottom, firstLoad, messagesEndRef]);


    React.useEffect(() => {
        if(isAtBottom){
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
            }
        }
    }, [isAtBottom, isUserTyping, isUserTypingId]);

    const handleScroll = () => {
        if(!messagesContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;

        if(clientHeight+scrollTop + 100 <= scrollHeight) setMessagePopUp(true)

        if(scrollTop + clientHeight >= scrollHeight){
            setNewMessage(false)
            setMessagePopUp(false);
        }
        if(isAtBottom){
            setMessagePopUp(false)
        }
        setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 30);
    };

    React.useEffect(()=>{
        if(firstLoad.current) firstLoad.current=false;
        if(!textareaRef.current) return
        textareaRef.current.focus();
    },[userId,messages])

    React.useEffect(()=>{
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: 'instant'});
        }
        setNewMessage(false);
    },[userId])

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (outGoingMessage.trim() !== '') {
                sendMessage(messageObject);
            }
        }
    };

    React.useEffect(()=>{
        if(isAtBottom){
            scrollToBottom(scrollToBottomObject)
        }
    },[isAtBottom, messages, scrollToBottomObject])

    React.useCallback(()=> {
        scrollToBottom(scrollToBottomObject)
    },[scrollToBottomObject])

    const m = <>
        <div className='message message-bubble'>
            <div className='message-user-info'>
                <p className='user'>User</p>
                <p className='time'>12:00</p>
            </div>
            <p className='user-message'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, animi at consequuntur dicta earum eos .</p>
        </div>
        <div className='message message-bubble'>
            <div className='message-user-info'>
                <p className='user'>User</p>
                <p className='time'>12:00</p>
            </div>
            <p className='user-message'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, animi at consequuntur dicta earum eos .</p>
        </div>
        <div className='message message-bubble'>
            <div className='message-user-info'>
                <p className='user'>User</p>
                <p className='time'>12:00</p>
            </div>
            <p className='user-message'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, animi at consequuntur dicta earum eos .</p>
        </div>
        <div className='message message-bubble'>
            <div className='message-user-info'>
                <p className='user'>User</p>
                <p className='time'>12:00</p>
            </div>
            <p className='user-message'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, animi at consequuntur dicta earum eos .</p>
        </div>
        <div className='message message-bubble'>
            <div className='message-user-info'>
                <p className='user'>User</p>
                <p className='time'>12:00</p>
            </div>
            <p className='user-message'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, animi at consequuntur dicta earum eos .</p>
        </div>
        <div className='message message-bubble'>
            <div className='message-user-info'>
                <p className='user'>User</p>
                <p className='time'>12:00</p>
            </div>
            <p className='user-message'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, animi at consequuntur dicta earum eos .</p>
        </div>
        <div className='message message-bubble'>
            <div className='message-user-info'>
                <p className='user'>User</p>
                <p className='time'>12:00</p>
            </div>
            <p className='user-message'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, animi at consequuntur dicta earum eos .</p>
        </div>
        <div className='message message-bubble'>
            <div className='message-user-info'>
                <p className='user'>User</p>
                <p className='time'>12:00</p>
            </div>
            <p className='user-message'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, animi at consequuntur dicta earum eos .</p>
        </div>
    </>

    return (
        <>
            <StarAnimation/>
            <UploadHandler socket={socket}>

                <div className='user-profile'>
                    <img src={user.img} alt="p"/>
                    <div className='profile-details'>
                        <p className='profile-name'>{user.name}</p>
                    </div>
                </div>

                <div className='chat-container'
                     ref={messagesContainerRef}
                     onScroll={handleScroll}
                >
                    <>
                        {m}
                    </>
                    <div className='chat-container-spacer'/>

                    {messages.map((m:Message,i:number)=>
                            <MessageObject
                                m={m}
                                key={i}
                                activeUserId={activeUserId}
                            />
                    )}

                    {isUserTyping && isUserTypingId === userId &&
                        <UserTyping/>
                    }

                    <div ref={messagesEndRef} ></div>

                </div>

                {messagePopUp &&
                    <MessagePupUp
                        scrollToBottomObject={scrollToBottomObject}
                        newMessage={newMessage}
                    />
                }

                <MessageInputContainer
                    textareaRef={textareaRef}
                    outGoingMessage={outGoingMessage}
                    handleInputChange={handleInputChange}
                    handleKeyDown={handleKeyDown}
                    sendMessage={sendMessage}
                    messageObject={messageObject}
                    handelChangeObject={handelChangeObject}
                />

            </UploadHandler>
        </>
    );
}

export default ChatBox;
