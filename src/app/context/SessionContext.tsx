import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

type SessionType = {
    sessionStatus: "SessionActive" | "SessionNotActive";
};

type SessionContextType = {
    sessionStatus: SessionType;
    setSessionStatus: Dispatch<SetStateAction<SessionType>>;
};

type SessionProviderProps = {
    children: ReactNode;
};

const defaultSession: SessionType = {
    sessionStatus: "SessionNotActive",
};

export const UserContext = createContext<SessionContextType | undefined>(undefined);

export const UserProvider = ({ children }: SessionProviderProps) => {
    const [sessionStatus, setSessionStatus] = useState<SessionType>(defaultSession);

    return (
        <UserContext.Provider value={{ sessionStatus, setSessionStatus }}>
            {children}
        </UserContext.Provider>
    );
};
