import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet,Alert } from 'react-native';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import JobGrid from './JobGrid';
import AppliedJobsGrid from './AppliedJobsGrid';
import AccountSettingsScreen from './AccountSettingsScreen';
import { useFocusEffect } from '@react-navigation/native';

import Profile from './ProfileScreen';

import PostedJobsGrid from './PostedJobsGrid';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Applications from './Applications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './LoginScreen';
import CompanyProfile from './CompanyProfile';
import WelcomePage from './WelcomePage';
import AboutUsScreen from './AboutUsScreen';
import PrivacyPolicyScreen from './PrivacyPolicyScreen';
import OurServicesScreen from './OurServicesScreen';
import RegisterEmployerScreen from './RegisterEmployerScreen';


// ...


import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';


const Drawer = createDrawerNavigator();
const Tab = createMaterialBottomTabNavigator();

const CustomDrawerContent = (props) => {
  const { navigation, state } = props;
  const [userName, setUserName] = useState('');
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
    fetchData(); // Fetch data initially when the component mounts
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      fetchData(); // Refresh data when the drawer state changes
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
        <Image
          style={styles.profileImage}
          source={require('./images/logo.png')}
          resizeMode="contain" 
        />
        <Text style={styles.headerText}>{userName}</Text>
      </View>
     
        {!userId && (
          <View>
            <DrawerItem
              label="Sign in"
              icon={() => (
                <Icon
                  name="person"
                  size={26}
                  color="#694fad" // Set default color to magenta
                />
              )}
              labelStyle={{
                color: focusedRoute === 'SignOut' ? 'white' : '#696969', // Keep text color unchanged
              }}
              onPress={handleSignIn}
            />
            <View style={styles.divider} />
          </View>
        )}
      <DrawerItemList {...props} />
      <View style={styles.divider} />
      <DrawerItem
        label="Sign Out"
        icon={() => (
          <Icon
            name="exit-to-app"
            size={26}
            color="#694fad" // Set default color to magenta
          />
        )}
        labelStyle={{
          color: focusedRoute === 'SignOut' ? 'white' : '#696969', // Keep text color unchanged
        }}
        onPress={handleSignOut}
      />
        


          </DrawerContentScrollView>
        );
      };
     
      const MainTabScreen = () => {
        // const [userRegisterType, setUserRegisterType] = useState(null);
      
        // useEffect(() => {
        //   fetchData(); // Fetch userRegisterType initially when the component mounts
        // }, []);
      
        // // Fetch userRegisterType when the component is focused
        // useFocusEffect(
        //   React.useCallback(() => {
        //     fetchData();
        //   }, [])
        // );
      
        // const fetchData = async () => {
        //   try {
      
        //     // Fetch userRegisterType from AsyncStorage or any other data source
        //     const userRegister = await AsyncStorage.getItem('userRegisterType');
        //     const userRegisterInt = parseInt(userRegister);
        //     setUserRegisterType(userRegisterInt);
        //   } catch (error) {
        //     console.error('Error fetching userRegisterType:', error);
        //   }
        // };
      
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
                tabBarShowLabel: true, // Show label by default
              }}
            />
              
            <Tab.Screen
              name="Applied Jobs"
              component={AppliedJobsGrid}
              options={{
                tabBarLabel: 'Applied Jobs',
                tabBarIcon: ({ color }) => <Icon name="assignment" color="#3e2465" size={26} />,
                tabBarShowLabel: true, // Show label by default
              }}
            />
            
            <Tab.Screen 
              name="Profile" 
              component={Profile} 
              options={{
                tabBarLabel: 'Candidate Profile',
                tabBarIcon: ({ color }) => <Icon name="person" color="#3e2465" size={26} />,
                tabBarShowLabel: true, // Show label by default
              }}
              
            />  
          </Tab.Navigator>
        );
      };
      
// 

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
        name="Applications"
        component={Applications}
        options={{
          tabBarLabel: 'Applications',
          tabBarIcon: ({ color }) => <Icon name="description" color="#3e2465" size={26} />,
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


const handleSignInPending = () => {
  // Your sign-in logic here
  navigation.navigate('Login');
  
  
  
};



const JobGridStack = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchData(); // Fetch user data initially when the component mounts
  }, []);

  const fetchData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);
    } catch (error) {
      console.error('Error retrieving userId from AsyncStorage:', error);
    }
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} handleSignIn={handleSignInPending}/>}
      initialRouteName="Jobs"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#694fad' },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerTitle: () => (
          <View style={styles.headerContainer}>
            {/* <Image style={styles.logo} source={require('./images/logo.png')} /> */}
            {/* <Text style={[styles.headerText, { color: '#fff' }]}>HIRE NOW</Text> */}
          </View>
        )
      }}
    >
      <Drawer.Screen 
        name="Job Seekers" 
        component={MainTabScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="people" size={26} color='#694fad' />
          ),
        }}
      />
      <Drawer.Screen 
        name="Hire Staff" 
        component={Employer}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="business" size={26} color='#694fad' />
          ),
        }}
      />
      <Drawer.Screen 
        name="About Us" 
        component={AboutUsScreen} // Replace with your About Us component
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="info" size={26} color='#694fad' /> // You can choose appropriate icon for About Us
          ),
        }}
      />
      <Drawer.Screen 
        name="Privacy Policy" 
        component={PrivacyPolicyScreen} // Replace with your Privacy Policy component
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="privacy-tip" size={26} color='#694fad' /> // You can choose appropriate icon for Privacy Policy
          ),
        }}
      />
      <Drawer.Screen 
        name="Our Services" 
        component={OurServicesScreen} // Replace with your Our Services component
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="business-center" size={26} color='#694fad' /> // You can choose appropriate icon for Our Services
          ),
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={AccountSettingsScreen} 
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="settings" size={26} color='#694fad' />
          ),
        }}
      />
      {/* <Drawer.Screen 
        name="RegisterEmployerScreen" 
        component={RegisterEmployerScreen} 
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="settings" size={26} color='#694fad' />
          ),
        }}
      /> */}
    </Drawer.Navigator>
  );
};


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
