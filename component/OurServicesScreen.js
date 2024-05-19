import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';

const OurServicesScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Image
        source={require('./images/our_services.jpeg')}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.section}>
        <Text style={styles.heading}>Our Services</Text>
        <Text style={styles.text}>
          At Hire Now, we offer a comprehensive range of services designed to streamline the hiring process for employers and empower job seekers to find their ideal careers. Our platform is built to cater to the diverse needs of businesses and professionals across various industries. Discover how our services can help you achieve your hiring or job search goals.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeading}>For Employers</Text>
        <Text style={styles.text}>
          1. Job Posting: Our user-friendly job posting tool allows you to create and publish job listings quickly and easily. Customize your job descriptions, requirements, and application settings to attract the most relevant candidates.
          {'\n'}2. Candidate Management: Our intuitive candidate management system helps you organize, review, and shortlist applications efficiently. Keep track of your top candidates, schedule interviews, and communicate seamlessly within our platform.
          {'\n'}3. Branded Company Pages: Showcase your company culture, values, and mission through personalized company pages. Attract top talent by highlighting your unique selling points and providing insight into what it's like to work at your organization.
          {'\n'}4. Targeted Job Promotion: Ensure your job listings reach the right audience with our targeted job promotion options. Leverage our partnerships with leading job boards and social media platforms to expand your reach and attract qualified candidates.
          {'\n'}5. Hiring Analytics: Gain valuable insights into your hiring process with our comprehensive analytics dashboard. Track key metrics such as application rates, time-to-hire, and candidate sources to optimize your recruitment strategies.
          {'\n'}6. Temp Staffing: Easily manage your temporary staffing needs with our temp staffing solutions. Access a pool of skilled temporary workers and streamline your staffing process to ensure business continuity and flexibility.
          {'\n'}7. AI & Virtual Workers: Leverage the power of artificial intelligence and virtual workers to enhance your workforce. Our AI-powered tools and virtual worker solutions help you automate repetitive tasks, improve efficiency, and reduce costs.
          {'\n'}8. Payroll Management: Simplify your payroll processes with our integrated payroll management services. Automate payroll calculations, tax deductions, and compliance, ensuring accurate and timely payments to your employees.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeading}>For Job Seekers</Text>
        <Text style={styles.text}>
          1. Job Search: Easily search and discover job opportunities that match your skills, experience, and preferences. Our advanced search filters and personalized recommendations help you find the most relevant job listings quickly.
          {'\n'}2. Professional Profiles: Create a compelling professional profile that showcases your skills, experience, and achievements. Stand out to potential employers and increase your chances of getting noticed.
          {'\n'}3. Application Management: Keep track of your job applications, view your application status, and communicate with employers directly through our platform. Stay organized and never miss an opportunity.
          {'\n'}4. Job Alerts: Stay informed about the latest job openings that match your criteria with our customizable job alerts. Receive notifications via email or SMS, so you can be among the first to apply.
          {'\n'}5. Career Resources: Access a wealth of career resources, including expert advice, industry insights, and interview tips. Enhance your job search skills and stay informed about the latest trends in your field.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeading}>Additional Services</Text>
        <Text style={styles.text}>
          1. AI Resume Builder by Hire Now, Revolutionize your job search with Hire Now's cutting-edge AI Resume Building service. Our advanced artificial intelligence technology analyses your skills, experience, and achievements to create a compelling, tailored resume that showcases your unique strengths and captures the attention of potential employers.
          {'\n'}2. Interview Coaching: Prepare for your job interviews with confidence through our interview coaching services. Our experienced coaches provide personalized guidance and feedback to help you ace your interviews and secure your desired role.
          {'\n'}3. Employer Branding: Enhance your employer brand and attract top talent with our specialized employer branding services. Our experts work closely with you to develop and implement strategies that position your company as an employer of choice.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>
          At Hire Now, we are committed to providing exceptional services that cater to the unique needs of employers and job seekers alike. Our team of experienced professionals is dedicated to ensuring your success, whether you're looking to build a strong team or take the next step in your career.
          {'\n'}Explore our services today and discover how Hire Now can help you achieve your hiring and job search goals efficiently and effectively. If you have any questions or require further assistance, please don't hesitate to contact our support team at team@hirenow.site.
        </Text>
      </View>
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
  section: {
    marginBottom: 20,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  subHeading: {
    fontWeight: 'bold',
    fontSize: 16,
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

export default OurServicesScreen;
