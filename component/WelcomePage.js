import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PostJobForm from './CreateJob'; 

const WelcomePage = () => {
  const navigation = useNavigation(); // useNavigation hook

  const handlePostJob = () => {
    // Navigate to the post job page
    
    navigation.navigate('PostJobForm');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./images/create_job.jpg')}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.text}>
        Empower your business with the right talent. Let's make your next great hire. Fast.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handlePostJob}>
        <Text style={styles.buttonText}>Post a Job</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '80%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#694fad',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomePage;
