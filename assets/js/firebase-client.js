import { getApp, getApps, initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAgdTBS-i3f4MRCt4KVScDmUXCHnmpSG80",
  authDomain: "visynic-website.firebaseapp.com",
  projectId: "visynic-website",
  storageBucket: "visynic-website.firebasestorage.app",
  messagingSenderId: "823989929650",
  appId: "1:823989929650:web:00f1be9b05ff03dfe7abab"
};

function hasFirebaseConfig(config) {
  return Object.values(config).every((value) => value && !String(value).includes("YOUR_"));
}

export const firebaseReady = hasFirebaseConfig(firebaseConfig);

let app = null;
let auth = null;
let db = null;

if (firebaseReady) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };

export function randomMemberId() {
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  const stamp = Date.now().toString(36).slice(-4).toUpperCase();
  return `VY-${stamp}-${random}`;
}

export async function saveMemberProfile(user, fullName) {
  if (!firebaseReady || !db || !user) return null;
  const userRef = doc(db, "users", user.uid);
  const existing = await getDoc(userRef);

  const base = {
    uid: user.uid,
    email: user.email || "",
    fullName: fullName || user.displayName || "",
    updatedAt: serverTimestamp()
  };

  if (!existing.exists()) {
    await setDoc(userRef, {
      ...base,
      memberId: randomMemberId(),
      role: "member",
      createdAt: serverTimestamp()
    });
  } else {
    await setDoc(userRef, base, { merge: true });
  }

  const latest = await getDoc(userRef);
  return latest.exists() ? latest.data() : null;
}
