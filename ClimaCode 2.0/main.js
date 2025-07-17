var rotateDiv = document.getElementById('rot');
var rotateIcons = document.getElementById('rot-icons');
var clickRotateDiv = document.getElementById('click-rot');
var angle = 0;

clickRotateDiv.onclick = function() {
  angle += 60;
  rotateDiv.style.transform = 'rotate(' + angle + 'deg)';
  rotateIcons.style.transform = 'rotate(' + angle + 'deg)';
};

var step = 2;
var color1 = 'rgba(0,0,0,0.5)';
var color2 = 'rgba(0,0,0,0.1)';

var gradient = ' conic-gradient(';
for (var i = 0; i < 360; i += step) {
  var color = i % (2 * step) === 0 ? color1 : color2;
  gradient += color + ' ' + i + 'deg, ';
}
gradient = gradient.slice(0, -2) + '), rgb(85 93 108)'; 

rotateDiv.style.background = gradient;


var toggles = document.querySelectorAll('.toggle');
var tempElement = document.querySelector('.temp');

let isAnimating = false; // Add flag to indicate if animation is active

toggles.forEach(function(toggle) {
  toggle.addEventListener('click', function() {
    if (this.classList.contains('active') || isAnimating) { // Check if animation is active
      return;
    }
    toggles.forEach(function(toggle) {
      toggle.classList.remove('active');
    });
    this.classList.add('active');
    var tempValue = parseFloat(tempElement.textContent);
    if (this.id === 'toggle-cel') {
      var celsius = Math.round((tempValue - 32) * 5 / 9);
      tempElement.textContent = celsius + '°C';
    } else if (this.id === 'toggle-far') {
      var fahrenheit = Math.round(tempValue * 9 / 5 + 32);
      tempElement.textContent = fahrenheit + '°F';
    }
  });
});

let currentTempF = 34; // Initialize with the initial temperature in Fahrenheit

// cubic ease in/out function
function easeInOutCubic(t) {
  return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
}

function changeTemp(element, newTemp) {
  let unit = element.innerHTML.includes("F") ? "°F" : "°C";
  let currentTemp = unit === "°F" ? currentTempF : Math.round((currentTempF - 32) * 5 / 9);
  let finalTemp = unit === "°F" ? newTemp : Math.round((newTemp - 32) * 5 / 9);

  let duration = 2000; // Duration of the animation in milliseconds
  let startTime = null;

  function animate(currentTime) {
    if (startTime === null) {
      startTime = currentTime;
    }

    let elapsed = currentTime - startTime;
    let progress = Math.min(elapsed / duration, 1);
    progress = easeInOutCubic(progress);

    let tempNow = Math.round(currentTemp + (progress * (finalTemp - currentTemp)));
    element.innerHTML = `${tempNow}${unit}`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Update currentTempF once the animation is complete
      currentTempF = newTemp;
      isAnimating = false; // Reset the flag when animation is done
    }
  }

  isAnimating = true; // Set flag when animation starts
  requestAnimationFrame(animate);
}


// LIVE TEMPERATURE OF USER REGION
function getweather(lat, lon) {
  const apiKey = '8c1066b6f53349a696c220353251707'; // Your WeatherAPI key
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const tempC = Math.round(data.current.temp_c);
      const condition = data.current.condition.text.toLowerCase(); // e.g., "partly cloudy"
      const city = data.location.name;

      console.log("City:", city, "Temp:", tempC, "Condition:", condition);
      initializeWeatherUI(tempC, condition, city);
    })
    .catch(err => console.error('Weather fetch error:', err));
}


function initializeWeatherUI(tempF, condition, cityName) {
  console.log("City:", cityName, "Temp:", tempF);
  const tempElement = document.querySelector('.temp');
  const mountains = document.querySelector('#mountains');
  const outerRim = document.querySelector('.outer-rim');

  changeTemp(tempElement, tempF); // animate
  outerRim.classList.add('power-on');
  mountains.classList.remove("clouds", "snow", "moon", "sunset", "storm");

  if (condition.includes("snow")) {
    mountains.classList.add("snow");
  } else if (condition.includes("cloud")) {
    mountains.classList.add("clouds");
  } else if (condition.includes("rain") || condition.includes("storm")) {
    mountains.classList.add("storm");
  } else if (condition.includes("clear") && new Date().getHours() > 18) {
    mountains.classList.add("moon");
  } else if (condition.includes("clear")) {
    // sunny default
  } else {
    mountains.classList.add("clouds"); // fallback
  }

    document.getElementById('user-location').textContent = cityName;
  document.getElementById('user-temp').textContent = `${tempF}°C`;


  currentTempF = tempF; // Update the global variable
}




window.onload = function() {

  fetch('https://ipapi.co/json/')
  .then(response => response.json())
  .then(location => { 
    const lat = location.latitude;
    const lon = location.longitude;
    console.log("User location:", lat, lon);
    getweather(lat, lon);
  })
  .catch(err => {
    console.error('Error fetching location:', err);
    // Fallback to a default location if needed
  })



  const sixths = Array.from(document.querySelectorAll('.sixths'));
  let index = 0;
  let temp = document.querySelector('.temp');

  document.querySelector('#rot-icons').addEventListener('click', () => {
    sixths[index].classList.remove('active');
    index = (index + 1) % sixths.length;
    sixths[index].classList.add('active');
    if (index == 0 ) {
      changeTemp(temp, 34);
      console.log("sun")
      document.querySelector('#mountains').classList.remove("snow");
      document.querySelector('#mountains').classList.remove("clouds");
    } else if (index == 1) {
      changeTemp(temp, 27);
      console.log("sunset")
      document.querySelector('#mountains').classList.add("sunset");
    } else if (index == 2) {
      changeTemp(temp, 14);
      console.log("moon")
      document.querySelector('#mountains').classList.remove("sunset");
      document.querySelector('#mountains').classList.add("moon");
    } else if (index == 3) {
      changeTemp(temp, 16);
      console.log("clouds")
      document.querySelector('#mountains').classList.add("clouds");
    } else if (index == 4) {
      changeTemp(temp, 8);
      console.log("storm")
      document.querySelector('#mountains').classList.add("storm");
    } else if (index == 5) {
      changeTemp(temp, -4);
      console.log("snow")
      document.querySelector('#mountains').classList.remove("moon");
      document.querySelector('#mountains').classList.remove("storm");
      document.querySelector('#mountains').classList.add("snow");
    }

    let loadingBar = document.querySelector('.loading-bar');
    loadingBar.classList.add('active');
  
    setTimeout(() => {
      loadingBar.classList.remove('active');
    }, 1200);
  });
};