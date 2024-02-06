// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './component/LoginScreen';
import JobGridStack from './component/DrawerStack'; 
import JobDetailsScreen from './component/JobDetailsScreen'; 
import ApplyJobPage from './component/ApplyJobPage';
import AppliedJobGrid from './component/AppliedJobsGrid'; 
import Register from './component/Register'; 
import ProfileScreen from './component/ProfileScreen'; // Import the new component

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      
        <Stack.Screen name="JobGridStack" component={JobGridStack} />
        <Stack.Screen name="Profile" component={ProfileScreen} /> 
       
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />
        <Stack.Screen name="ApplyJobPage" component={ApplyJobPage} />
        <Stack.Screen name="AppliedJobGrid" component={AppliedJobGrid} />
        
        <Stack.Screen name="Registration" component={Register} />
        

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
