import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      const apiUrl = `https://hirenow.site/api/loginAppEmployer?email=${username}&password=${password}`;
      const response = await fetch(apiUrl);
      const responseData = await response.json();
      console.log(responseData);  
      if (responseData.success) {
        console.log('Login successful:', responseData);
        await AsyncStorage.setItem('userId', responseData.user.id.toString());

        setModalMessage('Login successful. Welcome!');
        setModalVisible(true);
        
        setTimeout(() => {
          setModalVisible(false);
          // Redirect to Home screen
          
         
          if (responseData.user && responseData.user.name) {
            
            navigation.navigate('JobGridStack', { userName: responseData.user.name , userId: responseData.user.id});
          }
    
        }, 2000);

      } else {
        console.log('Login failed:', responseData.message);
        // Show a custom modal with the error message
        setModalMessage(responseData.message);
        setModalVisible(true);
      }
    } catch (error) {
      console.log('Login failed:', error.message);
      // Show a custom modal with the error message
      setModalMessage('Login failed. Please try again later.');
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Navigate to the forgot password screen
    navigation.navigate('ForgotPassword');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainger}>
          <Image style={styles.logo} source={require('./images/logo.png')} resizeMode="contain" />
          <Text style={styles.title}>Employers Portal</Text>
       </View>
      
      <View style={styles.labelContianer}>
              <Text style={styles.label}>User Name</Text>
          </View>
          <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
       </View>   
       
       <View style={styles.labelContianer}>
          <Text style={styles.label}>Password </Text>
        </View>
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.forgotPasswordLink} onPress={handleForgotPassword}>
        Forgot Password?
      </Text>    
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
          <Text style={styles.registerLink}>Register here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  
  forgotPasswordLink:{
    marginLeft:15,
    fontSize: 14,
    fontSize: 14,
    color: '#164081', // Set link color to #164081
    fontWeight: 'bold',
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
  loginButton: {
    backgroundColor: '#164081',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
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
  modalText: {
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
  registerContainer: {
    flexDirection: 'row',
    marginTop: 16, // Remove this line to reduce top margin
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    color: '#164081', // Set link color to #164081
    fontWeight: 'bold',
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
    width: 150, // Set width of the logo image
    height: 150, // Set height of the logo image
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  placeholder: {
    color: '#1e282c',
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
  loginButton: {
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
  registerContainer: {
    flexDirection: 'row',
    marginTop: 16, // Remove this line to reduce top margin
    
  },
  registerText: {
    
    marginLeft:15,
    fontSize: 14,
    color: '#333',
    
  },
  registerLink: {
    fontSize: 14,
    color: '#164081', // Set link color to #164081
    fontWeight: 'bold',
  },
});

export default LoginPage;
