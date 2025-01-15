import '../styles/ChatBox.css';
import React, {useRef} from "react";

import StarAnimation from "../../../LandingPage/components/StarAnimation.tsx";
import {Props, Message} from "../types/ChatBox.ts";
import send from '/svg/send_icon.svg?url'
import UploadHandler from "./UploadHandler.tsx";
import useSocket from "../hooks/useSocket.ts";
import {handleInputChange, sendMessage} from "../utils/handelMessage.ts";
import decryptPrivateKey from "../../../../shared/decryptPrivateKey.ts";
import {useUserContext} from "../ChatContext.tsx";

const ChatBox = ({ activeUser,activeUserId,userEmail}:Props) => {
    const {userId,user,setUsersList} = useUserContext()
    const [outGoingMessage,setOutGoingMessage] = React.useState<string>('');
    const [messages,setMessages] = React.useState<Message[]>([]);
    const [newMessage, setNewMessage] = React.useState<boolean>(false);
    const [messagePopUp,setMessagePopUp] = React.useState<boolean>(false);
    const [isAtBottom, setIsAtBottom] = React.useState(true);
    const key = localStorage.getItem('privateKey')
    try{
        if(key && userEmail) decryptPrivateKey(key,userEmail)
    }catch (e){
        localStorage.removeItem('privateKey')
        window.location.href = '/login'
        console.log(e)
    }

    const socket = useSocket({activeUserId,userId,setMessages,setNewMessage,setUsersList});

    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const firstLoad = useRef<boolean>(false);
    const messageObject = {socket, outGoingMessage, setMessages, setOutGoingMessage, activeUser,textareaRef,activeUserId,userId,setNewMessage,setUsersList}

    const scrollToBottom = React.useCallback(() => {
        if(!firstLoad.current){
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({behavior: 'instant'});
            }
            firstLoad.current=true;
        }else{
            if(!isAtBottom){
                if (messagesEndRef.current) {
                    messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
                }
            }
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
            }
        }
    },[isAtBottom]);

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
            scrollToBottom()
        }else{
            // setNewMessage(true)
        }
    },[isAtBottom, messages, scrollToBottom])

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
                    <img src="u" alt="p"/>
                    <div className='profile-details'>
                        <p className='profile-name'>{user}</p>
                    </div>
                </div>

                <div className='chat-container'
                     ref={messagesContainerRef}
                     onScroll={handleScroll}
                >
                    <>
                        {m}
                    </>
                    <div className='chat-container-spacer'></div>
                    {messages.map((m:Message,i:number)=> {
                        const time = new Date(m.timestamp).toLocaleTimeString()
                        return(
                            <div tabIndex={0} key={i} className={`message ${(m.activeUserId) === activeUserId ? 'self' : ''}`}>
                                <div className='message-bubble'>
                                    <div className='message-user-info'>
                                        <p className='time'>{time.slice(0,-3)}</p>
                                        <p className='user-message'>{m.message}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} ></div>
                </div>
                {messagePopUp &&
                    <div className='down-arrow'>
                        <div className="subtle-down-arrow" onClick={() => scrollToBottom()}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                width="24px"
                                height="24px"
                            >
                                <path d="M12 16l-6-6h12z"/>
                            </svg>
                        </div>
                        {newMessage && <span className="new-message-indicator"></span>}
                    </div>
                }
                <div className='input-container'>
                    <div className='message-container'>
                        <label htmlFor="message">Your Message:</label>
                        <textarea
                            ref={textareaRef}
                            name="message"
                            id="message"
                            placeholder={'Message Goes here'}
                            value={outGoingMessage}
                            rows={1}
                            autoComplete='off'
                            onChange={(event)=>handleInputChange({event, setOutGoingMessage})}
                            onKeyDown={handleKeyDown}
                        />
                        <img
                            src={send}
                            alt="Send Arrow"
                            onClick={()=>sendMessage(messageObject)}
                        />
                    </div>
                </div>
            </UploadHandler>
        </>
    );
}

export default ChatBox;
