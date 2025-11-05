import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useDirectoryApp } from '@/components/DirectoryAppProvider';

export default function ModalScreen() {
  const { isDark } = useDirectoryApp();
  const color = Colors[isDark ? 'dark' : 'light'];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: color.tint }]}>modal</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      <Text style={{ color: color.text, opacity: 0.7, textAlign: 'center' }}>
        Profile
      </Text>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
