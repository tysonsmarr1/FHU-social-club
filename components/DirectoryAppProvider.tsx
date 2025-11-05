import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useColorScheme, ActivityIndicator, Text, View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
// NOTE: We are removing the import for getDirectoryMembers here

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
    throw new Error('useDirectoryApp must be used within a DirectoryAppProvider');
  }
  return context;
};

// --- Helper Function for Data Mapping (Local JSON) ---
const mapPersonData = (item: any): Person => {
  // Maps fields from the local JSON file
  return {
    id: String(item.id),
    firstName: item.firstName,
    lastName: item.lastName,
    image: item.imageURL || 'https://placehold.co/150x150/aaaaaa/ffffff?text=FHU', 
    classification: item.classification,
    relationshipStatus: item.relationshipStatus,
    email: item.email,
    phone: item.phone,
    officerTitle: item.officer || undefined, 
    showEmail: item.showEmail || false,
    showPhone: item.showPhone || false,
  };
};

// --- 5. Provider Component ---

type DirectoryAppProviderProps = {
  children: React.ReactNode;
};

export const DirectoryAppProvider: React.FC<DirectoryAppProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [people, setPeople] = useState<Person[]>([]);
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [isLoading, setIsLoading] = useState(true);
  const [appError, setAppError] = useState<string | null>(null);

  // --- Theme Toggle ---
  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  // --- Data Loading (Synchronous local loading via require) ---
  useEffect(() => {
    console.log('Attempting to load data from LOCAL JSON file...');
    try {
      // Use require() with a relative path to read the local JSON file
      // NOTE: The path is relative to the 'components' folder, going up one level
      // and assuming the JSON is in the project root.
      const rawData = require('@/assets/data/sample_people_50_v4_with_id.json');
      
      if (!rawData || !Array.isArray(rawData)) {
        throw new Error('Local JSON file is empty or invalid.');
      }
      
      const finalData = rawData.map(mapPersonData);
      
      setPeople(finalData);
      console.log(`Successfully loaded ${finalData.length} members from local file.`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown data loading error occurred.';
      console.error('CRITICAL LOCAL LOADING ERROR:', errorMessage);
      setAppError("Local file read failure. File not found or corrupt.");
      setPeople([]); 
    } finally {
      setIsLoading(false);
    }
  }, []); 

  // --- Helper Function (Memoized for efficiency) ---
  const getPersonById = useMemo(() => {
    return (id: string) => people.find(p => String(p.id) === String(id));
  }, [people]);

  // --- Context Value ---
  const contextValue: AppContextType = {
    people,
    isDark,
    isLoading,
    toggleTheme,
    getPersonById,
  };

  // --- Loading Indicator / Error Display UI ---
  const color = Colors[isDark ? 'dark' : 'light'];
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: color.background }]}>
        <ActivityIndicator size="large" color={color.tint} />
        <Text style={[styles.loadingText, { color: color.text }]}>Loading Directory...</Text>
      </View>
    );
  }

  if (appError) {
      return (
          <View style={[styles.loadingContainer, { backgroundColor: color.background, padding: 20 }]}>
              <Ionicons name="warning-outline" size={30} color="#ff3333" />
              <Text style={[styles.errorTitle, { color: '#ff3333', marginTop: 10 }]}>DATA LOADING FAILED</Text>
              <Text style={[styles.errorMessage, { color: color.text, opacity: 0.8, marginTop: 10 }]}>
                  {appError}
              </Text>
              <Text style={[styles.errorMessage, { color: color.text, opacity: 0.6, marginTop: 20, fontSize: 14 }]}>
                  Hint: Ensure sample_people_50_v4_with_id.json is in the project root.
              </Text>
          </View>
      );
  }

  // --- Provide Context to Children ---
  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

// --- Styles ---

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
  },
  errorMessage: {
      fontSize: 16,
      textAlign: 'center',
      paddingHorizontal: 10,
  }
});