import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import SessionPlan from '../components/alpha_data.json';
import { useRouter } from 'expo-router';

type SessionItem = {
  'Course Name': string;
  Module: string;
  'Divided Content': string;
  // Add other properties from your JSON
}

const TeacherView = () => {
  const router = useRouter();
  const currentCourse = "Internet Programming";
  const filteredSessionPlan = SessionPlan.filter((session) => session['Course Name'] === currentCourse);

  const handleSessionClick = (session: SessionItem) => {
    router.push({
      pathname: '/components/MarkAttendance',
      params: {
        courseName: session['Course Name'],
        module: session.Module,
        dividedContent: session['Divided Content']
        // Add other needed properties
      }
    });
  };

  return (
    <View style={styles.container}>
      <FlatList 
        data={filteredSessionPlan}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity 
            style={styles.sessionItem} 
            onPress={() => handleSessionClick(item)}
          >
            <Text style={styles.courseName}>{item['Course Name']}</Text>
            <Text style={styles.module}>{item.Module}</Text>
            <Text style={styles.dividedContent}>{item['Divided Content']}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default TeacherView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9', // Light background color
  },
  sessionItem: {
    backgroundColor: '#fff', // White background for each session item
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Shadow for Android
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Dark color for course name
    marginBottom: 8,
  },
  module: {
    fontSize: 16,
    color: '#666', // Lighter color for module
    marginBottom: 6,
  },
  dividedContent: {
    fontSize: 14,
    color: '#444', // Medium dark color for divided content
  },
});
