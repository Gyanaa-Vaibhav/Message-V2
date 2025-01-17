type Props = {
    firstLoad: React.MutableRefObject<boolean>;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    isAtBottom: boolean
}
const scrollToBottom = ({firstLoad, messagesEndRef, isAtBottom}:Props) => {
    if (!firstLoad.current) {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: 'instant'});
        }
        firstLoad.current = true;
    } else {
        if (!isAtBottom) {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
            }
        }
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }
}

export default scrollToBottom;