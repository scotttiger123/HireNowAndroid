import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileScreen = () => {
  const [name, setName] = useState('Your Name');
  const [email, setEmail] = useState('your.email@example.com');
  const [phone, setPhone] = useState('123-456-7890');
  const [summary, setSummary] = useState('Experienced professional with expertise in...');
  const [workExperience, setWorkExperience] = useState('Company A - Position A\nCompany B - Position B');
  const [education, setEducation] = useState('University X - Degree X\nCollege Y - Degree Y');
  const [skills, setSkills] = useState('Skill A, Skill B, Skill C');
  const [certifications, setCertifications] = useState('Certification A, Certification B');
  const [licenses, setLicenses] = useState('License X, License Y');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSection, setEditingSection] = useState('');

  const handleEdit = (section) => {
    setEditingSection(section);
    setIsModalVisible(true);
  };

  const handleSave = () => {
    // Save the updated information (you can implement the saving logic here)
    console.log('Saving profile information:', {
      name,
      email,
      phone,
      summary,
      workExperience,
      education,
      skills,
      certifications,
      licenses,
    });
    setIsModalVisible(false);
    setEditingSection('');
  };

  return (
    <View style={styles.container}>
      {/* User Information Box */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.header}>Profile Information</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.info}>{name}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{email}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.info}>{phone}</Text>
        </View>
        {editingSection === 'Profile Information' && (
          <Modal visible={isModalVisible} animationType="slide">
            {/* ... (Edit Profile Modal content goes here) */}
            <TouchableOpacity onPress={handleSave}>
              <Text>Save</Text>
            </TouchableOpacity>
          </Modal>
        )}
        {!editingSection && (
          <TouchableOpacity style={styles.editButton} onPress={() => handleEdit('Profile Information')}>
            <Icon name="pencil" size={18} color="white" />
          </TouchableOpacity>
        )}
      </View>

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
          <TouchableOpacity style={styles.editButton} onPress={() => handleEdit('Summary')}>
            <Icon name="pencil" size={18} color="white" />
          </TouchableOpacity>
        )}
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
          <TouchableOpacity style={styles.editButton} onPress={() => handleEdit('Work Experience')}>
            <Icon name="pencil" size={18} color="white" />
          </TouchableOpacity>
        )}
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
    </View>
  );
};

const styles = StyleSheet.create({
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
    top: 20,
    right: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
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
});

export default ProfileScreen;
