import { useState, useMemo } from 'react';
import { StyleSheet, FlatList, TextInput, TouchableOpacity, Image, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from '@/components/Themed';
import { useDirectoryApp, Person } from '@/components/DirectoryAppProvider';
import Colors from '@/constants/Colors';


// --- Component: Single Person Row/Card ---
function PersonListItem({ person }: { person: Person }) {
  const { isDark } = useDirectoryApp();
  const color = Colors[isDark ? 'dark' : 'light'];

  const handlePress = () => {
    // Navigates to app/member/[id].tsx
    router.push(`/member/${person.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.listItem, { backgroundColor: color.cardBackground }]}>
      
      {/* Image */}
      <Image 
        source={{ uri: person.image || 'https://placehold.co/100x100/aaaaaa/ffffff?text=FHU' }}
        style={styles.image}
        accessibilityLabel={`${person.firstName} ${person.lastName}'s profile picture`}
      />

      <View style={styles.infoContainer} lightColor={color.cardBackground} darkColor={color.cardBackground}>
        {/* Name */}
        <Text style={[styles.nameText, { color: color.text }]}>
          {person.firstName} {person.lastName}
        </Text>

        {/* Classification */}
        <Text style={[styles.detailText, { color: color.tint }]}>
          {person.classification}
        </Text>

        {/* Relationship Status (optional) */}
        {person.relationshipStatus && (
          <Text style={[styles.detailText, { color: color.text, opacity: 0.8 }]}>
            Status: {person.relationshipStatus}
          </Text>
        )}
      </View>
      
      {/* Navigation Arrow */}
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={color.tabIconDefault} 
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  );
}


// --- Main Screen Component (Directory List Page) ---
export default function DirectoryListPage() {
  const { people, isDark, toggleTheme, isLoading } = useDirectoryApp();
  const [searchTerm, setSearchTerm] = useState('');
  const color = Colors[isDark ? 'dark' : 'light'];

  // Search (by first name or last name)
  const filteredPeople = useMemo(() => {
    if (!searchTerm) {
      return people;
    }
    const searchLower = searchTerm.toLowerCase();
    return people.filter(person => {
      return (
        person.firstName.toLowerCase().includes(searchLower) ||
        person.lastName.toLowerCase().includes(searchLower)
      );
    });
  }, [people, searchTerm]);

  // Show a loading indicator if data is still being fetched
  if (isLoading) {
    return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: color.background }]}>
            <Text style={{ color: color.text, marginBottom: 10 }}>Loading Directory...</Text>
            <Text style={{ color: color.text, fontSize: 12, opacity: 0.6 }}>Checking Appwrite connection...</Text>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* Header and Theme Toggle */}
      <View style={[styles.header, { 
          // Applies the new headerBackground color
          backgroundColor: color.headerBackground, 
          borderBottomColor: color.separator 
      }]}>
        <Text style={[styles.title, { color: color.text }]}>FHU Directory</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <Ionicons 
            // Swapped icon names for better visibility contrast
            name={isDark ? 'moon' : 'sunny'} 
            size={24} 
            // Use iconDark (black) in Light Mode, tint (white) in Dark Mode
            color={isDark ? color.tint : color.iconDark} 
            accessibilityLabel="Toggle Light/Dark Mode"
          />
        </TouchableOpacity>
      </View>

      {/* Search Input Container - Fixes the white background gap */}
      <View style={[styles.searchContainer, { backgroundColor: color.background }]}>
        <TextInput
          style={[styles.searchInput, { 
            // Search background color for contrast
            backgroundColor: color.searchBackground,
            color: color.text,
            borderColor: color.separator
          }]}
          placeholder="Search by first or last name"
          placeholderTextColor={color.tabIconDefault}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* List Display */}
      {filteredPeople.length > 0 ? (
        <FlatList
          data={filteredPeople}
          renderItem={({ item }) => <PersonListItem person={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ItemSeparatorComponent={() => 
            <View style={[styles.separator, { backgroundColor: color.separator }]} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: color.text }]}>No members found matching "{searchTerm}".</Text>
        </View>
      )}
    </View>
  );
}

// --- Styling ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 35 : 0, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  themeToggle: {
    padding: 5,
  },
  // NEW Search Container to hold the TextInput and manage padding/margin gap
  searchContainer: {
    padding: 15, // Adds padding around the search bar
    borderBottomWidth: 1,
    borderBottomColor: 'transparent', // Ensure it doesn't add an extra line
  },
  searchInput: {
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 15,
    // Margin removed and replaced by searchContainer padding
    fontSize: 16,
    borderWidth: 1,
  },
  separator: {
    height: 1,
    marginLeft: 20, 
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30, 
    marginRight: 15,
    backgroundColor: '#ccc',
    borderWidth: 1,
    borderColor: '#eee',
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  detailText: {
    fontSize: 14,
  },
  arrowIcon: {
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
  }
});