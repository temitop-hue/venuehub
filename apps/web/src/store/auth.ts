import { create } from "zustand";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  tenantId: number;
  role?: string;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem("token"),
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
  isLoading: false,
  error: null,
  setToken: (token: string) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  setUser: (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  setError: (error: string | null) => {
    set({ error });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null, error: null });
  },
}));
