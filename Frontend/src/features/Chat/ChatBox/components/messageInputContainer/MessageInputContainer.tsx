import './messageInputContainer.css'
import send from '/svg/send_icon.svg?url'
import React from "react";
import {Socket} from "socket.io-client";
import {DefaultEventsMap} from "@socket.io/component-emitter";
import {SendMessageParams} from "../../utils/handelMessages/handelMessagesTypes.ts";
import {handleInputChange} from "../../utils/utilsExport.ts";

type Prop = {
    textareaRef: React.RefObject<HTMLTextAreaElement>,
    outGoingMessage: string,
    handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>): void,
    sendMessage(props: SendMessageParams): void,
    messageObject:SendMessageParams,
    handelChangeObject: {
        setOutGoingMessage: React.Dispatch<React.SetStateAction<string>>,
        socket: Socket<DefaultEventsMap, DefaultEventsMap> | null,
        userId: number,
        isUserTyping: boolean
    }
}

export default function MessageInputContainer(props:Prop){
    const {textareaRef,outGoingMessage,handleKeyDown,sendMessage,messageObject,handelChangeObject} = props
    return(
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
                    onChange={(event)=>handleInputChange({event,...handelChangeObject})}
                    onKeyDown={handleKeyDown}
                />
                <img
                    src={send}
                    alt="Send Arrow"
                    onClick={()=>sendMessage(messageObject)}
                />
            </div>
        </div>
    )
}