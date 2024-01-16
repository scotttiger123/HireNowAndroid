// DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import JobGrid from './JobGrid'; // Import your main component

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={JobGrid} />
      {/* Add more screens if needed */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
