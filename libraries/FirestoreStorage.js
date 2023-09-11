import db from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore"; 

export default class FirestoreStorage {
    static async getClients() {
        const clients = []
        const querySnapshot = await getDocs(collection(db, "ClientsV2"));
        querySnapshot.forEach((doc) => {
            clients.push(doc.data())
        })
        return clients
    }

    static async getSchedules() {
        const schedules = []
        const querySnapshot = await getDocs(collection(db, "Schedules"));
        querySnapshot.forEach((doc) => {
            schedules.push(doc.data())
        })
        return schedules
    }

    static async getCurrentIterations() {
        const querySnapshot = await getDocs(collection(db, "CurrentIterations"));
        return querySnapshot.docs[0].data()
    }
}

