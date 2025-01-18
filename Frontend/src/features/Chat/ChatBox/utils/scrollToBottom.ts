type Props = {
    firstLoad: React.MutableRefObject<boolean>;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    isAtBottom: boolean
}
const scrollToBottom = ({firstLoad, messagesEndRef, isAtBottom}:Props) => {
    if(!messagesEndRef.current) return;
    if (!firstLoad.current) {
        messagesEndRef.current.scrollIntoView({behavior: 'instant'});
        firstLoad.current = true;
    } else {
        if (!isAtBottom) {
            messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
        messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
    }
}

export default scrollToBottom;