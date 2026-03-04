const LINKS = {
  youtube: "https://youtube.com/@visynicofficial",
  instagram: "https://www.instagram.com/visynic?igsh=Nmk1cjVpOGZmMTVr",
  email: "visynicofficial@gmail.com"
};

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function openLink(url, newTab = true){
  if(url === "#"){
    alert("Replace this link in index.js first.");
    return;
  }
  if(newTab) window.open(url, "_blank");
  else window.location.href = url;
}

function scrollToSection(id){
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({behavior:"smooth"});
}

function copyEmail(){
  navigator.clipboard.writeText(LINKS.email);
  toast("Email copied.");
}

function toast(text){
  const el = document.getElementById("statusText");
  if (el) {
    el.textContent = text;
    setTimeout(() => {
      el.textContent = "";
    }, 2200);
  }
}

const viewWorkBtn = document.getElementById("viewWorkBtn");
const youtubeBtn = document.getElementById("youtubeBtn");
const instagramBtn = document.getElementById("instagramBtn");
const copyEmailBtn = document.getElementById("copyEmailBtn");

if (viewWorkBtn) viewWorkBtn.addEventListener("click", () => scrollToSection("projects"));
if (youtubeBtn) youtubeBtn.addEventListener("click", () => openLink(LINKS.youtube, true));
if (instagramBtn) instagramBtn.addEventListener("click", () => openLink(LINKS.instagram, true));
if (copyEmailBtn) copyEmailBtn.addEventListener("click", copyEmail);

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}
