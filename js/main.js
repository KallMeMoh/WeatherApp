const currentLocation = document.querySelector('#selectedLocation');
const currentTemp = document.querySelector('#current span');

const conditionIcon = document.querySelectorAll('.conditionIcon');
const conditionState = document.querySelectorAll('.condition');
const todayHigh = document.querySelectorAll('.highest');
const todayLow = document.querySelectorAll('.lowest');

const rainRate = document.querySelector('#rainRate');
const windSpeed = document.querySelector('#windSpeed');
const windDirIcon = document.querySelector('#windDirIcon');
const windDir = document.querySelector('#windDir');
const days = document.querySelectorAll('.card-header .day');
const dates = document.querySelectorAll('.card-header .date');

const findBtn = document.getElementById('findBtn');
const inputLocaton = document.getElementById('inputLocation');

const today = new Date();
for (let i = 0; i < days.length; i++) {
  let formatedDay = formatDate(today);
  days[i].textContent = formatedDay.dayName;
  dates[i].textContent = `${formatedDay.dayNum} ${formatedDay.monthName}`;

  today.setDate(today.getDate() + 1);
}

let city;
navigator.geolocation.getCurrentPosition(async (position) => {
  try {
    const latitude = position.coords.latitude,
      longitude = position.coords.longitude;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );
    const data = await res.json();

    city = data.address.city || data.address.town || data.address.village;
    getWeather(city);
  } catch (e) {
    alert(`Couldn't calculate location, please reload or search manually`);
  }
});

function formatDate(date) {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const monthName = months[date.getMonth()];

  return { dayName, dayNum, monthName };
}

function updateWeatherCondition(current) {
  rainRate.textContent = current?.precip_mm || '0.00';
  windSpeed.textContent = current?.wind_kph || '0.00';

  switch (current?.wind_dir) {
    case 'N':
      windDirIcon.style.transform = 'rotate(135deg)';
      windDir.textContent = 'North';
      break;
    case 'NNE':
      windDirIcon.style.transform = 'rotate(157.5deg)';
      windDir.textContent = 'North-NorthEast';
      break;
    case 'NE':
      windDirIcon.style.transform = 'rotate(180deg)';
      windDir.textContent = 'North-East';
      break;
    case 'ENE':
      windDirIcon.style.transform = 'rotate(202.5deg)';
      windDir.textContent = 'East-NorthEast';
      break;
    case 'E':
      windDirIcon.style.transform = 'rotate(225deg)';
      windDir.textContent = 'East';
      break;
    case 'ESE':
      windDirIcon.style.transform = 'rotate(247.5deg)';
      windDir.textContent = 'East-SouthEast';
      windDir;
    case 'SE':
      windDirIcon.style.transform = 'rotate(270deg)';
      windDir.textContent = 'South-East';
      break;
    case 'SSE':
      windDirIcon.style.transform = 'rotate(292.5deg)';
      windDir.textContent = 'South-SouthEast';
      break;
    case 'S':
      windDirIcon.style.transform = 'rotate(315deg)';
      windDir.textContent = 'South';
      break;
    case 'SSW':
      windDirIcon.style.transform = 'rotate(337.5deg)';
      windDir.textContent = 'South-SouthWest';
      break;
    case 'SW':
      windDirIcon.style.transform = 'rotate(0deg)';
      windDir.textContent = 'South-West';
      break;
    case 'WSW':
      windDirIcon.style.transform = 'rotate(22.5deg)';
      windDir.textContent = 'West-SouthWest';
      break;
    case 'W':
      windDirIcon.style.transform = 'rotate(45deg)';
      windDir.textContent = 'West';
      break;
    case 'WNW':
      windDirIcon.style.transform = 'rotate(67.5deg)';
      windDir.textContent = 'West-NorthWest';
      break;
    case 'NW':
      windDirIcon.style.transform = 'rotate(90deg)';
      windDir.textContent = 'North-West';
      break;
    case 'NNW':
      windDirIcon.style.transform = 'rotate(112.5deg)';
      windDir.textContent = 'North-NorthWest';
      break;
    default:
      windDirIcon.style.transform = 'rotate(315deg)';
      windDir.textContent = 'Unknown';
  }
}

function getWeather(input) {
  const baseUrl = 'https://api.weatherapi.com/v1';
  const apiKey = 'e3e196d692da4cd8a73223327252106';

  fetch(`${baseUrl}/forecast.json?key=${apiKey}&q=${input}&days=3`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.error) {
        console.log(data);
        currentLocation.textContent = `${
          data.location?.region || 'Unset Location'
        } - ${data.location?.country || ''}`;

        updateWeatherCondition(data.current);

        for (let i = 0; i < data.forecast?.forecastday.length; i++) {
          if (i == 0) {
            currentTemp.textContent = data.current?.temp_c || '0.00';
            conditionIcon[0].src =
              'https:' + (data.current?.condition.icon || '');

            conditionState[0].textContent =
              data.current?.condition.text || 'Unknown';
          } else {
            conditionIcon[i].src =
              'https:' +
              (data.forecast?.forecastday[i].day.condition.icon || '');

            conditionState[i].textContent =
              data.forecast?.forecastday[i].day.condition.text || 'Unknown';
          }
          todayHigh[i].textContent =
            data.forecast?.forecastday[i].day.maxtemp_c || '0.00';
          todayLow[i].textContent =
            data.forecast?.forecastday[i].day.mintemp_c || '0.00';
        }
      }
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error);
    });
}

document.getElementById('findBtn').addEventListener('click', (event) => {
  event.preventDefault();
  getWeather(inputLocaton.value);
});

inputLocaton.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    getWeather(inputLocaton.value);
  }
});
inputLocaton.addEventListener('input', (event) =>
  getWeather(inputLocaton.value)
);
