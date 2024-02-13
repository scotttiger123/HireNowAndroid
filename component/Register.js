import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal, Button } from 'react-native';

const RegisterPage = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleRegister = async () => {
 
    try {
      const apiUrl = `https://jobs.dev.britmarketing.co.uk/api/register?fullName=${fullName}&email=${email}&phone=${phone}&password=${password}&confirmPassword=${confirmPassword}`;
      const response = await fetch(apiUrl);
      const result = await response.json();
      console.log(result);
      // Handle the response from the server
      if (result && result.error) {
        
        console.log('Registration unsuccessful:', result.error);
      
        if (result.error.email) {
          setModalMessage(result.error.email[0]);
          setModalVisible(true);
          return;
        }
        if (result.error.fullName) {
          setModalMessage(result.error.fullName[0]);
          setModalVisible(true);
          return;
        }
      
        if (result.error.password) {
          setModalMessage(result.error.password[0]);
          setModalVisible(true);
          return;
        }
      }else {
        
        console.log('Registration done:', result.success);
        setModalMessage(result.success);
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Registration error:', error.message);
      setModalMessage('An unexpected error occurred. Please try again.');
      setModalVisible(true);
    }
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Placeholder for logo image */}
      <Image
        style={styles.logo}
        source={require('./images/logo.png')} // Replace with your actual logo image path
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={(text) => setFullName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={(text) => setPhone(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20, // Reduced top padding
        backgroundColor: 'white', // Set white background
      },
      logo: {
        width: 150, // Set width of the logo image
        height: 150, // Set height of the logo image
        marginBottom: 16,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
      },
      input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        padding: 8,
      },
  registerButton: {
    backgroundColor: '#164081',
    padding: 10,
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
    fontSize: 14,
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
  },

});

export default RegisterPage;
