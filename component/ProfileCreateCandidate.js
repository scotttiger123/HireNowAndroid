import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const CandidateProfile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigation = useNavigation(); // useNavigation hook

  useFocusEffect(
    React.useCallback(() => {
      const checkLoginStatus = async () => {
        try {
          const userId = await AsyncStorage.getItem('userId');
          if (userId !== null) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Failed to fetch user ID from AsyncStorage', error);
          setIsLoggedIn(false);
        }
      };

      checkLoginStatus();
    }, [])
  );

  const handleAction = () => {
    if (isLoggedIn) {
      // Navigate to the profile page if logged in
      navigation.navigate('ProfileScreen');
    } else {
      // Navigate to the sign-in page if not logged in
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./images/profile_resume.jpg')}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.text}>
          Your profile is more than just a resume—it's a reflection of your professional identity and potential.
          Take the time to craft it thoughtfully, and you’ll be well on your way to making a lasting impression.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleAction}>
          <Text style={styles.buttonText}>
            {isLoggedIn ? 'Create Profile' : 'Sign In'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '40%', // Adjust the height as needed
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#694fad',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CandidateProfile;
