import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useColorScheme } from "react-native";
import { Models, Query } from "react-native-appwrite";
import { useAuth } from "@/hooks/AuthContext";
import {
  databases,
  DATABASE_ID,
  MEMBERS_COLLECTION_ID,
} from "@/lib/appwrite";

// --- 1. Type Definitions ---

export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  classification: string;
  relationshipStatus: string;
  email: string;
  phone: string;
  officerTitle?: string;
  showEmail: boolean;
  showPhone: boolean;
};

type AppContextType = {
  people: Person[];
  isDark: boolean;
  isLoading: boolean;
  toggleTheme: () => void;
  getPersonById: (id: string) => Person | undefined;
};

// --- 2. Context Initialization ---

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- 3. Custom Hook to Consume Context ---

export const useDirectoryApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useDirectoryApp must be used within a DirectoryAppProvider");
  }
  return context;
};

// --- Member document type from Appwrite ---

type MemberDoc = Models.Document & {
  firstName: string;
  lastName: string;
  imageURL?: string;
  classification?: string;
  relationshipStatus?: string;
  email?: string;
  phone?: string;
  officer?: string;
  showEmail?: boolean;
  showPhone?: boolean;
  // club?: string; // you can add this if you want to read the club from docs later
};

// --- Helper: Map Appwrite doc -> Person ---

const mapPersonFromDoc = (doc: MemberDoc): Person => {
  return {
    id: String(doc.$id),
    firstName: doc.firstName,
    lastName: doc.lastName,
    image:
      doc.imageURL ||
      "https://placehold.co/150x150/aaaaaa/ffffff?text=FHU",
    classification: doc.classification ?? "",
    relationshipStatus: doc.relationshipStatus ?? "",
    email: doc.email ?? "",
    phone: doc.phone ?? "",
    officerTitle: doc.officer || undefined,
    showEmail: !!doc.showEmail,
    showPhone: !!doc.showPhone,
  };
};

// --- 5. Provider Component ---

type DirectoryAppProviderProps = {
  children: React.ReactNode;
};

export const DirectoryAppProvider: React.FC<DirectoryAppProviderProps> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [people, setPeople] = useState<Person[]>([]);
  const [isDark, setIsDark] = useState(systemColorScheme === "dark");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // --- Theme Toggle ---
  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // --- Data Loading from Appwrite ---
  useEffect(() => {
    const loadMembers = async () => {
      if (!user) {
        setPeople([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // clubId stored in user prefs (see AuthContext signup)
        const prefs = (user.prefs as any) || {};
        const clubId = prefs.clubId as string | undefined;

        // 👇 IMPORTANT: "club" must match the attribute name in your Appwrite members collection
        const queries = clubId ? [Query.equal("club", clubId)] : [];

        console.log("Loading members from Appwrite with", {
          databaseId: DATABASE_ID,
          collectionId: MEMBERS_COLLECTION_ID,
          clubId,
        });

        const res = await databases.listDocuments<MemberDoc>(
          DATABASE_ID,
          MEMBERS_COLLECTION_ID,
          queries
        );

        const mapped = res.documents.map(mapPersonFromDoc);
        setPeople(mapped);
      } catch (error) {
        console.error("Error loading members from Appwrite:", error);
        setPeople([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, [user]);

  // --- Helper Function (Memoized) ---
  const getPersonById = useMemo(() => {
    return (id: string) => people.find((p) => String(p.id) === String(id));
  }, [people]);

  // --- Context Value ---
  const contextValue: AppContextType = {
    people,
    isDark,
    isLoading,
    toggleTheme,
    getPersonById,
  };

  // --- Provide Context to Children ---
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};