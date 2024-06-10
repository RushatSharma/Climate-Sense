const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "d0668b99f6e9b88fc047dee3b6477417"; // API key for OpenWeatherMap API

const createWeatherCard = (cityName, weatherItem, index) => {
    const dateParts = weatherItem.dt_txt.split(/[-\s]/); // Split the date string by both "-" and " "
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Rearrange date parts to day-month-year format

    if (index === 0) { // HTML for the main weather card
        return `<div class="details">
                    <h2>${cityName} (${formattedDate})</h2>
                    <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
    } else { // HTML for the other five day forecast card
        return `<li class="card">
                    <h3>(${formattedDate})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
}

const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(response => response.json())
        .then(data => {
            // Filter the forecasts to get only one forecast per day
            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                }
            });

            // Clearing previous weather data
            cityInput.value = "";
            currentWeatherDiv.innerHTML = "";
            weatherCardsDiv.innerHTML = "";

            // Creating weather cards and adding them to the DOM
            fiveDaysForecast.forEach((weatherItem, index) => {
                const html = createWeatherCard(cityName, weatherItem, index);
                if (index === 0) {
                    currentWeatherDiv.insertAdjacentHTML("beforeend", html);
                } else {
                    weatherCardsDiv.insertAdjacentHTML("beforeend", html);
                }
            });

            // Add crop recommendation based on weather data
            const cropRecommendationDiv = document.createElement('div');
            cropRecommendationDiv.classList.add('crop-recommendation');
            cropRecommendationDiv.innerHTML = getCropRecommendation(data);
            currentWeatherDiv.appendChild(cropRecommendationDiv);
        })
        .catch(() => {
            alert("An error occurred while fetching the weather forecast!");
        });
}

const getCropRecommendation = (data) => {
    const temperature = data.list[0].main.temp - 273.15; // Convert temperature from Kelvin to Celsius

    // Example crop recommendation based on temperature
    if (temperature >= 35) {
        return `
            <h2> Crop Recommendation</h2>
            <br>
            <p>  Recommended Crop: Rice, Cotton, Sugarcane, Maize, Sorghum, Groundnut</p>
            <p>  Soil Type: Clayey</p>
            <p>  Fertilizer: Organic Manure, Vermicompost</p>
        `;
    } else if (temperature >= 30 && temperature < 35) {
        return `
            <h2>  Crop Recommendation</h2>
            <p>  Recommended Crop: Rice, Cotton, Sugarcane, Soybean, Sunflower, Pigeon Pea</p>
            <p>  Soil Type: Clayey</p>
            <p>  Fertilizer: Farmyard Manure, Green Manure</p>
        `;
    } else if (temperature >= 25 && temperature < 30) {
        return `
            <h2>  Crop Recommendation</h2>
            <p>  Recommended Crop: Wheat, Maize, Soybean, Sorghum, Mustard, Sunflower</p>
            <p>  Soil Type: Loamy</p>
            <p>  Fertilizer: Nitrogen, Phosphorus, Potassium</p>
        `;
    } else if (temperature >= 20 && temperature < 25) {
        return `
            <h2>  Crop Recommendation</h2>
            <p>  Recommended Crop: Mustard, Barley, Peas, Chickpea, Lentil, Linseed</p>
            <p>  Soil Type: Loamy</p>
            <p>  Fertilizer: Organic Compost, Bone Meal</p>
        `;
    } else if (temperature >= 15 && temperature < 20) {
        return `
            <h2>  Crop Recommendation</h2>
            <p>  Recommended Crop: Potato, Tomato, Carrot, Onion, Radish, Turnip</p>
            <p>  Soil Type: Sandy Loam</p>
            <p>  Fertilizer: Vermicompost, Fish Emulsion</p>
        `;
    } else if (temperature >= 10 && temperature < 15) {
        return `
            <h2>  Crop Recommendation</h2>
            <p>  Recommended Crop: Cabbage, Cauliflower, Spinach, Lettuce, Kale, Broccoli</p>
            <p>  Soil Type: Sandy</p>
            <p>  Fertilizer: Cow Manure, Seaweed Fertilizer</p>
        `;
    } else if (temperature >= 5 && temperature < 10) {
        return `
            <h2>  Crop Recommendation</h2>
            <p>  Recommended Crop: Pea, Turnip, Radish, Kale, Spinach, Carrot</p>
            <p>  Soil Type: Sandy</p>
            <p>  Fertilizer: Cow Dung, Vermicompost</p>
        `;
    } else {
        return `
            <h2>  Crop Recommendation</h2>
            <p>  No specific crop recommendation available for current temperature.</p>
        `;
    }
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    
    // Get entered city coordinates (latitude, longitude, and name) from the API response
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            if (!data.length) return alert(`No coordinates found for ${cityName}`);
            const { lat, lon, name } = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates!");
        });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords; // Get coordinates of user location
            // Get city name from coordinates using reverse geocoding API
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL)
                .then(response => response.json())
                .then(data => {
                    const { name } = data[0];
                    getWeatherDetails(name, latitude, longitude);
                })
                .catch(() => {
                    alert("An error occurred while fetching the city name!");
                });
        },
        error => { // Show alert if user denied the location permission
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        }
    );
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
