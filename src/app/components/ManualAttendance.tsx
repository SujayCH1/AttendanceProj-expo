// types.ts
export interface StudentInfo {
  prn: string;
  name: string;
  semester: string;
  branch: string;
  division: string;
  batch: string;
  user_id: string;
  dlo: string;
}

export interface PresentStudentsData {
  student_user_id_array: string[];
}

export interface AttendanceRecord extends StudentInfo {
  status: 'Present' | 'Absent';
}
type RouteParams = {
  facultyId: string;
  uuid: string;
  courseName: string;
  subjectId: string;
  semester: string;
  branch: string;
  division: string;
  batch: string;
};
// ManualAttendance.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getPresentStudentsFromDB, getAllStudentsFromDB, fetchSemId } from '../api/useGetData'
import { useLocalSearchParams } from 'expo-router';


interface ManualAttendanceProps {
  facultyId: string;
  
}


const ManualAttendance: React.FC<ManualAttendanceProps> = ({ facultyId }) => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [semId, setSemId] = useState<string | null>(null);
  const params = useLocalSearchParams<RouteParams>();
    console.log("Faculty Id :",params.facultyId);
    

    useEffect(() => {
      // Create an async function to fetch the semId
      const getSemId = async () => {
        console.log("Params :",params);
        
        try {
          const id = await fetchSemId(params); // Assuming fetchSemId takes facultyId as parameter
          console.log("ID from manual :",id);
          
          setSemId(id);
          
          // Only initialize attendance after we have the semId
          if (id) {
            await initializeAttendance(id);
          }
        } catch (err) {
          setError('Failed to fetch semester ID');0
          console.error('Error fetching semId:', err);
        }
      };
    
      // Separate the attendance initialization logic
      const initializeAttendance = async (currentSemId: string) => {
        try {
          setLoading(true);
          // Fetch all students and present students
          const [allStudents, presentData] = await Promise.all([
            getAllStudentsFromDB(currentSemId, facultyId) as Promise<StudentInfo[]>,
            getPresentStudentsFromDB(facultyId) as Promise<PresentStudentsData[]>
          ]);
    
          // Extract the array of present student IDs
          const presentStudentIds = presentData?.[0]?.student_user_id_array || [];
    
          // Map all students to include their attendance status
          const initialAttendance = allStudents?.map(student => ({
            ...student,
            status: presentStudentIds.includes(student.user_id) ? 'Present' : 'Absent'
          })) || [];
    
          setAttendance(initialAttendance);
        } catch (err) {
          setError('Failed to load attendance data');
          console.error('Error loading attendance:', err);
        } finally {
          setLoading(false);
        }
      };
    
      // Call the function to fetch semId
      getSemId();
    }, [facultyId]); 

  const handleStatusChange = (userId: string, status: 'Present' | 'Absent'): void => {
    setAttendance((prev) =>
      prev.map((student) =>
        student.user_id === userId ? { ...student, status } : student
      )
    );
  };

  const renderItem = ({ item }: { item: AttendanceRecord }) => (
    <View style={styles.studentRow}>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentPrn}>PRN: {item.prn}</Text>
      </View>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.statusButton,
            item.status === 'Present' && styles.presentButton,
          ]}
          onPress={() => handleStatusChange(item.user_id, 'Present')}
        >
          <Text style={styles.buttonText}>Present</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.statusButton,
            item.status === 'Absent' && styles.absentButton,
          ]}
          onPress={() => handleStatusChange(item.user_id, 'Absent')}
        >
          <Text style={styles.buttonText}>Absent</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading attendance data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manual Attendance</Text>
      {attendance.length === 0 ? (
        <Text style={styles.message}>No students found</Text>
      ) : (
        <FlatList<AttendanceRecord>
          data={attendance}
          keyExtractor={(item) => item.user_id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
  },
  studentPrn: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  statusButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  presentButton: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  absentButton: {
    backgroundColor: '#dc3545',
    borderColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  errorMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#dc3545',
  },
});

export default ManualAttendance;