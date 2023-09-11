import AsyncStorage from '@react-native-async-storage/async-storage';

export class LocalStore {
    static _storeEmail = async (email) => {
        console.log('starting save')
        try {
          await AsyncStorage.setItem(
            'client_email',
            email,
          );
          console.log('saved name')
        } catch (error) {
          // Error saving data
        }
      };

    static _getEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('client_email');
            if (email !== null) {
            // We have data!!
            return email
            }
            else {
            return ""
            }
        } catch (error) {
            console.log(error)
            return ""
        }
    }
}