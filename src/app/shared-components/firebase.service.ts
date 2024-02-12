import { Injectable } from "@angular/core";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { environment } from "src/environments/environment";
import { getAuth, signInWithCustomToken, Auth, UserCredential } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor() {

  }

  async conexionFirebase(userId: string, token: string, diaSesion: string | null, horaSesion: string | null, tokenFirebase: string) {
    try {
      const app = initializeApp(environment.firebaseConfig);
      const analytics = getAnalytics(app);

      const auth: Auth = getAuth(app);
      signInWithCustomToken(auth, tokenFirebase)
        .then((userCredential: UserCredential) => {
          // El usuario se ha autenticado con éxito usando el token personalizado
          console.log('Usuario autenticado:', userCredential.user);
           // Autenticación exitosa, ahora puedes realizar operaciones en la base de datos
      const uid = userCredential.user.uid;

      if (uid) {
        const database = getDatabase();
        const databaseRef = ref(database, `/users/${uid}`);

        // Escribe datos en la base de datos
         set(databaseRef, {
          username: userId,
          token: token,
          diaSesion: diaSesion,
          horaSesion: horaSesion
          
        });
      }
        })
        .catch((error) => {
          console.error('Error al autenticar al usuario con el token personalizado:', error);
        });

    } catch (error) {
      console.log(error);
    }
  }


}
