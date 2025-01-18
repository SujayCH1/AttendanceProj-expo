import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { fetchStudentInfo, getActiveSessionsForStudent } from '../api/useGetData';
import { UserContext } from '../context/UserContext';

const StudentView = () => {
  const router = useRouter();
  const [studentInfo, setStudentInfo] = useState(null);
  const [activeSessions, setActiveSessions] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
        const info = await fetchStudentInfo();
        if (info) {
          console.log('Fecthed student info sucessfully')
          setStudentInfo(info || null);
        } else {
          console.log('failed to fetch student info')
        }
    };
    fetchData();
  }, [user, fetchStudentInfo]);

  useEffect(() => {
    const pollActiveSessions = setInterval(async () => {
      if (studentInfo) {
        const sessions = await getActiveSessionsForStudent(studentInfo);
        setActiveSessions(sessions || []);
      }
    }, 5000);

    return () => clearInterval(pollActiveSessions);
  }, [studentInfo]);

  const handleSessionClick = (session) => {
    router.push({
      pathname: '/components/StudentMarkingAttendance',
      params: {
        sessionId: session.session_id,
        facultyId: session.faculty_id,
        subjectName: session.subject.subject_name,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Active Sessions</Text>
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

export default StudentView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  noSessions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
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
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sessionDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
