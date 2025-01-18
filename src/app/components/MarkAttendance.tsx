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
  subjectId: string;
  semester: string;
  branch: string;
  division: string;
  batch: string;
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
      console.log("Student detected:", data);
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

  const startSessionInDB = async () => {
    const { data, error } = await supabase.from('active_sessions').insert({
      faculty_id: params.uuid,
      subject_id: params.subjectId,
      branch: params.branch,
      semester: params.semester,
      division: params.division,
      batch: params.batch,
      session_name: `${params.courseName} (${params.branch} - ${params.semester} - ${params.division})`
    });

    if (error) throw new Error(error.message);
    return data[0].session_id;
  };

  const handleMarkAttendance = async () => {
    try {
      if (!isSessionActive) {
        const hasPermissions = await ble.requestPermissions();
        if (!hasPermissions) {
          Alert.alert("Permission Error", "Bluetooth permissions required.");
          return;
        }

        const sessionId = await startSessionInDB();
        console.log("Started session:", sessionId);

        await ble.startAdvertising(params.uuid);
        setIsSessionActive(true);
        Alert.alert("Session Started", "Students can now mark attendance.");
      } else {
        await ble.stopAdvertising();
        setIsSessionActive(false);
        Alert.alert("Session Ended", "Attendance session has been stopped.");
      }
    } catch (error) {
      console.error('Error during session:', error);
      Alert.alert("Error", "Failed to manage the attendance session.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{params.courseName}</Text>
        <Text>{`Branch: ${params.branch} | Sem: ${params.semester} | Div: ${params.division}`}</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, isSessionActive && styles.activeButton]}
        onPress={handleMarkAttendance}
      >
        <Text style={styles.buttonText}>
          {isSessionActive ? 'Stop Session' : 'Start Session'}
        </Text>
      </TouchableOpacity>
      <View>
        <Text>{`Marked Students: ${markedStudents.length}`}</Text>
        {markedStudents.map((student, index) => (
          <Text key={index}>{student}</Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { marginBottom: 16 },
  headerText: { fontSize: 18, fontWeight: 'bold' },
  button: { padding: 16, backgroundColor: '#007AFF', borderRadius: 8 },
  activeButton: { backgroundColor: '#FF3B30' },
  buttonText: { color: '#FFF', textAlign: 'center' },
});

export default MarkAttendance;
