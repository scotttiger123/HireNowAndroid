import React, { useState ,useEffect} from 'react';
import { View, Text, Modal, Alert,StyleSheet, TouchableOpacity, Image ,ScrollView,TextInput,ActivityIndicator } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/FontAwesome';
import getCsrfToken from './csrfTokenUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useFocusEffect } from '@react-navigation/native';

const ProfileScreen = () => {
  const [headline, setHeadLine] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  
  
  const [isSummaryModalVisible, setIsSummaryModalVisible] = useState(false);
  const [summary, setSummary] = useState('');


  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [description, setDescription] = useState('');


 
    
  const [isEducationModalVisible, setIsEducationModalVisible] = useState(false);
  const [level, setLevel] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [cityedu, setCityedu] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const [isSkillModalVisible, setIsSkillModalVisible] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');

  const [isCertificationModalVisible, setIsCertificationModalVisible] = useState(false);
  const [certificationName, setCertificationName] = useState('');
  const [certificationStartDate, setCertificationStartDate] = useState('');
  const [certificationEndDate, setCertificationEndDate] = useState('');
  const [certificationDescription, setCertificationDescription] = useState('');


  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  
  const [isWorkExperienceModalVisible, setIsWorkExperienceModalVisible] = useState(false);
  
  
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  
  const handleDeleteCertification = async (tableName, id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { 
          text: 'Delete', 
          onPress: () => deleteCertification(tableName, id)
        }
      ],
      { cancelable: false }
    );
  };
  
  const deleteCertification = async (tableName, id) => {
    try {
      const response = await fetch(`https://hirenow.site/api/delete-entry/${tableName}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Include any required headers
        },
      });
  
      if (response) {
        const csrfToken = await getCsrfToken();
        const storedUserId = await AsyncStorage.getItem('userId');
        await fetchDefaultProfileInfo(storedUserId, csrfToken);
        console.log('Certification deleted successfully');
      } else {
        console.error('Failed to delete certification:', response.status);
        // Handle other non-200 status codes
      }
    } catch (error) {
      console.error('Error deleting certification:', error.message);
      // Handle fetch or other errors
    }
  };
  


  const handleSaveCertification  = async () => {

    try {

      const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) {
          Alert.alert('Please log in to create profile.');
        return;
      }
      setIsSaving(true); // Set loading to true while saving
    
      const csrfToken = await getCsrfToken();
      
      const formData = new FormData();
    
    formData.append('user_id', storedUserId);
    formData.append('certification_name', certificationName);
    formData.append('start_date', certificationStartDate);
    formData.append('end_date', certificationEndDate);
    formData.append('description', certificationDescription);
    
      const response = await fetch('https://hirenow.site/api/save-certification', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: formData,
      });
    
      const responseData = await response.json();
    
      if (!response) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    
      console.log(responseData);
      await fetchDefaultProfileInfo(storedUserId, csrfToken);
      
      setIsCertificationModalVisible(false);
    } catch (error) {
      console.error('Error saving education:', error.message);
    } finally {
      setIsSaving(false); // Set loading back to false after save attempt
    }
  }

  const handleSaveEducation = async () => {
    
    try {

      const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) {
          Alert.alert('Please log in to create profile.');
        return;
      }

      setIsSaving(true); 

      const csrfToken = await getCsrfToken();
      
      const formData = new FormData();
    
      formData.append('user_id', storedUserId);
      formData.append('level', level);
      formData.append('field_of_study', fieldOfStudy);
      formData.append('school_name', schoolName);
      formData.append('city', cityedu);
      formData.append('from_date', fromDate);
      formData.append('to_date', toDate);
    
      const response = await fetch('https://hirenow.site/api/save-education', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: formData,
      });
    
      const responseData = await response.json();
    
      if (!response) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    
      console.log(responseData);
      await fetchDefaultProfileInfo(storedUserId, csrfToken);
      
      setIsEducationModalVisible(false);
    } catch (error) {
      console.error('Error saving education:', error.message);
    } finally {
      setIsSaving(false); 
    }
   
  };  

  // Function to handle opening the date picker for the 'from' date
  const handleFromDatePress = () => {
    setShowFromDatePicker(true);
  };

  // Function to handle opening the date picker for the 'to' date
  const handleToDatePress = () => {
    setShowToDatePicker(true);
  };

  // Function to handle date confirmation for the 'from' date
  const handleFromDateConfirm = (date) => {
    setFromDate(date.toISOString().split('T')[0]);
    setShowFromDatePicker(false);
  };

  

  const handleCertificationStartDateConfirm = (date) => {
    console.log('Selected date:', date);
    console.log('Formatted date:', date.toISOString().split('T')[0]);
    setCertificationStartDate(date.toISOString().split('T')[0]);
    setShowFromDatePicker(false);
  };
  
  const handleCertificationEndDateConfirm = (date) => { console.log('alert');
    console.log('Selected end date:', date);
    console.log('Formatted end date:', date.toISOString().split('T')[0]);
    setCertificationEndDate(date.toISOString().split('T')[0]);
    setShowToDatePicker(false);
    console.log('alert');
  };
  
  // Function to handle date confirmation for the 'to' date
  const handleToDateConfirm = (date) => {
    setToDate(date.toISOString().split('T')[0]);
    setShowToDatePicker(false);
  };

  const [profileInfo, setProfileInfo] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    postalCode: '',
    headline: '',
  });
  

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );
  
  const fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        clearData();
        
        return;
      }

      const csrfToken = await getCsrfToken();
      await fetchDefaultProfileInfo(userId, csrfToken);
    } catch (error) {
      console.error('Error fetching profile information:', error.message);
    }
  };

  const fetchDefaultProfileInfo = async (userId, csrfToken) => {
    try {
        const response = await fetch(`https://hirenow.site/api/get-default-profile-info?user_id=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
        });
        
        if (!response) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        const profileData = responseData.data; // Accessing the nested 'data' object
        setSelectedDocument(profileData.profile_image);

        console.log("profile-data",profileData.profile_image);
        setHeadLine(profileData.headline);
        setName(profileData.first_name);
        setEmail(profileData.email);
        setPhone(profileData.phone);
        setCity(profileData.city);
        setPostalCode(profileData.postal_code);
        setSummary(profileData.summary);
        
        // Update profileInfo object with the fetched data
        setProfileInfo({
          ...profileInfo, // Preserve existing profileInfo properties
          name: profileData.first_name,
          email: profileData.email,
          phone: profileData.phone,
          city: profileData.city,
          headline: profileData.headline,
          postalCode: profileData.postal_code,
          workExperiences: profileData.work_experiences, 
          educations: profileData.educations, 
          skills: profileData.skills, 
          certifications: profileData.certifications, 
  
          
        });
    } catch (error) {
        console.error('Error fetching default profile information:', error.message);
        throw error; // Propagate the error to the caller
    }
};
const clearData = () => {
  setProfileInfo({});
  setSelectedDocument(null);
  setHeadLine('');
  setName('');
  setEmail('');
  setPhone('');
  setCity('');
  setPostalCode('');
  setSummary('');
};

