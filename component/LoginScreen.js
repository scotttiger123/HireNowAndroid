import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';

const JobDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { job } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadCV = async () => {
    try {
      setIsLoading(true);

      // Pick a document from the device
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      // Create form data for file upload
      const formData = new FormData();
      formData.append('cv', {
        uri: result.uri,
        type: result.type,
        name: result.name,
      });

      // Make the API request to upload the CV
      const response = await fetch('https://jobs.dev.britmarketing.co.uk/api/upload-cv', {
        method: 'get',
        headers: {
          'Content-Type': 'multipart/form-data',
          // Add any additional headers as needed
        },
        body: formData,
      });

      // Handle the response from the server
      if (response.ok) {
        // CV uploaded successfully
        Alert.alert('Success', 'CV uploaded successfully!');
      } else {
        // Handle error cases
        const errorData = await response.json(); // Assuming the server sends JSON error messages
        Alert.alert('Error', `Failed to upload CV. ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{job.jobTitle}</Text>
      <Text style={styles.description}>{job.jobDescription}</Text>

      <Button
        title={isLoading ? 'Uploading...' : 'Upload CV'}
        onPress={handleUploadCV}
        disabled={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  description: {
    textAlign: 'left',
    color: '#000',
    paddingHorizontal: 20,
  },
});

export default JobDetailsScreen;
