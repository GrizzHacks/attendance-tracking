import * as firebase from "firebase/app";
import "firebase/firestore";

const firebaseApp = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID
});

const firestore = firebaseApp.firestore();

export async function checkin({
  hackathon,
  event,
  id
}: {
  hackathon: string;
  event: string;
  id: string;
}): Promise<boolean> {
  const collection = firestore.collection(`Hackathons/${hackathon}/${event}`);
  const document = collection.doc(id).set({ id, date: new Date() });
  return await document
    .then(() => {
      return true;
    })
    .catch(error => {
      console.log(error);
      return false;
    });
}
