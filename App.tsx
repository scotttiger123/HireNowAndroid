import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { createDrawerNavigator } from '@react-navigation/drawer';
import JobGrid from './component/JobGrid';

const Drawer = createDrawerNavigator();

function App() {
    
    return (
    
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="Jobs" component={JobGrid} />
        </Drawer.Navigator>
      </NavigationContainer>

  );
}


export default App;
