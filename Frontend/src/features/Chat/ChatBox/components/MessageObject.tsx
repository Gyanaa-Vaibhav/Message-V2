import '../componentStyles/messageObject.css'
import {Message} from "../types/ChatBox.ts";
import React from "react";
import EmojiContainer from "./EmojiContainer.tsx";
import ReadReceipt from "./ReadReceipt.tsx";

type Props = {
    m:Message,
    activeUserId:number,
}

export default function MessageObject({m,activeUserId}:Props){
    const [showReaction,setShowReaction] = React.useState<boolean>(false)
    const time = new Date(m.timestamp).toLocaleTimeString()
    return(
        <div
            tabIndex={0}
            onMouseEnter={()=> setShowReaction(true)}
            onMouseLeave={()=>setShowReaction(false)}
            className={`message${(m.activeUserId) === activeUserId ? ' self' : ''}${m?.system ? ' system' : ''}`}
        >
            {showReaction && !m.system && m.activeUserId === activeUserId &&
                <>
                    <EmojiContainer

                    />
                </>
            }
            <div className='message-bubble'>
                <div className='message-user-info'>
                    <p className='user-message'>{m.message}</p>
                    <p className='time'>{time.slice(0,-3)}</p>
                    <ReadReceipt m={m} activeUserId={activeUserId}/>
                </div>
            </div>
            {showReaction && !m.system && m.activeUserId !== activeUserId &&
                <>
                    <EmojiContainer

                    />
                </>
            }
        </div>
    )
}