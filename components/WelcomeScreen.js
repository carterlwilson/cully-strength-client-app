import * as React from 'react';
import { useEffect } from 'react';
import {Text, View, TextInput, StyleSheet, Alert, Button} from 'react-native';
import FirestoreStorage from '../libraries/FirestoreStorage';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen(props) {

    const [clientUsername, setClientUsername] = React.useState("")
    const [clientFirstName, setClientFirstName] = React.useState("")
    const [usernameEntry, changeUsernameEntry] = React.useState("")
    const [userNames, setUserNames] = React.useState([])
    const [clients, setClients] = React.useState([])
    const [emailSubmitError, setEmailSubmitError] = React.useState(false)

    useEffect(() => {
        async function fetchUsername() {
            let username = await AsyncStorage.getItem('email')
            console.log('username', username)
            if (username) setClientUsername(username)
        }
        fetchUsername()
        fetchClients()
    }, [])

    useEffect(() => {
        const names = []
        let fetchedClients = []
        async function fetchClients() {
            console.log('fetching clients')
            fetchedClients = await FirestoreStorage.getClients()
            setClients(fetchedClients)
            fetchedClients.forEach(client => {
                names.push(client.email?.toLowerCase())
            })
            setUserNames(names)

            if (clientUsername != "") {
                let clientUser = fetchedClients.find(client => {
                    return client.email?.toLowerCase() == clientUsername.toLowerCase()
                })
                setClientFirstName(clientUser?.firstName)
            }
        }
        fetchClients()
    }, [clientUsername])

    const fetchClients = async () => {
        let names = []
        console.log('fetching clients 2')
        let fetchedClients = await FirestoreStorage.getClients()
        setClients(fetchedClients)
        fetchedClients.forEach(client => {
            names.push(client.email?.toLowerCase())
        })
        setUserNames(names)
    }

    const submitUsername = async () => {
        await fetchClients()
        console.log('usernames', userNames)
        if (!userNames.includes(usernameEntry.toLowerCase())) {
            Alert.alert('Login Error', "We couldn't find your username, please double-check that it's the correct email or speak to your coach.", [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ]);
            setEmailSubmitError(true)
        }
        else {
            setClientUsername(usernameEntry)
            setEmailSubmitError(false)
            AsyncStorage.setItem('email', usernameEntry)
            changeUsernameEntry("")
        }
    }

    const switchUser = () => {
        setClientUsername("")
    }

    const goToDay = (dayNumber) => {
        let currentClient = clients.find(client => {
            return client.email?.toLowerCase() == clientUsername.toLowerCase()
        })
        props.navigation.navigate('DayView', {username: clientUsername, client: currentClient, dayNumber: dayNumber})
    }
    
    return(
        <View style={styles.screen}>
            {clientUsername != "" ? (
                <View>
                    <Text>Welcome back {clientFirstName}! Select which workout you're doing today.</Text>
                    <View style={styles.dayButton}>
                        <Button
                            color="#228B22"
                            title='Day 1'
                            onPress={() => goToDay(0)} />
                    </View>
                    <View style={styles.dayButton}>
                        <Button
                            color="#228B22"
                            title='Day 2'
                            onPress={() => goToDay(1)} />
                    </View>
                    <View style={styles.dayButton}>
                        <Button
                            color="#228B22"
                            title='Day 3' 
                            onPress={() => goToDay(2)}/>
                    </View>
                    <View style={styles.submitButton}>
                        <Button
                            color="#228B22"
                            title='Switch User'
                            onPress={switchUser}>
                            <Text style={styles.submitButton}>Switch User</Text>
                        </Button>
                    </View>
                </View>
            ) : (
                <View style={styles.dayButton}>
                    <Text>Welcome! Please enter your username. This should be the email you signed up for Cully Strength with.</Text>
                    <TextInput
                        onChangeText={changeUsernameEntry}
                        value={usernameEntry}
                        style={styles.input}/>
                    <Button 
                        title='Submit'
                        color="#228B22"
                        onPress={submitUsername}/>
                    {emailSubmitError == true ? (
                        <Text>We couldn't find your username, please double-check that it's the correct email or speak to your coach.</Text>
                    ) : (
                        <View></View>
                    )}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    dayButton: {
        marginTop: 10,
    },
    submitButton: {
        marginTop: 10,
        color: "#228B22"
    },
    screen: {
        margin: 10
    }
  });