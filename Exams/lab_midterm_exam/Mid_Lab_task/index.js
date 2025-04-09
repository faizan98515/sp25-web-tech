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

const previousLink = document.getElementById("previous-tasks-link");
const previousdropdown = document.getElementById("previous-tasks-dropdown");
const pnav = document.getElementById("nav-bkg");

previousLink.addEventListener("click", () => {
  previousdropdown.classList.add("show");
  pnav.style.backgroundColor = "#e9e9e9";
});

document.getElementById("layer-section-id").addEventListener("click", ()=>{
  previousdropdown.classList.remove("show");
  pnav.style.backgroundColor = "transparent";
  // previousdropdown.classList.remove("show");
})

// previousLink.addEventListener("mouseleave", () => {
//   previousdropdown.classList.remove("show");
//   pnav.style.backgroundColor = "transparent";
// });

// previousdropdown.addEventListener("mouseleave", () => {
//   previousdropdown.classList.remove("show");
// });

// previousdropdown.addEventListener("click", () => {
//   previousdropdown.classList.add("show");
// });

document.getElementById("checkout-form").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent actual form submission

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();
  const phoneInput = document.getElementById("phone").value.trim();
  const cardNumber = document.getElementById("cardNumber").value.trim();
  const expiryDate = document.getElementById("expiryDate").value.trim();
  const cvv = document.getElementById("cvv").value.trim();
  const message = document.getElementById("checkout-message");

  // Basic validations
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cardPattern = /^\d{16}$/;
  const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
  const cvvPattern = /^\d{3,4}$/;
  const phonePattern = /^[0-9]{11}$/;

  if (!fullName || !email || !address || !cardNumber || !expiryDate || !cvv) {
    message.textContent = "Please fill in all required fields.";
    message.style.color = "red";
    return;
  }

  if (!emailPattern.test(email)) {
    message.textContent = "Invalid email format.";
    message.style.color = "red";
    return;
  }

  if (!phonePattern.test(phoneInput)) {
    alert("Please enter a valid 10-digit phone number.");
    return;
  }

  if (!cardPattern.test(cardNumber)) {
    message.textContent = "Card number must be 16 digits.";
    message.style.color = "red";
    return;
  }

  if (!expiryPattern.test(expiryDate)) {
    message.textContent = "Expiry date must be in MM/YY format.";
    message.style.color = "red";
    return;
  }

  if (!cvvPattern.test(cvv)) {
    message.textContent = "CVV must be 3 or 4 digits.";
    message.style.color = "red";
    return;
  }

  // All validations passed
  message.textContent = "Order placed successfully!";
  message.style.color = "green";

  // Optionally clear the form
  document.getElementById("checkout-form").reset();
});


