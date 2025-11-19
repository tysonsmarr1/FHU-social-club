import { StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Platform, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useDirectoryApp } from '@/components/DirectoryAppProvider';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from "@/hooks/AuthContext";

const ProfileInfoRow = ({ label, value, isDark }: { label: string, value: string, isDark: boolean }) => {
    const color = Colors[isDark ? 'dark' : 'light'];
    
    const rowBgColor = isDark ? color.searchBackground : color.cardBackground;

    return (
        <View 
            style={[profileStyles.infoRow, { backgroundColor: rowBgColor, borderColor: color.separator }]}
            lightColor={rowBgColor} 
            darkColor={rowBgColor}
        >
            <Text style={[profileStyles.infoLabel, { color: color.text }]}>{label}</Text>
            <Text style={[profileStyles.infoValue, { color: color.text }]}>{value}</Text>
        </View>
    );
};

export default function ProfileScreen() {
    const { isDark, toggleTheme } = useDirectoryApp();
    const { user, logout } = useAuth();
    const color = Colors[isDark ? 'dark' : 'light'];

    const placeholderUser = {
        name: user?.name ?? "Name",
        email: user?.email ?? "placeholder@fhu.edu",
        club: ((user?.prefs as any)?.clubId as string) ?? "No Club Assigned",
        image: "user",
    };

    return (
        <ScrollView contentContainerStyle={[profileStyles.scrollContent, { backgroundColor: color.background }]}>
            
            <View style={[profileStyles.profileCard, { backgroundColor: color.cardBackground }]}>
                <Image
                    source={{ uri: placeholderUser.image }}
                    style={profileStyles.profileImage}
                    accessibilityLabel={`${placeholderUser.name}'s profile picture`}
                />
                
                <Text style={[profileStyles.nameText, { color: color.text }]}>
                    {placeholderUser.name}
                </Text>
                
                <TouchableOpacity
                    style={profileStyles.logoutButton}
                    onPress={logout}
                >
                    <Text style={profileStyles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={[profileStyles.detailsSection, { borderColor: color.separator }]}>
                <Text style={[profileStyles.sectionTitle, { color: color.tint }]}>Account Details</Text>
                
                <ProfileInfoRow label="Email" value={placeholderUser.email} isDark={isDark} />
                <ProfileInfoRow label="Club" value={placeholderUser.club} isDark={isDark} />
                <ProfileInfoRow
                    label="Status"
                    value={user ? "Authenticated" : "Not logged in"}
                    isDark={isDark}
                />
            </View>

            <View style={[profileStyles.detailsSection, { borderColor: color.separator }]}>
                <Text style={[profileStyles.sectionTitle, { color: color.tint }]}>App Settings</Text>
                
                <View style={profileStyles.themeRow}>
                    <Text style={[profileStyles.themeLabel, { color: color.tint }]}>Dark Mode</Text>
                    <TouchableOpacity onPress={toggleTheme} style={profileStyles.themeToggle}>
                        <Ionicons 
                            name={isDark ? 'moon' : 'sunny'} 
                            size={24} 
                            color={isDark ? color.tint : color.iconDark} 
                            accessibilityLabel="Toggle Light/Dark Mode"
                        />
                    </TouchableOpacity>
                </View>
            </View>

        </ScrollView>
    );
}

const profileStyles = StyleSheet.create({
    scrollContent: {
        paddingVertical: 20,
        alignItems: 'center',
        flexGrow: 1, 
    },
    profileCard: {
        width: '90%',
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 30,
        elevation: 5, 
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        backgroundColor: '#ccc',
    },
    nameText: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 5,
    },
    logoutButton: {
        marginTop: 15,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#c09191ff', 
    },
    logoutText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    detailsSection: {
        width: '90%',
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginVertical: 2, 
        borderRadius: 6,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '400',
    },
    themeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    themeLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    themeToggle: {
        padding: 5,
    }
});