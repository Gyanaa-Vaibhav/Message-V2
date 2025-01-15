import React, { createContext, useContext, useState, ReactNode } from 'react';
import {User} from "../ChatLayout/types/ChatLayout.ts";

// Define the shape of the context
interface UserContextType {
    activeUser: string;
    setActiveUser: React.Dispatch<React.SetStateAction<string>>;
    user: string;
    setUser: React.Dispatch<React.SetStateAction<string>>;
    userId: number;
    setUserId: React.Dispatch<React.SetStateAction<number>>;
    usersList: User[];
    setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider Props
interface UserProviderProps {
    children: ReactNode;
}



// Context Provider
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [activeUser, setActiveUser] = useState<string>('');
    const [user, setUser] = useState<string>(''); // To share the userName for the Nav bar
    const [userId, setUserId] = useState<number>(NaN);
    const [usersList, setUsersList] = useState<User[]>([]);

    return (
        <UserContext.Provider
            value={{
                activeUser,
                setActiveUser,
                user,
                setUser,
                userId,
                setUserId,
                usersList,
                setUsersList,
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
