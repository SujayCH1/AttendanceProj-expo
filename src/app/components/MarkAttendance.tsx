import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import bleService from '../backend/bleSetup';

type RouteParams = {
  courseName: string;
  module: string;
  dividedContent: string;
}


const MarkAttendance = () => {
  const params = useLocalSearchParams<RouteParams>();
  const router = useRouter();

  const {
    requestPermission,
    advertise
  } = bleService()

  const handleMarkAttendance = async() => {
    const isPermissionsEnabled = await requestPermission();
    if (isPermissionsEnabled) {
      console.log("Checking Started");
      advertise()
    }
    
    console.log("Marking attendance...");
  };



  const handleBackPress = () => {
    Alert.alert(
      "Confirm Navigation",
      "Are you sure you want to go back? Any unsaved changes will be lost.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes, go back",
          onPress: () => router.back()
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.courseName}>{params.courseName}</Text>
        <Text style={styles.module}>Module: {params.module}</Text>
        <Text style={styles.dividedContent}>Content: {params.dividedContent}</Text>
        
        <View style={styles.attendanceSection}>
          <Text style={styles.sectionTitle}>Attendance Details</Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleMarkAttendance}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Start Session</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default MarkAttendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  cardContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  courseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  module: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  dividedContent: {
    fontSize: 14,
    color: '#444',
    marginBottom: 16,
  },
  attendanceSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});