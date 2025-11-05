import { StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Text, View } from '@/components/Themed';
import { useDirectoryApp } from '@/components/DirectoryAppProvider';
import Colors from '@/constants/Colors';


export default function MemberDetailsScreen() {
    const { id } = useLocalSearchParams();
    const personId = Array.isArray(id) ? id[0] : id; 
    
    const { getPersonById, isDark, isLoading } = useDirectoryApp();
    const color = Colors[isDark ? 'dark' : 'light'];

    const person = getPersonById(personId);

    
    const handleText = (phoneNumber: string) => {
        const url = `sms:${phoneNumber}`;
        Linking.openURL(url).catch(err => console.error('Failed to open SMS app:', err));
    };

    const handleEmail = (emailAddress: string) => {
        const url = `mailto:${emailAddress}`;
        Linking.openURL(url).catch(err => console.error('Failed to open email app:', err));
    };

    
    if (isLoading || !person) {
        const title = isLoading ? "Loading..." : "Member Not Found";
        return (
            <View style={[styles.loadingContainer, { backgroundColor: color.background }]}>
                {isLoading && <ActivityIndicator size="large" color={color.tint} />}
                <Text style={[styles.errorText, { color: color.text }]}>{title}</Text>
            </View>
        );
    }

    const headerTitle = `${person.firstName} ${person.lastName}`;

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: headerTitle }} />

            <ScrollView contentContainerStyle={[styles.scrollContent, { backgroundColor: color.background }]}>
                
                <View style={[styles.profileCard, { backgroundColor: color.cardBackground }]}>
                    
                    <Image
                        source={{ uri: person.image || 'https://placehold.co/150x150/aaaaaa/ffffff?text=FHU' }}
                        style={styles.profileImage}
                        accessibilityLabel={`${person.firstName} ${person.lastName}'s profile picture`}
                    />
                    <Text style={[styles.nameText, { color: color.text }]}>{headerTitle}</Text>
                    
                    
                    {person.officerTitle && (
                        <View style={styles.officerBadge} lightColor={color.tint} darkColor={color.tint}>
                            {/* FIX: Text must be black/dark against the accent badge in Dark Mode */}
                            <Text style={[styles.officerText, { color: isDark ? Colors.light.text : 'white' }]}>
                                {person.officerTitle}
                            </Text>
                        </View>
                    )}
                </View>

                
                    <View style={[styles.infoSection, { 
                        borderColor: color.separator, 
                        backgroundColor: color.cardBackground 
                        }]}>
                    
                    <Text style={[styles.sectionTitle, { color: color.iconDark }]}>General Information</Text>
                    
                    <DetailRow label="Classification" value={person.classification} isDark={isDark} />
    
                    {person.relationshipStatus && (
                        <DetailRow label="Relationship Status" value={person.relationshipStatus} isDark={isDark} />
                    )}
                </View>

                
                    <View style={[styles.infoSection, { 
                        borderColor: color.separator, 
                        backgroundColor: color.cardBackground 
                        }]}>
                   
                    <Text style={[styles.sectionTitle, { color: color.iconDark }]}>Contact</Text>
                    
                    {person.showEmail ? (
                        <ContactActionRow 
                            icon="mail-outline"
                            label="Email"
                            value={person.email}
                            action={() => handleEmail(person.email)}
                            color={color}
                            isDark={isDark}
                        />
                    ) : (
                        <Text style={[styles.detailValue, { opacity: 0.7, color: color.iconDark, paddingHorizontal: 10 }]}>
                            Email not opted in.
                        </Text>
                    )}
                    {person.showPhone ? (
                        <ContactActionRow 
                            icon="chatbubbles-outline"
                            label="Phone"
                            value={person.phone}
                            action={() => handleText(person.phone)}
                            color={color}
                            isDark={isDark}
                        />
                    ) : (
                        <Text style={[styles.detailValue, { opacity: 0.7, color: color.iconDark, paddingHorizontal: 10 }]}>
                            Phone number not opted in.
                        </Text>
                    )}
                </View>

            </ScrollView>
        </View>
    );
}


const DetailRow = ({ label, value, isDark }: { label: string, value: string, isDark: boolean }) => {
    const color = Colors[isDark ? 'dark' : 'light'];
    
    const rowBgColor = isDark ? color.searchBackground : color.cardBackground;
    const rowTextColor = isDark ? color.text : color.text; 

    return (
        <View 
            style={[styles.detailRow, { backgroundColor: rowBgColor }]} 
            lightColor={rowBgColor} 
            darkColor={rowBgColor}
        >
            <Text style={[styles.detailLabel, { color: rowTextColor }]}>{label}:</Text>
            <Text style={[styles.detailValue, { color: rowTextColor }]}>{value}</Text>
        </View>
    );
}

const ContactActionRow = ({ icon, label, value, action, color, isDark }: { icon: any, label: string, value: string, action: () => void, color: any, isDark: boolean }) => {
    
    const actionBgColor = isDark ? color.searchBackground : color.cardBackground;
    const actionTextColor = isDark ? color.text : color.text;

    return (
        <TouchableOpacity style={[styles.contactRow, { borderColor: color.separator, backgroundColor: actionBgColor }]} onPress={action}>
            <Ionicons name={icon} size={24} color={color.tint} style={{ marginRight: 10 }} />
            <View style={[styles.contactTextContainer, { backgroundColor: actionBgColor }]} lightColor={actionBgColor} darkColor={actionBgColor}>
                <Text style={[styles.detailLabel, { color: actionTextColor }]}>{label}</Text>
                <Text style={[styles.detailValue, { color: color.tint, fontWeight: '600' }]}>{value}</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={color.tabIconDefault} />
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        padding: 20,
        textAlign: 'center',
    },
    scrollContent: {
        paddingVertical: 20,
        alignItems: 'center',
        flexGrow: 1, 
    },
    profileCard: {
        width: '90%',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 25,
        elevation: 3, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 15,
        backgroundColor: '#ccc',
    },
    nameText: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 10,
    },
    officerBadge: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
    },
    officerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    infoSection: {
        width: '90%',
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12, 
        paddingHorizontal: 10,
        marginVertical: 2, 
        borderRadius: 6, 
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginRight: 10,
    },
    detailValue: {
        fontSize: 16,
        flexShrink: 1,
        textAlign: 'right',
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12, 
        borderRadius: 8,
        borderWidth: 1,
        marginVertical: 5,
    },
    contactTextContainer: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 10,
    }
});