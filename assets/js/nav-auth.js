import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { auth, db, firebaseReady } from "./firebase-client.js";

const authNavLink = document.getElementById("authNavLink");
const teamNavLink = document.getElementById("teamNavLink");
const productionNavLink = document.getElementById("productionNavLink");
const adminNavLink = document.getElementById("adminNavLink");
const OWNER_EMAILS = ["visynicofficial@gmail.com", "himanshusharmaaofficial@gmail.com"];

if (teamNavLink) {
  teamNavLink.style.display = "none";
  if (!teamNavLink.getAttribute("href")) {
    teamNavLink.href = "team.html";
  }
}

if (productionNavLink) {
  productionNavLink.style.display = "none";
  if (!productionNavLink.getAttribute("href")) {
    productionNavLink.href = "work.html";
  }
}

if (adminNavLink) {
  adminNavLink.style.display = "none";
  if (!adminNavLink.getAttribute("href")) {
    adminNavLink.href = "admin.html";
  }
}

if (authNavLink && !firebaseReady) {
  authNavLink.textContent = "Login / Sign Up";
  authNavLink.href = "auth.html";
}

if (firebaseReady && authNavLink && auth) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      authNavLink.textContent = "Logout";
      authNavLink.href = "#";
      authNavLink.onclick = async (event) => {
        event.preventDefault();
        await signOut(auth);
        window.location.href = "index.html";
      };

      let approved = false;
      if (db) {
        const snap = await getDoc(doc(db, "users", user.uid));
        approved = Boolean(snap.exists() && snap.data()?.teamApproved);
      }

      if (productionNavLink) {
        productionNavLink.href = "work.html";
        productionNavLink.style.display = approved ? "" : "none";
      }

      if (teamNavLink) {
        teamNavLink.href = "team.html";
        teamNavLink.style.display = approved ? "" : "none";
      }
      if (adminNavLink) {
        const isOwner = OWNER_EMAILS.includes((user.email || "").toLowerCase());
        adminNavLink.href = "admin.html";
        adminNavLink.style.display = isOwner ? "" : "none";
      }
      return;
    }

    authNavLink.textContent = "Login / Sign Up";
    authNavLink.href = "auth.html";
    authNavLink.onclick = null;
    if (productionNavLink) {
      productionNavLink.href = "auth.html?next=work.html";
      productionNavLink.style.display = "none";
    }
    if (teamNavLink) {
      teamNavLink.href = "auth.html?next=team.html";
      teamNavLink.style.display = "none";
    }
    if (adminNavLink) {
      adminNavLink.href = "auth.html?next=admin.html";
      adminNavLink.style.display = "none";
    }
  });
}
