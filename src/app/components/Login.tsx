import { Button, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useRouter } from 'expo-router';

const Login = ({ navigation }: { navigation: any }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const User = useContext(UserContext);
    const router = useRouter()

    if (!User) {
        return <Text>User context not found</Text>;
    }

    const { user, setUser } = User;

    const HandleEmailChange = (newEmail: string) => {
        setEmail(newEmail);
        setUser(prevUser => ({
            ...prevUser,
            userEmail: newEmail
        }));
    };

    const HandlePasswordChange = (newPassword: string) => {
        setPassword(newPassword);
        setUser(prevUser => ({
            ...prevUser,
            userPassword: newPassword
        }));
    };

    const handleLogin = () => {
        if (user.userRole === "student") {
            router.push({
                pathname:'/components/StudentView'
            });
        } else if (user.userRole === "faculty") {
            router.push({
                pathname:'/components/TeacherView'
            });
        } else {
            Alert.alert('Error', 'Invalid role. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={HandleEmailChange}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={HandlePasswordChange}
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 16,
        borderRadius: 4,
    },
});
