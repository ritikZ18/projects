// script.js

document.addEventListener("DOMContentLoaded", function () {
  // 1. Highlight active link in nav
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  // 2. Smooth scroll (if internal anchors used)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // 3. Waitlist form submission (feedback only)
  const form = document.querySelector(".waitlist-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("✅ Thank you! Your waitlist request has been submitted.");
      form.reset();
    });
  }

  // 4. Scroll to top button (optional)
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    window.addEventListener("scroll", function () {
      scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
    });

    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
