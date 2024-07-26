import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createDrawerNavigator, DrawerItem, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import JobGrid from './JobGrid';
import AppliedJobsGrid from './AppliedJobsGrid';
import AccountSettingsScreen from './AccountSettingsScreen';
import Profile from './ProfileScreen';
import ProfileCreateCandidate from './ProfileCreateCandidate';
import PostedJobsGrid from './PostedJobsGrid';
import Applications from './Applications';
import LoginScreen from './LoginScreen';
import CompanyProfile from './CompanyProfile';
import WelcomePage from './WelcomePage';
import AboutUsScreen from './AboutUsScreen';
import PrivacyPolicyScreen from './PrivacyPolicyScreen';
import OurServicesScreen from './OurServicesScreen';
import RegisterEmployerScreen from './RegisterEmployerScreen';
import WorkerSchedule from './WorkerSchedule';

const Drawer = createDrawerNavigator();
const Tab = createMaterialBottomTabNavigator();

const CustomDrawerContent = (props) => {
  const { navigation, state } = props;
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [focusedRoute, setFocusedRoute] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e) => {
      const route = e.data.state.routes.find((r) => r.name === 'JobGridStack');
      if (route && route.params && route.params.userName) {
        setUserName(route.params.userName);
        setUserId(route.params.userId);
        console.log();
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);
    } catch (error) {
      console.error('Error retrieving userId from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    const focusedRouteName = state.routes[state.index].name;
    setFocusedRoute(focusedRouteName);
  }, [state]);

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userRegisterType');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      <View style={styles.headerContainer}>
        <Image style={styles.profileImage} source={require('./images/logo.png')} resizeMode="contain" />
        <Text style={styles.headerText}>{userName}</Text>
      </View>

      {!userId && (
        <View>
          <DrawerItem
            label="Sign in"
            icon={() => <Icon name="person" size={26} color="#694fad" />}
            labelStyle={{ color: focusedRoute === 'SignOut' ? 'white' : '#696969' }}
            onPress={handleSignIn}
          />
          <View style={styles.divider} />
        </View>
      )}
      <DrawerItemList {...props} />
      {userId && (
        <>
          <View style={styles.divider} />
          <DrawerItem
            label="Sign Out"
            icon={() => <Icon name="exit-to-app" size={26} color="#694fad" />}
            labelStyle={{ color: focusedRoute === 'SignOut' ? 'white' : '#696969' }}
            onPress={handleSignOut}
          />
        </>
      )}
    </DrawerContentScrollView>
  );
};

const MainTabScreen = () => {
  return (
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
          tabBarShowLabel: true,
        }}
      />
      <Tab.Screen
        name="Applied Jobs"
        component={AppliedJobsGrid}
        options={{
          tabBarLabel: 'Applied Jobs',
          tabBarIcon: ({ color }) => <Icon name="assignment" color="#3e2465" size={26} />,
          tabBarShowLabel: true,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileCreateCandidate}
        options={{
          tabBarLabel: 'Candidate Profile',
          tabBarIcon: ({ color }) => <Icon name="person" color="#3e2465" size={26} />,
          tabBarShowLabel: true,
        }}
      />
    </Tab.Navigator>
  );
};

const Employer = () => {
  return (
    <Tab.Navigator
      initialRouteName="Jobs"
      shifting={true}
      activeColor="#f0edf6"
      inactiveColor="#3e2465"
      barStyle={{ backgroundColor: '#694fad' }}
    >
      <Tab.Screen
        name="CreateJob"
        component={WelcomePage}
        options={{
          tabBarLabel: 'Post a Job',
          tabBarIcon: ({ color }) => <Icon name="add-circle-outline" color="#3e2465" size={26} />,
        }}
      />
      <Tab.Screen
        name="Our Jobs"
        component={PostedJobsGrid}
        options={{
          tabBarLabel: 'Our Jobs',
          tabBarIcon: ({ color }) => <Icon name="event" color="#3e2465" size={26} />,
        }}
      />
      <Tab.Screen
        name="Company Profile"
        component={CompanyProfile}
        options={{
          tabBarLabel: 'Company Profile',
          tabBarIcon: ({ color }) => <Icon name="work" color="#3e2465" size={26} />,
        }}
      />
    </Tab.Navigator>
  );
};

const JobGridStack = ({ navigation }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);
    } catch (error) {
      console.error('Error retrieving userId from AsyncStorage:', error);
    }
  };

  const handleEmployerButtonClick = () => {
    try {
      if (!navigation) {
        throw new Error('Navigation is not defined');
      }
      navigation.navigate('Employers/ Post a Job');
    } catch (error) {
      Alert.alert('Error', `Error navigating to Employers/ Post a Job: ${error.message}`);
    }
  };

  return (
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
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity style={styles.headerButton} onPress={handleEmployerButtonClick}>
            <Text style={styles.headerButtonText}>Employer</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen
        name="Job Seekers"
        component={MainTabScreen}
        options={{
          drawerIcon: ({ color }) => <Icon name="people" size={26} color='#694fad' />,
        }}
      />
      <Drawer.Screen
        name="Employers/ Post a Job"
        component={Employer}
        options={{
          drawerIcon: ({ color }) => <Icon name="business" size={26} color='#694fad' />,
        }}
      />
      <Drawer.Screen
        name="Worker Schedule"
        component={WorkerSchedule}
        options={{
          drawerIcon: ({ color }) => <Icon name="schedule" size={26} color='#694fad' />,
        }}
      />
      <Drawer.Screen
        name="About Us"
        component={AboutUsScreen}
        options={{
          drawerIcon: ({ color }) => <Icon name="info" size={26} color='#694fad' />,
        }}
      />
      <Drawer.Screen
        name="Privacy Policy"
        component={PrivacyPolicyScreen}
        options={{
          drawerIcon: ({ color }) => <Icon name="lock" size={26} color='#694fad' />,
        }}
      />
      <Drawer.Screen
        name="Our Services"
        component={OurServicesScreen}
        options={{
          drawerIcon: ({ color }) => <Icon name="build" size={26} color='#694fad' />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default JobGridStack;

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
  headerButton: {
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f0edf6',
    borderRadius: 5,
  },
  headerButtonText: {
    color: '#694fad',
    fontSize: 14,
    fontWeight: 'bold',
  },
  drawerContent: {
    flex: 1,
  },

  



});

