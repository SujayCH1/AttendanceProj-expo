import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import bleService from '../backend/bleSetup';
import { useLocalSearchParams } from 'expo-router';

const StudentMarkingAttendance = () => {
  const [isScanning, setIsScanning] = useState(false);
  const params = useLocalSearchParams();
  const ble = bleService();

  const handleAttendance = async () => {
    try {
      if (!isScanning) {
        const hasPermissions = await ble.requestPermissions();
        if (!hasPermissions) {
          Alert.alert("Permission Error", "Bluetooth permissions required");
          return;
        }
        ble.startScanning(params.facultyId);
        setIsScanning(true);
      } else {
        ble.stopScanning();
        setIsScanning(false);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert("Error", "Failed to mark attendance");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Attendance</Text>
      <Text style={styles.subjectName}>{params.subjectName}</Text>
      <TouchableOpacity
        style={[styles.button, isScanning && styles.activeButton]}
        onPress={handleAttendance}
      >
        <Text style={styles.buttonText}>
          {isScanning ? 'Cancel' : 'Mark Attendance'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default StudentMarkingAttendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subjectName: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
