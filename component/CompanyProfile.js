import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CompanyProfile = () => {
  const navigation = useNavigation(); // useNavigation hook

  const handlePostProfile = () => {
    // Navigate to the post job page
    navigation.navigate('PostCompanyProfile');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./images/company_profile.jpg')}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.text}>
        A well-crafted company profile reflects your organization's values, culture, and mission, providing candidates with valuable insights.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handlePostProfile}>
          <Text style={styles.buttonText}>Create Company Profile</Text>
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

export default CompanyProfile;
