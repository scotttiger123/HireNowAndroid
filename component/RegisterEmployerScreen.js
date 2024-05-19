import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TextInput, TouchableOpacity,Alert } from 'react-native';
import getCsrfToken from './csrfTokenUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const RegisterEmployerScreen = () => {
     
    const [password, setPassword] = useState('');
    const navigation = useNavigation(); // useNavigation hook
    
    const handleCreateAccount = async () => {
      try {
          
          if (!password) {
              Alert.alert('Please enter a password');
              return;
          }
    
          
          const userEmail = await AsyncStorage.getItem('userEmail');
    
          const data = {
              email: userEmail, // Include email in the data object
              password,
              // Add other form fields here as needed
          };
    
          
          const csrfToken = await getCsrfToken();
    
          
          const response = await fetch('https://hirenow.site/api/save-password', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-TOKEN': csrfToken,
              },
              body: JSON.stringify(data),
          });
           
          let data_response = await response.json();
          
          if (data_response.success) {
             
            Alert.alert('Success', data_response.success);
            setPassword('');
            navigation.navigate('Login');
             
          } else {
             
              Alert.alert("Error", data_response.error || 'Unknown error');
          }
        } catch (error) {
          console.error('Error creating account:', error);
          // Handle error
          Alert.alert('An error occurred while creating the account', error.message || 'Unknown error');
      }
      
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={require('./images/register.jpeg')}
                style={styles.image}
                resizeMode="contain"
            />
            <View style={styles.section}>
              <View>
                <Text style={styles.heading}>Create Login </Text>
              </View>  
                <Text style={styles.label}>Password Required*</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
                    <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#ffffff',
        padding: 20,
    },
    section: {
        marginBottom: 20,
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'justify',
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 20,
        borderRadius: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#694fad',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 5,
      color: '#333',
    },
});

export default RegisterEmployerScreen;
