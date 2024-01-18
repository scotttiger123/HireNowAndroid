// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './component/LoginScreen';
import JobGridStack from './component/DrawerStack'; // Import the JobGridStack component
import JobDetailsScreen from './component/JobDetailsScreen'; // Import the JobGridStack component
import ApplyJobPage from './component/ApplyJobPage';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
        <Stack.Screen name="JobGridStack" component={JobGridStack} />
        <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />
        <Stack.Screen name="ApplyJobPage" component={ApplyJobPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
