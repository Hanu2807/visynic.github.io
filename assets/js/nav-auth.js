import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { auth, db, firebaseReady } from "./firebase-client.js";

const authNavLink = document.getElementById("authNavLink");
const teamNavLink = document.getElementById("teamNavLink");
const productionNavLink = document.getElementById("productionNavLink");
const adminNavLink = document.getElementById("adminNavLink");
const homeProductionAccessWrap = document.getElementById("homeProductionAccessWrap");
const homeProductionAccessBtn = document.getElementById("homeProductionAccessBtn");
const nav = document.querySelector("nav");
const navInner = nav?.querySelector(".nav-inner") || null;
const navLinks = nav?.querySelector(".nav-links") || null;
const OWNER_EMAILS = ["visynicofficial@gmail.com", "himanshusharmaaofficial@gmail.com"];

let activeUser = null;

function setHomeAccessVisibility(isVisible) {
  if (!homeProductionAccessWrap) return;
  homeProductionAccessWrap.classList.toggle("show", isVisible);
}

function ensureHref(anchor, href) {
  if (anchor && !anchor.getAttribute("href")) {
    anchor.href = href;
  }
}

function injectNavEnhancementStyles() {
  if (document.getElementById("visynicNavEnhancements")) return;
  const style = document.createElement("style");
  style.id = "visynicNavEnhancements";
  style.textContent = `
    .menu-btn { display: none !important; }
    .nav-actions { display: inline-flex; align-items: center; gap: 8px; margin-left: 8px; position: relative; }
    .menu-btn-dyn, .profile-btn-dyn {
      display: none;
      padding: 9px 12px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(255,255,255,0.05);
      color: inherit;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
    }
    .profile-btn-dyn.show { display: inline-flex; }
    .profile-popup {
      position: absolute;
      top: 48px;
      right: 0;
      width: min(260px, 92vw);
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(7,10,18,0.97);
      backdrop-filter: blur(8px);
      box-shadow: 0 12px 28px rgba(0,0,0,0.45);
      padding: 10px;
      display: none;
      z-index: 120;
    }
    .profile-popup.show { display: grid; gap: 8px; }
    .profile-head { border-bottom: 1px solid rgba(255,255,255,0.10); padding-bottom: 8px; margin-bottom: 4px; }
    .profile-name { font-weight: 800; line-height: 1.2; color: #e8ecff; }
    .profile-email { font-size: 12px; color: #a7b0d6; word-break: break-all; margin-top: 2px; }
    .profile-item {
      text-align: left;
      width: 100%;
      padding: 10px 11px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(255,255,255,0.04);
      color: #e8ecff;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      display: block;
    }
    .profile-item:hover { background: rgba(255,255,255,0.08); }
    .profile-item.logout { background: rgba(255,92,92,0.18); border-color: rgba(255,92,92,0.35); }
    .nav-links.nav-menu-open { display: flex !important; }
    @media (max-width: 900px) {
      .menu-btn-dyn { display: inline-flex; }
      .nav-links {
        display: none !important;
        flex-direction: column;
        align-items: flex-start;
        position: absolute;
        top: 60px;
        right: 4vw;
        background: rgba(7,10,18,0.95);
        border: 1px solid rgba(255,255,255,0.10);
        border-radius: 18px;
        padding: 10px;
        width: min(260px, 92vw);
        z-index: 110;
      }
      .nav-links.nav-menu-open { display: flex !important; }
      .nav-links a { width: 100%; }
    }
  `;
  document.head.appendChild(style);
}

function closeNavPopups() {
  if (navLinks) {
    navLinks.classList.remove("nav-menu-open");
    navLinks.classList.remove("show");
  }
  const profilePopup = document.getElementById("profilePopupDynamic");
  if (profilePopup) profilePopup.classList.remove("show");
}

function openOrCloseMenu() {
  if (!navLinks) return;
  const willOpen = !navLinks.classList.contains("nav-menu-open") && !navLinks.classList.contains("show");
  closeNavPopups();
  if (willOpen) {
    navLinks.classList.add("nav-menu-open");
  }
}

function openOrCloseProfilePopup() {
  const profilePopup = document.getElementById("profilePopupDynamic");
  if (!profilePopup) return;
  const willOpen = !profilePopup.classList.contains("show");
  closeNavPopups();
  if (willOpen) {
    profilePopup.classList.add("show");
  }
}

