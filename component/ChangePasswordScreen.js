// Import the necessary modules
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import getCsrfToken from './csrfTokenUtil';

// Define the ChangePasswordScreen component
const ChangePasswordScreen = ({ route, token, email }) => {
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  // Function to handle the back press
  const handleBackPress = () => {
    // Navigate back to the login screen
    navigation.navigate('DuplicateLogin');
  };

  // Function to handle password change
  // Function to handle password change
const handleChangePassword = async () => {
  try {
    // Check if passwords meet criteria
    if (newPassword.length < 6) {
      setModalMessage('New password must be at least 6 characters long');
      setModalVisible(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setModalMessage('Passwords do not match');
      setModalVisible(true);
      return;
    }

    // If validation passes, proceed with password change
    const csrfToken = await getCsrfToken();
    const response = await fetch('https://hirenow.site/api/reset-password-employer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      },
      body: JSON.stringify({ token, newPassword, confirmPassword, email }),
    });
    const responseData = await response.json();

    if (response.ok) {
      // Password reset email sent successfully
      setModalMessage('Password reset successfully');
      setModalVisible(true);
      // Navigate back to the login screen
      setTimeout(() => {
        navigation.navigate('DuplicateLogin');
      }, 3000);
    } else {
      // Error handling
      setModalMessage(responseData.message || 'Failed to send password reset email');
      setModalVisible(true);
    }
  } catch (error) {
    console.error('Error:', error);
    setModalMessage('An error occurred. Please try again later.');
    setModalVisible(true);
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.imageContainger}>
          <Image style={styles.logo} source={require('./images/logo.png')} resizeMode="contain" />
          <Text style={styles.title}>Change Password</Text>
       </View>
        <View style={styles.labelContianer}>
              <Text style={styles.label}>Email </Text>
        </View>
        <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.emailInput, styles.disabledTextInput]}
              placeholder="Email"
              value={email}
              editable={false} // To make the field non-editable

            />
         </View>

        <View style={styles.labelContianer}>
              <Text style={styles.label}>New Password </Text>
        </View>
      <View style={styles.inputContainer}>      
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            
            onChangeText={setNewPassword}
          />
      </View>

      <View style={styles.labelContianer}>
              <Text style={styles.label}>Confirm New Password </Text>
        </View>
      <View style={styles.inputContainer}>      
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      </View>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <TouchableOpacity style={styles.resetButton} onPress={handleChangePassword} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>
      {/* <View style={styles.loginContainer}>
        <Text style={styles.loginText}> </Text>
        <TouchableOpacity onPress={handleBackPress}>
          <Text style={styles.registerLink}>Login here</Text>
        </TouchableOpacity>
      </View> */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View> 
  );
};

// Define the styles
const styles = StyleSheet.create({
  registerLink: {
    fontSize: 14,
    color: '#164081', // Set link color to #164081
    fontWeight: 'bold',
  },
  disabledTextInput: {
    backgroundColor: '#f2f2f2', // Gray background color
    color: '#666', // Gray text color
  },
  inputContainer: {
    flexDirection: 'row',
  },
  labelContianer:{
    alignItems: 'right',
  },
  
  label: {
    fontWeight: 'bold',
    color: '#1e282c',
    margin:5,
  },
  imageContainger: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100, // Reduced top padding

  },
  container: {
    backgroundColor: 'white',
      flex: 1,
      // justifyContent: 'center',
      // alignItems: 'center',
      padding: 20, // Reduced top padding
      backgroundColor: 'white', // Set white background
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    color: '#1e282c',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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
    borderBottomColor: '#164081',
  },
  resetButton: {
    backgroundColor: '#164081', // Set button color to #164081
    padding: 10,
    margin:5,
    marginTop:10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  loginText: {
    marginLeft:15,
    fontSize: 14,
    color: '#333',
  },
  loginLink: {
    fontSize: 14,
    color: '#164081',
    fontWeight: 'bold',
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
  },
});

// Export the component
export default ChangePasswordScreen;
