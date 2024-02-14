import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';

const JobDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { job } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const fetchCSRFToken = async () => {
    try {
      const response = await fetch('https://hirenow.site/api/csrf-token');
      const data = await response.json();
      const csrfToken = data.csrf_token;
      return csrfToken;
    } catch (error) {
      console.error('Error fetching CSRF token: ', error);
      throw error;
    }
  };

  const handleUploadCV = async () => {
    try {
      setIsLoading(true);

      const csrfToken = await fetchCSRFToken();

      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const fileData = result[0];

      const base64Data = await RNFetchBlob.fs.readFile(fileData.uri, 'base64');

      const apiUrl = 'https://hirenow.site/api/upload-cv';
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
        // Handle the response as needed
      } else {
        console.error('API request failed: ', response.status, response.statusText);
        // Handle the error response
      }
    } catch (error) {
      console.error('An unexpected error occurred: ', error);
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default JobDetailsScreen;