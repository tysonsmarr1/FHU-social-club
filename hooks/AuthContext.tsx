import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Models } from "react-native-appwrite";
import { account } from "@/lib/appwrite";

type AppwriteUser = Models.User<Models.Preferences>;

type AuthContextType = {
  user: AppwriteUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    clubId: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};

// ❗ THIS is your actual React Context (not the type)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppwriteUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user session on startup
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await account.get();
        setUser(result);
      } catch {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await account.createEmailPasswordSession(email, password);
      const current = await account.get();
      setUser(current);
    } finally {
      setLoading(false);
    }
  };

  // Signup — create user, save prefs
  const signup = async (
    name: string,
    email: string,
    password: string,
    clubId: string
  ) => {
    setLoading(true);
    try {
      await account.create("unique()", email, password, name);
      await account.createEmailPasswordSession(email, password);

      // Save clubId in user preferences
      await account.updatePrefs({ clubId });

      const current = await account.get();
      setUser(current);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await account.deleteSession("current");
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};