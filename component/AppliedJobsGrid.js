import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppliedJobGrid = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [userId, setUserId] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);

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
        const response = await fetch(`https://jobs.dev.britmarketing.co.uk/api/job-applications/${userId}`);
        const data = await response.json();
        console.log(data);
        if (data && data.job_applications) {
          setAppliedJobs(data.job_applications);
        } else {
          console.error('Failed to fetch applied jobs:', data.message);
        }
      } catch (error) {
        console.error('Error fetching applied jobs:', error.message);
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
    <TouchableOpacity
      style={styles.jobItem}
      onPress={() => {
        console.log('Selected Job ID:', item.id);
        navigation.navigate('JobDetails', { jobId: item.job_post.id });
      }}
    >
      <Text style={styles.jobTitle}>{item.job_post.jobTitle}</Text>
      <Text style={styles.company}>{item.job_post.company}</Text>
      <Text style={styles.appliedDate}>
        Applied on: {formatAppliedDate(item.created_at)}
      </Text>
    </TouchableOpacity>
  );

  const formatAppliedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Applied Jobs</Text>
      <FlatList
        data={appliedJobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={1} // Change to 2 if you want a multi-column layout
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
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
    color: '#333',
  },
  company: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  appliedDate: {
    fontSize: 14,
    color: '#999',
  },
});

export default AppliedJobGrid;
