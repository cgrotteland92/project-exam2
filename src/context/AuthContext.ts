import { createContext } from "react";

export interface User {
  name: string;
  email: string;
  avatar?: { url: string; alt?: string };
  venueManager: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
