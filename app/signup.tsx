// app/signup.tsx
import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/hooks/AuthContext";

const CLUB_OPTIONS = ["Chi Beta Chi", "Phi Kappa Alpha", "Sigma Rho", "Other"];

export default function SignupScreen() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [club, setClub] = useState(CLUB_OPTIONS[0]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    try {
      setError(null);
      await signup(name.trim(), email.trim(), password, club);
    } catch (e: any) {
      setError(e.message ?? "Sign-up failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Simple text-based club picker for now */}
      <Text style={{ marginBottom: 4 }}>Club</Text>
      <TextInput
        style={styles.input}
        value={club}
        onChangeText={setClub}
        placeholder="Club name"
      />

      <Button title="Sign Up" onPress={onSubmit} />
      <View style={{ height: 16 }} />
      <Link href="/login">
        <Text style={styles.link}>Already have an account? Login</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  error: { color: "red", marginBottom: 12 },
  link: { textAlign: "center", textDecorationLine: "underline" },
});
