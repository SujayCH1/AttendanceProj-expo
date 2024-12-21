import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import SessionPlan from '../components/alpha_data.json';

const TeacherView = () => {
  const currentCourse = "Internet Programming";
  const filteredSessionPlan = SessionPlan.filter((session) => session['Course Name'] == currentCourse);

  return (
    <View style={styles.container}>
      <FlatList 
        data={filteredSessionPlan}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.sessionItem}>
            <Text style={styles.courseName}>{item['Course Name']}</Text>
            <Text style={styles.module}>{item.Module}</Text>
            <Text style={styles.dividedContent}>{item['Divided Content']}</Text>
          </View>
        )}
      />
    </View>
  );
}

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
