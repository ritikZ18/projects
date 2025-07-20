const r = document.querySelector(":root");
const bodyElement = document.body;
const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");

const titleEl = document.getElementById("destination-title");
const subtitleEl = document.getElementById("destination-subtitle");

const destinations = [
  { name: "Sahara", location: "Marrakech", img: "https://cdn.pixabay.com/photo/2021/11/26/17/26/dubai-desert-safari-6826298_1280.jpg" },
  { name: "Maldives", location: "Indian Ocean", img: "https://cdn.pixabay.com/photo/2017/01/20/00/30/maldives-1993704_1280.jpg" },
  { name: "Dolomites", location: "Italy", img: "https://cdn.pixabay.com/photo/2020/03/29/09/24/pale-di-san-martino-4979964_1280.jpg" },
  { name: "Highland", location: "Scotland", img: "https://cdn.pixabay.com/photo/2014/11/21/03/26/neist-point-540119_1280.jpg" },
  { name: "Kleifarvatn", location: "Iceland", img: "https://cdn.pixabay.com/photo/2017/03/02/16/54/iceland-2111811_1280.jpg" },
  { name: "Taj Mahal", location: "India", img: "https://cdn.pixabay.com/photo/2023/08/19/13/26/ai-generated-8200484_1280.jpg" },
  { name: "Colorado", location: "Arizona", img: "https://cdn.pixabay.com/photo/2016/11/29/03/13/desert-1867005_1280.jpg" },
  { name: "Santorin", location: "Greece", img: "https://cdn.pixabay.com/photo/2017/01/30/07/54/church-2020258_1280.jpg" },
  { name: "Petra", location: "Jordan", img: "https://cdn.pixabay.com/photo/2019/07/20/19/12/petra-4351361_1280.jpg" },
  { name: "Fundy", location: "Canada", img: "https://cdn.pixabay.com/photo/2020/11/22/07/11/river-5765785_1280.jpg" },
  { name: "Fuji", location: "Japan", img: "https://cdn.pixabay.com/photo/2016/12/12/22/31/japan-1902834_1280.jpg" },
  { name: "Ha Long Bay", location: "Vietnam", img: "https://cdn.pixabay.com/photo/2022/10/21/10/00/marvel-7536676_1280.jpg" },
  { name: "Banff", location: "Canada", img: "https://cdn.pixabay.com/photo/2017/07/09/21/46/lake-2484952_1280.jpg" },
  { name: "Kyoto", location: "Japan", img: "https://cdn.pixabay.com/photo/2021/09/26/14/56/japan-6658332_1280.jpg" },
  { name: "Meteora", location: "Greece", img: "https://cdn.pixabay.com/photo/2016/10/13/09/06/meteora-1731709_1280.jpg" },
  { name: "Bali", location: "Indonesia", img: "https://cdn.pixabay.com/photo/2016/11/18/15/19/bali-1839361_1280.jpg" },
  { name: "Swiss Alps", location: "Switzerland", img: "https://cdn.pixabay.com/photo/2018/10/02/20/49/switzerland-3718034_1280.jpg" },
  { name: "Uluru", location: "Australia", img: "https://cdn.pixabay.com/photo/2017/06/06/19/14/australia-2381569_1280.jpg" }
];

let currentIndex = 0;

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => img.decode?.().then(() => resolve(src)).catch(() => resolve(src));
    img.onerror = reject;
    img.src = src;
  });
}

function updateDestination(index) {
  const destination = destinations[index];

  if (bodyElement.classList.contains("body--animated")) return;

  bodyElement.classList.add("body--animated");

  preloadImage(destination.img).then(() => {
    // Step 1: set background image immediately
    r.style.setProperty("--img-current", `url(${destination.img})`);

    // Step 2: update text with slight delay for transition sync
    setTimeout(() => {
      r.style.setProperty("--text-current-title", `"${destination.name}"`);
      r.style.setProperty("--text-current-subtitle", `"${destination.location}"`);
    }, 300);

    // Step 3: unlock animation class
  setTimeout(() => {
  titleEl.innerText = destination.name;
  subtitleEl.innerText = destination.location;
}, 300);

  });
}

// Button actions
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % destinations.length;
  updateDestination(currentIndex);
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + destinations.length) % destinations.length;
  updateDestination(currentIndex);
});

// ✅ INITIAL LOAD
updateDestination(currentIndex);
