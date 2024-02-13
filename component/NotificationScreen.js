import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

// Dummy data for notifications
const notifications = [
  { id: 1, message: 'Your application for Software Engineer has been submitted.' },
  { id: 2, message: 'New message from Tech Solutions Inc.: Please schedule an interview.' },
  { id: 3, message: 'Reminder: Your interview for UX/UI Designer is tomorrow at 10 AM.' },
  { id: 4, message: 'New job alert: Data Analyst position available at Data Insights Co.' },
  { id: 5, message: 'Congratulations! You have been selected for the Financial Analyst position.' },
];

const NotificationScreen = () => {

  // Render each notification item
  const renderNotificationItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.message}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  item: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  message: {
    fontSize: 16,
    color: '#000',
  },
});

export default NotificationScreen;
