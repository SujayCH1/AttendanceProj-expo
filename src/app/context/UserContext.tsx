import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

type UserType = {
    userEmail: string;
    userPassword: string;
    userRole: "student" | "faculty" | undefined;
    status: "loggedIn" | "notLoggedIn"
};

type UserContextType = {
    user: UserType;
    setUser: Dispatch<SetStateAction<UserType>>;
};

type UserProviderProps = {
    children: ReactNode;
};

const defaultUser: UserType = {
    userEmail: "",
    userPassword: "",
    userRole: "faculty",
    status: "notLoggedIn"
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<UserType>(defaultUser);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
