import React, { useEffect, useState ,} from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator  } from 'react-native';
import { Card ,Button  } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute ,useNavigation  } from '@react-navigation/native';

import Modal from 'react-native-modal';
import ComboBoxes from './ComboBoxes';

const JobGrid = () => {
  
  
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
  const navigation = useNavigation();
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

                <Card.Divider style={styles.secondDivider} /> 
         
                <View style={styles.table}>
          
                    
                    {renderTableRow('Positions', selectedJob.numPositions !== null ? selectedJob.numPositions : 'N/A')}
                    {renderTableRow('Job Shift', selectedJob.job_shift !== null && selectedJob.job_shift !== 'N/A' ? selectedJob.job_shift : 'N/A')}
                    {renderTableRow('Job Type', selectedJob.job_type !== null ? (selectedJob.job_type === 'full_time' ? 'Full Time' : (selectedJob.job_type === 'part_time' ? 'Part Time' : 'N/A')) : 'N/A')}
                    {renderTableRow('Gender', selectedJob.genderPreference !== null ? selectedJob.genderPreference : 'N/A')}
                    {renderTableRow('Minimum Education', selectedJob.qualification !== null ? selectedJob.qualification : 'N/A')}
                    {renderTableRow('Career Level', selectedJob.careerLevel !== null ? selectedJob.careerLevel : 'N/A')}
                    {renderTableRow('Experience', selectedJob.minExperience !== null && selectedJob.minExperience > 0 && selectedJob.maxExperience !== null && selectedJob.maxExperience > 0
                      ? `${selectedJob.minExperience} to ${selectedJob.maxExperience}`
                      : 'N/A')}
                    {renderTableRow('Age', selectedJob.minAge !== null && selectedJob.minAge > 0 && selectedJob.maxAge !== null && selectedJob.maxAge > 0
                      ? `${selectedJob.minAge} to ${selectedJob.maxAge}`
                      : 'N/A')}
                    {renderTableRow('Apply Before', selectedJob.apply_by_date !== null ? selectedJob.apply_by_date : 'N/A')}
                    {renderTableRow('Posting Date', selectedJob.created_at !== null ? selectedJob.created_at : 'N/A')}
                  </View>
              </ScrollView>
              
              <Button
                title="Apply"
                onPress={() => navigation.navigate('ApplyJobPage', { job: selectedJob })}
              />
            </Card>
          )}
        </View>
      </Modal>
   </View>

   );
};
const renderTableRow = (label, value) => (
  <View style={styles.tableRow} key={label}>
    <Text style={styles.tableLabel}>{label}</Text>
    <Text style={styles.tableValue}>{value}</Text>
  </View>
);
const styles = StyleSheet.create({
  secondDivider: {
    marginTop: 10, // Add the desired top margin
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    backgroundColor: '#F2F2F2',
    padding: 10,
    fontFamily: 'Tohama',
  },
  tableLabel: {
    flex: 1,
    fontSize: 12, // Adjusted font size
    fontWeight: 'bold',
    marginRight: 10,
    backgroundColor: '#F2F2F2',
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    color: 'black',
    fontFamily: 'Tahoma',
  },
  tableValue: {
    flex: 2,
    fontSize: 12, // Adjusted font size
    padding: 10,
    color: 'black',
    fontFamily: 'Tahoma',
  },
  // Introduce new property for adjustable width
  labelWidth: {
    width: 100, // You can set this value as per your requirement
  },
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
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '70%', 
  },
  descriptionContainer: {
    maxHeight: '70%', // Set the maximum height for the description
    borderRadius: 5,
    marginBottom :10
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    padding: 5,
    zIndex:10,
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
