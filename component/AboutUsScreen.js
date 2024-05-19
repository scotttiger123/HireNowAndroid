import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';

const AboutUsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Image
        source={require('./images/about_us.jpeg')}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.section}>
        <Text style={styles.heading}>About Hire Now</Text>
        <Text style={styles.text}>
          At Hire Now, we are passionate about connecting talented professionals with exciting job opportunities and helping businesses find the perfect candidates to join their teams. Our mission is to revolutionize the hiring process by providing a user-friendly, efficient, and effective platform cutting edge AI technology that streamlines job posting, staff hiring, and job search.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.heading}>Who We Are</Text>
        <Text style={styles.text}>
          Hire Now was founded by a team of experienced professionals who recognized the need for a more intuitive and accessible hiring solution. With a combined experience of over two decades in the recruitment industry, our founders set out to create a platform that would bridge the gap between employers and job seekers, making the hiring process more transparent, cost-effective, and time efficient. Our team consists of dedicated individuals who are committed to delivering exceptional service and support to our users. We value innovation, integrity, and collaboration, and we strive to create a positive impact on the lives of both job seekers and employers.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>What We Offer</Text>
        <Text style={styles.text}>
          For Employers:
          {'\n'}{'\u2022'} Easy job posting and candidate management tools
          {'\n'}{'\u2022'} Access to a wide pool of qualified candidates
          {'\n'}{'\u2022'} Customizable hiring solutions to suit your specific needs
          {'\n'}{'\u2022'} Time and cost savings compared to traditional recruitment methods
          {'\n'}{'\u2022'} Dedicated support from our experienced team
          {'\n'}
          {'\n'}For Job Seekers:
          {'\n'}{'\u2022'} A user-friendly platform to search and apply for jobs
          {'\n'}{'\u2022'} A wide range of job opportunities across various industries
          {'\n'}{'\u2022'} Personalized job recommendations based on your skills and preferences
          {'\n'}{'\u2022'} Tools to create and manage your professional profile
          {'\n'}{'\u2022'} Alerts and notifications for new job openings that match your criteria
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Our Platform</Text>
        <Text style={styles.text}>
          Hire Now's platform is designed with simplicity and functionality in mind. We have created an intuitive interface that allows employers to post jobs, manage applications, and communicate with candidates effortlessly. Job seekers can create profiles, upload resumes, and apply for jobs with just a few clicks. Our advanced search algorithms ensure that employers can find the most relevant candidates for their job openings, while job seekers can discover opportunities that align with their skills and career goals. We continuously update and improve our platform based on user feedback and the latest industry trends to provide the best possible experience for our users.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Our Commitment</Text>
        <Text style={styles.text}>
          At Hire Now, we are committed to:
          {'\n'}{'\u2022'} Providing a safe, secure, and private environment for our users
          {'\n'}{'\u2022'} Delivering exceptional customer service and support
          {'\n'}{'\u2022'} Continuously innovating and improving our platform
          {'\n'}{'\u2022'} Promoting diversity, equality, and inclusivity in the hiring process
          {'\n'}{'\u2022'} Building long-lasting relationships with our users based on trust and transparency
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>
          Join the Hire Now Community
          {'\n'}Whether you're an employer looking to build a strong team or a job seeker searching for your next career opportunity, Hire Now is here to support you every step of the way. Join our growing community today and experience the future of hiring.
          {'\n'}If you have any questions or feedback, please don't hesitate to reach out to us at info@hirenow.site. We'd love to hear from you!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
});

export default AboutUsScreen;
