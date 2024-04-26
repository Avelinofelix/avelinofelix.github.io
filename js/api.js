const apiKey = "090d56995893e1ce30275a70ecfebec9";
const baseUrl = "https://api.openweathermap.org/data/2.5/";
const weekdayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

async function searchCities(query) {
    if (query.length < 3) {
        document.getElementById('searchResults').style.display = 'none';
        return;
    }
    const response = await fetch(`${baseUrl}find?q=${query}&type=like&sort=population&cnt=30&appid=${apiKey}&units=metric`);
    const data = await response.json();
    displayResults(data);
}

function displayResults(data) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';
    data.list.forEach(city => {
        const countryCode = city.sys.country.toLowerCase();
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('search-result');
        resultDiv.innerHTML = `
            <span class="flag-icon flag-icon-${countryCode}"> </span> <!-- Ícone de bandeira usando Flag Icon CSS -->
            <span>${city.name}, ${city.sys.country}</span>
        `;
        resultDiv.onclick = () => updateWeather(city.coord.lat, city.coord.lon);
        resultsContainer.appendChild(resultDiv);
    });
    resultsContainer.style.display = 'block';
}
async function updateWeather(lat, lon) {
    let url;
    if (lat && lon) {
        url = `${baseUrl}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt`;
    } else {
        url = `${baseUrl}forecast?q=${cityName}&appid=${apiKey}&units=metric&lang=pt`;
    }

    const response = await fetch(url);
    const data = await response.json();
    const timezoneOffset = data.city.timezone;


    const today = moment.utc(new Date()).add(timezoneOffset, 'seconds');
    const forecast = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    updateCurrentWeatherDiv(today, forecast[0]);
    updateCurrentWeather(today, forecast[0]);
    updateTomorrowWeather(today, forecast[1]);
    updateDayCards(today, forecast);

    const weatherForecastTitle = document.getElementById('weatherForecast');
    weatherForecastTitle.textContent = `Previsão de tempo ${data.city.name}`;
}
function updateCurrentWeatherDiv(today, currentWeather) {
    const weatherDescriptionElement = document.querySelector('.div1 .int p');
    const weatherIconElement = document.querySelector('.div1 .img1');
    const temperatureElement = document.querySelector('.div1 .span1');
    const feelsLikeElement = document.querySelector('.div1 .ds1 span');
    const timeElement = document.querySelector('.div1 .hora');

    const weatherDescription = currentWeather.weather[0].description;
    const temperature = Math.round(currentWeather.main.temp);
    const feelsLike = Math.round(currentWeather.main.feels_like);
    const currentTime = today.format('HH:mm');
    const currentWeekday = weekdayNames[today.day()];

    weatherDescriptionElement.textContent = weatherDescription;
    weatherIconElement.src = `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;
    temperatureElement.textContent = `${temperature}°`;
    feelsLikeElement.textContent = `Sensação de ${feelsLike}°`;
    timeElement.textContent = `${currentTime} | ${currentWeekday}`;
}

function updateCurrentWeather(today, currentWeather) {
    const formattedDate = `${weekdayNames[today.day()]}, ${today.date()} de ${monthNames[today.month()]} de ${today.year()}`;

    document.querySelector('.today-date').innerHTML = formattedDate;
    document.querySelector('.today-temp').innerHTML = `${currentWeather.main.temp.toFixed(0)}°C`;
    document.querySelector('.today-icon').src = `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;
    document.querySelector('.today-wind').innerHTML = `Vento: ${currentWeather.wind.speed} m/s`;
}

function updateTomorrowWeather(today, tomorrowWeather) {
    const tomorrow = today.clone().add(1, 'days');
    const formattedDate = `${weekdayNames[tomorrow.day()]}, ${tomorrow.date()} de ${monthNames[tomorrow.month()]} de ${tomorrow.year()}`;

    document.querySelector('.tomorrow-date').innerHTML = formattedDate;
    document.querySelector('.tomorrow-temp').innerHTML = `${tomorrowWeather.main.temp.toFixed(0)}°C`;
    document.querySelector('.tomorrow-icon').src = `http://openweathermap.org/img/wn/${tomorrowWeather.weather[0].icon}@2x.png`;
    document.querySelector('.tomorrow-wind').innerHTML = `Vento: ${tomorrowWeather.wind.speed} m/s`;
}

function updateDayCards(today, forecast) {
    const dayCards = document.querySelectorAll('.day-card');
    let currentDay = today.clone().add(2, 'days');

    for (let i = 0; i < dayCards.length; i++) {
        const dayCard = dayCards[i];
        const dayIndex = i + 2;
        let dayWeather;

        if (dayIndex < forecast.length) {
            dayWeather = forecast[dayIndex];
        } else {
            dayWeather = forecast[dayIndex - forecast.length];
        }

        const formattedDate = `${weekdayNames[currentDay.day()]}, ${currentDay.date()} de ${monthNames[currentDay.month()]} de ${currentDay.year()}`;

        dayCard.querySelector('.day-name').innerHTML = weekdayNames[currentDay.day()];
        dayCard.querySelector('.day-date').innerHTML = formattedDate;
        dayCard.querySelector('.day-temp').innerHTML = `${dayWeather.main.temp.toFixed(0)}°C`;
        dayCard.querySelector('.day-icon').src = `http://openweathermap.org/img/wn/${dayWeather.weather[0].icon}@2x.png`;
        dayCard.querySelector('.day-wind').innerHTML = `Vento: ${dayWeather.wind.speed} m/s`;

        currentDay.add(1, 'days');
        dayCard.style.display = 'block';
    }
}


window.addEventListener('load', () => {
    const luandaLatitude = -8.8368;
    const luandaLongitude = 13.2343;
    updateWeather(luandaLatitude, luandaLongitude);
  });


  document.addEventListener('DOMContentLoaded', function () {
    const shareButton = document.querySelector('.button-share'); 
    if (shareButton) {
        shareButton.addEventListener('click', shareWeather);
    }
});

function shareWeather() {
    const weatherForecastTitle = document.getElementById('weatherForecast');
    const cityName = weatherForecastTitle ? weatherForecastTitle.textContent.replace('Previsão de tempo ', '') : 'Cidade desconhecida';
    const weatherInfo = document.querySelector('.div1 .int p') ? document.querySelector('.div1 .int p').textContent : 'Sem informações de tempo';
    const temperatureInfo = document.querySelector('.div1 .span1') ? document.querySelector('.div1 .span1').textContent : 'Sem temperatura';
    const feelsLikeInfo = document.querySelector('.div1 .ds1 span') ? document.querySelector('.div1 .ds1 span').textContent : 'Sem sensação térmica';
    const currentDate = new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const shareData = {
        title: `Previsão do tempo para ${cityName}`,
        text: `Tempo em ${cityName} no dia ${currentDate}: ${weatherInfo}, Temperatura: ${temperatureInfo}, Sensação térmica: ${feelsLikeInfo}`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Compartilhamento feito com sucesso!'))
            .catch((error) => console.log('Erro ao compartilhar:', error));
    } else {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.text)}`;
        window.open(shareUrl, '_blank');
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                updateWeather(latitude, longitude);
                const cityName = document.querySelector('.city-name');
                cityName.textContent = 'Localização Atual';
            },
            function(error) {
                console.log('Erro ao obter a localização:', error);
            }
        );
    } else {
        console.log('A Geolocalização não é suportada neste navegador.');
    }
}

document.getElementById('currentLocationBtn').addEventListener('click', getCurrentLocation);