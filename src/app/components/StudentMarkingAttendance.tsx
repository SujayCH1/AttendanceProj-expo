import React, { useContext, useEffect, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import bleService from '../backend/bleSetup';
import { UserContext } from '../context/UserContext';
import { fetchStudentInfo } from '../api/useGetData';

const StudentMarkingAttendance = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const {user, setUser} = useContext(UserContext)

  useEffect(() => {
      const fetchDataAsync = async () => {
        if(user.userRole === 'student') {
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
  } = bleService();

  // Function to handle button press
  const handlePress = () => {
    requestPermission
    // checking(uuid);
    setIsPressed(!isPressed); // Toggle the button color
  };

  return (
    <View style={styles.container}>
      <Button
        title={isPressed ?"Stop Attendance"  : "Mark Attendance"}
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