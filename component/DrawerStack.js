import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import JobGrid from './JobGrid';
import AppliedJobsGrid from './AppliedJobsGrid';
import AccountSettingsScreen from './AccountSettingsScreen';
import NotificationScreen from './NotificationScreen';

import Profile from './ProfileScreen';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';


const Drawer = createDrawerNavigator();
const Tab = createMaterialBottomTabNavigator();

const CustomDrawerContent = (props) => {
  const { navigation, state } = props;
  const [userName, setUserName] = useState('User Name');
  const [userId, setUserId] = useState(null); // Add userId state
  const [focusedRoute, setFocusedRoute] = useState('');

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

  useEffect(() => {
    const focusedRouteName = state.routes[state.index].name;
    setFocusedRoute(focusedRouteName);
  }, [state]);

  const handleSignOut = () => {
    navigation.navigate('Login');
  };

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.profileImage}
          source={require('./images/logo.png')}
          resizeMode="contain" 
        />
        <Text style={styles.headerText}>{userName}</Text>
      </View>
      <DrawerItemList {...props} />
      <View style={styles.divider} />
      <DrawerItem
        label="Sign Out"
        icon={({ color }) => <Icon name="exit-to-app" size={26} color={focusedRoute === 'SignOut' ? 'white' : '#696969'} />}
        onPress={handleSignOut}
      />
    </DrawerContentScrollView>
  );
};

const MainTabScreen = () => (
  <Tab.Navigator
    initialRouteName="Jobs"
    shifting={true}
    activeColor="#f0edf6"
    inactiveColor="#3e2465"
    barStyle={{ backgroundColor: '#694fad' }}
  >
    <Tab.Screen
      name="Jobs"
      component={JobGrid}
      options={{
        tabBarLabel: 'Live Jobs',
        tabBarIcon: ({ color }) => <Icon name="search" color="#3e2465" size={26} />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        tabBarLabel: 'My Profile',
        tabBarIcon: ({ color }) => <Icon name="person" color="#3e2465" size={26} />,
      }}
    />
    <Tab.Screen
      name="Applied Jobs"
      component={AppliedJobsGrid}
      options={{
        tabBarLabel: 'Applied Jobs',
        tabBarIcon: ({ color }) => <Icon name="assignment" color="#3e2465" size={26} />,
      }}
    />
    {/* <Tab.Screen
      name="Notifications"
      component={NotificationScreen}
      options={{
        tabBarLabel: 'Notifications',
        tabBarIcon: ({ color }) => <Icon name="notifications" color="#3e2465" size={26} />,
      }}
    /> */}
  </Tab.Navigator>
);

const JobGridStack = () => (
<Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    initialRouteName="Jobs"
    screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: '#694fad' },
      headerTintColor: '#fff',
      headerTitleAlign: 'center',
      headerTitle: () => (
        <View style={styles.headerContainer}>
          {/* <Image style={styles.logo} source={require('./images/logo.png')} /> */}
          
          <Text style={[styles.headerText, { color: '#fff' }]}>HIRE NOW</Text>
        </View>
      ),
    }}
  >
    <Drawer.Screen 
      name="Jobs Live" 
      component={MainTabScreen} 
      options={{
        drawerIcon: ({ color }) => (
          <Icon name="work" size={26} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="Account Settings" 
      component={AccountSettingsScreen} 
      options={{
        drawerIcon: ({ color }) => (
          <Icon name="settings" size={26} color={color} />
        ),
      }}
    />
  </Drawer.Navigator>
);

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
    color:'#1e282c'
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

export default JobGridStack;
