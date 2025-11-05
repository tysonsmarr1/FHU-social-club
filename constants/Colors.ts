const tintColorLight = '#7fb9e2ff';
const tintColorDark = '#bba7a7ff';
const separatorLight = '#E0E0E0';
const separatorDark = '#444444';
const backgroundLight = '#F9F9F9';
const backgroundDark = '#121212';
const cardBackgroundLight = '#FFFFFF';
const cardBackgroundDark = '#252424ff';
const searchBackgroundLight = '#F0FFff';
const searchBackgroundDark = '#333333';
const tabBarBackgroundLight = '#FFFFFF';
const tabBarBackgroundDark = '#1E1E1E';
const headerDark = '#1E1E1E'; 
const iconDark = '#000'; 

export default {
  light: {
    text: '#000',
    background: backgroundLight,
    tint: tintColorLight,
    tabIconDefault: '#888',
    tabIconSelected: tintColorLight,
    cardBackground: cardBackgroundLight,
    searchBackground: searchBackgroundLight,
    separator: separatorLight,
    tabBarBackground: tabBarBackgroundLight,
    headerBackground: cardBackgroundLight, 
    iconDark: iconDark, 
  },
  dark: {
    text: '#fff',
    background: backgroundDark,
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    cardBackground: cardBackgroundDark,
    searchBackground: searchBackgroundDark,
    separator: separatorDark,
    tabBarBackground: tabBarBackgroundDark,
    headerBackground: headerDark, 
    iconDark: tintColorDark, 
  },
};