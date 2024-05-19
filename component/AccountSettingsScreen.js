import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal, Button, ActivityIndicator, ScrollView,Alert,Linking } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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
  const [userIdAvailable, setUserIdAvailable] = useState(false);
  
    const fetchData = async () => {
      try {
        const csrfToken = await getCsrfToken();
        const storedUserId = await AsyncStorage.getItem('userId');

        //console.log("session id user ", storedUserId);
        if (storedUserId) {
          setUserIdAvailable(true);
          const response = await fetch(`https://hirenow.site/api/get-default-profile-info?user_id=${storedUserId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
        });
        const data = await response.json();
       
        console.log(data.data.user_info.phone);

        setPhoneNumber(data.data.user_info.phone);
        setUsername(data.data.user_info.name);
        setPassword(data.data.user_info.salt);
        setEmail(data.data.email);
      } else {
       // setPhoneNumber(null);
        setUsername(null);
        setPassword(null);
        setEmail(null);
        //setModalVisible(true);
        //setModalMessage('No settings available. Please log in first.');
      }

      } catch (error) {
        console.error('Error fetching profile information:', error);
      }
    };

    


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
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );
  const handleUpdate = async () => {
    try {
      setIsLoading(true);
        const storedUserId = await AsyncStorage.getItem('userId');
          // Check if the user ID is not available
          if (!storedUserId) {
            // If user ID is not available, display an alert indicating the need to log in
            Alert.alert(
              'Login Required',
              'You need to log in before updating settings.',
              [
                {
                  text: 'OK',
                  onPress: () => console.log('OK Pressed'),
                },
              ],
              { cancelable: false }
            );

            setIsLoading(false);
            return;
          }


      showAlert()
        .then(async () => {
          const csrfToken = await getCsrfToken();
          
            
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

  const onDeleteAccount = async () => {
        
    try {
        const storedUserId = await AsyncStorage.getItem('userId');
        // Check if the user ID is not available
          if (!storedUserId) {
            // If user ID is not available, display an alert indicating the need to log in
            Alert.alert(
              'Login Required',
              'You need to log in before deleting settings.',
              [
                {
                  text: 'OK',
                  onPress: () => console.log('OK Pressed'),
                },
              ],
              { cancelable: false }
            );

            setIsLoading(false);
            return;
          }

          
        Linking.openURL('https://hirenow.site/delete-candidate-info');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
    
        
          <View>
            <Text style={styles.header}>Account Settings</Text>
            <View style={styles.experienceContainer}>
              <View style={styles.label}>
                <Text style={styles.label} >User Name </Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
              <View>
                <Text style={styles.label} >Password </Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              <View style={styles.label}>
                <Text style={styles.label} > Email </Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: '#f0f0f0' }]}
                  placeholder="Email"
                  keyboardType="email-address" // Set keyboard type to email address
                  value={email}
                  onChangeText={setEmail}
                  editable={false} // Set editable prop to false to disable editing
                />
              </View>
              {isLoading ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                      <Text style={styles.updateButtonText}>Update</Text>
                    </TouchableOpacity>
                  </View>
                )}
              {/* Delete Account button */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.deleteButton} onPress={onDeleteAccount}>
                  <Text style={styles.deleteButtonText}>Delete Account</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  noSettingsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noSettingsText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1e282c',
  },
  container: {
    flex: 1,marginBottom: 12,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#694fad',
    textAlign: 'center',
  },updateButton: {
    backgroundColor: '#694fad',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  experienceContainer: {
    flex: 1,
    padding: 20,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    
    width: '100%',
    height: 40,
    color: '#333',
    borderRadius: 8,
    padding: 10,
    margin:5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    // Add a bottom shadow
    borderBottomWidth: 2,
    borderBottomColor: '#694fad',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#694fad',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});


export default AccountSettingsScreen;
