import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView, Linking ,Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Applications = () => {
  const navigation = useNavigation();
  const [jobApplications, setJobApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Function to fetch job applications
  const fetchJobApplications = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      
      if (!storedUserId) {
        Alert.alert('Please log in to view Applications.');
        
      }
      const response = await fetch(`https://hirenow.site/api/employer/${storedUserId}/cvs`);
      const data = await response.json();
      if (data.jobApplications) {
        setJobApplications(data.jobApplications);
      } else {
        console.error('Failed to fetch job applications:', data.error);
      }
    } catch (error) {
      console.error('Error fetching job applications:', error.message);
    }
  };


  const handleViewCVPdf = (jobId, userId) => {
    const cvUrl = `https://hirenow.site/view-cv-pdf/${jobId}/${userId}`;
    Linking.openURL(cvUrl);
  };

  const handleViewCVProfile = (jobId, userId) => {
    const cvUrl = `https://hirenow.site/view-cv-email/${jobId}/${userId}`;
    Linking.openURL(cvUrl);
  };

  // Use useEffect to fetch data when component mounts
  useEffect(() => {
    fetchJobApplications();
  }, []);

  // Use useFocusEffect to fetch data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchJobApplications();
    }, [])
  );
  
  // const openDetailsModal = (item) => {
  //   setSelectedJob(item);
  //   setModalVisible(true);
  // };

  const closeModal = () => {
    setSelectedJob(null);
    setModalVisible(false);
  };
  
  
  const renderItem = ({ item }) => (
    <View style={styles.jobItem}>
  <Text style={styles.jobTitle}>{item.user.name.toUpperCase()}</Text>
  <TouchableOpacity
    onPress={() => item.cv_saved === '1' ? handleViewCVProfile(item.job_id, item.user.id) : handleViewCVPdf(item.job_id, item.user.id)}
    style={styles.viewCV}
  >
    <Icon name="insert-drive-file" size={20} color="orange" />
  </TouchableOpacity>
    <View style={styles.infoContainer}>
      <Text style={styles.detailText}>Job Title: {item.job_post.jobTitle}</Text>
      <Text style={styles.detailText}>Applied on: {new Date(item.created_at).toDateString()}</Text>
      
    </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Job Applications</Text>
      <FlatList
        data={jobApplications}
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
                  <Text style={styles.detailText}>{selectedJob.job_post.jobTitle}</Text>
                </View>
                <View style={styles.detailContainer}>
                  <Text style={styles.detailLabel}>Skills Required:</Text>
                  <Text style={styles.detailText}>{selectedJob.job_post.skillsRequired}</Text>
                </View>
                {/* Add more job details here */}
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
    backgroundColor: '#f0f0f0',
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
    flex: 1,
  },
  viewCV: {
    position: 'absolute',
    top: 20,
    right: 10,
  },
  infoContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
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
    borderRadius: 20,
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
  },
  closeButton: {
    backgroundColor: '#2196F3',
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
  detailContainer: {
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  viewCvButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewCvButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Applications;