type Props = {
    isAtBottom: boolean,
    messagesContainerRef: React.RefObject<HTMLDivElement>,
    setMessagePopUp: (value: React.SetStateAction<boolean>) => void,
    setIsAtBottom: (value: React.SetStateAction<boolean>) => void,
    setNewMessage: (value: React.SetStateAction<boolean>) => void,
}

export const handleScroll = ({messagesContainerRef,setMessagePopUp,setNewMessage,setIsAtBottom,isAtBottom}:Props) => {
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