import React from 'react';
import { View, Image, Text, StyleSheet, ScrollView } from 'react-native';

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('./images/privacy_policy.jpg')}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.text}>
        <Text style={styles.heading}>Privacy Policy</Text>
        {"\n\n"}
        At Hire Now, we are committed to protecting the privacy and personal information of our users. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you use our website, https://hirenow.site/, and our job posting, staff hiring, and job search services. By accessing or using our platform, you consent to the practices described in this policy.
        {"\n\n"}
        <Text style={styles.heading}>1. Information We Collect</Text>
        {"\na. Personal Information:"} When you create an account, post a job, or apply for a job through Hire Now, we may collect personal information such as your name, email address, phone number, resume, and other relevant details. 
        {"\nb. Usage Data:"} We may automatically collect certain information about your interaction with our platform, including your IP address, browser type, referring/exit pages, and operating system. 
        {"\nc. Cookies:"} We use cookies and similar tracking technologies to enhance your experience and gather information about your usage patterns on our site.
        {"\n\n"}
        <Text style={styles.heading}>2. Use of Information</Text>
        {"\na. "} We use the collected information to provide and improve our services, personalize your experience, and communicate with you about relevant job opportunities, hiring updates, and platform enhancements. 
        {"\nb. "} We may use your contact information to send you newsletters, promotional materials, and other marketing communications. You can opt-out of these communications at any time.
        {"\n\n"}
        <Text style={styles.heading}>3. Sharing of Information</Text>
        {"\na. "} We may share your personal information with potential employers or job seekers when you apply for a job or post a job listing on our platform. 
        {"\nb. "} We may disclose your information to third-party service providers who assist us in operating our platform, conducting our business, or servicing you, subject to confidentiality obligations. 
        {"\nc. "} We may share your information if required by law, court order, or government regulation, or if we believe that such action is necessary to protect our rights, property, or safety, or that of our users or the public.
        {"\n\n"}
        <Text style={styles.heading}>4. Data Security</Text>
        {"\n"} We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
        {"\n\n"}
        <Text style={styles.heading}>5. Third-Party Links</Text>
        {"\n"} Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices or content of those websites. We encourage you to review the privacy policies of any third-party sites you visit.
        {"\n\n"}
        <Text style={styles.heading}>6. Children's Privacy</Text>
        {"\n"} Our services are not intended for use by individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that a child under 16 has provided us with personal information, we will take steps to delete such information.
        {"\n\n"}
        <Text style={styles.heading}>7. Your Rights and Choices</Text>
        {"\na. "} You have the right to access, update, or delete your personal information. You can do this by logging into your account or contacting us directly. 
        {"\nb. "} You can control the use of cookies through your browser settings or by opting out of certain tracking technologies. 
        {"\nc. "} If you are a resident of the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR), such as the right to data portability and the right to restrict processing.
        {"\n\n"}
        <Text style={styles.heading}>8. Changes to This Privacy Policy</Text>
        {"\n"} We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. Your continued use of our platform after any modifications will constitute your acceptance of the updated policy.
        {"\n\n"}
        <Text style={styles.heading}>9. Contact Us</Text>
        {"\n"} If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at privacy@hirenow.site.
        {"\n\n"}
        By using Hire Now, you acknowledge that you have read, understood, and agree to the terms outlined in this Privacy Policy.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
});

export default PrivacyPolicyScreen;
