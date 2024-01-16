import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { WebView } from 'react-native-webview';

const LoginPage = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      const apiUrl = `https://jobs.dev.britmarketing.co.uk/api/loginApp?email=${username}&password=${password}`;
      const response = await fetch(apiUrl);
      const responseData = await response.json();

      if (responseData.success) {
        console.log('Login successful:', responseData.user.name);

        setModalMessage('Login successful. Welcome!');
        setModalVisible(true);
        
        setTimeout(() => {
          setModalVisible(false);
          // Redirect to Home screen
          
         
          if (responseData.user && responseData.user.name) {
            navigation.navigate('JobGrid', { userName: responseData.user.name });
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

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('./images/logo.png')} resizeMode="contain" />
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
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
  // ... your existing styles
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
  loginButton: {
    backgroundColor: '#164081', // Set button color to #164081
    padding: 10,
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
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    color: '#164081', // Set link color to #164081
    fontWeight: 'bold',
  },
});

export default LoginPage;
