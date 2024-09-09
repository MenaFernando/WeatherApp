const apiKey = '56eed9c975c04b808ba181023240909'; 

document.addEventListener('DOMContentLoaded', () => {
    const locationInput = document.getElementById('location-input');
    const searchButton = document.getElementById('search-button');
    const locationElement = document.getElementById('location');
    const temperatureElement = document.getElementById('temperature');
    const descriptionElement = document.getElementById('description');
    const airQualityElement = document.getElementById('air-quality');
    const uvIndexElement = document.getElementById('uv-index');
    const sunriseElement = document.getElementById('sunrise');
    const forecastContainer = document.getElementById('forecast-container');
    const airQualityContainer = document.getElementById('air-quality-container');

    // Fetch user's location weather on load
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherData(lat, lon);
        }, () => {
            alert("Geolocation is not enabled or available.");
        });
    }

    // Search weather by location
    searchButton.addEventListener('click', () => {
        const location = locationInput.value;
        if (location) {
            fetchWeatherDataByLocation(location);
        }
    });

    // Air Quality clickable functionality
    airQualityContainer.addEventListener('click', () => {
        // Open a new window or modal with more details (example behavior)
        window.open(`https://www.weatherapi.com/weather/air_quality/${locationElement.innerText}`, '_blank');
    });

    function fetchWeatherData(lat, lon) {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7`;
        fetch(url)
            .then(response => response.json())
            .then(data => updateUI(data));
    }

    function fetchWeatherDataByLocation(location) {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7`;
        fetch(url)
            .then(response => response.json())
            .then(data => updateUI(data));
    }

    function updateUI(data) {
        locationElement.innerText = data.location.name + ', ' + data.location.country;
        temperatureElement.innerText = data.current.temp_c + '°C';
        descriptionElement.innerText = data.current.condition.text;

        // Air Quality, UV Index, Sunrise
        airQualityElement.innerText = data.current.air_quality.pm2_5.toFixed(2) + ' µg/m³';
        uvIndexElement.innerText = data.current.uv;
        sunriseElement.innerText = data.forecast.forecastday[0].astro.sunrise;

        // 7-Days Forecast
        forecastContainer.innerHTML = '';
        data.forecast.forecastday.forEach(day => {
            const forecastCard = document.createElement('div');
            forecastCard.classList.add('forecast-card');
            forecastCard.innerHTML = `
                <p>${day.date}</p>
                <p>${day.day.avgtemp_c}°C</p>
                <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
            `;
            forecastContainer.appendChild(forecastCard);
        });
    }
});
