import React, { useEffect, useState ,} from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator, Image,Alert ,TouchableWithoutFeedback } from 'react-native';
import { Card ,Button  } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute ,useNavigation  } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import ComboBoxes from './ComboBoxes';



// Import other images...



const JobGrid = () => {
  
  
  const [selectedJobType, setSelectedJobType] = useState(null);
  const [selectedPostedBy, setSelectedPostedBy] = useState(null);
  const [selectedDatePosted, setSelectedDatePosted] = useState(null);
  const [selectedSalary, setSelectedSalary] = useState(null);
  
  
  
  
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [locationText, setLocationText] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  const navigation = useNavigation();
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [noMoreJobs, setNoMoreJobs] = useState(false);
  const [jobLiked, setJobLiked] = useState({});
  const [displayNoJobsMessage, setDisplayNoJobsMessage] = useState(false);

  
  // useEffect(() => {
  //   fetchData(); // Fetch data when component mounts
  // }, []);
  

  const toggleJobLiked = (jobId) => {
    setJobLiked(prevState => ({
      ...prevState,
      [jobId]: !prevState[jobId] // Toggle liked state for the specified job
    }));
  };
  useEffect(() => {
    fetchData();
  }, [page]);

  const handleScroll = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      if (!isLoading && !noMoreJobs) {
        setPage(prevPage => prevPage + 1);
      } else if (jobs.length === 0 && noMoreJobs) {
        // If no jobs are found and there are no more jobs to fetch, display the "No jobs found" message
        setNoMoreJobsMessage(true);
      }
    }
  };
  

  useEffect(() => {
    setPage(1); // Reset page to 1
    setJobs([]); // Clear jobs array before searching
    searchJobs(); // Call searchJobs whenever search criteria change
  }, [searchText, locationText, selectedJobType, selectedPostedBy, selectedDatePosted, selectedSalary]);
  

  // const fetchData = async () => {
  //   try {
  //     setIsLoading(true); // Set loading to true while searching
      
  //     const response = await fetch('https://hirenow.site/api/jobs');
  //     const data = await response.json();
  //     setJobs(data.jobs);
  //     setIsLoading(false); // Set loading to false after searching
  //   } catch (error) {
  //     //console.error('Error fetching data:', error);
  //   }
  // };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://hirenow.site/api/jobs?page=${page}`);
      const data = await response.json();
  
      if (data.jobs.length === 0) {
        setNoMoreJobs(true);
      } else {
        setJobs(prevJobs => [...prevJobs, ...data.jobs]);
      }
  
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };
  

  const searchJobs = async () => {
    try {
      setIsLoading(true);
      setPage(1); // Reset page to 1
      setNoMoreJobs(false); // Reset noMoreJobs to false
  
      const apiUrl = `https://hirenow.site/api/search-jobs-filter?keywords=${searchText}&location=${locationText}${
        selectedJobType ? `&selectedJobType=${selectedJobType}` : ''
      }${
        selectedPostedBy ? `&selectedPostedBy=${selectedPostedBy}` : ''
      }${
        selectedDatePosted ? `&selectedPostedDate=${selectedDatePosted}` : ''
      }${
        selectedSalary ? `&selectedSalary=${selectedSalary}` : ''
      }`;
  
      const response = await fetch(apiUrl);
      const data = await response.json(); 
  
      if (data.jobs.length === 0) {
        setNoMoreJobs(true);
        setJobs([]); // Clear the jobs array if no jobs are found
      } else {
        setJobs(data.jobs);
      }
  
      setIsLoading(false);
    } catch (error) {
      console.error('Error searching jobs:', error);
      setIsLoading(false);
    }
  };
  
  
  const openModal = (job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setModalVisible(false);
  };
  
  const imagePaths = {
    "admin": require('./images/grid/admin-min-min.jpg'),
    "catering": require('./images/grid/catering-min-min.jpg'),
    "construction": require('./images/grid/Construction-min-min.jpg'),
    "customer support": require('./images/grid/customer support-min.jpg'),
    "events": require('./images/grid/events-min.jpg'),
    "healthcare": require('./images/grid/Healthcare-min.jpg'),
    "hospitality": require('./images/grid/Hospitality-min.jpg'),
    "industrial": require('./images/grid/Industrial-min.jpg'),
    "marketing": require('./images/grid/Marketing-min.jpg'),
    "social care": require('./images/grid/Social Care-min.jpg'),
    "telecommunications": require('./images/grid/Telecommunications-min.jpg'),
    "transportation": require('./images/grid/Transportation-min.jpg'),
    "warehousing": require('./images/grid/Warehousing-min.jpg'),
    "approved": require('./images/grid/Warehousing-min.jpg'),
    "default": require('./images/grid/admin-min-min.jpg') 
  };
  
  const renderItem = ({ item }) => {
    
    const skillsArray = item.skillsRequired ? item.skillsRequired.split(',').map(skill => skill.trim()) : [];
    const jobLocation = item.jobLocation ? JSON.parse(item.jobLocation) : [];
    const location = Array.isArray(jobLocation) ? jobLocation[0] : '';
    
    const capitalizeEachWord = (str) => {
      if (!str) return ''; // Check if str is null or undefined, return empty string if so
      return str.replace(/\b\w/g, c => c.toUpperCase());
    };

    const capitalize = (str) => {
      if (!str) return ''; // Check if str is null or undefined, return empty string if so
      
      // Capitalize the first letter of each sentence
      return str.replace(/(^\w{1}|\.\s+\w{1})/g, c => c.toUpperCase());
    };
  
  const companyName = capitalizeEachWord(item.company);
  
  const jobTitle = capitalize(item.jobTitle);

   // Check if any key in imagePaths includes any part of the job title
   const matchedKey = Object.keys(imagePaths).find(key => jobTitle.toLowerCase().includes(key.toLowerCase()));

   // If a matching key is found, use its corresponding image path; otherwise, use the default image path
   const imagePath = matchedKey ? imagePaths[matchedKey] : imagePaths["default"];
 
  
  // Adjust the getPostedDays function
  const getPostedDays = (postedDate) => {
    if (!postedDate) return 'days ago'; // Return 'X days ago' if no date available
    const today = new Date();
    const datePosted = new Date(postedDate);
    const diffTime = Math.abs(today - datePosted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    // Check if it's just one day ago
    if (diffDays === 1) {
      return '1 day ago';
    } else {
      return `${diffDays} days ago`;
    }
  };
  
  
    return (
      <TouchableOpacity onPress={() => openModal(item)}>
        

        <Card containerStyle={styles.card}>
        
        
        <View style={styles.companyContainer}>
      {/* Icon */}
      <Icon name="business" size={24} color="#694fad" style={styles.companyIcon} />
      {/* Company Name */}
      <Text style={styles.companyText}>{companyName}</Text>
    </View>
        <View style={styles.imageContainer}>
        <Image
            source={imagePath} // Use the dynamically selected image path
            style={styles.image}
            resizeMode="cover"
          />


          {/* Add an overlay to create a darker effect */}
          <View style={styles.overlay} />
          <TouchableWithoutFeedback onPress={() => toggleJobLiked(item.id)}>
              <View style={styles.favoriteContainer}>
                <Icon
                  name="favorite"
                  size={24}
                  color={jobLiked[item.id] ? 'red' : '#fff'} // Use the liked state for the current item
                  style={styles.favoriteIcon}
                />
              </View>
            </TouchableWithoutFeedback>
        </View>
        <View style={styles.content}>
        
        <View style={styles.jobInfo}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.jobTitle}>{jobTitle.toUpperCase()}</Text>
            </View>
            <Text style={styles.postedDays}>{getPostedDays(item.created_at)}</Text>
          </View>
          
        </View>


        
        
          
        {/* Render job location, icon, salary range, and time icons with values */}
          <View style={styles.detailsContainer}>
          
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Salary Range */}
              <Text style={[styles.detailText, styles.salaryText]}>
                {item.min_salary && item.max_salary ? `£${item.min_salary} - £${item.max_salary} ` : 'Salary not specified'}
              </Text>
              <Text style={[styles.detailText, styles.detailItem]}>
                {item.salary_type}
              </Text>
              {/* Dot symbol */}
              <Text style={styles.dotSymbol}>•</Text>
              {/* Job Shift */}
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.detailText, styles.detailItem]}>
                  {item && item.job_type && 
                    (
                      item.job_type.toLowerCase().includes('full') ? 'Full Time' : (
                        item.job_type.toLowerCase().includes('part') ? 'Part Time' : (
                          item.job_type.charAt(0).toUpperCase() + item.job_type.slice(1).toLowerCase() 
                        )
                      )
                    )
                  || 'Job Type N/A'}
                  
                </Text>
              </View>

              {/* Dot symbol */}
              <Text style={styles.dotSymbol}>•</Text>
              {/* Job Location */}
              <Text style={[styles.detailText, styles.detailItem]}>
                {location ? `${location}` : 'Location not specified'}
              </Text>
            </View>

  
        {/* Render each skill separately */}
        
            <View style={styles.skillsContainer}>
              {skillsArray.length > 0 ? (
                skillsArray.map((skill, index) => (
                  <View key={index} style={styles.skill}>
                    <Text>{skill}</Text>
                  </View>
                ))
              ) : (
                  <View  style={styles.skill}>
                    <Text>No skills </Text>
                  </View> 
              )}
                <View style={styles.experience}>
                  <Text>
                    {item.minExperience > 0 ? `${item.minExperience} Years Experience` : 'No Experience'}
                  </Text>
                </View>

  

            </View>  


      </View>
          <Card.Divider />
          <Text style = {{ color:'#1e282c'}}>{item.jobDescription.substring(0, 50)} Read more ...</Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };
 
  const closeModalNavigate = () => {
    //setSelectedJob(null);
    setModalVisible(false);
  };
  
  const handleApplyButton = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
            closeModalNavigate(); // Close modal when navigating to ApplyJobPage
            navigation.navigate('ApplyJobPage', { job: selectedJob });
        } else {
            // Show an alert dialog for confirmation
            Alert.alert(
                'Confirmation',
                'You are not logged in. Do you want to proceed to the login ?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'OK',
                        onPress: () => {
                            setModalVisible(false); // Close the modal
                            navigation.navigate('Login'); // Navigate to the login screen
                        }
                    }
                ]
            );
        }
    } catch (error) {
        console.error("Error occurred:", error); // Log any errors
        // Handle error appropriately
    }
};

  
  

  const updateSelectedValues = (value, filterType) => {
    let processedValue = value;
  
    if (filterType === 'datePosted') {
      processedValue = mapStringToDateValue(value);
    }

    if (filterType === 'Salary') {
      processedValue = mapStringToSalaryValue(value);
    }
  
    if (filterType === 'jobType') {
      setSelectedJobType(processedValue);
    } else if (filterType === 'postedJob') {
      setSelectedPostedBy(processedValue);
    } else if (filterType === 'datePosted') {
      setSelectedDatePosted(processedValue);
    } else if (filterType === 'Salary') {
      setSelectedSalary(processedValue);
    }
    
    //searchJobs();
  };
  const mapStringToSalaryValue = (stringValue) => {
    switch (stringValue) {
      case '£5.00+/hour':
        return 5;
      case '£11.00+/hour':
        return 11;
      case '£21.00+/hour':
        return 21;
      case '£31.00+/hour':
        return 31;    
      default:
        return null;
    }
  };
  
  const mapStringToDateValue = (stringValue) => {
    switch (stringValue) {
      case 'Last 24 hours':
        return 24;
      case 'Last 3 days':
        return 3;
      case 'Last 7 days':
        return 7;
      case 'Last 14 days':
        return 14;
      default:
        return null;
    }
  };
  return (
    
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      
      <Image
        source={require('./images/HeroImage.jpg')} 
        style={{ width: '100%', height: 120 }}
        resizeMode="contain"
      />
      <View style={styles.inputContainer}> 
        
        <TextInput
          style={styles.inputField}
          placeholder="Job title"
          value={searchText}
          placeholderTextColor={styles.placeholder.color}
          onChangeText={(text) => setSearchText(text)}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Where"
          value={locationText}
          placeholderTextColor={styles.placeholder.color}
          onChangeText={(text) => setLocationText(text)}
        />
        <Button
          
          onPress={searchJobs}
          icon={
            <Icon
              name="find-replace"
              size={20}
              color="#fff"
              style={{ marginRight: 5 }}
            />
          }
          
          buttonStyle={{ backgroundColor: '#694fad' ,borderRadius: 6 }}
        />
        
      </View>
      <View>
          { <ComboBoxes
            updateSelectedValues={(value, filterType) => updateSelectedValues(value, filterType)}
            searchJobs={searchJobs}
          /> }
      </View>    

      {isLoading ? (
  <ActivityIndicator style={{ marginTop: 2 }} size="large" color="#164081" />
) : displayNoJobsMessage ? (
  <View style={styles.notFoundContainer}>
    <Text style={styles.notFoundText}>No jobs found</Text>
  </View>
) : (
  <FlatList
  data={jobs}
  keyExtractor={(item) => item.id.toString()}
  renderItem={renderItem}
  onEndReached={() => {
    if (!isLoading && !noMoreJobs) {
      setPage(prevPage => prevPage + 1);
    }
  }}
  onEndReachedThreshold={0.5}
  ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="#164081" /> : null}
/>

)}




