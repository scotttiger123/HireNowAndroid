import React, { useEffect, useState } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DrawerContentScrollView, DrawerItemList , DrawerItem } from '@react-navigation/drawer';

// Import your screens
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import JobGrid from './JobGrid';
import AppliedJobsGrid from './AppliedJobsGrid';
import AccountSettingsScreen from './AccountSettingsScreen';
import Profile from './ProfileScreen';
import LoginScreen from './LoginScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

// Bottom tab navigator
const BottomTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Jobs1"
      component={JobGridStack}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="search" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Applied Jobs"
      component={AppliedJobsGrid}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="assignment" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="person" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Account Settings"
      component={AccountSettingsScreen}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="settings" size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);

const CustomDrawerContent = (props) => {
  const { navigation } = props;
  const [userName, setUserName] = useState('User Name');
  const [userId, setUserId] = useState(null); // Add userId state

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e) => {
      const route = e.data.state.routes.find((r) => r.name === 'JobGridStack');
      if (route && route.params && route.params.userName) {
        setUserName(route.params.userName);
        setUserId(route.params.userId); // Set userId from the route parameters
        console.log();
      }
    });

    return unsubscribe;
  }, [navigation]);

  const handleSignOut = () => {
    navigation.navigate('Login');
  };

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      <View style={styles.headerContainer}>
        <Image style={styles.profileImage} source={require('./images/logo.png')} />
        <Text style={styles.headerText}>{userName}</Text>
      </View>
      <DrawerItemList {...props} />
      <View style={styles.divider} />
      <DrawerItem
        label="Sign Out"
        icon={() => <Icon name="exit-to-app" size={20} color="#000" />}
        onPress={handleSignOut}
      />
    </DrawerContentScrollView>
  );
};

const JobGridStack = () => (
  <Drawer.Navigator initialRouteName="Jobs" drawerContent={(props) => <CustomDrawerContent {...props} />}>
    <Drawer.Screen name="Jobs" component={JobGrid} />
    <Drawer.Screen name="My Profile" component={Profile} />
    <Drawer.Screen name="Applied Jobs" component={AppliedJobsGrid} />
    <Drawer.Screen name="Account Settings" component={AccountSettingsScreen} />
  </Drawer.Navigator>
);

// Root stack navigator
const RootStackNavigator = () => (
  <Stack.Navigator >
    <Stack.Screen name="Main" component={BottomTabNavigator} />
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

// Main navigation container
const AppNavigation = () => (
  <NavigationContainer>
    <RootStackNavigator />
  </NavigationContainer>
);

export default AppNavigation;

const styles = StyleSheet.create({
  drawerContainer: {
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
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 8,
  },
});