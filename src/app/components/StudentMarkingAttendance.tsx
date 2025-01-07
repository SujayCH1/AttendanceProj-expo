import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';

const StudentMarkingAttendance = () => {
  const [isPressed, setIsPressed] = useState(false);

  // Function to handle button press
  const handlePress = () => {
    setIsPressed(!isPressed); // Toggle the button color
  };

  return (
    <View style={styles.container}>
      <Button
        title="Mark Attendance"
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