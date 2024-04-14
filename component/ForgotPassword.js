import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button,Image  } from 'react-native';
import getCsrfToken from './csrfTokenUtil';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordPage = () => {
  const navigation = useNavigation(); // Get navigation object
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleResetPassword = async () => {
    try {
      const csrfToken = await getCsrfToken(); 
      const response  = await fetch('https://hirenow.site/api/reset-password-candidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({ email }),
      });
      const responseData = await response.json();
       
      if (response.ok) {
        // Password reset email sent successfully
        setModalMessage('Password reset email sent successfully');
        setModalVisible(true);
        // Navigate to the login page
        
        setTimeout(() => {
          navigation.navigate('Login');
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

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainger}>
      <Image
        style={styles.logo}
        source={require('./images/logo.png')} // Replace with your actual logo image path
        resizeMode="contain"
      />
      <Text style={styles.title}>Forgot Password</Text>
      </View>
      
      <View style={styles.labelContianer}>
              <Text style={styles.label}>Email</Text>
          </View>
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login here</Text>
        </TouchableOpacity>
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
            <Button
              title="OK"
              onPress={closeModal}
              color="#164081"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    color: 'white',
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

export default ForgotPasswordPage;
