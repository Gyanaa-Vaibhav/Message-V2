import double_tick_icon from '/svg/double_tick_icon.svg'
import blue_tick_icon from '/svg/double_tick_icon_blue.svg'
import single_tick_icon from '/svg/single_tick_icon.svg'
import {Message} from "../types/ChatBox.ts";

type Props = {
    m:Message,
    activeUserId:number,
}

export default function ReadReceipt({m,activeUserId}:Props){
    if(m.activeUserId === m.userId){
        m.seen = true;
    }
    return(m.activeUserId === activeUserId && (
        m.system
            ? null
            : m.seen === null
                ? <img src={single_tick_icon} alt="sent" />
                : m.seen
                    ? <img src={blue_tick_icon} alt="delivered" />
                    : <img src={double_tick_icon} alt="received" />
        )
    )
}