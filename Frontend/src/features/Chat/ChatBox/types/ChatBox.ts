// types for ChatBox
type Props = {
    user: string;
    activeUser: string;
    activeUserId:number;
    userId:number;
};

type Message = {
    message:string,
    activeUserId:number,
    userId:number,
    timestamp:string
}

type MessageData = {
    message: Message;
    from: number;
};

export type {Props,Message,MessageData}