// ComboBoxes.js
import React, { useEffect, useState } from 'react';

import { View, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const ComboBoxes = ({ updateSelectedValues, searchJobs }) => {
  
  const [selectedJobType, setSelectedJobType] = useState();
  const [selectedPostedBy, setSelectedPostedBy] = useState(null);
  const [selectedDatePosted, setSelectedDatePosted] = useState(null);
  const [selectedSalary, setSelectedSalary] = useState(null);
  
  
  const [data, setData] = useState({
    jobs: [],
    jobTypesWithCounts: [],
    salaryRangesCounts: [],
    employerCount: 0,
    staffingAgencyCount: 0,
  });
  useEffect(() => {
    // This effect will run every time selectedJobType changes
    console.log("After updateSelectedValues, selectedJobType:", selectedJobType);

    // If you want to execute some logic based on the updated state, do it here
    // For example, call a function like searchJobs
    searchJobs();
  }, [selectedJobType, selectedPostedBy,selectedDatePosted,selectedSalary]);

 

  const onJobTypeChange = (itemValue) => {
    setSelectedJobType(itemValue);
    updateSelectedValues(itemValue, 'jobType'); // Update the selected value for job type
  };

  const onPostedByChange = (itemValue) => {
    setSelectedPostedBy(itemValue);
    updateSelectedValues(itemValue, 'postedJob'); // Update the selected value for posted job
  };

  const onDatePostedChange = (itemValue) => {
    
    setSelectedDatePosted(itemValue);
    updateSelectedValues(itemValue, 'datePosted'); // Update the selected value for posted job
  };

  const onSalaryChange = (itemValue) => {
    
    setSelectedSalary(itemValue);
    updateSelectedValues(itemValue, 'Salary'); // Update the selected value for posted job
  };
 
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://hirenow.site/api/comboCounter');
        const result = await response.json();
        setData(result);
        console.log(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const sumCounts = Object.entries(data.jobTypesWithCounts).reduce((acc, [key, value]) => {
    acc.count_last_24_hours += value.count_last_24_hours;
    acc.count_last_3_days += value.count_last_3_days;
    acc.count_last_7_days += value.count_last_7_days;
    acc.count_last_14_days += value.count_last_14_days;
    return acc;
  }, {
    count_last_24_hours: 0,
    count_last_3_days: 0,
    count_last_7_days: 0,
    count_last_14_days: 0,
  });

  const postedDateOptions = [
    { label: 'Last 24 hours', value: sumCounts.count_last_24_hours },
    { label: 'Last 3 days', value: sumCounts.count_last_3_days },
    { label: 'Last 7 days', value: sumCounts.count_last_7_days },
    { label: 'Last 14 days', value: sumCounts.count_last_14_days },
  ];

  const employerStaffingOptions = [
    //{ label: 'Employer', value: data.employerCount },
    //{ label: 'Staffing', value: data.staffingAgencyCount },
    { label: 'Employer', value: 1230 },
    { label: 'Staffing', value:  1430 },
  ];

  const salaryRangeOptions = [
    { label: '£5.00+/hour', value: data.salaryRangesCounts['5-10'] },
    { label: '£11.00+/hour', value: data.salaryRangesCounts['11-20'] },
    { label: '£21.00+/hour', value: data.salaryRangesCounts['21-30'] },
    { label: '£31.00+/hour', value: data.salaryRangesCounts['31-40'] },
  ];
  
  

  const jobTypeOptions = Object.entries(data.jobTypesWithCounts).map(([key, value]) => ({
    label: value.job_type,
    value: value.count,
  }));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
      <View style={styles.container}>
        
      <View style={styles.comboBox}>
          {data && (
            <View style={[styles.pickerWrapper, selectedJobType === 'Job Type' && styles.selectedCombo]}>
              <Picker
                selectedValue={selectedJobType}
                
                
                onValueChange={onJobTypeChange}
                style={{width: 160, height: 100}} itemStyle={{height: 100,fontSize:12}}>
              
                <Picker.Item label="Job Type" value="" style={styles.pickerItem} />
                {jobTypeOptions.map((option, index) => (
                  <Picker.Item
                    key={index}
                    label={`${option.label} (${option.value})`}
                    value={option.label}
                    style={{flex:1}}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>
        <View style={styles.comboBox}>
          {data && (
            <View style={[styles.pickerWrapper, selectedJobType === 'Date Posted' && styles.selectedCombo]}>
              <Picker
                selectedValue={selectedDatePosted}
                onValueChange={onDatePostedChange}
                
                style={{width: 160, height: 100}} itemStyle={{height: 100,fontSize:12}}>
                <Picker.Item label="Date Posted" value=""  />
                {postedDateOptions.map((option, index) => (
                  <Picker.Item
                    key={index}
                    label={`${option.label} (${option.value})`}
                    value={option.label}
                    style={{flex:1}}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>

        <View style={styles.comboBox}>
          {data && (
            <View style={[styles.pickerWrapper, selectedJobType === 'Employer/Staffing' && styles.selectedCombo]}>
              <Picker
                selectedValue={selectedPostedBy}
                onValueChange={onPostedByChange}
                style={{width: 160, height: 100}} itemStyle={{height: 100,fontSize:12}}>
              
                <Picker.Item label="Posted by" value="" style={styles.pickerItem} />
                {employerStaffingOptions.map((option, index) => (
                  <Picker.Item
                    key={index}
                    label={`${option.label} (${option.value})`}
                    value={option.label}
                    style={{flex:1}}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>

        <View style={styles.comboBox}>
          {data && (
            <View style={[styles.pickerWrapper, selectedJobType === 'Salary Range' && styles.selectedCombo]}>
              <Picker
                selectedValue={selectedSalary}
                onValueChange={onSalaryChange}
                style={{width: 160, height: 100}} itemStyle={{height: 100,fontSize:12}}>
              
                <Picker.Item label="Salary Range" value="" style={styles.pickerItem} />
                {salaryRangeOptions.map((option, index) => (
                  <Picker.Item
                    key={index}
                    label={`${option.label} (${option.value})`}
                    value={option.label}
                    style={{flex:1}}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>


      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: 80,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 2,
  },
 
  pickerWrapper: {
  
    borderRadius: 10, // Slightly rounded corners
    overflow: 'hidden',
    //borderWidth: 1,
   // borderColor: '#b896d9', // Adjusted to a lighter shade of the same color (#694fad)
  
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 1,
    marginLeft:12
  },
  
});


export default ComboBoxes;