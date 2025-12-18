const header = document.querySelector(".rf-header");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    header.classList.add("hide");
    if (window.innerWidth > 768) {
  header.classList.add("hide");
}

  } else {
    header.classList.remove("hide");
  }

  lastScrollY = currentScrollY;
});
