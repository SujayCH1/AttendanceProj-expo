import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchStudentInfo, getActiveSessionsForStudent } from '../api/useGetData';
import { UserContext } from '../context/UserContext';

const StudentView = () => {
  const router = useRouter();
  const [studentInfo, setStudentInfo] = useState(null);
  const [activeSessions, setActiveSessions] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      const info = await fetchStudentInfo();
      setStudentInfo(info || null);
    };
    fetchData();
  }, [user]);

  const fetchActiveSessions = useCallback(async () => {
    if (studentInfo) {
      const sessions = await getActiveSessionsForStudent(studentInfo);
      setActiveSessions(sessions || []);
    }
  }, [studentInfo]);

  useEffect(() => {
    fetchActiveSessions();
  }, [fetchActiveSessions]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchActiveSessions();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSessionClick = (session) => {
    console.log("Pushing Data ", "faculty id: ", session.faculty_user_id, "subject id: ", session.subject_id)
    router.push({
      pathname: '/components/StudentMarkingAttendance',
      params: {
        sessionId: session.session_id,
        facultyUuid: session.faculty_user_id, 
        subjectName: session.subject.subject_name,
        subjectID: session.subject_id
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Active Attendance Sessions</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.refreshButtonText}>Refresh</Text>
          )}
        </TouchableOpacity>
      </View>

      {activeSessions.length === 0 ? (
        <Text style={styles.noSessions}>No active attendance sessions</Text>
      ) : (
        <FlatList
          data={activeSessions}
          keyExtractor={(item) => item.session_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.sessionCard}
              onPress={() => handleSessionClick(item)}
            >
              <Text style={styles.subjectName}>{item.subject.subject_name}</Text>
              <Text style={styles.sessionDetails}>
                {`Started at: ${new Date(item.start_time).toLocaleTimeString()}`}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: { fontSize: 24, fontWeight: 'bold' },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    opacity: 1,
  },
  refreshButtonText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  noSessions: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 20 },
  sessionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subjectName: { fontSize: 18, fontWeight: 'bold' },
  sessionDetails: { fontSize: 14, color: '#666', marginTop: 4 },
});

export default StudentView;
