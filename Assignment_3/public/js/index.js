function animateColumns(dropdown) {
  const columns = dropdown.querySelectorAll('.drop-column');
  columns.forEach((col, i) => {
    setTimeout(() => {
      col.classList.add('animated');
    }, i * 120); // 120ms delay between columns
  });
}

function resetColumns(dropdown) {
  const columns = dropdown.querySelectorAll('.drop-column');
  columns.forEach(col => col.classList.remove('animated'));
}

const nav = document.getElementById("nav-bkg");

const menLink = document.getElementById("men-link");
const dropdown = document.getElementById("men-dropdown");
if (menLink && dropdown && nav) {
  menLink.addEventListener("mouseenter", () => {
    dropdown.classList.add("show");
    nav.style.backgroundColor = "#f6f6f6";
    animateColumns(dropdown);
  });
  menLink.addEventListener("mouseleave", () => {
    dropdown.classList.remove("show");
    nav.style.backgroundColor = "transparent";
    resetColumns(dropdown);
  });
  dropdown.addEventListener("mouseleave", () => {
    dropdown.classList.remove("show");
    resetColumns(dropdown);
  });
  dropdown.addEventListener("mouseenter", () => {
    dropdown.classList.add("show");
    animateColumns(dropdown);
  });
}

const womenLink = document.getElementById("women-link");
const womendropdown = document.getElementById("women-dropdown");
if (womenLink && womendropdown && nav) {
  womenLink.addEventListener("mouseenter", () => {
    womendropdown.classList.add("show");
    nav.style.backgroundColor = "#f6f6f6";
    animateColumns(womendropdown);
  });
  womenLink.addEventListener("mouseleave", () => {
    womendropdown.classList.remove("show");
    nav.style.backgroundColor = "transparent";
    resetColumns(womendropdown);
  });
  womendropdown.addEventListener("mouseenter", () => {
    womendropdown.classList.add("show");
    animateColumns(womendropdown);
  });
  womendropdown.addEventListener("mouseleave", () => {
    womendropdown.classList.remove("show");
    resetColumns(womendropdown);
  });
}

const impactLink = document.getElementById("impact-link");
const impactdropdown = document.getElementById("impact-dropdown");
if (impactLink && impactdropdown && nav) {
  impactLink.addEventListener("mouseenter", () => {
    impactdropdown.classList.add("show");
    nav.style.backgroundColor = "#f6f6f6";
    animateColumns(impactdropdown);
  });
  impactLink.addEventListener("mouseleave", () => {
    impactdropdown.classList.remove("show");
    nav.style.backgroundColor = "transparent";
    resetColumns(impactdropdown);
  });
  impactdropdown.addEventListener("mouseleave", () => {
    impactdropdown.classList.remove("show");
    resetColumns(impactdropdown);
  });
  impactdropdown.addEventListener("mouseenter", () => {
    impactdropdown.classList.add("show");
    animateColumns(impactdropdown);
  });
}

const storiesLink = document.getElementById("stories-link");
const storiesdropdown = document.getElementById("stories-dropdown");
if (storiesLink && storiesdropdown && nav) {
  storiesLink.addEventListener("mouseenter", () => {
    storiesdropdown.classList.add("show");
    nav.style.backgroundColor = "#f6f6f6";
    animateColumns(storiesdropdown);
  });
  storiesLink.addEventListener("mouseleave", () => {
    storiesdropdown.classList.remove("show");
    nav.style.backgroundColor = "transparent";
    resetColumns(storiesdropdown);
  });
  storiesdropdown.addEventListener("mouseleave", () => {
    storiesdropdown.classList.remove("show");
    resetColumns(storiesdropdown);
  });
  storiesdropdown.addEventListener("mouseenter", () => {
    storiesdropdown.classList.add("show");
    animateColumns(storiesdropdown);
  });
}

const livedLink = document.getElementById("lived-link");
const liveddropdown = document.getElementById("lived-dropdown");
if (livedLink && liveddropdown && nav) {
  livedLink.addEventListener("mouseenter", () => {
    liveddropdown.classList.add("show");
    nav.style.backgroundColor = "#f6f6f6";
    animateColumns(liveddropdown);
  });
  livedLink.addEventListener("mouseleave", () => {
    liveddropdown.classList.remove("show");
    nav.style.backgroundColor = "transparent";
    resetColumns(liveddropdown);
  });
  liveddropdown.addEventListener("mouseleave", () => {
    liveddropdown.classList.remove("show");
    resetColumns(liveddropdown);
  });
  liveddropdown.addEventListener("mouseenter", () => {
    liveddropdown.classList.add("show");
    animateColumns(liveddropdown);
  });
}

const previousLink = document.getElementById("previous-tasks-link");
const previousdropdown = document.getElementById("previous-tasks-dropdown");
if (previousLink && previousdropdown && nav) {
  previousLink.addEventListener("mouseenter", () => {
    previousdropdown.classList.add("show");
    nav.style.backgroundColor = "#f6f6f6";
    animateColumns(previousdropdown);
  });
  previousLink.addEventListener("mouseleave", () => {
    previousdropdown.classList.remove("show");
    nav.style.backgroundColor = "transparent";
    resetColumns(previousdropdown);
  });
  previousdropdown.addEventListener("mouseleave", () => {
    previousdropdown.classList.remove("show");
    resetColumns(previousdropdown);
  });
  previousdropdown.addEventListener("mouseenter", () => {
    previousdropdown.classList.add("show");
    animateColumns(previousdropdown);
  });
}

document.getElementById("layer-section-id").addEventListener("click", ()=>{
  previousdropdown.classList.remove("show");
  nav.style.backgroundColor = "transparent";
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

document.addEventListener('DOMContentLoaded', function() {
  const toasts = document.querySelectorAll('.toast-message');
  toasts.forEach(toast => {
    setTimeout(() => {
      toast.remove();
    }, 4000); // 4 seconds (matches the animation)
  });
});

