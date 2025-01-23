import React, { createContext, useContext, useState, ReactNode } from 'react';
import {User} from "../ChatLayout/types/ChatLayout.ts";
import {Message} from "./types/ChatBox.ts";

// Define the shape of the context
interface UserContextType {
    user: { name: string, img: string }
    setUser: React.Dispatch<React.SetStateAction<{ name: string, img: string }>>;
    userId: number;
    setUserId: React.Dispatch<React.SetStateAction<number>>;
    usersList: User[];
    setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    messages:Message[],
    userPublicKey: string,
    setUserPublicKey: React.Dispatch<React.SetStateAction<string>>,
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider Props
interface UserProviderProps {
    children: ReactNode;
}



// Context Provider
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<{ name:string,img:string }>({name:'',img:''}); // To share the userName for the Nav bar
    const [userId, setUserId] = useState<number>(NaN);
    const [userPublicKey, setUserPublicKey] = useState<string>('');
    const [usersList, setUsersList] = useState<User[]>([]);
    const [messages,setMessages] = React.useState<Message[]>([]);

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                userId,
                setUserId,
                userPublicKey,
                setUserPublicKey,
                usersList,
                setUsersList,
                messages,
                setMessages,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

// Custom Hook to Use the Context
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};
