import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import bleService from '../backend/bleSetup';

const StudentMarkingAttendance = () => {
  const [isPressed, setIsPressed] = useState(false);

  const {
    requestPermission,
    checking,
  } = bleService();

  // Function to handle button press
  const handlePress = () => {
    requestPermission
    // checking(uuid);
    setIsPressed(!isPressed); // Toggle the button color
  };

  return (
    <View style={styles.container}>
      <Button
        title={isPressed ?"Stop Attendance"  : "Mark Attendance"}
        color={isPressed ? 'red' : undefined} // Change color to red when pressed
        onPress={handlePress}
      />
    </View>
  );
};

export default StudentMarkingAttendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});