import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal, Button,ActivityIndicator  } from 'react-native';

const RegisterPage = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleRegister = async () => {
    
    if (password !== confirmPassword) {
      setModalMessage("Passwords don't match.");
      setModalVisible(true);
      return;
    }
    try {
      setIsLoading(true);
      const apiUrl = `https://hirenow.site/api/register?fullName=${fullName}&email=${email}&phone=${phone}&password=${password}&confirmPassword=${confirmPassword}`;
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
     } finally {
      setIsLoading(false); // Hide loader regardless of success or failure
    }
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Placeholder for logo image */}
      <View style={styles.imageContainger}>
      <Image
        style={styles.logo}
        source={require('./images/logo.png')} // Replace with your actual logo image path
        resizeMode="contain"
      />
      </View>
      <View style={styles.labelContianer}>
              <Text style={styles.label}>Full Name</Text>
          </View>
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={(text) => setFullName(text)}
      />
      </View>
      <View style={styles.labelContianer}>
              <Text style={styles.label}>Email</Text>
          </View>
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      </View>
      <View style={styles.labelContianer}>
              <Text style={styles.label}>Phone</Text>
          </View>
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Phone"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={(text) => setPhone(text)}
      />
      </View>
      <View style={styles.labelContianer}>
              <Text style={styles.label}>Password</Text>
          </View>
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      </View>
      <View style={styles.labelContianer}>
              <Text style={styles.label}>Confirm Password</Text>
          </View>
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      </View>
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="white" /> 
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
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
    paddingTop: 20, // Reduced top padding

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
  registerButton: {
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
    width: '80%', // You can adjust the width as needed
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
  modalButton: {
    backgroundColor: '#164081',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  

});

export default RegisterPage;
