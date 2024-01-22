// JobGridStack.js
import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import JobGrid from './JobGrid';
import AppliedJobsGrid from './AppliedJobsGrid';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Drawer = createDrawerNavigator();

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
    <Drawer.Screen
      name="Jobs"
      component={JobGrid}
      options={{
        drawerLabel: 'Jobs',
        drawerIcon: ({ color, size }) => <Icon name="search" size={size} color={color} />,
      }}
    />
    <Drawer.Screen
      name="Applied Jobs"
      component={AppliedJobsGrid}
      initialParams={{ userId: null }} // Set initialParams with userId
      options={{
        drawerLabel: 'Applied Jobs',
        drawerIcon: ({ color, size }) => <Icon name="assignment" size={size} color={color} />,
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
