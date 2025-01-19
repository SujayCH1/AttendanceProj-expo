import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";

const ManualAttendance = () => {
  // Static data for present students (simulating data from an API/database)
  const staticPresentStudents = [
    { prn: "101", name: "John Doe" },
    { prn: "103", name: "Alice Johnson" },
    // PRN 101 and 103 are marked as present initially
  ];

  // Static data for all students in the class
  const staticAllStudents = [
    { prn: "101", name: "John Doe" },
    { prn: "102", name: "Jane Smith" },
    { prn: "103", name: "Alice Johnson" },
    { prn: "104", name: "Bob Wilson" },
    { prn: "105", name: "Emma Davis" },
  ];

  // State to maintain the attendance record
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    // Initialize attendance when component mounts
    // Compare staticAllStudents with staticPresentStudents to set initial status
    const initialAttendance = staticAllStudents.map(student => ({
      ...student,
      // If student is found in presentStudents array, mark as "Present", else "Absent"
      status: staticPresentStudents.some(present => present.prn === student.prn) 
        ? "Present" 
        : "Absent"
    }));
    setAttendance(initialAttendance);
  }, []); // Empty dependency array means this runs once when component mounts

  // Function to handle status change when buttons are pressed
  const handleStatusChange = (prn, status) => {
    setAttendance((prev) =>
      prev.map((student) =>
        // If this is the student we're updating, change their status
        student.prn === prn ? { ...student, status } : student
      )
    );
  };

  // Component to render each student row
  const renderItem = ({ item }) => (
    <View style={styles.studentRow}>
      <Text style={styles.studentName}>{item.name}</Text>
      <View style={styles.buttonGroup}>
        {/* Present button - highlighted green when selected */}
        <TouchableOpacity
          style={[
            styles.statusButton,
            item.status === "Present" && styles.presentButton,
          ]}
          onPress={() => handleStatusChange(item.prn, "Present")}
        >
          <Text style={styles.buttonText}>Present</Text>
        </TouchableOpacity>
        {/* Absent button - highlighted red when selected */}
        <TouchableOpacity
          style={[
            styles.statusButton,
            item.status === "Absent" && styles.absentButton,
          ]}
          onPress={() => handleStatusChange(item.prn, "Absent")}
        >
          <Text style={styles.buttonText}>Absent</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manual Attendance</Text>
      <FlatList
        data={attendance}
        keyExtractor={(item) => item.prn}
        renderItem={renderItem}
      />
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9", // Light background for the whole screen
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  studentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    // Shadow for card effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
  studentName: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  buttonGroup: {
    flexDirection: "row", // Arrange buttons horizontally
  },
  statusButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  presentButton: {
    backgroundColor: "#28a745", // Bootstrap-style green
    borderColor: "#28a745",
  },
  absentButton: {
    backgroundColor: "#dc3545", // Bootstrap-style red
    borderColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ManualAttendance;