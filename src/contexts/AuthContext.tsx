import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, getToken } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const data = await api.get('/auth/user');
          setUser(data);
        } catch {
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const data = await api.post('/auth/register', { email, password, full_name: fullName });
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    await api.post('/auth/logout', {});
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
