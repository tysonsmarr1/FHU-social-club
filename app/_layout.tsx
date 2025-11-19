import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { DirectoryAppProvider, useDirectoryApp } from '@/components/DirectoryAppProvider';
import { AuthProvider, useAuth } from '@/hooks/AuthContext';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'login',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <DirectoryAppProvider>
        <RootLayoutNav />
      </DirectoryAppProvider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { isDark } = useDirectoryApp();
  const { user, loading } = useAuth();   // 👈 make sure AuthContext exposes `loading`
  const colorScheme = isDark ? 'dark' : 'light';
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  theme.colors.background = isDark ? '#1a1a1a' : '#f5f5f5';

  // While auth is checking the session, you can show nothing or a tiny splash
  if (loading) {
    return null;
  }

  return (
    <ThemeProvider value={theme}>
      {user ? (
        // ✅ Logged in: show tabs + member + modal
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="member/[id]"
            options={{
              title: 'Member Details',
              presentation: 'card',
            }}
          />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      ) : (
        // ❌ Not logged in: only show login
        <Stack>
          <Stack.Screen
            name="login"
            options={{ headerShown: false }}
          />
        </Stack>
      )}
    </ThemeProvider>
  );
}