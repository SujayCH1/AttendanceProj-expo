import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  NativeEventEmitter,
  NativeModules 
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import bleService from '../backend/bleSetup';
import { supabase } from '../utils/supabase';

type RouteParams = {
  uuid: string;
  courseName: string;
  module: string;
  dividedContent: string;
  sem_id: string;
};

const MarkAttendance = () => {
  const params = useLocalSearchParams<RouteParams>();
  const router = useRouter();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [markedStudents, setMarkedStudents] = useState([]);
  const ble = bleService();

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.BLEAdvertiser);
    const foundUuidListener = eventEmitter.addListener("foundUuid", (data) => {
      console.log("Student marked attendance:", data);
      setMarkedStudents(prev => [...prev, data]);
    });

    return () => {
      foundUuidListener.remove();
      if (isSessionActive) {
        ble.stopAdvertising();
        ble.cleanup();
      }
    };
  }, [isSessionActive]);

  const handleConfirmAttendance = async () => {
    try {
      const attendanceData = {
        sem_id: params.sem_id,
        date: new Date().toISOString(),
        students: markedStudents
      };
      
      const { data, error } = await supabase
        .from('attendance_table')
        .insert([attendanceData]);

      if (error) throw error;

      Alert.alert("Success", "Attendance recorded successfully");
      router.back();
    } catch (error) {
      console.error('Error recording attendance:', error);
      Alert.alert("Error", "Failed to record attendance");
    }
  };

  const handleMarkAttendance = async () => {
    try {
      if (!isSessionActive) {
        const hasPermissions = await ble.requestPermissions();
        if (!hasPermissions) {
          Alert.alert(
            "Permission Error",
            "Required Bluetooth permissions were not granted.",
            [{ text: "OK" }]
          );
          return;
        }

        await ble.startAdvertising(params.uuid);
        setIsSessionActive(true);
        Alert.alert(
          "Session Started",
          "Students can now mark their attendance.",
          [{ text: "OK" }]
        );
      } else {
        await ble.stopAdvertising();
        setIsSessionActive(false);
        Alert.alert(
          "Session Ended",
          "Attendance marking session has ended.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error('Error in attendance session:', error);
      Alert.alert(
        "Error",
        "There was an error managing the attendance session. Please try again.",
        [{ text: "OK" }]
      );
      setIsSessionActive(false);
    }
  };

  const handleBackPress = () => {
    if (isSessionActive) {
      Alert.alert(
        "Active Session",
        "You have an active attendance session. Do you want to end it and go back?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "End Session & Go Back",
            style: "destructive",
            onPress: async () => {
              try {
                await ble.stopAdvertising();
                ble.cleanup();
                router.back();
              } catch (error) {
                console.error('Error cleaning up:', error);
              }
            }
          }
        ]
      );
    } else {
      Alert.alert(
        "Confirm Navigation",
        "Are you sure you want to go back?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Go Back",
            onPress: () => router.back()
          }
        ]
      );
    }
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
          <Text style={styles.sectionTitle}>Attendance Session</Text>
          <Text style={styles.sessionStatus}>
            Status: {isSessionActive ? 'Active' : 'Inactive'}
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.button, isSessionActive && styles.stopButton]} 
          onPress={handleMarkAttendance}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {isSessionActive ? 'Stop Session' : 'Start Session'}
          </Text>
        </TouchableOpacity>

        {markedStudents.length > 0 && (
          <TouchableOpacity 
            style={[styles.button, styles.confirmButton]} 
            onPress={handleConfirmAttendance}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              Confirm Attendance ({markedStudents.length} students)
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

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
  sessionStatus: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
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
  stopButton: {
    backgroundColor: '#FF3B30',
  },
  confirmButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MarkAttendance;