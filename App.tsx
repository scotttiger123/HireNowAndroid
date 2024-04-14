// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Linking } from 'react-native';

import LoginScreen from './component/LoginScreen';
import JobGridStack from './component/DrawerStack'; 
import JobDetailsScreen from './component/JobDetailsScreen'; 
import ApplyJobPage from './component/ApplyJobPage';
import Register from './component/Register'; 
import AccountSettingsScreen from './component/AccountSettingsScreen'; 
import MainTabScreen from './component/MainTabScreen'; 
import ForgotPassword from './component/ForgotPassword'; 
import ChangePasswordScreen from './component/ChangePasswordScreen';
import DuplicateLogin from './component/DuplicateLogin';

const Stack = createStackNavigator();


function App() {

   const [initialRoute, setInitialRoute] = useState('Login');
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const deepLink = await Linking.getInitialURL();
        if (deepLink && deepLink.startsWith('mychat://HireNowCandidate/ChangePassword')) {
          console.log('Setting initial route to ChangePassword fetchInitialRoute');
          setInitialRoute('ChangePassword');
          handleDeepLink(deepLink);
        } else {
          console.log('Setting initial route to Login');
          setInitialRoute('Login');
        }
      } catch (error) {
        console.error('Error fetching initial route:', error);
      }
    };

    const handleDeepLink = (url) => {
      const route = url.replace(/.*?:\/\//g, ''); // Remove the scheme
      const parts = route.split('/'); // Split the URL by '/'
      const routeName = parts[1]; // The second part should be the route name
      const token = parts[2]; 
      const email = parts[3]; 
  
      console.log('Received deep link:===', routeName);
  
      if (routeName === 'ChangePassword') {
        setToken(token);
        setEmail(email);
        console.log('Setting initial route to ChangePassword handle Deep link');
        setInitialRoute('ChangePassword');
      }
    };

    Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
    initializeApp();
    
    return () => {
       // Linking.removeEventListener('url', handleDeepLink);
    };
  }, []);

  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        {initialRoute === 'ChangePassword' ? (
          <React.Fragment>
            <Stack.Screen name={initialRoute}>
              {(props) => <ChangePasswordScreen {...props} token={token} email={email} />}
            </Stack.Screen>
            <Stack.Screen name="DuplicateLogin" component={DuplicateLogin} />
            <Stack.Screen name="JobGridStack" component={JobGridStack} />
            <Stack.Screen name="MainTabScreen" component={MainTabScreen} />
            <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />
            <Stack.Screen name="ApplyJobPage" component={ApplyJobPage} />
            <Stack.Screen name="Registration" component={Register} />
            <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} /> 
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} /> 
            
          </React.Fragment>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="JobGridStack" component={JobGridStack} />
            <Stack.Screen name="MainTabScreen" component={MainTabScreen} />
            <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />
            <Stack.Screen name="ApplyJobPage" component={ApplyJobPage} />
            <Stack.Screen name="Registration" component={Register} />
            <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} /> 
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} /> 
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
   
}

export default App;