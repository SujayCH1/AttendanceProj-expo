import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../utils/supabase';
import { fetchStudentInfo } from '../api/useGetData';
import { UUIDContext } from '../context/uuidContext';
import { UserContext } from '../context/UserContext';

const StudentView = () => {
  const [currentUserID, setCurrentUserID] = useState(null);
  const {UUID, setUUID} = useContext(UUIDContext);
  const {user, setUser} = useContext(UserContext);
  const router = useRouter();
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    // Run this effect only when user is logged in and has the role of 'student'
    console.log('UUID: ', UUID);
    console.log('user: ', {user});
    if (user.userRole === "student" && user.status === "loggedIn") {
      const fetchInfo = async () => {
        const info = await fetchStudentInfo(UUID);
        if (info) {
          setStudentInfo(info);
          console.log('Student Info assigned');
        } else {
          console.error('Student info assignment failed');
        }
      };
      fetchInfo();
    }
  }, [UUID, user]); 

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Student View</Text>

      {/* Details Container */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Teacher Name: </Text>Mr. John Doe
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Subject: </Text>Mathematics
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Semester: </Text>5
        </Text>
      </View>

      {/* Button to navigate to Feedback Form */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/components/FeedBackForm')}
      >
        <Text style={styles.buttonText}>Feedback Form</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StudentView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});