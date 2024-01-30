import React, { useState ,useEffect} from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image ,ScrollView,TextInput,ActivityIndicator } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/FontAwesome';
import getCsrfToken from './csrfTokenUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [headline, setHeadLine] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const [loading, setLoading] = useState(false);
  
  const [isSummaryModalVisible, setIsSummaryModalVisible] = useState(false);
  const [summary, setSummary] = useState('');

  const [workExperience, setWorkExperience] = useState('Company A - Position A\nCompany B - Position B');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [description, setDescription] = useState('');

  const [education, setEducation] = useState('University X - Degree X\nCollege Y - Degree Y');
  const [skills, setSkills] = useState('Skill A, Skill B, Skill C');
  const [certifications, setCertifications] = useState('Certification A, Certification B');
  const [licenses, setLicenses] = useState('License X, License Y');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isWorkExperienceModalVisible, setIsWorkExperienceModalVisible] = useState(false);
  

  const [profileInfo, setProfileInfo] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    postalCode: '',
    headline: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const csrfToken = await getCsrfToken();
        const storedUserId = await AsyncStorage.getItem('userId');
        await fetchDefaultProfileInfo(storedUserId, csrfToken);
      } catch (error) {
        console.error('Error fetching profile information:', error.message);
      }
    };
  
    fetchData();
  }, []);
  

  const fetchDefaultProfileInfo = async (userId, csrfToken) => {
    try {
        const response = await fetch(`https://jobs.dev.britmarketing.co.uk/api/get-default-profile-info?user_id=${userId}`, {
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
        
        setHeadLine(profileData.headline);
        setName(`${profileData.first_name} ${profileData.last_name}`);
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
          headline: profileData.headline,
          postalCode: profileData.postal_code,
        });
    } catch (error) {
        console.error('Error fetching default profile information:', error.message);
        throw error; // Propagate the error to the caller
    }
};

const handleSaveWorkExperience = async () => {
  try {
    setLoading(true); // Set loading to true while saving
    const csrfToken = await getCsrfToken();
    const storedUserId = await AsyncStorage.getItem('userId');
    const formData = new FormData();

    formData.append('user_id', storedUserId);
    formData.append('job_title', jobTitle);
    formData.append('company', company);
    formData.append('from_date', fromDate);
    formData.append('to_date', toDate);
    formData.append('description', description);

    const response = await fetch('https://jobs.dev.britmarketing.co.uk/api/save-work-experience', {
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

    // Optionally, you can update the UI or perform any additional actions after saving the work experience

    // Reset the form fields
    setJobTitle('');
    setCompany('');
    setFromDate('');
    setToDate('');
    setDescription('');

    setIsWorkExperienceModalVisible(false);
  } catch (error) {
    console.error('Error saving work experience:', error.message);
  } finally {
    setLoading(false); // Set loading back to false after save attempt
  }
};


  const handleDocumentSelectAndSave = async () => {
    try {
        const csrfToken = await getCsrfToken();
        const result = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });
        const fileData = result[0];
        const base64Data = await RNFetchBlob.fs.readFile(fileData.uri, 'base64');
        const formData = new FormData();
        formData.append('profile_image', base64Data);
        formData.append('extension', fileData.type.split('/')[1]); // Append the file extension
        
        const storedUserId = await AsyncStorage.getItem('userId');
        formData.append('user_id', storedUserId);
  
        const apiUrl = 'https://jobs.dev.britmarketing.co.uk/api/save-profile-image';
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
      console.log(responseData);
      
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
      setLoading(true); // Set loading to true while saving
      const csrfToken = await getCsrfToken();
      const storedUserId = await AsyncStorage.getItem('userId');
      const formData = new FormData();
      
      
      
      formData.append('user_id', storedUserId);
      formData.append('name', profileInfo.name);
      formData.append('phone', profileInfo.phone);
      formData.append('headline', profileInfo.headline);
      formData.append('postal_code', profileInfo.postalCode);
      
      console.log(storedUserId);
      const response = await fetch('https://jobs.dev.britmarketing.co.uk/api/save-profile-info', {
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
      setLoading(false); // Set loading back to false after save attempt
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
      setLoading(true);
      const csrfToken = await getCsrfToken();
      const storedUserId = await AsyncStorage.getItem('userId');
      const formData = new FormData();
      
      formData.append('user_id', storedUserId);
      formData.append('summary', summary);
      
      const response = await fetch('https://jobs.dev.britmarketing.co.uk/api/save-summary', {
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
      setLoading(false);
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
                    <Text style={styles.info}>{capitalizeEachWord(profileInfo.name)}</Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Job Title:</Text>
                    <Text style={styles.info}>{capitalizeEachWord(profileInfo.headline)}</Text>
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
                    <Text style={styles.info}>{capitalizeEachWord(profileInfo.city)}</Text>
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
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Headline / CV Title"
                    value={profileInfo.headline}
                    onChangeText={(text) => setProfileInfo({ ...profileInfo, headline: text })}
                  />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Name"
                    value={profileInfo.name}
                    onChangeText={(text) => setProfileInfo({ ...profileInfo, name: text })}
                  />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Phone"
                    value={profileInfo.phone}
                    onChangeText={(text) => setProfileInfo({ ...profileInfo, phone: text })}
                  />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="City"
                    value={profileInfo.city}
                    onChangeText={(text) => setProfileInfo({ ...profileInfo, city: text })}
                  />
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
                      {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                      ) : (
                        <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveProfile}>
                          <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                      )}
                
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
                      {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                      ) : (
                        <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveSummary}>
                          <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                )}
            </View>
          </View>
        </View>
      </Modal>

      </View>

      {/* Work Experience Box */}
      <View style={styles.sectionContainer}>
          <Text style={styles.header}>Work Experience</Text>
            <Text style={styles.text}>{workExperience}</Text>
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
                <Icon name="pencil" size={18} color="white" />
              </TouchableOpacity>
            )}

