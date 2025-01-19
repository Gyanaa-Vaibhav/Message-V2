import scrollToBottom from "../utils/scrollToBottom.ts";
import React from "react";
import '../componentStyles/messagePopup.css'

type Props = {
    scrollToBottomObject: {
        isAtBottom: boolean,
        firstLoad: React.MutableRefObject<boolean>,
        messagesEndRef: React.RefObject<HTMLDivElement>
    }
    newMessage: boolean
}

export default function MessagePupUp({scrollToBottomObject,newMessage}:Props){
    return(
        <div className='down-arrow'>
            <div className="subtle-down-arrow" onClick={() => scrollToBottom(scrollToBottomObject)}>
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
    )
}