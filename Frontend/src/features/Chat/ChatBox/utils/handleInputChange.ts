import {HandleInputChange} from "./handelMessages/handelMessagesTypes.ts";
import handelTypingIndicator from "./handelTypingIndicator.ts";

export default function handleInputChange ({event,setOutGoingMessage,socket,userId,isUserTyping}:HandleInputChange){
    const textarea = event.target;
    setOutGoingMessage(textarea.value);

    textarea.style.height=`auto`

    // Resize the textarea to fit the content
    if (textarea.scrollHeight > textarea.clientHeight) {
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 4 * 1.5 * parseFloat(getComputedStyle(textarea).fontSize))}px`;
    }
    handelTypingIndicator({socket,userId,isUserTyping})
}