<Modal isVisible={isModalVisible} style={styles.modal} backdropOpacity={0.3}>
  <View style={styles.modalContent}>
    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
      <Icon name="close" size={20} color="#fff" />
    </TouchableOpacity>
    {selectedJob && (
      <Card> 
        
        <View style={styles.titleContainer}>
          <Icon name="work" size={24} color="#694fad" style={styles.titleIcon} />
          <Text style={styles.titleText}>{selectedJob.jobTitle}</Text>
        </View>
        {/* <Card.Divider /> */}
        
          {/* <Image
            source={require('./images/default-job-image.jpeg')}
            style={styles.imageModal} // Apply styles to the image as needed
            resizeMode="contain" // Adjust the resizeMode to 'contain'
          /> */}

        <ScrollView style={styles.descriptionContainer}>
          
          <View style={styles.jobDetailsContainer}>
          {/* Render various job details */}
            <View style={styles.jobDetail}>
              <Text style={styles.jobDetailLabel}>Positions:</Text>
              <Text style={styles.jobDetailValue}>{selectedJob.numPositions !== null ? selectedJob.numPositions : 'N/A'}</Text>
            </View>

            <View style={styles.jobDetail}>
              <Text style={styles.jobDetailLabel}>Job Shift:</Text>
              <Text style={styles.jobDetailValue}>
                {
                  selectedJob.job_shift !== null && selectedJob.job_shift.trim() !== '' 
                    ? selectedJob.job_shift.charAt(0).toUpperCase() + selectedJob.job_shift.slice(1).toLowerCase() 
                    : 'Morning'
                }
              </Text>

            </View>

            <View style={styles.jobDetail}>
              <Text style={styles.jobDetailLabel}>Job Type:</Text>
              <Text style={styles.jobDetailValue}> 
              {selectedJob.job_type && 
                  (
                    selectedJob.job_type.toLowerCase().includes('full') ? 'Full Time' : (
                      selectedJob.job_type.toLowerCase().includes('part') ? 'Part Time' : (
                        selectedJob.job_type.charAt(0).toUpperCase() + selectedJob.job_type.slice(1).toLowerCase() 
                      )
                    )
                  )
                  || 'Job Type not specified'}

              
              </Text>
            </View>

            <View style={styles.jobDetail}>
              <Text style={styles.jobDetailLabel}>Experience:</Text>
              <Text style={styles.jobDetailValue}>{selectedJob.minExperience !== null && selectedJob.minExperience > 0 && selectedJob.maxExperience !== null && selectedJob.maxExperience > 0 ? `${selectedJob.minExperience} to ${selectedJob.maxExperience}` : 'N/A'}</Text>
            </View>

            <View style={styles.jobDetail}>
              <Text style={styles.jobDetailLabel}>Apply Before:</Text>
              <Text style={styles.jobDetailValue}>{selectedJob.apply_by_date ? new Date(selectedJob.apply_by_date).toLocaleDateString() : 'N/A'}</Text>
            </View>

            <View style={styles.jobDetail}>
              <Text style={styles.jobDetailLabel}>Posting Date:</Text>
              <Text style={styles.jobDetailValue}>{selectedJob.created_at ? new Date(selectedJob.created_at).toLocaleDateString() : 'N/A'}</Text>
            </View>
          </View>

          <Text style={styles.jobDescriptionHeading}>Job Description</Text> 
          <Text style={styles.jobDescription} >{selectedJob.jobDescription}</Text> 

        </ScrollView>
        <View style={styles.buttonContainer}>
          {/* Apply button */}
          <TouchableOpacity style={styles.updateButton} onPress={handleApplyButton}>
            <Text style={styles.updateButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </Card>
    )}
  </View>
</Modal>

   </View>

   );
};

