// app/profile.tsx
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "@/hooks/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const prefs = (user?.prefs as any) || {};
  const club = prefs.clubId ?? "club";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text>Name: {user?.name}</Text>
      <Text>Email: {user?.email}</Text>
      <Text>Club: {club}</Text>
      <View style={{ height: 16 }} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
});
