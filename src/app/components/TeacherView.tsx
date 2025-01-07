import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import SessionPlan from '../components/alpha_data.json';
import { useRouter } from 'expo-router';
import { UserContext } from '../context/UserContext';
import { fetchFacultyInfo } from '../api/useGetData';

type SessionItem = {
  'Course Name': string;
  Module: string;
  'Divided Content': string;
  // Add other properties 
}


const TeacherView = () => {
  const router = useRouter();
  const currentCourse = "Internet Programming";
  const filteredSessionPlan = SessionPlan.filter((session) => session['Course Name'] === currentCourse);
  const {user, setUser} = useContext(UserContext)
  const [facultyInfo, setFacultyInfo] = useState(null)

  useEffect(() => {
      const fetchDataAsync = async () => {
        if(user.userRole === 'faculty') {
          try {
            const info = await fetchFacultyInfo();
            if (info) {
              const studentData = 'info' in info ? info.info : info;
              setFacultyInfo(studentData);
              console.log('faculty state: ', studentData);
            } else {
              console.log('no faculty info');
            }
          } catch (error) {
            console.error('faculty  data fetching failed:', error);
          }
        }
      };
      fetchDataAsync();
    }, [fetchFacultyInfo]);

<<<<<<< HEAD
  const handleSessionClick = (session: SessionItem) => {
    router.push({
      pathname: '/components/MarkAttendance',
      params: {
        courseName: session['Course Name'],
        module: session.Module,
        dividedContent: session['Divided Content'],
=======
    const handleSessionClick = (session: SessionItem) => {
      if (facultyInfo) {
        router.push({
          pathname: '/components/MarkAttendance',
          params: {
            uuid: facultyInfo["user_id"], // Pass the uuid from facultyInfo
            courseName: session['Course Name'],
            module: session.Module,
            dividedContent: session['Divided Content'],
          },
        });
      } else {
        console.warn('UUID not found in facultyInfo');
>>>>>>> 517539855666034ca3b9f9665fe434d102141e02
      }
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
