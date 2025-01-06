import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

type UUIDContextType = {
    UUID: string | null;
    setUUID: Dispatch<SetStateAction<string | null>>;
};

type UUIDProviderProps = {
    children: ReactNode;
};

export const UUIDContext = createContext<UUIDContextType>({
    UUID: null,
    setUUID: () => {},
});

export const UUIDProvider = ({ children }: UUIDProviderProps) => {
    const [UUID, setUUID] = useState<string | null>(null);

    return (
        <UUIDContext.Provider value={{ UUID, setUUID }}>
            {children}
        </UUIDContext.Provider>
    );
};