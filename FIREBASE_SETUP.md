# Firebase Setup for VISYNIC Team Page

## 1) Create Firebase project
1. Go to `https://console.firebase.google.com/`
2. Create a new project (or use existing).
3. Add a Web App in Project Settings.
4. Copy web config keys.

## 2) Update config in website
Edit `assets/js/firebase-client.js` and replace:

```js
const firebaseConfig = {
  apiKey: "AIzaSyAgdTBS-i3f4MRCt4KVScDmUXCHnmpSG80",
  authDomain: "visynic-website.firebaseapp.com",
  projectId: "visynic-website",
  storageBucket: "visynic-website.firebasestorage.app",S
  messagingSenderId: "823989929650",
  appId: "Y1:823989929650:web:00f1be9b05ff03dfe7abab"
};
```

## 3) Enable authentication
1. Open Firebase Console -> Authentication -> Sign-in method.
2. Enable `Email/Password`.

## 4) Create Firestore database
1. Open Firebase Console -> Firestore Database.
2. Create database in production mode.
3. Pick a region close to your users.

## 5) Add Firestore security rules
Use these rules in Firestore Rules:

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

These rules allow signed-in members to read team items and create new ones.

## 6) Use the new pages
1. Open `auth.html` and create team member accounts.
2. Open `team.html` to add/view production tasks.
3. Navbar links in all pages include `Production Team` and `Login / Sign Up`.
