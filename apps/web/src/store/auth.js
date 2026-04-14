import { create } from "zustand";
export const useAuthStore = create((set) => ({
    token: localStorage.getItem("token"),
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    isLoading: false,
    error: null,
    setToken: (token) => {
        localStorage.setItem("token", token);
        set({ token });
    },
    setUser: (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        set({ user });
    },
    setError: (error) => {
        set({ error });
    },
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ token: null, user: null, error: null });
    },
}));
