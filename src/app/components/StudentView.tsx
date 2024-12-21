import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const StudentView = () => {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Student View</Text> */}

      {/* Details Container */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Teacher Name: </Text>Mr. John Doe
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Subject: </Text>Mathematics
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Semester: </Text>5
        </Text>
      </View>
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
  detailsContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    marginVertical: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
});
