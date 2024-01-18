import React, { useState } from 'react';
import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const ApplyJobPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { job } = route.params; // Access selectedJob details from the route parameters

  const [formData, setFormData] = useState({
    education: '',
    experience: '',
    ageRequirements: '',
    step2Data: '',
    step3Data: '',
    step4Data: '',
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    // Validate if all "Yes" options are selected
    if (
      formData.education.toLowerCase() === 'yes' &&
      formData.experience.toLowerCase() === 'yes' &&
      formData.ageRequirements.toLowerCase() === 'yes'
    ) {
      // Move to the next step
      setCurrentStep(currentStep + 1);
    } else {
      // Display an error or prompt to select all "Yes" options
      console.log('Please select "Yes" for all options');
    }
  };

  const handlePrevious = () => {
    // Implement logic to handle moving to the previous step
    setCurrentStep(currentStep - 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.jobTitle}>{job.jobTitle}</Text>

      {currentStep === 1 && (
        <View>
          {/* Job Description */}
          <Text style={styles.jobDescription}>{job.jobDescription}</Text>

          {/* Step 1 Form Fields - Education */}
          <View style={styles.radioContainer}>
            <Text>Do you have education High School?</Text>
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

          {/* Step 1 Form Fields - Experience */}
          <View style={styles.radioContainer}>
            <Text>Do you have experience (Between {job.minExperience} and {job.maxExperience} years)?</Text>
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

          {/* Step 1 Form Fields - Age Requirements */}
          <View style={styles.radioContainer}>
            <Text>Do you meet the age requirements (Between {job.minAge} and {job.maxAge} years)?</Text>
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
      )}

      {currentStep === 2 && (
        <View>
          {/* Job Description on Step 2 */}
          <Text style={styles.jobDescription}>{job.jobDescription}</Text>

          {/* Step 2 Form Fields */}
          <TextInput
            placeholder="Step 2 Field"
            value={formData.step2Data}
            onChangeText={(text) => setFormData({ ...formData, step2Data: text })}
            style={styles.inputField}
          />

          {/* Upload CV Button */}
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload CV</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Buttons for navigating between steps */}
      {currentStep > 1 && (
        <Button title="Previous" onPress={handlePrevious} />
      )}
      <Button title={currentStep === 2 ? 'Submit' : 'Next'} onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  jobDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    borderColor: 'blue',
    backgroundColor: 'lightblue',
    borderRadius: 5,
    padding: 5,
    marginHorizontal: 5,
  },
  radioLabel: {
    fontSize: 16,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  uploadButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ApplyJobPage;
