import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import bleService from '../backend/bleSetup';
import { UserContext } from '../context/UserContext';
import { fetchStudentInfo } from '../api/useGetData';
import { useLocalSearchParams, useRouter } from 'expo-router';


const StudentMarkingAttendance = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const { user } = useContext(UserContext);
  const params = useLocalSearchParams();
  const router = useRouter();
  const facultyUUIDs = params.facultyUUIDS as string;
  const ble = bleService();

  useEffect(() => {
    const fetchData = async () => {
      if (user.userRole === 'student') {
        try {
          const info = await fetchStudentInfo();
          if (info) {
            const studentData = 'info' in info ? info.info : info;
            setStudentInfo(studentData);
            console.log('Student info loaded:', studentData);
          } else {
            throw new Error('No student info received');
          }
        } catch (error) {
          console.error('Failed to fetch student data:', error);
          Alert.alert(
            "Error",
            "Failed to load student information. Please try again.",
            [
              { 
                text: "Retry", 
                onPress: fetchData 
              },
              { 
                text: "Cancel",
                onPress: () => router.back(),
                style: "cancel"
              }
            ]
          );
        }
      }
    };

    fetchData();
  }, [user.userRole]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (isScanning) {
        ble.stopScanning();
        ble.cleanup();
      }
    };
  }, [isScanning]);

  const handleAttendance = async () => {
    try {
      if (!isScanning) {
        const hasPermissions = await ble.requestPermissions();
        if (!hasPermissions) {
          Alert.alert(
            "Permission Error",
            "Bluetooth permissions are required to mark attendance.",
            [{ text: "OK" }]
          );
          return;
        }

        if (!facultyUUIDs) {
          Alert.alert(
            "Error",
            "No faculty information available. Please try again later.",
            [{ text: "OK" }]
          );
          return;
        }

        ble.startScanning(facultyUUIDs);
        setIsScanning(true);
        Alert.alert(
          "Scanning Started",
          "Looking for nearby faculty devices...",
          [{ text: "OK" }]
        );
      } else {
        ble.stopScanning();
        setIsScanning(false);
        Alert.alert(
          "Scanning Stopped",
          "Attendance marking cancelled.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error('Error in attendance marking:', error);
      Alert.alert(
        "Error",
        "There was an error while marking attendance. Please try again.",
        [{ text: "OK" }]
      );
      setIsScanning(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Mark Attendance</Text>
        <Text style={styles.status}>
          Status: {isScanning ? 'Scanning...' : 'Ready'}
        </Text>
        
        <TouchableOpacity
          style={[styles.button, isScanning && styles.activeButton]}
          onPress={handleAttendance}
        >
          <Text style={styles.buttonText}>
            {isScanning ? 'Stop Scanning' : 'Mark Attendance'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  status: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StudentMarkingAttendance;