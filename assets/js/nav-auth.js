import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { auth, firebaseReady } from "./firebase-client.js";

const authNavLink = document.getElementById("authNavLink");
const teamNavLink = document.getElementById("teamNavLink");

if (teamNavLink && !teamNavLink.getAttribute("href")) {
  teamNavLink.href = "team.html";
}

if (authNavLink && !firebaseReady) {
  authNavLink.textContent = "Login / Sign Up";
  authNavLink.href = "auth.html";
}

if (firebaseReady && authNavLink && auth) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      authNavLink.textContent = "Logout";
      authNavLink.href = "#";
      authNavLink.onclick = async (event) => {
        event.preventDefault();
        await signOut(auth);
        window.location.href = "index.html";
      };
      if (teamNavLink) teamNavLink.href = "team.html";
      return;
    }

    authNavLink.textContent = "Login / Sign Up";
    authNavLink.href = "auth.html";
    authNavLink.onclick = null;
    if (teamNavLink) teamNavLink.href = "auth.html?next=team.html";
  });
}
