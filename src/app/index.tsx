import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Login from './components/Login';
import { UserProvider } from './context/UserContext';
import { createStackNavigator } from '@react-navigation/stack'; // Corrected import
import { NavigationContainer } from '@react-navigation/native'; // Corrected import
import StudentView from './components/StudentView';
import TeacherView from './components/TeacherView';

const Stack = createStackNavigator(); // Corrected function

const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="StudentView" component={StudentView} />
          <Stack.Screen name="TeacherView" component={TeacherView} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
