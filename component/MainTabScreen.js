import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import JobGridStack from './JobGrid'; 
import NotificationScreen from './NotificationScreen'; 
import AccountSettingsScreen from './AccountSettingsScreen'; 
import ProfileScreen from './ProfileScreen'; 

const Drawer = createDrawerNavigator();
const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

// Define the main tab screen
function MainTabScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Jobs"
      activeColor="#f0edf6"
      inactiveColor="#3e2465"
      barStyle={{ backgroundColor: '#694fad' }}
    >
      <Tab.Screen 
        name="MyAccount"
        component={AccountSettingsScreen}
        options={{
          tabBarLabel: 'My Account',
          tabBarIcon: ({ color }) => (
            <Icon name="account-circle" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen 
        name="MyProfile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'My Profile',
          tabBarIcon: ({ color }) => (
            <Icon name="person" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen 
        name="Jobs"
        component={JobGridStack}
        options={{
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ color }) => (
            <Icon name="work" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen 
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color }) => (
            <Icon name="notifications" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}




export default MainTabScreen;
