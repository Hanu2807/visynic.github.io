# Firebase Setup for VISYNIC Auth + Team Workspace

## 1) Add Firebase web config
Update `assets/js/firebase-client.js`:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Use the values from Firebase Console -> Project settings -> General -> Your apps -> Web app config.

## 2) Enable Authentication providers
Open Firebase Console -> Authentication -> Sign-in method and enable:
1. `Email/Password`
2. `Google`

For Google provider:
1. Set support email.
2. Save.

## 3) Authorize your website domain
Open Authentication -> Settings -> Authorized domains:
1. Add your production domain (example: `visynic.com`).
2. Add local domain if needed (example: `localhost`).

Google sign-in popup fails if the domain is not authorized.

## 4) Create Firestore and apply rules
Open Firestore Database and create database in production mode, then set rules:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /teamItems/{itemId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }
  }
}
```

## 5) Deploy and test
1. Open `auth.html`.
2. Test sign up with email/password.
3. Test sign in with Google (`Continue with Google` button).
4. Open `team.html` and confirm add/view team items.
