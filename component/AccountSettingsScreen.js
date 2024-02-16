import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text ,Alert ,Modal ,TouchableOpacity ,ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import getCsrfToken from './csrfTokenUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountSettingsScreen = () => {

  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const csrfToken = await getCsrfToken();
        const storedUserId = await AsyncStorage.getItem('userId');
        
        console.log("session id user ",storedUserId);
        const response = await fetch(`https://hirenow.site/api/get-default-profile-info?user_id=${storedUserId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
        });
        const data = await response.json();
        
        setPhoneNumber(data.data.user_info.phone);
        setUsername(data.data.user_info.name);
        setPassword(data.data.user_info.salt);
        setEmail(data.data.email);
        
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
      setIsLoading(true);
  
      showAlert()
        .then(async () => {
          const csrfToken = await getCsrfToken();
          const storedUserId = await AsyncStorage.getItem('userId');
      
          const response = await fetch(`https://hirenow.site/api/update-profile`, {
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
          const errors = responseData.errors;
  
          if (errors) {
            let errorMessage = 'Error:\n';
            
            for (const field in errors) {
              errorMessage += `${field}: ${errors[field].join(', ')}\n`;
            }
            
            setModalMessage(errorMessage);
            setModalVisible(true);
          } else {
            const { success, message } = responseData;
            
            if (success) {
              setModalMessage(message);
            } else {
              setModalMessage(message);
            }
            
            setModalVisible(true);
          }
          
          setIsLoading(false);
        })
        .catch((error) => {
          if (error === 'Update canceled') {
            // Handle update cancelation
            setModalMessage('Update canceled. No changes were made.');
            setModalVisible(true);
          } else {
            // Handle other errors
            console.error('Error updating profile:', error);
            setModalMessage('An unexpected error occurred. Please try again.');
            setModalVisible(true);
          }
          setIsLoading(false);
        });
    } catch (error) {
      console.error('Error updating profile:', error);
      setModalMessage('An unexpected error occurred. Please try again.');
      setModalVisible(true);
      setIsLoading(false);
    }
  };
  


  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Account Settings</Text>
      <View style={styles.experienceContainer}>
        <View style={styles.label}>
          <Text>Phone Number</Text>
        </View>
        <View style={styles.inputContainer}>
          <Icon name="phone" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
        <View style={styles.label}>
          <Text>User Name </Text>
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
        <View style={styles.label}>
          <Text>Password </Text>
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={styles.label}>
          <Text>Email </Text>
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
        {isLoading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <View style={styles.buttonContainer}>
            <Button title="Update" onPress={handleUpdate} />
          </View>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={closeModal}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: 'black',
  },
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
  },modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%', // You can adjust the width as needed
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black', // You can set the text color to your preference
  },
  modalButton: {
    backgroundColor: '#164081',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

});

export default AccountSettingsScreen;
