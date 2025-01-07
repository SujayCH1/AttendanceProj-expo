import React, { useContext, useEffect, useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import bleService from '../backend/bleSetup';
import { UserContext } from '../context/UserContext';
import { fetchStudentInfo } from '../api/useGetData';
import { useLocalSearchParams} from 'expo-router';


const StudentMarkingAttendance = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const { user, setUser } = useContext(UserContext)
  const params = useLocalSearchParams()
  const FUUID = params.facultyUUIDS

  useEffect(() => {
    const fetchDataAsync = async () => {
      if (user.userRole === 'student') {
        try {
          const info = await fetchStudentInfo();
          if (info) {
            const studentData = 'info' in info ? info.info : info;
            setStudentInfo(studentData);
            console.log('student state in Marking attendnace: ', studentData);
          } else {
            console.log('no student info');
          }
        } catch (error) {
          console.error('student data fetching failed:', error);
        }
      }
    };
    fetchDataAsync();
  }, [fetchStudentInfo]);



  const {
    requestPermission,
    checking,
    stopScan
  } = bleService();

  // Function to handle button press
  const handlePress = () => {
    requestPermission
    if (isPressed) {
      console.log("Scanned Stopped");
      stopScan
      setIsPressed(!isPressed)
    }
    else {
      console.log("Scan started");

      checking("22222222-2222-2222-2222-222222222222");
      setIsPressed(!isPressed)
    }

  };

  return (
    <View style={styles.container}>
      <Button
        title={isPressed ? "Stop Attendance" : "Mark Attendance"}
        color={isPressed ? 'red' : undefined} // Change color to red when pressed
        onPress={handlePress}
      />
    </View>
  );
};

export default StudentMarkingAttendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});