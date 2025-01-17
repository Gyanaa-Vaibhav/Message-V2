// types for ChatBox

type Props = {
    activeUser: string;
    activeUserId:number;
    userEmail:string;
};

type Message = {
    system: boolean;
    message:string,
    activeUserId:number,
    userId:number,
    timestamp:string,
    seen?:boolean
}

type MessageData = {
    message: Message;
    from: number;
};

type TypingFormat = {
    typing:boolean,
    from:number,
}

export type {Props,Message,MessageData,TypingFormat}