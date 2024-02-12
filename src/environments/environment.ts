// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  secretKey:"a-very-long-radonmly-generated-secret-key-that-cannot-be-guessed",
  UrlWebApi: "http://localhost:3000",
  encrypt:false,
  firebaseConfig : {
    apiKey: "AIzaSyABrwv9e5QQ24VuyuAyB6jN8HVXCQS0d64",
    authDomain: "proyecto-angular-12.firebaseapp.com",
    databaseURL: "https://proyecto-angular-12-default-rtdb.firebaseio.com",
    projectId: "proyecto-angular-12",
    storageBucket: "proyecto-angular-12.appspot.com",
    messagingSenderId: "422106423872",
    appId: "1:422106423872:web:c8168a9f5718540252f5a5",
    measurementId: "G-PH7EDM00T4"
  },
  token:"J1tPD5Bq5RmX7OpdRo4OjeMLYVpv6XfI6uRu0DHl"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
