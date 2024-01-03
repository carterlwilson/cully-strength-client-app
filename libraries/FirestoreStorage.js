import db from "../firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore"; 

export default class FirestoreStorage {
    static async getClients() {
        const clients = []
        const querySnapshot = await getDocs(collection(db, "ClientsV2"));
        querySnapshot.forEach((doc) => {
            let newClient = doc.data()
            newClient.id = doc.id
            clients.push(newClient)
        })
        return clients
    }

    static async getClent(id) {
        const docRef = doc(db, "ClientsV2", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return docSnap.data()
        } else {
            console.log("No such document!")
        }
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

