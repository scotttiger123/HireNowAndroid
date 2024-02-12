import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text ,Alert  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import getCsrfToken from './csrfTokenUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountSettingsScreen = () => {

  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const csrfToken = await getCsrfToken();
        const storedUserId = await AsyncStorage.getItem('userId');
        console.log(storedUserId);
        const response = await fetch(`https://jobs.dev.britmarketing.co.uk/api/get-default-profile-info?user_id=${storedUserId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
        });
        const data = await response.json();
        console.log(data);
        setPhoneNumber(data.phoneNumber);
        setUsername(data.username);
        setPassword(data.password);
        setEmail(data.email);
      } catch (error) {
        console.error('Error fetching profile information:', error);
      }
    };

    fetchData();
  }, []);


  const showAlert = async () => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        'Confirm Update',
        'Are you sure you want to update your profile?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => reject('Update canceled'),
          },
          {
            text: 'OK',
            onPress: () => resolve(),
          },
        ],
        { cancelable: false }
      );
    });
  };

  const handleUpdate = async () => {
    try {

      await showAlert();
      const csrfToken = await getCsrfToken();
      const storedUserId = await AsyncStorage.getItem('userId');
  
      const response = await fetch(`https://jobs.dev.britmarketing.co.uk/api/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
          user_id: storedUserId,
          phoneNumber: phoneNumber,
          username: username,
          password: password,
          email: email,
        }),
      });
  
      if (!response) {
        throw new Error('Failed to update profile');
      }
  
      const responseData = await response.json();
      console.log(responseData); // Handle response data as needed
  
      // Optionally, you can navigate to a different screen or show a success message
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error, show error message, etc.
    }
    

  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Account Settings</Text>
      <View style={styles.experienceContainer}>
        <View style={styles.inputContainer}>
          <Icon name="phone" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="user" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={styles.inputContainer}>
        <Icon name="envelope" size={15.5} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address" // Set keyboard type to email address
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Update" onPress={handleUpdate} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  experienceContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '90%', // Adjusted width to 90%
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginLeft: 10, // Margin to separate icon and input
  },
  icon: {
    marginRight: 10, // Margin to separate icon and input
  },
  buttonContainer: {
    borderRadius: 10, // Rounded corners for the button container
    overflow: 'hidden', // Ensure child components respect rounded corners
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    margin: 10,
  },
});

export default AccountSettingsScreen;