const handleSaveSkill = async () => { 
  try { 
    const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) {
          Alert.alert('Please log in to create profile.');
        return;
      }
        setIsSaving(true);
        const csrfToken = await getCsrfToken();
        
        const formData = new FormData();
        
        formData.append('user_id', storedUserId);
        formData.append('skill_name', skillName);
        formData.append('year_of_experience', yearsOfExperience);
        
        const response = await fetch('https://hirenow.site/api/save-skill', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-CSRF-TOKEN': csrfToken,
          },
          body: formData,
        });
        
        const responseData = await response.json();

        if (!response) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        await fetchDefaultProfileInfo(storedUserId, csrfToken);

        setIsSkillModalVisible(false);
      } catch (error) {
        console.error('Error saving summary:', error.message);
      } finally {
        setIsSaving(false);
      }

} 

const handleSaveWorkExperience = async () => {
  try {

    const storedUserId = await AsyncStorage.getItem('userId');
    if (!storedUserId) {
          Alert.alert('Please log in to create profile.');
      return;
    }
    setIsSaving(true);
    
    const csrfToken = await getCsrfToken();
    
    const formData = new FormData();

    formData.append('user_id', storedUserId);
    formData.append('job_title', jobTitle);
    formData.append('company', company);
    formData.append('from_date', fromDate);
    formData.append('to_date', toDate);
    formData.append('description', description);

    const response = await fetch('https://hirenow.site/api/save-work-experience', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRF-TOKEN': csrfToken,
      },
      body: formData,
    });

    const responseData = await response.json();
    console.log(responseData);

    if (!response) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log(response);

    await fetchDefaultProfileInfo(storedUserId, csrfToken);
  
    setIsWorkExperienceModalVisible(false);
  } catch (error) {
    console.error('Error saving work experience:', error.message);

  } finally {
    
    setIsSaving(false); 
  
  }
};


  const handleDocumentSelectAndSave = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) {
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
        
        
        formData.append('user_id', storedUserId);
  
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
  const handleEdit = (section) => {
    setEditingSection(section);
    //setInitialProfileData(); 
    setIsModalVisible(true);
  };
  
  const handleCancelEdit = () => {
    setEditingSection(null); 
    setIsModalVisible(false);
  };


  const handleSaveProfile = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) {
          Alert.alert('Please log in to create profile.');
        return;
      }
      setIsSaving(true); 
      const csrfToken = await getCsrfToken();
      
      const formData = new FormData();
      
      
      
      formData.append('user_id', storedUserId);
      formData.append('name', profileInfo.name);
      formData.append('phone', profileInfo.phone);
      formData.append('headline', profileInfo.headline);
      formData.append('postal_code', profileInfo.postalCode);
      formData.append('city', profileInfo.city);
      
      console.log(storedUserId);
      const response = await fetch('https://hirenow.site/api/save-profile-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: formData,
      });
      
      const responseData = await response.json();
      console.log(responseData);

      if (!response) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log(response);

      await fetchDefaultProfileInfo(storedUserId, csrfToken);
  

      setEditingSection(null);
      setIsModalVisible(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile information:', error.message);
    } finally {
      setIsSaving(false); 
    }
  };
  

  const capitalizeEachWord = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  
  const handleSaveSummary = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) {
          Alert.alert('Please log in to create profile.');
        return;
      }
      setIsSaving(true);
      const csrfToken = await getCsrfToken();
      
      const formData = new FormData();
      
      formData.append('user_id', storedUserId);
      formData.append('summary', summary);
      
      const response = await fetch('https://hirenow.site/api/save-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: formData,
      });
      
      const responseData = await response.json();
  
      if (!response) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      await fetchDefaultProfileInfo(storedUserId, csrfToken);
  
      setIsSummaryModalVisible(false);
    } catch (error) {
      console.error('Error saving summary:', error.message);
    } finally {
      setIsSaving(false);
    }
  };
  

 
  return (
    <ScrollView style={styles.container}>
      {/* User Information Box */}
      
      <View style={styles.userInfoContainer}>
        
              <Text style={styles.header}>Profile Information</Text>
              <View style={styles.imageContainer}>
                {!selectedDocument ? (
                  <TouchableOpacity
                    style={styles.imageButton}
                    onPress={handleDocumentSelectAndSave}
                  >
                    <View style={styles.imageWrapper}>
                      <Image
                        source={require('./images/default_profile.png')}
                        style={styles.image}
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

        
              <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.info}>{profileInfo.name ? capitalizeEachWord(profileInfo.name) : ""}</Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Job Title:</Text>
                    <Text style={styles.info}>{profileInfo.headline ? capitalizeEachWord(profileInfo.headline) : ""}</Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.info}>{profileInfo.email}</Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Phone:</Text>
                    <Text style={styles.info}>{profileInfo.phone}</Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>City:</Text>
                    <Text style={styles.info}>{profileInfo.city ? capitalizeEachWord(profileInfo.city) : ""}</Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Postal Code:</Text>
                    <Text style={styles.info}>{profileInfo.postalCode}</Text>
                  </View>

              {!editingSection && (
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEdit('Profile Information')}>
                    <Icon name="pencil" size={18} color="white" />
                  </TouchableOpacity>
                )}

             </View>
          {/* Edit Profile Modal */}
            <Modal visible={isModalVisible} animationType="slide" transparent>
              <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalHeader}>Edit Profile Information</Text>
                  <View style={styles.labelContianer}>
                    <Text style={styles.label}>Headline / CV Title</Text>
                  </View>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Headline / CV Title"
                    value={profileInfo.headline}
                    onChangeText={(text) => setProfileInfo({ ...profileInfo, headline: text })}
                  />
                  <View style={styles.labelContianer}>
                    <Text style={styles.label}>Name</Text>
                  </View>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Name"
                    value={profileInfo.name}
                    onChangeText={(text) => setProfileInfo({ ...profileInfo, name: text })}
                  />
                  <View style={styles.labelContianer}>
                    <Text style={styles.label}>Phone</Text>
                  </View>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Phone"
                    value={profileInfo.phone}
                    onChangeText={(text) => setProfileInfo({ ...profileInfo, phone: text })}
                  />
                  <View style={styles.labelContianer}>
                    <Text style={styles.label}>City</Text>
                  </View>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="City"
                    value={profileInfo.city}
                    onChangeText={(text) => setProfileInfo({ ...profileInfo, city: text })}
                  />
                  <View style={styles.labelContianer}>
                    <Text style={styles.label}>Postal Code</Text>
                  </View>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Postal Code"
                    value={profileInfo.postalCode}
                    onChangeText={(text) => setProfileInfo({ ...profileInfo, postalCode: text })}
                  />
                  <View style={styles.modalButtonsContainer}>
                    <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancelEdit}>
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                      
                        <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveProfile} disabled={isSaving}>
                          <Text style={styles.buttonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
                        </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>


      {/* Summary Box */}
      <View style={styles.sectionContainer}>
        <Text style={styles.header}>Summary</Text>
        <Text style={styles.text}>{summary}</Text>
        {editingSection === 'Summary' && (
          <Modal visible={isModalVisible} animationType="slide">
            {/* ... (Edit Summary Modal content goes here) */}
            <TouchableOpacity onPress={handleSave}>
              <Text>Save</Text>
            </TouchableOpacity>
          </Modal>
        )}
        {!editingSection && (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsSummaryModalVisible(true)}>
              <Icon name="pencil" size={18} color="white" />
            </TouchableOpacity>
        )}

         {/* Summary Modal */}
            <Modal visible={isSummaryModalVisible} animationType="slide" transparent>
              <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalHeader}>Edit Summary</Text>
                  <View style={styles.labelContianer}>
                    <Text style={styles.label}>Enter Summary</Text>
                  </View>
                  <TextInput
                    style={[styles.modalInput, { height: 100 }]} // Adjust the height as needed
                    placeholder="Enter summary"
                    multiline={true}
                    numberOfLines={4} // Adjust the number of lines as needed
                    value={summary}
                    onChangeText={setSummary}
                  />
                  <View style={styles.modalButtonsContainer}>
                    <TouchableOpacity style={[styles.modalButton,styles.cancelButton]} onPress={() => setIsSummaryModalVisible(false)}>
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                      <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveSummary} disabled={isSaving}>
                          <Text style={styles.buttonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
                      </TouchableOpacity>
                      
                  </View>
                </View>
              </View>
            </Modal>

      </View>

      {/* Work Experience Box */}
              <View style={styles.sectionContainer}>
                  <Text style={styles.header}>Work Experience</Text>
                    {profileInfo && Array.isArray(profileInfo.workExperiences) && profileInfo.workExperiences.map((experience, index) => (
                      
                      <View key={index} style={styles.experienceContainer}>
                         <TouchableOpacity onPress={() => handleDeleteCertification('candidate_work_experiences',experience.id)} style={styles.deleteButton}>
                          <View style={styles.deleteButtonContainer}>
                              <Icon name="trash" size={18} color="gray" />
                          </View>
                          </TouchableOpacity>
                                <View style={styles.fieldContainer}>
                                  <Text style={styles.label}>Job Title:</Text>
                                  <Text style={styles.text}>{experience.job_title}</Text>
                                </View>
                                <View style={styles.fieldContainer}>
                                  <Text style={styles.label}>Company:</Text>
                                  <Text style={styles.text}>{experience.company_name}</Text>
                                </View>
                                <View style={styles.fieldContainer}>
                                  <Text style={styles.label}>Start Date:</Text>
                                  <Text style={styles.text}>{experience.start_date}</Text>
                                </View>
                                <View style={styles.fieldContainer}>
                                  <Text style={styles.label}>End Date:</Text>
                                  <Text style={styles.text}>{experience.end_date}</Text>
                                </View>
                                <View style={styles.fieldContainer}>
                                  <Text style={styles.label}>Description:</Text>
                                  <Text style={styles.text}>{experience.description}</Text>
                                </View>

                      </View>
                    ))}


            {editingSection === 'Work Experience' && (
              <Modal visible={isModalVisible} animationType="slide">
                {/* ... (Edit Work Experience Modal content goes here) */}
                <TouchableOpacity onPress={handleSave}>
                  <Text>Save</Text>
                </TouchableOpacity>
              </Modal>
            )}
            {!editingSection && (
              <TouchableOpacity style={styles.editButton} onPress={() => setIsWorkExperienceModalVisible(true)}>
                <Icon name="plus" size={18} color="white" />
              </TouchableOpacity>
            )}

              <Modal visible={isWorkExperienceModalVisible} animationType="slide" transparent>
                <View style={styles.modalBackground}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalHeader}>Add Work Experience</Text>
                    <View style={styles.labelContianer}>
                                <Text style={styles.label}>Job Title</Text>
                    </View> 
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Job Title*"
                      value={jobTitle}
                      onChangeText={setJobTitle}
                    />
                    <View style={styles.labelContianer}>
                                <Text style={styles.label}>Company</Text>
                    </View> 
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Company"
                      value={company}
                      onChangeText={setCompany}
                    />
                    <View style={styles.labelContianer}>
                                <Text style={styles.label}>From Date</Text>
                    </View> 
                    <View style={styles.dateInputContainer}>
                      <TouchableOpacity onPress={handleFromDatePress}>
                      <View  onTouchEnd={handleFromDatePress}>
                        <TextInput
                          style={[styles.modalInput, styles.dateInput]}
                          placeholder="From Date"
                          value={fromDate}
                          editable={false}
                        />
                        </View>
                      </TouchableOpacity>
                      <View style={styles.labelContianer}>
                                <Text style={styles.label}>To Date</Text>
                      </View> 
                      <TouchableOpacity onPress={handleToDatePress}>
                      <View  onTouchEnd={handleToDatePress}>
                        <TextInput
                          style={[styles.modalInput, styles.dateInput]}
                          placeholder="To Date"
                          value={toDate}
                          editable={false}
                        />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <DateTimePickerModal
                      isVisible={showFromDatePicker}
                      mode="date"
                      onConfirm={handleFromDateConfirm}
                      onCancel={() => setShowFromDatePicker(false)}
                    />
                    <DateTimePickerModal
                      isVisible={showToDatePicker}
                      mode="date"
                      onConfirm={handleToDateConfirm}
                      onCancel={() => setShowToDatePicker(false)}
                    />
                    <View style={styles.labelContianer}>
                                <Text style={styles.label}>Description</Text>
                              </View> 
                    <TextInput
                      style={[styles.modalInput, { height: 100 }]} // Adjust height for description
                      placeholder="Description"
                      multiline
                      numberOfLines={4}
                      value={description}
                      onChangeText={setDescription}
                    />
                    <View style={styles.modalButtonsContainer}>
                      <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setIsWorkExperienceModalVisible(false)}>
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.modalButton, styles.saveButton]} 
                        onPress={handleSaveWorkExperience}
                        disabled={isSaving}
                        >
                        <Text style={styles.buttonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>


      </View>

      {/* Education Box */}
      <View style={styles.sectionContainer}>
        <Text style={styles.header}>Education</Text>
        {profileInfo && Array.isArray(profileInfo.educations) && profileInfo.educations.map((education, index) => (
          <View key={index} style={styles.experienceContainer}>
                
                  {/* Delete Button with Icon */}
                  <TouchableOpacity onPress={() => handleDeleteCertification('candidate_educations',education.id)} style={styles.deleteButton}>
                    <View style={styles.deleteButtonContainer}>
                      <Icon name="trash" size={18} color="gray" />
                    </View>
                  </TouchableOpacity>
                
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Level of Education:</Text>
                  <Text style={styles.text}>{education.edu_level_of_education}</Text>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Field of Study:</Text>
                  <Text style={styles.text}>{education.edu_field_of_study}</Text>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>School Name:</Text>
                  <Text style={styles.text}>{education.edu_school}</Text>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>City:</Text>
                  <Text style={styles.text}>{education.edu_city}</Text>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Start Date:</Text>
                  <Text style={styles.text}>{education.edu_start_date}</Text>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>End Date:</Text>
                  <Text style={styles.text}>{education.edu_end_date}</Text>
                </View>
              </View>

          
        ))}

        {editingSection === 'Education' && (
          <Modal visible={isModalVisible} animationType="slide">
            {/* ... (Edit Education Modal content goes here) */}
            <TouchableOpacity onPress={handleSave}>
              <Text>Save</Text>
            </TouchableOpacity>
          </Modal>
        )}
        {!editingSection && (
          
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEducationModalVisible(true)}>
            <Icon name="plus" size={18} color="white" />
          </TouchableOpacity>
        )}

          <Modal visible={isEducationModalVisible} animationType="slide" transparent>
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>Add Education</Text>
                <View style={styles.labelContianer}>
                  <Text style={styles.label}>Level of Education</Text>
                </View>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Level of Education*"
                  value={level}
                  onChangeText={setLevel}
                />
                <View style={styles.labelContianer}>
                  <Text style={styles.label}>Feild of Study</Text>
                </View>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Field of Study*"
                  value={fieldOfStudy}
                  onChangeText={setFieldOfStudy}
                />
                <View style={styles.labelContianer}>
                  <Text style={styles.label}>School Name</Text>
                </View>
                <TextInput
                  style={styles.modalInput}
                  placeholder="School Name*"
                  value={schoolName}
                  onChangeText={setSchoolName}
                />
                <View style={styles.labelContianer}>
                  <Text style={styles.label}>City</Text>
                </View>
                <TextInput
                  style={styles.modalInput}
                  placeholder="City*"
                  value={cityedu}
                  onChangeText={setCityedu}
                />
                <View style={styles.labelContianer}>
                  <Text style={styles.label}>From Date</Text>
                </View>
                <View style={styles.dateInputContainer}>
                  <TouchableOpacity onPress={handleFromDatePress}>
                  <View  onTouchEnd={handleFromDatePress}>
                    <TextInput
                      style={[styles.modalInput, styles.dateInput]}
                      placeholder="From Date"
                      value={fromDate}
                      editable={false}
                    />
                    </View>
                  </TouchableOpacity>
                  <View style={styles.labelContianer}>
                    <Text style={styles.label}>To Date</Text>
                  </View>
                  <TouchableOpacity onPress={handleToDatePress}>
                  <View  onTouchEnd={handleToDatePress}>
                    <TextInput
                      style={[styles.modalInput, styles.dateInput]}
                      placeholder="To Date"
                      value={toDate}
                      editable={false}
                    />
                    </View>
                  </TouchableOpacity>
                </View>
                <DateTimePickerModal
                  isVisible={showFromDatePicker}
                  mode="date"
                  onConfirm={handleFromDateConfirm}
                  onCancel={() => setShowFromDatePicker(false)}
                />
                <DateTimePickerModal
                  isVisible={showToDatePicker}
                  mode="date"
                  onConfirm={handleToDateConfirm}
                  onCancel={() => setShowToDatePicker(false)}
                />
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setIsEducationModalVisible(false)}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.saveButton]} 
                        onPress={handleSaveEducation}
                        disabled={isSaving}
                        >
                        <Text style={styles.buttonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
      </View>

            {/* Skill Box */}
      <View style={styles.sectionContainer}>
        <Text style={styles.header}>Skills</Text>
            {profileInfo && Array.isArray(profileInfo.skills) && profileInfo.skills.map((skill, index) => (
              <View key={index} style={styles.experienceContainer}>
                
                  {/* Delete Button with Icon */}
                  <TouchableOpacity onPress={() => handleDeleteCertification('candidate_skills',skill.id)} style={styles.deleteButton}>
                    <View style={styles.deleteButtonContainer}>
                      <Icon name="trash" size={18} color="gray" />
                    </View>
                  </TouchableOpacity>
                
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Skill</Text>
                    <Text style={styles.text}>{skill.skill_name}</Text>
                    </View>    
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Experience:</Text>
                    <Text style={styles.text}>
                      {skill.year_of_experience} {skill.year_of_experience > 1 ? 'years' : 'year'}
                    </Text>
                  </View>
              </View> 

              ))}

      
  {editingSection === 'Skills' && (
    <Modal visible={isModalVisible} animationType="slide">
      {/* Edit Skill Modal content goes here */}
      <TouchableOpacity onPress={handleSaveSkill} disabled={isSaving}>
      <Text style={styles.buttonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
      </TouchableOpacity>
    </Modal>
  )}
  {!editingSection && (
    <TouchableOpacity style={styles.editButton} onPress={() => setIsSkillModalVisible(true)}>
      <Icon name="plus" size={18} color="white" />
    </TouchableOpacity>
  )}

  {/* Skill Modal */}
  <Modal visible={isSkillModalVisible} animationType="slide" transparent>
    <View style={styles.modalBackground}>
      <View style={styles.modalContent}>
        <Text style={styles.modalHeader}>Edit Skills</Text>
        <View style={styles.labelContianer}>
              <Text style={styles.label}>Skill name</Text>
        </View>
        <TextInput
          style={styles.modalInput}
          placeholder="Enter skill name"
          value={skillName}
          onChangeText={setSkillName}
        />
        <View style={styles.labelContianer}>
              <Text style={styles.label}>Experience</Text>
        </View>
        <TextInput
          style={styles.modalInput}
          placeholder="Enter years of experience"
          keyboardType="numeric"
          value={yearsOfExperience.toString()}
          onChangeText={text => setYearsOfExperience(parseInt(text))}
        />
        <View style={styles.modalButtonsContainer}>
          <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setIsSkillModalVisible(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveSkill} disabled={isSaving} >
                <Text style={styles.buttonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
</View>

      {/* Certification/License Box */}
      <View style={styles.sectionContainer}>
      <Text style={styles.header}>Certifications/Licenses</Text>
      {/* Display total count of certifications/licenses */}
      
      {/* Display existing certifications/licenses */}
      {profileInfo && Array.isArray(profileInfo.certifications) && profileInfo.certifications.map((certification, index) => (
        <View key={index} style={styles.experienceContainer}>
          
            {/* Delete Button with Icon */}
            <TouchableOpacity onPress={() => handleDeleteCertification('candidate_certifications',certification.id)} style={styles.deleteButton}>
              <View style={styles.deleteButtonContainer}>
                <Icon name="trash" size={18} color="gray" />
              </View>
            </TouchableOpacity>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Certification/License </Text>
            <Text style={styles.text}>{certification.certificate_name}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Start Date</Text>
            <Text style={styles.text}>{certification.certificate_start_date}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>End Date</Text>
            <Text style={styles.text}>{certification.certificate_end_date}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.text}>{certification.certificate_description}</Text>
          </View>
        </View>
      ))}

      {/* Add certification/license button */}
      <TouchableOpacity style={styles.editButton} onPress={() => setIsCertificationModalVisible(true)}>
        <Icon name="plus" size={18} color="white" />
      </TouchableOpacity>
      {/* Certification/License Modal */}
      <Modal visible={isCertificationModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Add Certification/License</Text>
            <View style={styles.labelContianer}>
              <Text style={styles.label}>Certification / License  Name</Text>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="Certification/License Name"
              value={certificationName}
              onChangeText={setCertificationName}
            />
            <View style={styles.labelContianer}>
              <Text style={styles.label}>From Date</Text>
            </View>
             <TouchableOpacity onPress={handleFromDatePress}>
             <View  onTouchEnd={handleFromDatePress}>
                <TextInput
                style={[styles.modalInput, styles.dateInput]}
                placeholder="From Date"
                value={certificationStartDate}
                editable={false}
              />
              </View>
             </TouchableOpacity> 
             <View style={styles.labelContianer}>
              <Text style={styles.label}>To Date</Text>
            </View>
            <TouchableOpacity onPress={handleToDatePress} >
            <View  onTouchEnd={handleToDatePress}>
              <TextInput
                style={[styles.modalInput, styles.dateInput]}
                placeholder="To Date"
                value={certificationEndDate}
                editable={false}
              />
              </View>
              </TouchableOpacity>
            
             
            <View style={styles.labelContianer}>
              <Text style={styles.label}>Description</Text>
            </View>
            <TextInput
              style={[styles.modalInput, { height: 100 }]}
              placeholder="Description"
              multiline
              numberOfLines={4}
              value={certificationDescription}
              onChangeText={setCertificationDescription}
            />
                <DateTimePickerModal
                      isVisible={showFromDatePicker}
                      mode="date"
                      onConfirm={handleCertificationStartDateConfirm}
                      onCancel={() => setShowFromDatePicker(false)}
                    />
                    <DateTimePickerModal
                      isVisible={showToDatePicker}
                      mode="date"
                      onConfirm={handleCertificationEndDateConfirm} 
                      onCancel={() => setShowToDatePicker(false)``}
                    />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setIsCertificationModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveCertification} disabled={isSaving}>
                  <Text style={styles.buttonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>

    </ScrollView>
  );
};


const styles = StyleSheet.create({
  labelContianer: { 
   marginBottom:5,
  },
  experienceContainer: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
},
deleteButtonContainer: {
  position: 'absolute',
  top: 5,
  right: 5,
  
  
   //borderWidth: 1, // Border width
   //borderColor: 'black', // Border color
   //borderStyle: 'solid', // Border style
},
deleteButton: {
  
  borderRadius: 5,
},
text: {
  fontFamily: 'Tahoma',
    fontWeight: '500',
}, modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color:'#1e282c'
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF6347', // Red color for cancel button
  },
  saveButton: {
    backgroundColor: '#008000', // Green color for save button
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
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
    backgroundColor: '#ccc',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
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
  sectionContainer: {
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
    color: '#555',
  },
  info: {
    flex: 1,
    color: '#333',
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#694fad',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  text: {
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default ProfileScreen;

