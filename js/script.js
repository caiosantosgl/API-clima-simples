//Variáveis e seleção de elementos
const apiCountry = "https://flagsapi.com//flat/32.png"
const cityInput = document.querySelector("#city-input")
const searchBtn = document.querySelector("#search")

const cityElement = document.querySelector("#city")
const tempElement = document.querySelector("#temperature span")
const descElement = document.querySelector("#description")
const weatherIconElement = document.querySelector("#weather-icon")
const countryElement = document.querySelector("#country")
const umidityElement = document.querySelector("#umidity span")
const windElement = document.querySelector("#wind span")


//Funções
const getCidade = async(city) => {
    const apiCityURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`
    const res = await fetch(apiCityURL)
    const data = await res.json()

    if(!data.results || data.results.length === 0) {
        window.alert("Cidade não encontrada!")
        return null
    }

    const cidade = data.results[0]

    return {
        nome: cidade.name,
        pais: cidade.country,
        latitude: cidade.latitude,
        longitude: cidade.longitude
    }
}

const getDadosClima = async (latitude, longitude) => {
    const apiTempURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`

    const resp = await fetch(apiTempURL)
    const dados = await resp.json()

    return {
        temperatura: dados.current.temperature_2m,
        umidade: dados.current.relative_humidity_2m,
        vento: dados.current.wind_speed_10m,
        clima: traduzirWeatherCode(dados.current.weather_code)
    }
}

function traduzirWeatherCode(code) {
  const mapa = {
    0: "Céu limpo",
    1: "Poucas nuvens",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Névoa",
    48: "Névoa com geada",
    51: "Garoa leve",
    53: "Garoa moderada",
    55: "Garoa intensa",
    61: "Chuva leve",
    63: "Chuva moderada",
    65: "Chuva forte",
    71: "Neve leve",
    73: "Neve moderada",
    75: "Neve forte",
    80: "Pancadas de chuva leves",
    81: "Pancadas moderadas",
    82: "Pancadas fortes",
    95: "Tempestade"
  };

  return mapa[code] || "Clima desconhecido";
}

const showWeatherData = async (city) => {
    const cidade = await getCidade(city)

    if(!cidade) {
        return
    }

    const dadosClima = await getDadosClima(cidade.latitude, cidade.longitude)

    console.log("Cidade:", cidade.nome)
    console.log("País:", cidade.pais)
    console.log("Temperatura:", dadosClima.temperatura + "°C")
    console.log("Umidade:", dadosClima.umidade + "%")
    console.log("Vento:", dadosClima.vento + " km/h")
    console.log("Clima:", dadosClima.clima)
}

//Eventos

searchBtn.addEventListener('click', (e) => {
    e.preventDefault()

    const city = cityInput.value
    showWeatherData(city)
})
