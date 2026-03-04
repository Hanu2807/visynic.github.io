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
  storageBucket: "visynic-website.firebasestorage.app",
  messagingSenderId: "823989929650",
  appId: "1:823989929650:web:00f1be9b05ff03dfe7abab"
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
Use the `firestore.rules` file from this project root.

If you use Firebase CLI:
1. `firebase login`
2. `firebase use <your-project-id>`
3. `firebase deploy --only firestore:rules`

Or copy-paste `firestore.rules` into Firebase Console -> Firestore -> Rules and publish.

## 6) Use the new pages
1. Open `auth.html`, sign in, submit access request.
2. Open `admin.html` with owner email to approve/reject and issue PIN.
3. Approved users can open `work.html`/`team.html` and unlock with PIN.
4. `contact.html` stores new inquiries in `contactMessages`.
