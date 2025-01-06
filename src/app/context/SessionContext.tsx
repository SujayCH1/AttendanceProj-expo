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

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: SessionProviderProps) => {
    const [sessionStatus, setSessionStatus] = useState<SessionType>(defaultSession);

    return (
        <SessionContext.Provider value={{ sessionStatus, setSessionStatus }}>
            {children}
        </SessionContext.Provider>
    );
};
