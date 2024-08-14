/*async function getWeather(city) {
    try {
        const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
        if (!response.ok) {
            throw new Error('Erro ao buscar dados meteorológicos');
        }
        const meu_json = await response.json();

        // Condições atuais
        const currentCondition = meu_json.current_condition[0];
        console.log("Current temperature:", currentCondition.temp_C, "°C");
        console.log("Time description:", currentCondition.weatherDesc[0].value);

        // Área mais próxima
        const nearestArea = meu_json.nearest_area[0];
        console.log("Nearest area:", nearestArea.areaName[0].value);
        console.log("Country:", nearestArea.country[0].value);

        // Previsão para o primeiro dia
        const firstDayForecast = meu_json.weather[0];
        console.log("Forecast date:", firstDayForecast.date);
        console.log("Maximum temperature:", firstDayForecast.maxtempC, "°C");
        console.log("Minimum temperature:", firstDayForecast.mintempC, "°C");

    } catch (error) {
        console.error('Erro:', error);
    }
}*/

// Função para buscar dados meteorológicos
async function fetchWeatherData(city) {
    try {
        const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
        if (!response.ok) {
            throw new Error('Erro ao buscar dados meteorológicos');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        return null;
    }
}

// Função para obter condições atuais
function getCurrentConditions(data) {
    if (!data || !data.current_condition || data.current_condition.length === 0) {
        return null;
    }
    return data.current_condition[0];
}

// Função para obter a área mais próxima
function getNearestArea(data) {
    if (!data || !data.nearest_area || data.nearest_area.length === 0) {
        return null;
    }
    return data.nearest_area[0];
}

// Função para obter a previsão do tempo
function getWeatherForecast(data) {
    if (!data || !data.weather) {
        return [];
    }
    return data.weather;
}

// Função para atualizar a exibição no HTML
function updateWeatherDisplay(currentCondition, nearestArea, forecast) {
    // Atualiza condições atuais
    if (currentCondition) {
        document.getElementById('current-temperature').innerText = `Current temperature: ${currentCondition.temp_C} °C`;
        document.getElementById('time-description').innerText = `Weather description: ${currentCondition.weatherDesc[0].value}`;
        
        // Atualiza a imagem de acordo com a descrição do tempo
        const weatherDesc = currentCondition.weatherDesc[0].value.toLowerCase();
        let imgSrc = '';
        switch (weatherDesc) {
            case 'sunny':
                imgSrc = 'img/sunny.png';
                break;
            case 'partly cloudy':
                imgSrc = 'img/Partly-cloudy.png';
                break;
            case 'cloudy':
                imgSrc = 'img/Cloudy.png';
                break;
            case 'overcast':
                imgSrc = 'img/Overcast.png';
                break;
            case 'mist':
                imgSrc = 'img/Cloudy.png';
                break;
            case 'fog':
                imgSrc = 'img/cloudy.png';
                break;
            case 'hail':
                imgSrc = 'img/Hail.png';
                break;
            case 'heavy rain':
                imgSrc = 'img/Heavy-rain.png';
                break;
            case 'light rain':
                imgSrc = 'img/Light-rain.png';
                break;
            case 'moderate rain':
                imgSrc = 'img/Moderate-rain.png';
                break;
            case 'patchy rain possible':
                imgSrc = 'img/Patchy-rain-possible.png';
                break;
            case 'patchy snow possible':
                imgSrc = 'img/Patchy-snow-possible.png';
                break;
            case 'patchy sleet possible':
                imgSrc = 'img/Patchy-sleet-possible.png';
                break;
            case 'patchy freezing drizzle possible':
                imgSrc = 'img/Patchy-snow-possible.png';
                break;
            case 'thunderstorm':
                imgSrc = 'img/Thunderstorm.png';
                break;
            case 'light snow':
                imgSrc = 'img/Snow.png';
                break;
            case 'moderate snow':
                imgSrc = 'img/Snow.png';
                break;
            case 'heavy snow':
                imgSrc = 'img/Snow.png';
                break;
            case 'blizzard':
                imgSrc = 'img/Snow.png';
                break;
            case 'thundery outbreaks possible':
                imgSrc = 'img/Thunderstorm.png';
                break;
            case 'freezing fog':
                imgSrc = 'img/Snow.png';
                break;
            case 'torrential rain shower ':
                imgSrc = 'img/Torrential-rain-shower.png';
                break;
            default:
                break;
        }

        // Atualiza a imagem no HTML
        const weatherImg= document.getElementById('image-weather');
        weatherImg.src = imgSrc;
        weatherImg.classList.remove('invisible');
    }

    // Atualiza área mais próxima
    if (nearestArea) {
        document.getElementById('nearest-area').innerText = `${nearestArea.areaName[0].value} Current Forecast`;
        document.getElementById('country').innerText = `Country: ${nearestArea.country[0].value}`;
    }

    // Atualiza previsão
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = ''; // Limpa o conteúdo existente

    forecast.forEach((day, index) => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('forecast-day');
        dayElement.innerHTML = `
            <h3>Forecast for (${day.date}):</h3>
            <p>Max temperature: ${day.maxtempC} °C</p>
            <p>Min temperature: ${day.mintempC} °C</p>
            <p>Weather description: ${day.weatherDesc ? day.weatherDesc[0].value : 'No data available'}</p>
            <p>Humidity: ${day.humidity ? day.humidity : 'No data available'}</p>
            <p>Precipitation: ${day.totalPrecipitation_mm ? day.totalPrecipitation_mm : 'No data available'}</p>
        `;
        forecastContainer.appendChild(dayElement);
    });
}

// Função principal para gerenciar o fluxo de dados
async function getWeather(city) {
    const data = await fetchWeatherData(city);
    if (data) {
        const currentCondition = getCurrentConditions(data);
        const nearestArea = getNearestArea(data);
        const forecast = getWeatherForecast(data);

        updateWeatherDisplay(currentCondition, nearestArea, forecast);
    } else {
        console.error('Não foi possível obter os dados meteorológicos.');
    }
}

// Inicializa a página e adiciona event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Adiciona listener para o botão
    document.getElementById('get-weather-btn').addEventListener('click', () => {
        const cityInput = document.getElementById('city-input').value;
        if (cityInput.trim() !== "") {
            getWeather(cityInput);
        } else {
            alert('Please enter a city name.');
        }
    });
});