<Modal visible={isWorkExperienceModalVisible} animationType="slide" transparent>
  <View style={styles.modalBackground}>
    <View style={styles.modalContent}>
      <Text style={styles.modalHeader}>Add Work Experience</Text>
      <TextInput
        style={styles.modalInput}
        placeholder="Job Title*"
        value={jobTitle}
        onChangeText={setJobTitle}
      />
      <TextInput
        style={styles.modalInput}
        placeholder="Company"
        value={company}
        onChangeText={setCompany}
      />
      <View style={styles.dateInputContainer}>
        <TextInput
          style={[styles.modalInput, styles.dateInput]}
          placeholder="From"
          value={fromDate}
          onChangeText={setFromDate}
        />
        <TextInput
          style={[styles.modalInput, styles.dateInput]}
          placeholder="To"
          value={toDate}
          onChangeText={setToDate}
        />
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
        <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveWorkExperience}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

      </View>

      {/* Education Box */}
      <View style={styles.sectionContainer}>
        <Text style={styles.header}>Education</Text>
        <Text style={styles.text}>{education}</Text>
        {editingSection === 'Education' && (
          <Modal visible={isModalVisible} animationType="slide">
            {/* ... (Edit Education Modal content goes here) */}
            <TouchableOpacity onPress={handleSave}>
              <Text>Save</Text>
            </TouchableOpacity>
          </Modal>
        )}
        {!editingSection && (
          <TouchableOpacity style={styles.editButton} onPress={() => handleEdit('Education')}>
            <Icon name="pencil" size={18} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Skills Box */}
      <View style={styles.sectionContainer}>
        <Text style={styles.header}>Skills</Text>
        <Text style={styles.text}>{skills}</Text>
        {editingSection === 'Skills' && (
          <Modal visible={isModalVisible} animationType="slide">
            {/* ... (Edit Skills Modal content goes here) */}
            <TouchableOpacity onPress={handleSave}>
              <Text>Save</Text>
            </TouchableOpacity>
          </Modal>
        )}
        {!editingSection && (
          <TouchableOpacity style={styles.editButton} onPress={() => handleEdit('Skills')}>
            <Icon name="pencil" size={18} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Certifications Box */}
      <View style={styles.sectionContainer}>
        <Text style={styles.header}>Certifications</Text>
        <Text style={styles.text}>{certifications}</Text>
        {editingSection === 'Certifications' && (
          <Modal visible={isModalVisible} animationType="slide">
            {/* ... (Edit Certifications Modal content goes here) */}
            <TouchableOpacity onPress={handleSave}>
              <Text>Save</Text>
            </TouchableOpacity>
          </Modal>
        )}
        {!editingSection && (
          <TouchableOpacity style={styles.editButton} onPress={() => handleEdit('Certifications')}>
            <Icon name="pencil" size={18} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Licenses Box */}
      <View style={styles.sectionContainer}>
        <Text style={styles.header}>Licenses</Text>
        <Text style={styles.text}>{licenses}</Text>
        {editingSection === 'Licenses' && (
          <Modal visible={isModalVisible} animationType="slide">
            {/* ... (Edit Licenses Modal content goes here) */}
            <TouchableOpacity onPress={handleSave}>
              <Text>Save</Text>
            </TouchableOpacity>
          </Modal>
        )}
        {!editingSection && (
          <TouchableOpacity style={styles.editButton} onPress={() => handleEdit('Licenses')}>
            <Icon name="pencil" size={18} color="white" />
          </TouchableOpacity>
        )}
      </View>
      </ScrollView>
  );
};


const styles = StyleSheet.create({
  modalBackground: {
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
    backgroundColor: '#164081',
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

