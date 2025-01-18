import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../utils/supabase';

const StudentMarkingAttendance = () => {
  const [activeSessions, setActiveSessions] = useState([]);

  const fetchActiveSessions = async () => {
    const { data, error } = await supabase
      .from('active_sessions')
      .select('*')
      .is('end_time', null); // Fetch only active sessions

    if (error) {
      console.error("Error fetching active sessions:", error);
      return [];
    }
    setActiveSessions(data);
  };

  useEffect(() => {
    fetchActiveSessions();
  }, []);

  const handleMarkAttendance = (sessionId) => {
    console.log("Attendance marked for session:", sessionId);
    Alert.alert("Attendance Marked", `You marked attendance for session ${sessionId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Active Attendance Sessions</Text>
      {activeSessions.length === 0 ? (
        <Text>No active sessions</Text>
      ) : (
        <FlatList
          data={activeSessions}
          keyExtractor={(item) => item.session_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleMarkAttendance(item.session_id)}
            >
              <Text style={styles.cardText}>{item.session_name}</Text>
              <Text>{`Branch: ${item.branch}, Sem: ${item.semester}, Div: ${item.division}`}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  card: { padding: 16, backgroundColor: '#FFF', marginBottom: 12, borderRadius: 8 },
  cardText: { fontSize: 16, fontWeight: 'bold' },
});

export default StudentMarkingAttendance;
