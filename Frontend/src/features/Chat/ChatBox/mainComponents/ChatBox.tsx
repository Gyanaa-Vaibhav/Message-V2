import '../mainStyles/ChatBox.css';
import React from "react";

import StarAnimation from "../../../LandingPage/components/StarAnimation.tsx";
import {Message} from "../types/ChatBox.ts";
import {useUserContext} from "../ChatContext.tsx";
import UploadHandler from "./UploadHandler.tsx";
import useSocket from "../hooks/useSocket.ts";
import {sendMessage,scrollToBottom,handleKeyDown,handleScroll} from "../utils/utilsExport.ts";
import decryptPrivateKey from "../../../../shared/decryptPrivateKey.ts";
import {MessagePopUp,UserTyping,MessageObject,MessageInputContainer} from "../components/componentsExports.ts";

const ChatBox = () => {

    // Items from Local Storage
    const activeUserId = Number(localStorage.getItem('activeUserId'))
    const userEmail = localStorage.getItem('activeUserEmail')

    // Key Verifier
    const key = localStorage.getItem('privateKey')
    try{
        if(key && userEmail) decryptPrivateKey(key,userEmail)
    }catch (e){
        localStorage.removeItem('privateKey')
        window.location.href = '/login'
    }

    // Global Context
    const {userId,user,setUsersList,messages,setMessages} = useUserContext()

    // Custom States
    const [outGoingMessage,setOutGoingMessage] = React.useState<string>('');
    const [newMessage, setNewMessage] = React.useState<boolean>(false);
    const [messagePopUp,setMessagePopUp] = React.useState<boolean>(false);
    const [isAtBottom, setIsAtBottom] = React.useState<boolean>(true);
    const [isUserTyping, setIsUserTyping] = React.useState<boolean>(false);
    const [isUserTypingId, setIsUserTypingId] = React.useState<number>(NaN);

    // Socket Initialization
    const socket = useSocket({activeUserId,userId,setNewMessage,setUsersList,setIsUserTyping,setIsUserTypingId});

    // Refs
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const messagesContainerRef = React.useRef<HTMLDivElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const firstLoad = React.useRef<boolean>(false);

    // Custom Objects
    const messageObject = {socket, outGoingMessage, setMessages, setOutGoingMessage,textareaRef,activeUserId,userId,setUsersList}
    const scrollObject = {messagesContainerRef,setNewMessage,setMessagePopUp,setIsAtBottom,isAtBottom}
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
                     onScroll={()=>handleScroll(scrollObject)}
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

                    {isUserTyping && isUserTypingId === userId && isUserTypingId !== activeUserId &&
                        <UserTyping/>
                    }

                    <div ref={messagesEndRef} ></div>

                </div>

                {messagePopUp &&
                    <MessagePopUp
                        scrollToBottomObject={scrollToBottomObject}
                        newMessage={newMessage}
                    />
                }

                <MessageInputContainer
                    textareaRef={textareaRef}
                    outGoingMessage={outGoingMessage}
                    handleKeyDown={(event)=>handleKeyDown({event,outGoingMessage,messageObject})}
                    sendMessage={sendMessage}
                    messageObject={messageObject}
                    handelChangeObject={handelChangeObject}
                />

            </UploadHandler>
        </>
    );
}

export default ChatBox;