function ensureDynamicButtons() {
  if (!navInner) return {};
  injectNavEnhancementStyles();

  let actions = navInner.querySelector(".nav-actions");
  if (!actions) {
    actions = document.createElement("div");
    actions.className = "nav-actions";
    navInner.appendChild(actions);
  }

  let menuBtn = document.getElementById("menuBtnDynamic");
  if (!menuBtn) {
    menuBtn = document.createElement("button");
    menuBtn.type = "button";
    menuBtn.id = "menuBtnDynamic";
    menuBtn.className = "menu-btn-dyn";
    menuBtn.textContent = "Menu";
    actions.appendChild(menuBtn);
  }

  let profileBtn = document.getElementById("profileBtnDynamic");
  if (!profileBtn) {
    profileBtn = document.createElement("button");
    profileBtn.type = "button";
    profileBtn.id = "profileBtnDynamic";
    profileBtn.className = "profile-btn-dyn";
    profileBtn.textContent = "Profile";
    actions.appendChild(profileBtn);
  }

  let profilePopup = document.getElementById("profilePopupDynamic");
  if (!profilePopup) {
    profilePopup = document.createElement("div");
    profilePopup.id = "profilePopupDynamic";
    profilePopup.className = "profile-popup";
    actions.appendChild(profilePopup);
  }

  menuBtn.onclick = openOrCloseMenu;
  profileBtn.onclick = openOrCloseProfilePopup;
  navLinks?.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest("a")) {
      closeNavPopups();
    }
  });

  document.addEventListener("click", (event) => {
    if (!nav) return;
    if (nav.contains(event.target)) return;
    closeNavPopups();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeNavPopups();
    }
  });

  return { profileBtn, profilePopup };
}

function updateProfilePopup(user, isVisible) {
  const controls = ensureDynamicButtons();
  const profileBtn = controls.profileBtn;
  const profilePopup = controls.profilePopup;
  if (!profileBtn || !profilePopup) return;

  profileBtn.classList.toggle("show", Boolean(isVisible));
  if (!isVisible || !user) {
    profilePopup.classList.remove("show");
    profilePopup.innerHTML = "";
    return;
  }

  const displayName = user.displayName || user.email?.split("@")[0] || "Team Member";
  profilePopup.innerHTML = `
    <div class="profile-head">
      <div class="profile-name">${displayName}</div>
      <div class="profile-email">${user.email || ""}</div>
    </div>
    <a class="profile-item" href="member.html?uid=${encodeURIComponent(user.uid)}">Edit details</a>
    <a class="profile-item" href="contact.html">Contact</a>
    <button class="profile-item logout" id="profileLogoutBtn" type="button">Log out</button>
  `;

  const logoutBtn = profilePopup.querySelector("#profileLogoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await signOut(auth);
      window.location.href = "index.html";
    });
  }
}

function setBaseLinksForGuest() {
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
  if (authNavLink) {
    authNavLink.textContent = "Login";
    authNavLink.href = "auth.html";
    authNavLink.onclick = null;
    authNavLink.style.display = "";
  }
}

if (homeProductionAccessBtn) {
  ensureHref(homeProductionAccessBtn, "production-access.html");
}
ensureHref(teamNavLink, "team.html");
ensureHref(productionNavLink, "work.html");
ensureHref(adminNavLink, "admin.html");
ensureDynamicButtons();

if (!firebaseReady || !auth) {
  setBaseLinksForGuest();
  if (authNavLink) {
    authNavLink.textContent = "Login";
    authNavLink.href = "auth.html";
  }
  setHomeAccessVisibility(false);
  updateProfilePopup(null, false);
} else {
  onAuthStateChanged(auth, async (user) => {
    activeUser = user;
    const contactLink = navLinks?.querySelector('a[href="contact.html"]') || null;

    if (user) {
      if (authNavLink) {
        authNavLink.textContent = "Signed in";
        authNavLink.href = "auth.html";
        authNavLink.style.display = "none";
      }
      if (contactLink) {
        contactLink.style.display = "none";
      }
      setHomeAccessVisibility(true);
      updateProfilePopup(user, true);

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

    if (contactLink) {
      contactLink.style.display = "";
    }
    setBaseLinksForGuest();
    setHomeAccessVisibility(false);
    updateProfilePopup(null, false);
    closeNavPopups();
  });
}
