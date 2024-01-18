// JobGridStack.js
import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import JobGrid from './JobGrid';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { navigation } = props;

  const handleSignOut = () => {
    // Implement your sign-out logic here
    // For example, you can navigate to the login screen
    navigation.navigate('Login');
  };

  const handleHome = () => {
    // Implement navigation to the home screen or any other screen
    // Example: navigation.navigate('Home');
  };

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      <View style={styles.headerContainer}>
        <Image style={styles.profileImage} source={require('./images/logo.png')} />
        <Text style={styles.headerText}>User Name</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Jobs"
        icon={() => <Icon name="search" size={20} color="#000" />}
        onPress={handleHome}
      />
      <DrawerItem
        label="Sign Out"
        icon={() => <Icon name="exit-to-app" size={20} color="#000" />}
        onPress={handleSignOut}
      />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const JobGridStack = () => (
  <Drawer.Navigator initialRouteName="Jobs" drawerContent={(props) => <CustomDrawerContent {...props} />}>
    <Drawer.Screen name="Jobs" component={JobGrid} />
  </Drawer.Navigator>
);

export default JobGridStack;
