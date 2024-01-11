import * as React from 'react';
import { useEffect } from 'react';
import {Text, View, TextInput, StyleSheet, Alert, Button} from 'react-native';
import FirestoreStorage from '../libraries/FirestoreStorage';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-web';

export default function WelcomeScreen(props) {

    const [clientUsername, setClientUsername] = React.useState("")
    const [clientFirstName, setClientFirstName] = React.useState("")
    const [usernameEntry, changeUsernameEntry] = React.useState("")
    const [userNames, setUserNames] = React.useState([])
    const [clients, setClients] = React.useState([])
    const [emailSubmitError, setEmailSubmitError] = React.useState(false)
    const [clientId, setClientId] = React.useState("")

    useEffect(() => {
        async function fetchUsername() {
            let username = await AsyncStorage.getItem('email')
            console.log('username', username)
            if (username) setClientUsername(username)
        }
        async function fetchUserid() {
            let id = await AsyncStorage.getItem('id')
            console.log('id', id)
            if (id) setClientId(id)
        }
        async function fetchUserFirstName() {
            let name = await AsyncStorage.getItem('firstName')
            console.log('name', name)
            if (name) setClientFirstName(name)
        }
        fetchUsername()
        fetchUserid()
        fetchUserFirstName()
    }, [])

    const fetchClients = async () => {
        let names = []
        let fetchedClients = await FirestoreStorage.getClients()
        setClients(fetchedClients)
        fetchedClients.forEach(client => {
            names.push(client.email?.toLowerCase())
        })
        return fetchedClients
    }

    const submitUsername = async () => {
        let fetchedClients = await fetchClients()
        let clientUsernames = []
        fetchedClients.forEach(client => {
            clientUsernames.push(client.email?.toLowerCase())
        })
        if (!clientUsernames.includes(usernameEntry.toLowerCase())) {
            Alert.alert('Login Error', "We couldn't find your username, please double-check that it's the correct email or speak to your coach.", [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ]);
            setEmailSubmitError(true)
        }
        else {

            let client = fetchedClients.find(c => c.email?.toLowerCase() === usernameEntry.toLowerCase())
            AsyncStorage.setItem('email', usernameEntry)
            AsyncStorage.setItem('firstName', client.firstName)
            setClientFirstName(client.firstName)
            AsyncStorage.setItem('id', client.id)
            setClientUsername(usernameEntry)
            setClientId(client.id)
            setEmailSubmitError(false)
            changeUsernameEntry("")
        }
    }

    const switchUser = () => {
        setClientUsername("")
    }

    const goToDay = async (dayNumber) => {
        let client = await FirestoreStorage.getClent(clientId)
        props.navigation.navigate('DayView', {username: clientUsername, client: client, dayNumber: dayNumber})
    }
    
    return(
        <View style={styles.screen}>
            {(clientUsername != "" && clientId != "") ? (
                <View>
                    <Text style={styles.welcomeScreenText}>Welcome back {clientFirstName}! Select which workout you're doing today.</Text>
                    <View style={{marginBottom: 10}}>
                        <TouchableOpacity
                            style={styles.dayButton}
                            onPress={() => goToDay(0)}>
                            <Text style={styles.dayButtonText}>DAY 1</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginBottom: 10}}>
                        <TouchableOpacity
                            style={styles.dayButton}
                            onPress={() => goToDay(1)}>
                            <Text style={styles.dayButtonText}>DAY 2</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginBottom: 10}}>
                        <TouchableOpacity
                            style={styles.dayButton}
                            onPress={() => goToDay(2)}>
                            <Text style={styles.dayButtonText}>DAY 3</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.submitButton}>
                        <TouchableOpacity
                            style={styles.dayButton}
                            onPress={switchUser}>
                            <Text style={styles.dayButtonText}>SWITCH USER</Text>
                        </TouchableOpacity>
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
        backgroundColor: "#228B22",
        alignItems: 'center',
        padding: 2,
    },
    dayButtonText: {
        fontSize: 20,
        color: 'white',
    },
    submitButton: {
        marginTop: 10,
        color: "#228B22"
    },
    screen: {
        margin: 10
    },
    welcomeScreenText: {
        fontSize: 20,
        marginBottom: 20
    }
  });