const styles = StyleSheet.create({
  
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  notFoundText: {
    fontSize: 24,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0', // Light gray background color
    padding: 20, // Add padding to create space around the text
    borderRadius: 10, // Rounded corners for a modern look
    borderWidth: 2, // Add a border
    borderColor: '#ccc', // Light gray border color
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Drop shadow for depth
  },
  
  
  jobDetailsContainer: {
    marginTop: 20,
    backgroundColor: '#eaf7eb',
    borderRadius: 10,
    padding: 10,
  },
  jobDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobDetailLabel: {
    
    color: '#333',
    width: '40%', // Adjust as needed
  },
  jobDetailValue: {
    width: '60%', // Adjust as needed
    color: '#555',
  },
  jobDetailValue: {
    fontWeight: 'bold', // Bold the value text
    color: '#333', // Darker grey text color
    marginLeft: 5,
  },

  
  jobDescriptionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#694fad',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#694fad',
    textAlign: 'justify',
  },
  jobDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 5,
  },
  companyIcon: {
    marginRight: 10,
  },
  companyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e282c',
  },
  detailsContainer: {
    marginTop: 0,
    paddingHorizontal: 0,
  },
  detailText: {
    fontSize: 14,
    color: '#1e282c',
  },
  salaryText: {
    fontWeight: 'bold',
  },
  hourlyDailyText: {
    fontSize: 12,
    color: '#1e282c',
    marginLeft: 5, // Adjust as needed
  },
  dotSymbol: {
    fontSize: 16,
    color: '#1e282c',
    paddingHorizontal: 5, // Adjust as needed
  },
  detailItem: {
    marginVertical: 5,
  },
  inline: {
    display: 'inline',
  },
  card: {
    marginBottom: 5,
    borderRadius: 10,
    borderColor: '#694fad',
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200, // Adjust height as needed
    borderRadius: 5, // Adjust border radius as needed
  },
  imageModal: {
    width: '500',
    height: 100, // Adjust height as needed
    borderRadius: 5, // Adjust border radius as needed
  },
  // overlay: {
  //   ...StyleSheet.absoluteFillObject,
  //   backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay color
  //   borderRadius: 5, // Adjust border radius as needed
  // },
  favoriteContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  content: {
    paddingTop:10,
  },
  postedDays: {
    marginLeft: 'auto', // Move the posted days to the right
    color: '#777', // Adjust color for the posted days
  },
  jobInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'left',
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#694fad', // Change the color to the desired one
  },
  cardContent: {
    flexDirection: 'row', // Arrange content horizontally
    justifyContent: 'space-between', // Add space between left and right content
    alignItems: 'center', // Align items vertically
  },
  companyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  skill: {
    backgroundColor: '#eaf7eb',
    color: '#4a4a4a', 
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  experience: {
    backgroundColor: '#f2f2f2',
    color: '#666', 
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  
  secondDivider: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
  },
  headerText: {
    color: '#164081',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  placeholder: {
    color: '#ccc',
  },
  inputField: {
    flex: 1,
    height: 40,
    color: '#333',
    borderRadius: 8,
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#fff',
    shadowColor: '#694fad',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#694fad',
  },
  updateButton: {
    backgroundColor: '#694fad',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    width: '100%', // Make the button take up full width
  },
  noJobsText: {
    color: '#1e282c',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: 'black',
  },
  tableLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
    backgroundColor: '#F2F2F2',
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    color: 'black',
    fontFamily: 'Tahoma',
  },
  tableValue: {
    flex: 2,
    fontSize: 12,
    padding: 10,
    color: 'black',
    fontFamily: 'Tahoma',
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
    color: '#1e282c',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    textAlign: 'justify',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  titleIcon: {
    marginRight: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#694fad',
  },
  descriptionContainer: {
    maxHeight: '80%',
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 2,
    color: '#1e282c',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#694fad',
    borderRadius: 15,
    padding: 5,
    zIndex: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  headerContainerStyle: {
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 1,
    borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
    marginBottom: 10,
    flexDirection: 'row',
  },
});


export default JobGrid;