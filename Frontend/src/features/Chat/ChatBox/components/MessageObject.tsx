import '../componentStyles/messageObject.css'
import double_tick_icon from '/svg/double_tick_icon.svg'
import blue_tick_icon from '/svg/double_tick_icon_blue.svg'
import single_tick_icon from '/svg/single_tick_icon.svg'
import {Message} from "../types/ChatBox.ts";
import React from "react";
import EmojiContainer from "./EmojiContainer.tsx";

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
                    {m.activeUserId === activeUserId && (
                        m.system
                            ? null
                            : m.seen === null
                                ? <img src={single_tick_icon} alt="sent" />
                                : m.seen
                                    ? <img src={blue_tick_icon} alt="delivered" />
                                    : <img src={double_tick_icon} alt="received" />
                    )}
                    <p className='time'>{time.slice(0,-3)}</p>
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