import React, { createContext, useContext, useState, ReactNode } from "react";
import { Book, CartItem } from "../types";

interface AppContextType {
    selectedPaymentMethod: string;
    setSelectedPaymentMethod: (method: string) => void;
    shippingAddress: string;
    setShippingAddress: (address: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("BCA");
    const [shippingAddress, setShippingAddress] = useState("");

    return (
        <AppContext.Provider
            value={{
                selectedPaymentMethod,
                setSelectedPaymentMethod,
                shippingAddress,
                setShippingAddress,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within AppProvider");
    return context;
}
