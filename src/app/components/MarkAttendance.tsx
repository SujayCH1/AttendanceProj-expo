import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  NativeEventEmitter, 
  NativeModules,
  ActivityIndicator 
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import bleService from '../backend/bleSetup';
import { supabase } from '../utils/supabase';

type RouteParams = {
  uuid: string;
  courseName: string;
  subjectId: string;
  semester: string;
  branch: string;
  division: string;
  batch: string;
};

type Student = {
  uuid: string;
  timestamp: string;
};

const MarkAttendance = () => {
  const params = useLocalSearchParams<RouteParams>();
  const router = useRouter();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [markedStudents, setMarkedStudents] = useState<Student[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const ble = bleService();

  const handleBleError = useCallback((error: Error) => {
    console.error('BLE Error:', error);
    Alert.alert(
      "Bluetooth Error",
      "There was an issue with the Bluetooth connection. Please ensure Bluetooth is enabled and try again."
    );
    setIsSessionActive(false);
    ble.stopAdvertising();
  }, []);

  useEffect(() => {
    if (!params.uuid) {
      console.error('No UUID provided');
      Alert.alert("Error", "Invalid session parameters");
      router.back();
      return;
    }

    const eventEmitter = new NativeEventEmitter(NativeModules.BLEAdvertiser);
    const foundUuidListener = eventEmitter.addListener("foundUuid", (data) => {
      if (data) {
        console.log("Student detected:", data);
        setMarkedStudents(prev => {
          // Prevent duplicate entries
          if (prev.some(student => student.uuid === data)) {
            return prev;
          }
          return [...prev, { uuid: data, timestamp: new Date().toISOString() }];
        });
      }
    });

    return () => {
      foundUuidListener.remove();
      if (isSessionActive) {
        endSession();
      }
    };
  }, [params.uuid, isSessionActive]);

  const startSessionInDB = async () => {
    try {
      const { data, error } = await supabase.from('active_sessions').insert({
        faculty_id: params.uuid,
        subject_id: params.subjectId,
        branch: params.branch,
        semester: params.semester,
        division: params.division,
        batch: params.batch,
        session_name: `${params.courseName} (${params.branch} - ${params.semester} - ${params.division})`
      }).select();

      if (error) throw new Error(error.message);
      if (!data || data.length === 0) throw new Error('No session data returned');

      setCurrentSessionId(data[0].session_id);
      return data[0].session_id;
    } catch (error) {
      console.error('Error creating session:', error);
      throw new Error('Failed to create session in database');
    }
  };

  const endSession = async () => {
    try {
      if (currentSessionId) {
        await supabase.from('active_sessions')
          .update({ end_time: new Date().toISOString() })
          .eq('session_id', currentSessionId);

        // Save attendance records
        if (markedStudents.length > 0) {
          await supabase.from('attendance_table').insert({
            session_id: currentSessionId,
            date: new Date().toISOString(),
            students: markedStudents.map(student => student.uuid)
          });
        }
      }
      ble.stopAdvertising();
      ble.cleanup();
    } catch (error) {
      console.error('Error ending session:', error);
      Alert.alert("Error", "Failed to save attendance data");
    }
  };

  const handleMarkAttendance = async () => {
    try {
      setIsLoading(true);
      
      if (!isSessionActive) {
        const hasPermissions = await ble.requestPermissions();
        if (!hasPermissions) {
          Alert.alert("Permission Error", "Bluetooth permissions required.");
          return;
        }

        const sessionId = await startSessionInDB();
        if (!sessionId) {
          throw new Error('Failed to create session');
        }

        await ble.startAdvertising(params.uuid);
        setIsSessionActive(true);
        Alert.alert("Session Started", "Students can now mark attendance.");
      } else {
        await endSession();
        setIsSessionActive(false);
        Alert.alert(
          "Session Ended", 
          `Attendance marked for ${markedStudents.length} students.`
        );
      }
    } catch (error) {
      console.error('Error during session:', error);
      Alert.alert("Error", "Failed to manage the attendance session.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!params.uuid) {
    return (
      <View style={styles.container}>
        <Text>Invalid session parameters</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{params.courseName}</Text>
        <Text style={styles.subHeader}>
          {`Branch: ${params.branch} | Sem: ${params.semester} | Div: ${params.division}`}
        </Text>
      </View>
      
      <TouchableOpacity
        style={[
          styles.button, 
          isSessionActive && styles.activeButton,
          isLoading && styles.disabledButton
        ]}
        onPress={handleMarkAttendance}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>
            {isSessionActive ? 'Stop Session' : 'Start Session'}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.studentsContainer}>
        <Text style={styles.studentsHeader}>
          {`Marked Students: ${markedStudents.length}`}
        </Text>
        {markedStudents.map((student, index) => (
          <View key={student.uuid} style={styles.studentRow}>
            <Text style={styles.studentText}>
              {`${index + 1}. ${student.uuid}`}
            </Text>
            <Text style={styles.timestampText}>
              {new Date(student.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  header: { 
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  headerText: { 
    fontSize: 20, 
    fontWeight: 'bold',
    marginBottom: 8
  },
  subHeader: {
    fontSize: 14,
    color: '#666'
  },
  button: { 
    padding: 16, 
    backgroundColor: '#007AFF', 
    borderRadius: 8,
    elevation: 2
  },
  activeButton: { 
    backgroundColor: '#FF3B30' 
  },
  disabledButton: {
    opacity: 0.7
  },
  buttonText: { 
    color: '#FFF', 
    textAlign: 'center',
    fontWeight: 'bold'
  },
  studentsContainer: {
    marginTop: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2
  },
  studentsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  studentText: {
    flex: 1,
    fontSize: 14
  },
  timestampText: {
    fontSize: 12,
    color: '#666'
  }
});

export default MarkAttendance;