import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { auth, db, firebaseReady } from "./firebase-client.js";

function waitForUser() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => resolve(user), () => resolve(null));
  });
}

async function sha256(input) {
  const value = String(input || "").trim();
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function sessionKey(uid) {
  return `visynic_team_pin_ok_${uid}`;
}

export async function ensureTeamAccess(nextPath) {
  if (!firebaseReady || !auth || !db) {
    return { ok: false, reason: "service-unavailable" };
  }

  const user = await waitForUser();
  if (!user) {
    window.location.href = `auth.html?next=${encodeURIComponent(nextPath)}`;
    return { ok: false, reason: "not-authenticated" };
  }

  const profileSnap = await getDoc(doc(db, "users", user.uid));
  const profile = profileSnap.exists() ? profileSnap.data() : null;
  const approved = Boolean(profile?.teamApproved);

  if (!approved) {
    return { ok: false, reason: "not-approved", user, profile };
  }

  const pinVerified = sessionStorage.getItem(sessionKey(user.uid)) === "ok";
  if (pinVerified) {
    return { ok: true, user, profile };
  }

  return {
    ok: false,
    reason: "pin-required",
    user,
    profile,
    verifyPin: async (inputPin) => {
      const pinHash = profile?.teamPinHash || "";
      if (!pinHash) return false;
      const inputHash = await sha256(inputPin);
      const valid = inputHash === pinHash;
      if (valid) {
        sessionStorage.setItem(sessionKey(user.uid), "ok");
      }
      return valid;
    }
  };
}

export async function hashPin(pin) {
  return sha256(pin);
}
