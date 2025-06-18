const menLink = document.getElementById("men-link");
const dropdown = document.getElementById("men-dropdown");
const nav = document.getElementById("nav-bkg");

menLink.addEventListener("mouseenter", () => {
  dropdown.classList.add("show");
  nav.style.backgroundColor = "#e9e9e9";
});

menLink.addEventListener("mouseleave", () => {
  dropdown.classList.remove("show");
  nav.style.backgroundColor = "transparent";
});

dropdown.addEventListener("mouseleave", () => {
  dropdown.classList.remove("show");
});

dropdown.addEventListener("mouseenter", () => {
  dropdown.classList.add("show");
});

const womenLink = document.getElementById("women-link");
const womendropdown = document.getElementById("women-dropdown");
const wnav = document.getElementById("nav-bkg");

womenLink.addEventListener("mouseenter", () => {
  womendropdown.classList.add("show");
  nav.style.backgroundColor = "#e9e9e9";
});

womenLink.addEventListener("mouseleave", () => {
  womendropdown.classList.remove("show");
  nav.style.backgroundColor = "transparent";
});

womendropdown.addEventListener("mouseenter", () => {
    womendropdown.classList.add("show");
});

womendropdown.addEventListener("mouseleave", () => {
  womendropdown.classList.remove("show");
});


const impactLink = document.getElementById("impact-link");
const impactdropdown = document.getElementById("impact-dropdown");
const inav = document.getElementById("nav-bkg");

impactLink.addEventListener("mouseenter", () => {
  impactdropdown.classList.add("show");
  nav.style.backgroundColor = "#e9e9e9";
});

impactLink.addEventListener("mouseleave", () => {
  impactdropdown.classList.remove("show");
  nav.style.backgroundColor = "transparent";
});

impactdropdown.addEventListener("mouseleave", () => {
  impactdropdown.classList.remove("show");
});

impactdropdown.addEventListener("mouseenter", () => {
  impactdropdown.classList.add("show");
});

const storiesLink = document.getElementById("stories-link");
const storiesdropdown = document.getElementById("stories-dropdown");
const snav = document.getElementById("nav-bkg");

storiesLink.addEventListener("mouseenter", () => {
  storiesdropdown.classList.add("show");
  nav.style.backgroundColor = "#e9e9e9";
});

storiesLink.addEventListener("mouseleave", () => {
  storiesdropdown.classList.remove("show");
  nav.style.backgroundColor = "transparent";
});

storiesdropdown.addEventListener("mouseleave", () => {
  storiesdropdown.classList.remove("show");
});

storiesdropdown.addEventListener("mouseenter", () => {
  storiesdropdown.classList.add("show");
});

const livedLink = document.getElementById("lived-link");
const liveddropdown = document.getElementById("lived-dropdown");
const lnav = document.getElementById("nav-bkg");

livedLink.addEventListener("mouseenter", () => {
  liveddropdown.classList.add("show");
  lnav.style.backgroundColor = "#e9e9e9";
});

livedLink.addEventListener("mouseleave", () => {
  liveddropdown.classList.remove("show");
  lnav.style.backgroundColor = "transparent";
});

liveddropdown.addEventListener("mouseleave", () => {
  liveddropdown.classList.remove("show");
});

liveddropdown.addEventListener("mouseenter", () => {
  liveddropdown.classList.add("show");
});


