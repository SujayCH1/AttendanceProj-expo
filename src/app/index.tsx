import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Login from './components/Login'
import { UserProvider } from './context/UserContext'

const index = () => {
    return (
        <UserProvider>
                <Login />
        </UserProvider>
    )
}

export default index

const styles = StyleSheet.create({})