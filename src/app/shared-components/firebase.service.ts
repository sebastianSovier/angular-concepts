import { Injectable } from "@angular/core";
import { initializeApp } from "firebase/app";
import { getDatabase,ref,set } from "firebase/database";
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor() {
    const app = initializeApp(this.firebaseConfig);
   }
    firebaseConfig = {
    apiKey: "AIzaSyABrwv9e5QQ24VuyuAyB6jN8HVXCQS0d64",
    authDomain: "proyecto-angular-12.firebaseapp.com",
    databaseURL: "https://proyecto-angular-12-default-rtdb.firebaseio.com",
    projectId: "proyecto-angular-12",
    storageBucket: "proyecto-angular-12.appspot.com",
    messagingSenderId: "422106423872",
    appId: "1:422106423872:web:c8168a9f5718540252f5a5",
    measurementId: "G-PH7EDM00T4"
  };


conexionFirebase(userId: string,token: string,diaSesion: string | null,horaSesion:string | null){
  
  // Initialize Firebase
  
  const db = getDatabase();
  const reference = ref(db,'users/'+userId)

  set(reference,{
    username:userId,
    token:token,
    diaSesion:diaSesion,
    horaSesion:horaSesion
  });

}

}
