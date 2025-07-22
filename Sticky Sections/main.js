const sections = document.querySelectorAll("section");
const first = sections[0];
const last = sections[sections.length - 1];


window.addEventListener("scroll", () => {
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (window.scrollY > 100 && scrollIndicator) {
    scrollIndicator.style.opacity = "0";
    scrollIndicator.style.transition = "opacity 1s ease-out";
  }
});


// scrollIntoView(last)
//   .then(() => asyncDelay())
//   .then(() => scrollIntoView(first));

// function asyncDelay(delayTime = 500) {
//   return new Promise((resolve) => setTimeout(resolve, delayTime));
// }

// async function scrollSequence() {
//   last.scrollIntoView({ behavior: "smooth" });
//   await asyncDelay(1500);
//   first.scrollIntoView({ behavior: "smooth" });
// }

// window.addEventListener("load", scrollSequence);


// Observe the last section to loop scroll back to the top
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target === last) {
      // Delay scroll to first section to allow viewing last image
      setTimeout(() => {
        first.scrollIntoView({ behavior: "smooth" });
      }, 2000); // Adjust delay as needed
    }
  });
}, {
  threshold: 0.9 // Trigger when 90% of the section is visible
});

observer.observe(last);