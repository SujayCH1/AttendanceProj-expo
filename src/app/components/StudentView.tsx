import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../utils/supabase';

const StudentView = () => {
  const [currentUserID, setCurrentUserID] = useState(null);
  const router = useRouter();

  const fetchSessionData = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
        return null;
      }

      if (session) {
        const userID = session.user.id;
        console.log('userID:', userID);
        return userID;
      } else {
        console.log('No active session');
        return null;
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      return null;
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      const userID = await fetchSessionData();
      setCurrentUserID(userID);
    };
    initializeUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Student View</Text>

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

      {/* Button to navigate to Feedback Form */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/components/FeedBackForm')}
      >
        <Text style={styles.buttonText}>Feedback Form</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
