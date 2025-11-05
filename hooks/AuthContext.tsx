import React, { createContext, useContext } from 'react';

type AuthContextType = {
    user: any | null,
    loading: boolean,
    login: (email: string, password: string) => Promise<void>,
    register: (email: string, password: string, name: string) => Promise<void>
}

const placeholderValue: AuthContextType = {
    user: null,
    loading: false,
    login: async () => { console.log("Auth is bypassed."); },
    register: async () => { console.log("Auth is bypassed."); }
};


const AuthContext = createContext<AuthContextType>(placeholderValue);


export function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <AuthContext.Provider value={placeholderValue} > 
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used inside <AuthProvider />")
    }
    return context
}