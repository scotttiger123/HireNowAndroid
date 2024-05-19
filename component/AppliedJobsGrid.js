import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet,ActivityIndicator  } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppliedJobGrid = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [userId, setUserId] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  useEffect(() => {
    const getUserIdFromStorage = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          console.log('UserId from storage:', storedUserId);
        }
      } catch (error) {
        console.error('Error getting userId from storage:', error.message);
      }
    };

    getUserIdFromStorage();
  }, []);

  useEffect(() => {
    
    console.log('Fetching applied jobs for UserId:', userId);
    const fetchAppliedJobs = async () => {
      try {
        setIsLoading(true); 
        const response = await fetch(`https://hirenow.site/api/job-applications/${userId}`);
        const data = await response.json();
        console.log(data);
        if (data && data.job_applications) {
          setAppliedJobs(data.job_applications);
        } else {
          console.error('Failed to fetch applied jobs:', data.message);
        }
        setIsLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error('Error fetching applied jobs:', error.message);
        setIsLoading(false); 
      }
    };

    fetchAppliedJobs();

    const unsubscribeFocus = navigation.addListener('focus', () => {
      fetchAppliedJobs();
    });
    return () => {
      unsubscribeFocus();
    };

  }, [userId],[navigation]);

  const renderItem = ({ item }) => (
    <View
      style={styles.jobItem}
      onPress={() => {
        console.log('Selected Job ID:', item.id);
        if (item.job_post) { // Check if job_post is not null
          navigation.navigate('JobDetails', { jobId: item.job_post.id });
        } else {
          console.error('Job post data is null for item:', item);
        }
      }}
    >
      {item.job_post && ( // Check if job_post is not null
        <>
          <Text style={styles.jobTitle}>{item.job_post.jobTitle}</Text>
          <Text style={styles.company}>{item.job_post.company}</Text>
        </>
      )}
      <Text style={styles.appliedDate}>
        Applied on: {formatAppliedDate(item.created_at)}
      </Text>
    </View>
  );

  const formatAppliedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
  };
  
  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#164081" />
        </View>
      ) : appliedJobs.length === 0 ? (
        <Text style={styles.pageTitle}>No jobs applied</Text>
      ) : (
        <>
          <Text style={styles.pageTitle}>Applied Jobs</Text>
          <FlatList
            data={appliedJobs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            numColumns={1} // Change to 2 if you want a multi-column layout
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#694fad',
  },
  jobItem: {
    padding: 20,
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e282c',
  },
  company: {
    fontSize: 16,
    color: '#1e282c',
    marginBottom: 8,
  },
  appliedDate: {
    fontSize: 14,
    color: '#1e282c',
  },
});

export default AppliedJobGrid;
