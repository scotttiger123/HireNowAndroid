import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons from react-native-vector-icons

const ViewApplicationsScreen = ({ route }) => {
  const { jobId } = route.params;
  const [appliedCVs, setAppliedCVs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAppliedCVs = async () => {
      try {
        const response = await fetch(`https://hirenow.site/api/applied-jobs/${jobId}`);
        const data = await response.json();
        if (data) {
          setAppliedCVs(data.appliedJobs);
          setLoading(false);
        } else {
          console.error('Failed to fetch applied CVs:', data.message);
        }
      } catch (error) {
        console.error('Error fetching applied CVs:', error.message);
      }
    };

    fetchAppliedCVs();
  }, [jobId]);

  const handleViewCVPdf = (jobId, userId) => {
    const cvUrl = `https://hirenow.site/view-cv-pdf/${jobId}/${userId}`;
    Linking.openURL(cvUrl);
  };

  const handleViewCVProfile = (jobId, userId) => {
    const cvUrl = `https://hirenow.site/view-cv-email/${jobId}/${userId}`;
    Linking.openURL(cvUrl);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>CVs Received</Text>
      </View>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={appliedCVs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.cvItem}>
              <View style={styles.cvRow}>
                <Icon name="person" size={20} color="#666" />
                {item.user && item.user.name ? (
                  <Text style={styles.cvText}>{item.user.name.toUpperCase()}</Text>
                ) : (
                  <Text style={styles.cvText}>Not Available</Text>
                )}
              </View>
              
              {/* Add other details here */}
  
              <TouchableOpacity
                onPress={() => item.cv_saved === '1' ? handleViewCVProfile(item.job_id, item.user.id) : handleViewCVPdf(item.job_id, item.user.id)}
                style={styles.viewCV}
              >
                <Icon name="description" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={() => ( // Conditionally render this message when the data array is empty
            <View style={styles.loaderContainer}>
              <Text style={styles.noCVsText}>No CVs Found</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  noCVsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666', // Choose the color you prefer
  },
  infoContainer: {
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#b896d9',
    marginLeft: 10,
  },
  cvItem: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    padding: 15,
    position: 'relative',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cvRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  cvText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  viewCV: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
});

export default ViewApplicationsScreen;