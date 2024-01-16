import React, { useEffect, useState ,} from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator  } from 'react-native';
import { Card ,Button  } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute ,useNavigation  } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Modal from 'react-native-modal';
import ComboBoxes from './ComboBoxes';

const JobGrid = () => {
//   const route = useRoute();
//   // const { userName } = route.params;

  
  
  
  const [selectedJobType, setSelectedJobType] = useState(null);
  const [selectedPostedBy, setSelectedPostedBy] = useState(null);
  const [selectedDatePosted, setSelectedDatePosted] = useState(null);
  const [selectedSalary, setSelectedSalary] = useState(null);
  
  
  
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [locationText, setLocationText] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state

  useEffect(() => { 
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setIsLoading(true); // Set loading to true while searching
      
      const response = await fetch('https://jobs.dev.britmarketing.co.uk/api/jobs');
      const data = await response.json();
      setJobs(data.jobs);
      setIsLoading(false); // Set loading to false after searching
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const searchJobs = async () => {
    try {
      setIsLoading(true); // Set loading to true while searching
      console.log(selectedJobType);
      
      const apiUrl = `https://jobs.dev.britmarketing.co.uk/api/search-jobs-filter?keywords=${searchText}&location=${locationText}${
        selectedJobType ? `&selectedJobType=${selectedJobType}` : ''
      }${
        selectedPostedBy ? `&selectedPostedBy=${selectedPostedBy}` : ''
      }${
        selectedDatePosted ? `&selectedPostedDate=${selectedDatePosted}` : ''
      }${
        selectedSalary ? `&selectedSalary=${selectedSalary}` : ''
      }`;
      
      const response = await fetch(apiUrl);
      const data = await response.json(); 
      setJobs(data.jobs);
      //console.log(data.jobs);
      setIsLoading(false); // Set loading to false after searching
    } catch (error) {
      console.error('Error searching jobs:', error);
    }
  };
  
  
  const openModal = (job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <Card containerStyle={styles.card}>
        <Card.Title>{item.jobTitle}</Card.Title>
        <Card.Divider />
        <Text>{item.jobDescription.substring(0, 50)}...</Text>
      </Card>
    </TouchableOpacity>
  );

 

  const updateSelectedValues = (value, filterType) => {
    let processedValue = value;
  
    if (filterType === 'datePosted') {
      processedValue = mapStringToDateValue(value);
    }

    if (filterType === 'Salary') {
      processedValue = mapStringToSalaryValue(value);
    }
  
    if (filterType === 'jobType') {
      setSelectedJobType(processedValue);
    } else if (filterType === 'postedJob') {
      setSelectedPostedBy(processedValue);
    } else if (filterType === 'datePosted') {
      setSelectedDatePosted(processedValue);
    } else if (filterType === 'Salary') {
      setSelectedSalary(processedValue);
    }
    
    searchJobs();
  };
  const mapStringToSalaryValue = (stringValue) => {
    switch (stringValue) {
      case '£5.00+/hour':
        return 5;
      case '£11.00+/hour':
        return 11;
      case '£21.00+/hour':
        return 21;
      case '£31.00+/hour':
        return 31;
      default:
        return null;
    }
  };
  
  const mapStringToDateValue = (stringValue) => {
    switch (stringValue) {
      case 'Last 24 hours':
        return 24;
      case 'Last 3 days':
        return 3;
      case 'Last 7 days':
        return 7;
      case 'Last 14 days':
        return 14;
      default:
        return null;
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.inputContainer}> 
        
        <TextInput
          style={styles.inputField}
          placeholder="Job title"
          value={searchText}
          placeholderTextColor={styles.placeholder.color}
          onChangeText={(text) => setSearchText(text)}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Where"
          value={locationText}
          placeholderTextColor={styles.placeholder.color}
          onChangeText={(text) => setLocationText(text)}
        />
        <Button
          
          onPress={searchJobs}
          icon={
            <Icon
              name="find-replace"
              size={20}
              color="#fff"
              style={{ marginRight: 5 }}
            />
          }
          
          buttonStyle={{ backgroundColor: '#164081' ,borderRadius: 6 }}
        />
        
      </View>

      <ComboBoxes
        updateSelectedValues={(value, filterType) => updateSelectedValues(value, filterType)}
        searchJobs={searchJobs}
      />

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#164081" />
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={jobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    <Modal isVisible={isModalVisible} style={styles.modal} backdropOpacity={0.3}>
        <View style={styles.modalContent }>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Icon name="close" size={20} color="#fff" />
          </TouchableOpacity>
          {selectedJob && (
            <Card > 
              <Card.Title>{selectedJob.jobTitle}</Card.Title>
              <Card.Divider />
              <ScrollView style={styles.descriptionContainer}>
                <Text>{selectedJob.jobDescription}</Text>
              </ScrollView>
              <Button title="Apply" onPress={closeModal} />
            </Card>
          )}
        </View>
      </Modal>
   </View>

   );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    borderRadius: 5, // Set the border radius for rounded corners
    
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '50%', 
  },
  descriptionContainer: {
    maxHeight: 200, // Set the maximum height for the description
    borderRadius: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  placeholder: {
    color: '#ccc',
  },
  inputField: {
    flex: 1,
    height: 40,
    color: '#333',
    borderRadius: 8,
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    // Add a bottom shadow
    borderBottomWidth: 2,
    borderBottomColor: '#164081',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
  },
  headerText: {
    color: '#164081',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerContainerStyle: {
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
    flexDirection: 'row',
  },
  overlay: {
    width: '80%',
    padding: 20,
  },
  
});

export default JobGrid;
