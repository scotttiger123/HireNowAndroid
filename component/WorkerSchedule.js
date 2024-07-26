import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getCsrfToken from './csrfTokenUtil';

const WorkerSchedule = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [siteLocation, setSiteLocation] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [workerName, setWorkerName] = useState('');
  const [siteManager, setSiteManager] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const checkLoginStatus = async () => {
        const storedUserId = await AsyncStorage.getItem('userId');
        setIsSignedIn(!!storedUserId);
        setUserId(storedUserId);
      };

      checkLoginStatus();
    }, [])
  );

  const handleConfirm = (selectedDate) => {
    setDatePickerVisibility(false);
    setDateTime(selectedDate);
  };

  const formatDateTimeForBackend = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async () => {
    if (!siteLocation || !jobTitle || !workerName || !siteManager || !dateTime) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      const formattedDateTime = formatDateTimeForBackend(dateTime);
      const csrfToken = await getCsrfToken();

      const response = await fetch('https://hirenow.site/api/work-schedules-store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
          site_location: siteLocation,
          job_title: jobTitle,
          worker_name: workerName,
          site_manager: siteManager,
          date_time: formattedDateTime,
          user_id: userId,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Work schedule created successfully');
        // Clear the fields after successful submission
        setSiteLocation('');
        setJobTitle('');
        setWorkerName('');
        setSiteManager('');
        setDateTime(new Date());
      } else {
        Alert.alert('Error', `Failed to create work schedule: ${responseData.message}`);
      }
    } catch (error) {
      Alert.alert('Error', `An error occurred: ${error.message}`);
    }
  };

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('./images/WorkerSchedule.png')}
        style={styles.image}
        resizeMode="contain"
      />

      {isSignedIn ? (
        <View style={styles.form}>
          <Text style={styles.heading}>Create Work Schedule</Text>
          <Text style={styles.label}>Site Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Site Location"
            value={siteLocation}
            onChangeText={setSiteLocation}
          />
          <Text style={styles.label}>Job Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Job Title"
            value={jobTitle}
            onChangeText={setJobTitle}
          />
          <Text style={styles.label}>Worker Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Worker Name"
            value={workerName}
            onChangeText={setWorkerName}
          />
          <Text style={styles.label}>Site Manager</Text>
          <TextInput
            style={styles.input}
            placeholder="Site Manager"
            value={siteManager}
            onChangeText={setSiteManager}
          />
          <Text style={styles.label}>Job Time</Text>
          <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
            <TextInput
              style={styles.input}
              placeholder="Select Date & Time"
              value={dateTime.toLocaleString()}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={() => setDatePickerVisibility(false)}
            date={dateTime}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.signInContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  form: {
    width: '100%',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
    borderRadius: 5,
    color: '#694fad', // Optional: change text color
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#694fad',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 2,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  signInContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  signInText: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default WorkerSchedule;