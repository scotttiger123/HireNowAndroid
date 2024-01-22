import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button,ScrollView ,Modal} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons from react-native-vector-icons

const ApplyJobPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { job } = route.params;

  const [formData, setFormData] = useState({
    education: '',
    experience: '',
    ageRequirements: '',
    step2Data: '',
    step3Data: '',
    step4Data: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleNext = () => {
    if (
      formData.education.toLowerCase() === 'yes' &&
      formData.experience.toLowerCase() === 'yes' &&
      formData.ageRequirements.toLowerCase() === 'yes'
    ) {
      setCurrentStep(currentStep + 1);
    } else {
      setModalMessage('Please select "Yes" for all options.');
      setModalVisible(true);
      console.log('Please select "Yes" for all options');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleUploadCV = async () => {
    try {
      setIsLoading(true);
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setSelectedFile(result);
    } catch (error) {
      console.error('Error picking document: ', error);
      setModalMessage('Error picking document: ', error);
      setModalVisible(true);
      
    } finally {
      setIsLoading(false);
    }
  };

  const submitCV = async () => {
    try {
      setIsLoading(true);

      const fetchCSRFToken = async () => {
        try {
          const response = await fetch('https://jobs.dev.britmarketing.co.uk/api/csrf-token');
          const data = await response.json();
          const csrfToken = data.csrf_token;
          return csrfToken;
        } catch (error) {
          console.error('Error fetching CSRF token: ', error);
          throw error;
        }
      };

      const csrfToken = await fetchCSRFToken();
      const fileData = selectedFile[0];
      const base64Data = await RNFetchBlob.fs.readFile(fileData.uri, 'base64');

      const apiUrl = 'https://jobs.dev.britmarketing.co.uk/api/upload-cv';
      const formData = new FormData();
      formData.append('cv', base64Data);
      formData.append('name', fileData.name);
      formData.append('type', fileData.type);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: formData,
      });

      if (response) {
        const responseData = await response.json();
        console.log('API response: ', responseData);
        setModalMessage(`API response: ${responseData.message}`);
      setModalVisible(true);
      } else {
        console.error('API request failed: ', response.status, response.statusText);
      }
    } catch (error) {
      console.error('An unexpected error occurred: ', error);
    } finally {
      setIsLoading(false);
    }
  };
  const renderTableRow = (label, value) => (
    <View style={styles.tableRow} key={label}>
      <Text style={styles.tableLabel}>{label}</Text>
      <Text style={styles.tableValue}>{value}</Text>
    </View>
  );

  const showErrorMessage = () => {
    setModalMessage('Please upload a CV');
    setModalVisible(true);
  };
  
  return (
   
    <View style={styles.container}>
      <View style={styles.header}>
        
        
        <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>
              <Icon name="arrow-back" size={30} color="black" />
            </Text>
          </TouchableOpacity>
      </View>

      <View style={styles.jobTitleContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.jobTitle}>{job.jobTitle}</Text>
            <Text style={styles.tableHeader}>Job Description</Text>
        <Text style={styles.jobDescription}>{job.jobDescription}</Text>
        {/* Job Details Table */}
        <View style={styles.table}>
          
          {/* Rows for job details */}
          {renderTableRow('Total Positions', job.numPositions !== null ? job.numPositions : 'N/A')}
          {renderTableRow('Job Shift', job.job_shift !== null && job.job_shift !== 'N/A' ? job.job_shift : 'N/A')}
          {renderTableRow('Job Type', job.job_type !== null ? (job.job_type === 'full_time' ? 'Full Time' : (job.job_type === 'part_time' ? 'Part Time' : 'N/A')) : 'N/A')}
          {renderTableRow('Gender', job.genderPreference !== null ? job.genderPreference : 'N/A')}
          {renderTableRow('Minimum Education', job.qualification !== null ? job.qualification : 'N/A')}
          {renderTableRow('Career Level', job.careerLevel !== null ? job.careerLevel : 'N/A')}
          {renderTableRow('Experience', job.minExperience !== null && job.minExperience > 0 && job.maxExperience !== null && job.maxExperience > 0
            ? `${job.minExperience} to ${job.maxExperience}`
            : 'N/A')}
          {renderTableRow('Age', job.minAge !== null && job.minAge > 0 && job.maxAge !== null && job.maxAge > 0
            ? `${job.minAge} to ${job.maxAge}`
            : 'N/A')}
          {renderTableRow('Apply Before', job.apply_by_date !== null ? job.apply_by_date : 'N/A')}
          {renderTableRow('Posting Date', job.created_at !== null ? job.created_at : 'N/A')}
        </View>
      </ScrollView>  
      </View>
      {currentStep === 1 && (
        <View>
          

          {/* Step 1 Form Fields - Education */}
          <View style={styles.questionContainer}>
          <Text style={styles.questionText}>Do you have education High School?</Text>
            <View style={styles.radioButtonsWrapper}>
              <TouchableOpacity
                style={formData.education === 'Yes' ? styles.radioButtonSelected : styles.radioButton}
                onPress={() => setFormData({ ...formData, education: 'Yes' })}
              >
                <Text style={styles.radioLabel}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={formData.education === 'No' ? styles.radioButtonSelected : styles.radioButton}
                onPress={() => setFormData({ ...formData, education: 'No' })}
              >
                <Text style={styles.radioLabel}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Step 1 Form Fields - Experience */}
          <View style={styles.questionContainer}>
          <Text style={styles.questionText}>Do you have experience (Between {job.minExperience} and {job.maxExperience} years)?</Text>
            <View style={styles.radioButtonsWrapper}>
              <TouchableOpacity
                style={formData.experience === 'Yes' ? styles.radioButtonSelected : styles.radioButton}
                onPress={() => setFormData({ ...formData, experience: 'Yes' })}
              >
                <Text style={styles.radioLabel}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={formData.experience === 'No' ? styles.radioButtonSelected : styles.radioButton}
                onPress={() => setFormData({ ...formData, experience: 'No' })}
              >
                <Text style={styles.radioLabel}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Step 1 Form Fields - Age Requirements */}
          <View style={styles.questionContainer}>
          <Text style={styles.questionText}>Do you meet the age requirements (Between {job.minAge} and {job.maxAge} years)?</Text>
            <View style={styles.radioButtonsWrapper}>
              <TouchableOpacity
                style={formData.ageRequirements === 'Yes' ? styles.radioButtonSelected : styles.radioButton}
                onPress={() => setFormData({ ...formData, ageRequirements: 'Yes' })}
              >
                <Text style={styles.radioLabel}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={formData.ageRequirements === 'No' ? styles.radioButtonSelected : styles.radioButton}
                onPress={() => setFormData({ ...formData, ageRequirements: 'No' })}
              >
                <Text style={styles.radioLabel}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {currentStep === 2 && (
        <View>
          {selectedFile && (
            <Text style={styles.selectedFileText}>
              Selected File: {selectedFile[0].name}
            </Text>
          )}
       
       <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUploadCV}
            disabled={isLoading}
          >
            <View style={styles.uploadButtonContainer}>
              <Icon name="cloud-upload" size={24} color="white" style={styles.iconStyle} />
              <Text style={styles.uploadButtonText}>Upload CV</Text>
            </View>
          </TouchableOpacity>

          
        </View>
      )}

      <View style={styles.footer}>
        {currentStep > 1 && (
          <TouchableOpacity onPress={handlePrevious} style={styles.button}>
            <Icon name="arrow-back" size={20} color="white" />
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        )}

        {currentStep === 1 && (
          <TouchableOpacity onPress={handleNext} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
            <Icon name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        )}

        {currentStep === 2 && (
          <TouchableOpacity onPress={selectedFile ? submitCV : () => showErrorMessage()} style={styles.submitButton}>
            <Icon name="cloud-upload" size={20} color="white" />
           <Text style={styles.submitButtonText}>Submit CV</Text>
          </TouchableOpacity>
        
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
        
    </View>
    
    
  );
};

const styles = StyleSheet.create({

  uploadButton: {
    backgroundColor: '#3498db', // Adjust the color as needed
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    marginTop:50,
    justifyContent: 'center',
    alignItems: 'center',

  },

  uploadButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10, // Increased margin for better spacing
  },

  uploadButtonText: {
    color: 'white',
    marginLeft: 10, // Increased margin between icon and text
  },

  iconStyle: {
    marginRight: 5, // Add space between the icon and text
  },
  


  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  button: {
    backgroundColor: '#164081',
    padding: 10,
    borderRadius: 5,
    color: 'white',
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    marginRight: 5,
  },

  submitButton: {
    backgroundColor: 'green', // Adjust the color as needed
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  submitButtonText: {
    color: 'white',
    marginLeft: 5,
  },
  
  
  questionText: {
    color: 'black',
    fontSize: 15, // You can adjust the font size
  },
  questionContainer: {
    marginBottom: 10,
  },
  radioButtonsWrapper: {
    flexDirection: 'row',
    marginTop: 5,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    backgroundColor: '#F2F2F2',
    padding: 10,
    fontFamily: 'Tohama',
  },
  tableLabel: {
    flex: 1,
    fontSize: 14, // Adjusted font size
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
    fontSize: 14, // Adjusted font size
    padding: 10,
    color: 'black',
    fontFamily: 'Tahoma',
  },
  // Introduce new property for adjustable width
  labelWidth: {
    width: 100, // You can set this value as per your requirement
  },
  backButton: {
    fontSize: 18,
    color: 'black',
  },
  jobTitleContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 10,
    width: '100%',
    flex: 1,
    maxHeight:'60%'
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    backgroundColor: '#F2F2F2',
    fontFamily: 'Tahoma',
  },
  jobDescription: {
    fontSize: 16,
    marginBottom: 20,
    color: 'black',
    fontFamily: 'Tahoma',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    color: 'black',
  },
  radioButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginHorizontal: 5,
  },
  radioButtonSelected: {
    borderWidth: 1,
  borderColor: 'green', // Set the border color to green
  backgroundColor: 'lightgreen', // Set the background color to lightgreen
  borderRadius: 5,
  padding: 5,
  marginHorizontal: 5,
  },
  radioLabel: {
    fontSize: 16,
    color: 'black',
  },
  selectedFileText: {
    marginTop: 10,
    fontSize: 16,
    color: 'black',
  },
  nextButton: {
    backgroundColor: '#164081',
    padding: 10,
    borderRadius: 5,
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%', // You can adjust the width as needed
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black', // You can set the text color to your preference
  },
  modalButton: {
    backgroundColor: '#164081',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
});
export default ApplyJobPage;
