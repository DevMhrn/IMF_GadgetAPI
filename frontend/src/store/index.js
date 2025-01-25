import { create } from "zustand";
import { setAuthToken } from "../libs/apiCalls";

export const useStore = create((set) => ({
    theme : localStorage.getItem('theme') || 'light',
    user : JSON.parse(localStorage.getItem('user')) || null,

    setTheme: (theme) => set(() => ({ theme })),
    setCredentials: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        setAuthToken(user?.token);
        set(() => ({ user }));
    },
    logout: () => {
        localStorage.removeItem('user');
        setAuthToken(null);
        set(() => ({ user: null }));
    }

}));
