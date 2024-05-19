import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, Alert, ActivityIndicator,Image } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import getCsrfToken from './csrfTokenUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from 'react-native-document-picker';

import { useNavigation } from '@react-navigation/native';
const PostCompanyProfile = () => {

  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [foundedYear, setFoundedYear] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [website, setWebsite] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [logo, setLogo] = useState('');
  const [address, setAddress] = useState('');
  const [postCode, setPostCode] = useState('');
  const [contactPersonName, setContactPersonName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [landline, setLandline] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const [errors, setErrors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigation = useNavigation(); // useNavigation hook
  const [selectedDocument, setSelectedDocument] = useState(null);


    const handleDocumentSelectAndSave = async () => {
    try {
        
      const storeId = await AsyncStorage.getItem('userId');
      if (!storeId) {
          Alert.alert('Please log in to create profile.');
          return;
        }
        const csrfToken = await getCsrfToken();
        const result = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });
        const fileData = result[0];
        const base64Data = await RNFetchBlob.fs.readFile(fileData.uri, 'base64');
        const formData = new FormData();
        formData.append('profile_image', base64Data);
        formData.append('extension', fileData.type.split('/')[1]); // Append the file extension
        
        
        formData.append('user_id', storeId);
  
        const apiUrl = 'https://hirenow.site/api/save-profile-image';
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-CSRF-TOKEN': csrfToken,
            },
            body: formData,
          });
  
      console.log(response);

      if (!response) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log("save-image-response",responseData);
      
      // Update state with the selected document
      setSelectedDocument(fileData.uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Document picking cancelled');
      } else {
        console.error('Error picking document or saving image:', err);
      }
    }
  };

  useEffect(() => {
    // Check if the user is logged in
    const checkLoginStatus = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      setIsLoggedIn(!!storedUserId); // Convert storedUserId to a boolean value
    };

    checkLoginStatus();
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!companyName.trim()) {
      errors.companyName = 'Company name is required';
    }

    if (!companyDescription.trim()) {
      errors.companyDescription = 'Company description is required';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Invalid email address';
    }

    if (!mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } 

    // Add validation for landline if needed

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidEmail = (email) => {
    // Basic email validation regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
 
  const handleSignIn = () => {
    
    navigation.navigate('Login');
  };
  
  const handlePostCompanyProfile = async () => {
    try {
        setLoading(true); // Set loading to true
        if (!validateForm()) {
            return;
          }
          
        
      const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) {
        Alert.alert('Please log in to post a company profile.');
        return;
      }
      
      const csrfToken = await getCsrfToken();
      const data = {
        company_name: companyName,
        company_description: companyDescription,
        industry: industry,
        founded_year: foundedYear,
        company_size: companySize,
        website: website,
        registration_no: registrationNo,
        logo: logo,
        address: address,
        post_code: postCode,
        contact_person_name: contactPersonName,
        designation: designation,
        email: email,
        mobile: mobile,
        landline: landline,
        user_id : storedUserId
        // Add other fields
      };
  
      // Make POST request to your API endpoint using fetch
      const response = await fetch('https://hirenow.site/api/save-company-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify(data),
      });

      if (!response) {
        throw new Error('Failed to create company profile');
      }
  
      // Handle successful response
      Alert.alert('Success', 'Company profile created successfully');
  
      // Reset form fields
      setCompanyName('');
      setCompanyDescription('');
      setIndustry('');
      setFoundedYear('');
      setCompanySize('');
      setWebsite('');
      setRegistrationNo('');
      setLogo('');
      setAddress('');
      setPostCode('');
      setContactPersonName('');
      setDesignation('');
      setEmail('');
      setMobile('');
      setLandline('');
      // Reset other fields
    } catch (error) {
      Alert.alert('Error posting company profile:', error.message);
      // Handle error
      Alert.alert('Error', 'Failed to create company profile. Please try again later.');
     
    } finally {
    setLoading(false); // Set loading to false regardless of success or failure
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
        
      <Text style={styles.pageTitle}>Add  Company Profile</Text>
      
      {!isLoggedIn ? (
        
      <View>
      <Image
        source={require('./images/company_profile.jpg')}
        style={styles.imagePage}
        resizeMode="cover"
      />
      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>
    </View> 
      ) : (
        <View>
            <Text style={styles.label}>Select Company Logo</Text>
            <View style={styles.imageContainer}>
                {!selectedDocument ? (
                  <TouchableOpacity
                    style={styles.imageButton}
                    onPress={handleDocumentSelectAndSave}
                  >
                    <View style={styles.imageWrapper}>
                      <Image
                        source={require('./images/profile_default_logo.jpeg')}
                        style={[styles.image, { resizeMode: 'contain' }]} // Add resizeMode: 'contain'
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.imageButton}
                    onPress={handleDocumentSelectAndSave}
                  >
                    <View style={styles.imageWrapper}>
                      <Image
                        source={{ uri: selectedDocument }}
                        style={styles.image}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>

      <Text style={styles.label}>Company Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter company name"
        value={companyName}
        onChangeText={setCompanyName}
      />
      {errors.companyName && <Text style={styles.error}>{errors.companyName}</Text>}
      
      {/* Company Description */}
      <Text style={styles.label}>Company Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter company description"
        multiline
        numberOfLines={4}
        value={companyDescription}
        onChangeText={setCompanyDescription}
      />
         {errors.companyDescription && <Text style={styles.error}>{errors.companyDescription}</Text>}

      {/* Industry */}
      <Text style={styles.label}>Industry</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter industry"
        value={industry}
        onChangeText={setIndustry}
      />

      {/* Founded Year */}
      <Text style={styles.label}>Founded Year</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter founded year"
        value={foundedYear}
        onChangeText={setFoundedYear}
        keyboardType="numeric"
      />

      {/* Company Size */}
      <Text style={styles.label}>Company Size</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter company size"
        value={companySize}
        onChangeText={setCompanySize}
        keyboardType="numeric"
      />

      {/* Website */}
      <Text style={styles.label}>Website</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter website"
        value={website}
        onChangeText={setWebsite}
      />

      {/* Registration No. */}
      <Text style={styles.label}>Registration No.</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter registration number"
        value={registrationNo}
        onChangeText={setRegistrationNo}
      />

      {/* Logo */}
      {/* <Text style={styles.label}>Logo</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter logo"
        value={logo}
        onChangeText={setLogo}
      /> */}
      

      {/* Address */}
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter address"
        value={address}
        onChangeText={setAddress}
      />

      {/* Post Code */}
      <Text style={styles.label}>Post Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter post code"
        value={postCode}
        onChangeText={setPostCode}
      />

      {/* Contact Person's Name */}
      <Text style={styles.label}>Contact Person's Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter contact person's name"
        value={contactPersonName}
        onChangeText={setContactPersonName}
      />

      {/* Designation */}
      <Text style={styles.label}>Designation</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter designation"
        value={designation}
        onChangeText={setDesignation}
      />

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
      />
         {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      {/* Mobile */}
      <Text style={styles.label}>Mobile</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter mobile"
        value={mobile}
        onChangeText={setMobile}
      />
    {errors.mobile && <Text style={styles.error}>{errors.mobile}</Text>}
      {/* Landline */}
      <Text style={styles.label}>Landline</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter landline"
        value={landline}
        onChangeText={setLandline}
      />

       <TouchableOpacity style={styles.button} onPress={handlePostCompanyProfile} disabled={loading}>
                {loading ? (
                <ActivityIndicator size="small" color="#fff" />
                ) : (
                <Text style={styles.buttonText}>Save Company Profile</Text>
                )}
      </TouchableOpacity>

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
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    userInfoContainer: {
        backgroundColor: '#fff',
        padding: 20,
        margin: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        marginBottom: 20,
      },
      imageContainer: {
        alignItems: 'center',
        margin: 20,
      },
      imageButton: {
        backgroundColor: '#cccccc',
        padding: 5,
        borderRadius: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      
      imageWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#694fad',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        
        borderWidth: 2, // You can adjust the width of the border as needed
      },
      
      image: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
      },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#694fad',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    fontWeight: 'bold', // Adding bold font weight
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#694fad',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#000',
  },
  modalButton: {
    backgroundColor: '#694fad',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },error: {
    color: 'red',
    marginBottom: 5,
  },
  imagePage: {
    width: '100%',
    height: '60%', // Adjust the height as needed
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 30,
  },
  signInButton: {
    backgroundColor: '#694fad',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 30,
    
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PostCompanyProfile;
