import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, Alert,Image,  Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getCsrfToken from './csrfTokenUtil';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';

const positionsData = [...Array(35).keys()].map(i => (i + 1).toString()).concat('35+');
const ukCities = [
  '',
  'London',
  'Birmingham',
  'Manchester',
  'Glasgow',
  'Liverpool',
  'Bristol',
  'Sheffield',
  'Leeds',
  'Edinburgh',
  'Leicester',
  'Coventry',
  'Bradford',
  'Cardiff',
  'Belfast',
  // Add more cities as needed
];

const PostJobForm = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [requiredCareerLevel, setRequiredCareerLevel] = useState('');
  const [numPositions, setNumPositions] = useState('1');
  const [jobLocation, setJobLocation] = useState('London');
  const [jobType, setJobType] = useState('');
  const [jobShift, setJobShift] = useState('');
  
  const [applyByDate, setApplyByDate] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  const [salaryFrom, setSalaryFrom] = useState('');
  const [salaryTo, setSalaryTo] = useState('');
  const [salaryType, setSalaryType] = useState('Hourly');
  
  const [shouldShowSalary, setShouldShowSalary] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [requiredQualification, setRequiredQualification] = useState('');
  
  const [minExp, setMinExp] = useState('');
  const [maxExp, setMaxExp] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalMessageSuccess, setModalMessageSuccess] = useState('');
  
  const [companyName, setCompanyName] = useState('');
  const [contactPersonName, setContactPersonName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const navigation = useNavigation(); // useNavigation hook
  const [userId, setUserId] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxToggle = () => {
    setIsChecked(!isChecked);
  };

  const openTermsAndConditions = () => {
    Linking.openURL('https://hirenow.site/term-and-conditions');
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(storedUserId);
        if (storedUserId) {
          fetchUserDetails(storedUserId);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error.message);
      }
    };

    fetchUserId();
  }, []);


  const fetchUserDetails = async (userId) => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(`https://hirenow.site/api/user-info/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
      });
      const userData = await response.json();
      if (userData) {
        const { company_profile } = userData;
        
        // Set state with company profile details
        setCompanyName(company_profile.company_name);
        setContactPersonName(company_profile.contact_person_name);
        // Set state with contact email from the users table
        setContactEmail(userData.email);
        setContactNumber(company_profile.mobile);
      }
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    }
  };
  
  const handleToDatePress = () => {
    setShowDatePicker(true);
  };

  const handleToDateConfirm = (date) => {
    console.log('Selected apply by date:', date);
    const formattedDate = date.toISOString().split('T')[0];
    setApplyByDate(formattedDate);
    setShowDatePicker(false);
  };


  const handleRadioPress = (value) => {
    setShouldShowSalary(value);
  };
  
  const totalSteps = 3;

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };
  const resetFields = () => {
    setJobTitle('');
    setJobDescription('');
    setSkillsRequired('');
    setRequiredCareerLevel('');
    setNumPositions('');
    setJobLocation('');
    setJobType('');
    setJobShift('');
    setApplyByDate('');
    setSalaryFrom('');
    setSalaryTo('');
    setShouldShowSalary(true);
    setRequiredQualification('');
    setMinExp('');
    setMaxExp('');
    setCompanyName('');
    setContactPersonName('');
    setContactEmail('');
    setContactNumber('');
  };
  const handlePostJob = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const missingFields = [];
    if (!jobTitle) missingFields.push('Job Title');
    if (!jobDescription) missingFields.push('Job Description');
    if (!skillsRequired) missingFields.push('Skills Required');
    if (!applyByDate) missingFields.push('Apply By Date');
    if (!contactEmail) missingFields.push('Contact Email');
    
    if (missingFields.length > 0) {
      // Alert user to fill in all required fields
      Alert.alert(`Please fill in all required fields:\n${missingFields.join('\n')}`);
      return;
    }
    


      const csrfToken = await getCsrfToken();
      

      const response = await fetch('https://hirenow.site/api/job-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
          jobTitle,
          jobDescription,
          skillsRequired,
          requiredCareerLevel,
          numPositions,
          jobLocation,
          jobType,
          jobShift,
          applyByDate,
          requiredQualification,
          salaryFrom,
          salaryTo,
          salaryType,
          shouldShowSalary,
          minExp,
          maxExp,
          minAge,
          maxAge,
          companyName,
          contactPersonName,
          contactEmail,
          contactNumber,
          storedUserId,
        }),
      });
      const data = await response.json();
      
      
      if (response) {
        await AsyncStorage.setItem('userEmail', contactEmail);

        setModalMessage(data.additionalMessage || 'Job posted successfully');
        setModalMessageSuccess(data.message);
        resetFields();
        setModalVisible(true);
        setCurrentStep(1);
      } else {
        setModalMessage(data.message || 'An error occurred while posting the job');
      }
      console.log('Job posted successfully:', data);
    } catch (error) {
      console.error('Error posting job:', error.message);
    }
  };

  const renderStepHeading = () => {
    switch (currentStep) {
      case 1:
        return <Text style={styles.pageTitle}>Add Job Details</Text>;
      case 2:
        return <Text style={styles.pageTitle}>Job Requirements</Text>;
      case 3:
        return <Text style={styles.pageTitle}>Company Info</Text>;
      default:
        return null;
    }
  };

  const renderFormFields = () => {
    switch (currentStep) {
      case 1:
        return (
          <ScrollView contentContainerStyle={styles.form}>
            <Text style={styles.label}>Job Title*</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#666"
              placeholder="Job Title"
              value={jobTitle}
              onChangeText={setJobTitle}
            />
            <Text style={styles.label}>Job Description*</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                Platform.OS === 'ios' && { height: 120 }, // Adjust the height as needed
              ]}
              placeholderTextColor="#666"
              placeholder="Job Description"
              multiline
              numberOfLines={4}
              value={jobDescription}
              onChangeText={setJobDescription}
            />
            <View>
              <Text style={styles.label}>Skills Required*</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#666"
                placeholder="Interpersonal skills,Teamwork skills,Leadership skills"
                value={skillsRequired}
                onChangeText={(text) => {
                  // Split the entered text by comma and trim each skill
                  const skillsArray = text.split(',').map(skill => skill.trim());
                  // Ensure the number of skills does not exceed 20
                  if (skillsArray.length <= 20) {
                    setSkillsRequired(text);
                  }
                }}
              />
              <Text style={styles.instruction}>Max. 20 skills allowed (comma-separated)</Text>
            </View>
            <Text style={styles.label}>Career Level*</Text>
            <View style={[styles.pickerContainer]}>
              <Picker
                selectedValue={requiredCareerLevel}
                onValueChange={(itemValue) => setRequiredCareerLevel(itemValue)}
                style={{ height: 50}} itemStyle={{height: 100,fontSize:14}}>
                
                <Picker.Item label="Entry Level" value="entry" />
                <Picker.Item label="Mid Level" value="mid" />
                <Picker.Item label="Senior Level" value="senior" />
              </Picker>
            </View> 
            
            <Text style={styles.label}>No. of Positions*</Text>
            <View style={[styles.pickerContainer]}>
            <Picker
              selectedValue={numPositions}
              onValueChange={(itemValue) => setNumPositions(itemValue)}
              style={{ height: 50}} itemStyle={{height: 100,fontSize:14}}>

                {[0, ...positionsData].map((value) => (
                  <Picker.Item key={value} label={value.toString()} value={value.toString()} />
                ))}
              </Picker>
            </View>
            <Text style={styles.label}>Job Location*</Text>
            <View style={[styles.pickerContainer]}>
            <Picker
              selectedValue={jobLocation}
              onValueChange={(itemValue) => setJobLocation(itemValue)}
              style={{ height: 50}} itemStyle={{height: 100,fontSize:14}}>
            
              {ukCities.map((city) => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
            </View>
            <Text style={styles.label}>What is the salary range?*</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, styles.inputInline]}
                    placeholderTextColor="#666" // Set placeholder text color
                    placeholder="From"
                    value={salaryFrom}
                    onChangeText={setSalaryFrom}
                    keyboardType="numeric"
                  />
                  <Text style={styles.separator}>  </Text>
                  <TextInput
                    style={[styles.input, styles.inputInline]}
                    placeholderTextColor="#666" // Set placeholder text color
                    placeholder="To"
                    value={salaryTo}
                    onChangeText={setSalaryTo}
                    keyboardType="numeric"
                  />
                </View>
                <Text style={styles.label}>Salary Type*</Text>
                  <View style={[styles.pickerContainer]}>
                    <Picker
                      selectedValue={salaryType}
                      onValueChange={(value) => setSalaryType(value)}
                      style={{ height: 50}} itemStyle={{height: 100,fontSize:14}}>
                    
                      <Picker.Item label="Daily" value="Daily" />
                      <Picker.Item label="Weekly" value="Weekly" />
                      <Picker.Item label="Monthly" value="Monthly" />
                      <Picker.Item label="Hourly" value="Hourly" />
                      <Picker.Item label="Annually" value="Annually" />
                    </Picker>
                  </View>    
            <Text style={styles.label}>Job Type *</Text>
            <View style={[styles.pickerContainer]}>
            <Picker
              selectedValue={jobType}
              onValueChange={(itemValue) => setJobType(itemValue)}
              style={{ height: 50}} itemStyle={{height: 100,fontSize:14}}>

              <Picker.Item label="Full Time" value="Full Time" />
              <Picker.Item label="Part Time" value="Part Time" />
              <Picker.Item label="Contract" value="Contract" />
              <Picker.Item label="Internship" value="Internship" />
              <Picker.Item label="Freelance" value="Freelance" />
            </Picker>
            </View>
            <Text style={styles.label}>Job Shift *</Text>
            <View style={[styles.pickerContainer]}>
            <Picker
              selectedValue={jobShift}
              onValueChange={(itemValue) => setJobShift(itemValue)}
              style={{ height: 50}} itemStyle={{height: 100,fontSize:14}}>
            
              
              <Picker.Item label="Morning" value="Morning" />
              <Picker.Item label="Afternoon" value="Afternoon" />
              <Picker.Item label="Night" value="Night" />
              <Picker.Item label="Rotating" value="Rotating" />
              <Picker.Item label="Hybrid Work Modal" value="Hybrid" />
              <Picker.Item label="Work from Home" value="Work from home" />
            </Picker>
            </View>
            <Text style={styles.label}>Should the salary be visible in your job post?</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[styles.radioButton, shouldShowSalary ? styles.radioButtonSelected : null]}
                onPress={() => handleRadioPress(true)}>
                <Text style={[styles.radioButtonText, shouldShowSalary ? styles.radioButtonTextSelected : null]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioButton, !shouldShowSalary ? styles.radioButtonSelected : null]}
                onPress={() => handleRadioPress(false)}>
                <Text style={[styles.radioButtonText, !shouldShowSalary ? styles.radioButtonTextSelected : null]}>No</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Apply Before Date*</Text>
            <TouchableOpacity onPress={handleToDatePress}>
            <View  onTouchEnd={handleToDatePress}>
              <TextInput
                style={styles.input}
                placeholderTextColor="#666"
                placeholder="Apply By Date"
                value={applyByDate}
                editable={false}
              />
             </View> 
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleToDateConfirm}
        onCancel={() => setShowDatePicker(false)}
      />
    
                                              
          </ScrollView>
        );
      case 2:
        return (
          <ScrollView >
            <Text style={styles.label}>Required Qualification</Text>
            <View style={[styles.pickerContainer]}>
              <Picker
                  selectedValue={requiredQualification}
                  onValueChange={(itemValue) => setRequiredQualification(itemValue)}
                  style={{ height: 50}} itemStyle={{height: 100,fontSize:14}}>

                  <Picker.Item label="Not Require" value="" />
                  <Picker.Item label="High School" value="High School" />
                  <Picker.Item label="Diploma" value="Diploma" />
                  <Picker.Item label="Associate's Degree" value="Associate's Degree" />
                  <Picker.Item label="Bachelor's Degree" value="Bachelor's Degree" />
                  <Picker.Item label="Master's Degree" value="Master's Degree" />
                  <Picker.Item label="Ph.D." value="Ph.D." />
                  <Picker.Item label="Certificate" value="Certificate" />
                  {/* Add more qualification options as needed */}
                </Picker>
              </View>
              <Text style={styles.label}>Require Years of Experience</Text>    
              <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholderTextColor="#666"
                    placeholder="Minimum Experience"
                    value={minExp}
                    onChangeText={setMinExp}
                    keyboardType="numeric"
                    
                  />
                  <Text style={styles.separator}>  </Text>
                  <TextInput
                    style={styles.input}
                    placeholderTextColor="#666"
                    placeholder="Maximum Experience"
                    value={maxExp}
                    onChangeText={setMaxExp}
                    keyboardType="numeric"
                  />
             </View>  
          </ScrollView>
        );
      case 3:
        return (
          // Add fields for Company Info in the third step
          <ScrollView>
              <Text style={styles.label}>Company Name</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#666"
                placeholder="Company Name"
                value={companyName}
                onChangeText={setCompanyName}
              />
              <Text style={styles.label}>Contact Person Name*</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#666"
                placeholder="Contact Person Name"
                value={contactPersonName}
                onChangeText={setContactPersonName}
              />
              <Text style={styles.label}>Contact Email*</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#666"
                placeholder="Contact Email"
                value={contactEmail}
                onChangeText={setContactEmail}
              />
              <Text style={styles.label}>Contact Number*</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#666"
                placeholder="Contact Number"
                value={contactNumber}
                onChangeText={setContactNumber}
                keyboardType="phone-pad"
              />
               <View style={styles.checkboxContainer}>
                <CheckBox
                  title={
                    <View style={styles.checkboxLabelContainer}>
                      <Text style={styles.checkboxLabelText}>I agree to the </Text>
                      <TouchableOpacity onPress={openTermsAndConditions}>
                        <Text style={styles.checkboxLabelLink}>Terms and Conditions</Text>
                      </TouchableOpacity>
                    </View>
                  }
                  checked={isChecked}
                  onPress={handleCheckboxToggle}
                />
              </View>
        </ScrollView>
        );
      default:
        return null;
    }
  };

  
  const handleCreateAccount = () => {
    try {
      // Navigate to the RegisterEmployerScreen
      navigation.navigate('RegisterEmployerScreen');
      setModalVisible(false);
    } catch (error) {
      // If an error occurs during navigation, display it in an alert
      Alert.alert('Navigation Error', `An error occurred while navigating: ${error.message}`);
      console.error('Error navigating to RegisterEmployerScreen:', error);
    }
  };

  
  const handleLogin = () => {
    // Navigate to the sign-up screen
    navigation.navigate('Login');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {renderStepHeading()}
      {renderFormFields()}
      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <TouchableOpacity style={[styles.button, styles.previousButton]} onPress={handlePreviousStep}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        )}
        {currentStep < totalSteps ? (
          <TouchableOpacity style={styles.button} onPress={handleNextStep}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handlePostJob}>
            <Text style={styles.buttonText}>Post Job</Text>
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
                
              <Image
                source={require('./images/submit.jpeg')}
                style={[styles.submitImage, { resizeMode: 'contain' }]} />
                  <Text style={[styles.modalText, styles.successMessage]}>{modalMessageSuccess}</Text>
                  {!userId && modalMessage.includes('create a login') ? (
                  
                  <View >
                    <View>
                      <Text style={[styles.modalText, styles.successMessage]}>{modalMessage}</Text>
                     
                      <TouchableOpacity style={[styles.modalButton, { paddingTop: 10 }]} onPress={handleCreateAccount}>
                        <Text style={styles.buttonText}>Create Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                ) : null}

                {!userId && modalMessage.includes('login here') ? (
                  <View >
                    <View>
                      <Text style={[styles.modalText, styles.successMessage]}>{modalMessage}</Text>
                    </View>
                    <View>
                      <TouchableOpacity style={[styles.modalButton, { paddingTop: 10 }]}  onPress={handleLogin}>

                        <Text style={styles.buttonText}>Login Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}

                <TouchableOpacity style={[styles.modalButton, { paddingTop: 10 }]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  checkboxLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabelText: {
    color: '#000',
  },
  checkboxLabelLink: {
    color: '#0000FF', // Change to your preferred link color
    textDecorationLine: 'underline',
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5, // Add border radius if needed
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
    backgroundColor: '#694fad',
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  successMessage: {
    color: 'green',
    
  },
  instruction:{
    paddingBottom:10,
    fontSize: 12,
    color: '#333',
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: '#694fad',
    borderRadius: 20, // Make round
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: '#694fad',
  },
  radioButtonText: {
    color: '#164081',
    fontSize: 16,
  },
  radioButtonTextSelected: {
    color: '#fff', // Change selected color to match text color
  },
  inputContainer: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#694fad',
    textAlign: 'center',
    textTransform: 'uppercase',
    borderBottomWidth: 2,
    borderBottomColor: '#aaa',
    paddingBottom: 10,
    letterSpacing: 1,
    borderRadius: 10,
    backgroundColor: '#fff', // Set background color to white
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  form: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 2,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#694fad',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    width: '48%', // Adjust button width as needed
  },
  previousButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitImage: {
    width: 120,
    height: 140,
    
    margin:10
    
    
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#333',
  },
  
  inputInline: {
    marginRight: 10,
  },
  separator: {
    fontSize: 16,
    marginHorizontal: 5,
    color: '#333',
  },
  picker: {
    fontSize: 24,
    color: '#333',
  },
  
});

export default PostJobForm;