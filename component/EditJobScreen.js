import React, { useState,useEffect  } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getCsrfToken from './csrfTokenUtil';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
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

const EditJobScreen = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [requiredCareerLevel, setRequiredCareerLevel] = useState('');
  const [numPositions, setNumPositions] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [jobShift, setJobShift] = useState('');
  
  const [applyByDate, setApplyByDate] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  const [salaryFrom, setSalaryFrom] = useState('');
  const [salaryTo, setSalaryTo] = useState('');
  const [shouldShowSalary, setShouldShowSalary] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [requiredQualification, setRequiredQualification] = useState('');
  
  const [minExp, setMinExp] = useState('');
  const [maxExp, setMaxExp] = useState('');
  
  const [jobId, setJobId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [companyName, setCompanyName] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { job } = route.params;


 

  // Now you can use the job data to populate your form fields
  useEffect(() => {
    if (job) {
        const locationArray = JSON.parse(job.jobLocation);
        const location = locationArray[0]; // Extract the city name
      setJobId(job.id);
      setJobTitle(job.jobTitle);
      setJobDescription(job.jobDescription);
      setSkillsRequired(job.skillsRequired);
      setRequiredCareerLevel(job.careerLevel);
      setNumPositions(job.numPositions);
      setJobLocation(location); 
      setSalaryFrom(job.min_salary);
      setSalaryTo(job.max_salary);
      setJobType(job.job_type);
      setJobShift(job.job_shift);
      setShouldShowSalary(job.salaryVisibility);
      setApplyByDate(job.apply_by_date);
      setRequiredQualification(job.qualification);
      setMinExp(job.minExperience);
      setMaxExp(job.maxExperience);
      setCompanyName(job.company);
    }
  }, [job]);

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
    setJobId('');
    setCompanyName('');
  };
  
  const handlePostJob = async () => {
    try {
      const csrfToken = await getCsrfToken();
      const storedUserId = await AsyncStorage.getItem('userId');

      const response = await fetch('https://hirenow.site/api/job-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
          jobId,
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
          shouldShowSalary,
          minExp,
          maxExp,
          companyName,
          storedUserId
        }),
      });
      console.log(jobDescription);
      const data = await response.json();
      setModalMessage('Job posted successfully');
      setModalVisible(true);
      console.log('Job posted successfully:', data);
      resetFields(); 
      navigation.navigate('JobGridStack');
    } catch (error) {
      console.error('Error posting job:', error.message);
    }
  };

  const renderStepHeading = () => {
    switch (currentStep) {
      case 1:
        return <Text style={styles.pageTitle}>Edit Job Details</Text>;
      case 2:
        return <Text style={styles.pageTitle}>Edit Job Requirements</Text>;
      case 3:
        return <Text style={styles.pageTitle}>Edit Company Info</Text>;
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
              placeholder="Job Title"
              placeholderTextColor="#666"
              value={jobTitle}
              onChangeText={setJobTitle}
            />
            <Text style={styles.label}>Job Description*</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Job Description"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              value={jobDescription}
              onChangeText={setJobDescription}
            />
            <View>
              <Text style={styles.label}>Skills Required*</Text>
              <TextInput
                style={styles.input}
                placeholder="Interpersonal skills,Teamwork skills,Leadership skills"
                placeholderTextColor="#666"
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
                style={{ height: 100}} itemStyle={{height: 100,fontSize:14}}>

                
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
              style={{ height: 100}} itemStyle={{height: 100,fontSize:14}}>
              {positionsData.map((value) => (
                <Picker.Item key={value} label={value} value={value} />
              ))}
            </Picker>
            </View>
            <Text style={styles.label}>Job Location*</Text>
            <View style={[styles.pickerContainer]}>
            <Picker
              selectedValue={jobLocation}
              onValueChange={(itemValue) => setJobLocation(itemValue)}
              style={{ height: 100}} itemStyle={{height: 100,fontSize:14}}>
              {ukCities.map((city) => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
            </View>
            
            <Text style={styles.label}>What is the salary range?*</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, styles.inputInline]}
                    placeholderTextColor="#666"
                    placeholder="From"
                    value={salaryFrom}
                    onChangeText={setSalaryFrom}
                  />
                  <Text style={styles.separator}>  </Text>
                  <TextInput
                    style={[styles.input, styles.inputInline]}
                    placeholderTextColor="#666"
                    placeholder="To"
                    value={salaryTo}
                    onChangeText={setSalaryTo}
                  />
                </View>

            <Text style={styles.label}>Job Type *</Text>
            <View style={[styles.pickerContainer]}>
            <Picker
              selectedValue={jobType}
              onValueChange={(itemValue) => setJobType(itemValue)}
              style={{ height: 100}} itemStyle={{height: 100,fontSize:14}}>
              <Picker.Item label="Full-Time" value="Full-Time" />
              <Picker.Item label="Part-Time" value="Part-Time" />
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
              style={{ height: 100}} itemStyle={{height: 100,fontSize:14}}>
              <Picker.Item label="Morning" value="morning" />
              <Picker.Item label="Afternoon" value="afternoon" />
              <Picker.Item label="Night" value="night" />
              <Picker.Item label="Rotating" value="rotating" />
              <Picker.Item label="Hybrid Work Modal" value="hybrid" />
              <Picker.Item label="Work from Home" value="work-from-home" />
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
            <Text style={styles.label}>Apply By Date*</Text>
            <TouchableOpacity onPress={handleToDatePress}>
            <View  onTouchEnd={handleToDatePress}>
        <TextInput
          style={styles.input}
          placeholder="Apply By Date"
          placeholderTextColor="#666"
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
            <Text style={styles.label}>Required Qualification*</Text>
            <View style={[styles.pickerContainer]}>
              <Picker
                  selectedValue={requiredQualification}
                  onValueChange={(itemValue) => setRequiredQualification(itemValue)}
                >
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
              <Text style={styles.label}>Years of Experience</Text>    
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
          <ScrollView >
              <TextInput  style={styles.input}
                    placeholderTextColor="#666"
                    placeholder="Company Name"
                    value={companyName}
                    onChangeText={setCompanyName}
              />
          </ScrollView>
        );
      default:
        return null;
    }
  };
  const handleBackButton = () => {
    navigation.goBack();
  };


  return (
    <View style={styles.container}>
     <TouchableOpacity onPress={handleBackButton} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#333" />
    </TouchableOpacity>
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
            <Text style={styles.buttonText}>Save Job</Text>
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
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
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
        color: '#b896d9',
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

export default EditJobScreen;