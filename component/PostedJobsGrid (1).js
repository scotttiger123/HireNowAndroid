import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert  } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PostedJobsGrid = () => {
  const navigation = useNavigation();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Function to fetch applied jobs
  const fetchAppliedJobs = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
       Alert.alert('No recent job posted.Please log in to view jobs.');
       setAppliedJobs([]); // Clear appliedJobs array if userId is null
        return; // Exit function if userId is null
      }
      console.log("console userid ", userId);
      
      
      const response = await fetch(`https://hirenow.site/api/view-posted-jobs/${userId}`);
      console.log("resp:", response);
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setAppliedJobs(data.postedJobs);
        
      } else {
        console.error('Failed to fetch applied jobs:', data.message);
      }
    
    } catch (error) {
      console.error('Error fetching applied jobs:', error.message);
    }
  };

  // Use useEffect to fetch data when component mounts
  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  // Use useFocusEffect to fetch data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchAppliedJobs();
    }, [])
  );
  
  const openDetailsModal = (item) => {
    setSelectedJob(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setModalVisible(false);
  };
  const deleteJob = async (jobId) => {  
    try {
      console.log("delete job", jobId);
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this job?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              const response = await fetch(`https://hirenow.site/api/delete-job/${jobId}`, {
                method: 'GET',
              });
              const data = await response.json();
              console.log(data);
              if (response.ok) {
                    console.log('Job deleted successfully');
                    fetchAppliedJobs();
                    Alert.alert('Job deleted successfully');
              } else {
                console.error('Failed to delete job:', data.error);
              }
            },
            style: 'destructive',
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error deleting job:', error.message);
    }
  };
  
  const renderItem = ({ item }) => (
    <View
      style={styles.jobItem}
      onPress={() => {
        console.log('Selected Job ID:', item.id);
        
      }}
    >
   
      <Text style={styles.jobTitle}>{item.jobTitle?.toUpperCase()}</Text>
      <View style={styles.infoContainer}>
      <TouchableOpacity
          onPress={() => {
            console.log('View Applications for Job ID:', item.id);
            // Navigate to the screen to view applications, passing the job ID
            navigation.navigate('ViewApplicationsScreen', { jobId: item.id });
          }}
        >
          <View style={styles.infoItem}>
            <Icon name="people" size={20} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>{item.job_applications_count}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.infoItem}>
          {/* <Text style={styles.infoLabel}>Posted on:</Text> */}
          <Text style={styles.infoText}>{new Date(item.created_at).toDateString()}</Text>
        </View>
        <TouchableOpacity onPress={() => openDetailsModal(item)}>
          <Icon name="visibility" size={20} color="#666" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('EditJobScreen', { job: item })}>
          <Icon name="edit" size={20} color="green" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteJob(item.id)}>
          <Icon name="delete" size={20} color="red" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View> 
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Our Recent Jobs</Text>
      <FlatList
        data={appliedJobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={1}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>JOB DETAILS</Text>
            {selectedJob && (
              <ScrollView style={styles.scrollContainer}>

                
                      <View style={styles.detailContainer}>
                        <Text style={styles.detailLabel}>Job Title:</Text>
                        <Text style={styles.detailText}>{selectedJob.jobTitle}</Text>
                      </View>
                      <View style={styles.detailContainer}>
                        <Text style={styles.detailLabel}>Skills Required:</Text>
                        <Text style={styles.detailText}>{selectedJob.skillsRequired}</Text>
                      </View>
                      <View style={styles.detailContainer}>
                        <Text style={styles.detailLabel}>Career Level:</Text>
                        <Text style={styles.detailText}>{selectedJob.careerLevel}</Text>
                      </View>
                      <View style={styles.detailContainer}>
                        <Text style={styles.detailLabel}>Number of Positions:</Text>
                        <Text style={styles.detailText}>{selectedJob.numPositions}</Text>
                      </View>
                      <View style={styles.detailContainer}>
                        <Text style={styles.detailLabel}>Job Location:</Text>
                        <Text style={styles.detailText}>
                          {selectedJob.jobLocation && JSON.parse(selectedJob.jobLocation)[0]}
                        </Text>
                      </View>

                      <View style={styles.detailContainer}>
                        <Text style={styles.detailLabel}>Salary Range:</Text>
                        <Text style={styles.detailText}>{selectedJob.min_salary} - {selectedJob.max_salary}</Text>
                      </View>
                      <View style={styles.detailContainer}>
                        <Text style={styles.detailLabel}>Job Type:</Text>
                        <Text style={styles.detailText}>{selectedJob.job_type}</Text>
                      </View>
                      <View style={styles.detailContainer}>
                        <Text style={styles.detailLabel}>Company:</Text>
                        <Text style={styles.detailText}>{selectedJob.company}</Text>
                      </View>
                      <View style={styles.detailContainer}>
                        <Text style={styles.detailLabel}>Description: </Text> 
                        <Text style={styles.detailText}> {selectedJob.jobDescription}</Text>
                      </View>
                </ScrollView>
            )}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white', // Background color white
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
    backgroundColor: '#f0f0f0', // Light background color
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoLabel: {
    fontWeight: 'bold',
    marginRight: 5,
    color: '#666',
  },
  infoText: {
    color: '#333',
  },
  icon: {
    marginRight: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#1e282c',
    
  },
  closeButton: {
    backgroundColor: '#694fad',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollContainer: {
    maxHeight: 200,
  },
  jobDescription: {
    fontSize: 16,
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    color: '#1e282c',
  },
  detailLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1e282c',
    width: '40%', // Adjust as needed for desired tabular layout
  },
  detailText: {
    fontSize: 16,
    width: '60%', // Adjust as needed for desired tabular layout
    color: '#1e282c',
  },
});

export default PostedJobsGrid;