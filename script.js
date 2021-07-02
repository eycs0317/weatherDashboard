var userInput = $('#city')
var searchForm = $('#search-form')
var prevSearch = [];


// Get the search item and build up the API
function searchFunction(e) {
  e.preventDefault();
  let searchValue = userInput.val();
  let key = '676165cbb7e4501a39986378002e67ff'
  let units = 'imperial'

  let requestApi = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${key}&units=${units}`

  fetchCurrent(requestApi, key)


}

//function to call 2 api to get the current weather and UV index
function fetchCurrent(api, key) {
  fetch(api)
  .then(res => {
    console.log(res)
    return res.json();
  }).then(data => {
    //city
    console.log('data', data)
    let city = data.name
    //call the function to create the history button
    addHistoryButton(city)
    let date = new Date(data.dt * 1000).toLocaleDateString("en-US")
    let temp = data.main.temp
    let wind = (data.wind.speed * 1.1507794).toFixed(2)
    let humidity = data.main.humidity
    let lat = data.coord.lat
    let lon = data.coord.lon
    let iconId = data.weather[0].icon
    let iconUrl = `http://openweathermap.org/img/wn/${iconId}@2x.png`
    console.log(iconUrl)



    $('#current-location').text(`${city} (${date})`)
    $('#current-temp').text(`Temperature: ${temp} °F`)
    $('#current-wind').text(`Wind Speed: ${wind} MPH`)
    $('#current-hum').text(`Humidity: ${humidity}%`)
    $('#icon').attr('src', iconUrl)


    let oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${key}`
    fetch(oneCallApi)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      let uvIndex = data.current.uvi
      var uvResult = checkUVIndex(uvIndex)
      $('#current-uv').prepend('UV Index: ')
      $('span').text(uvIndex)
      $('.uv-color').css("background-color", uvResult)
    })
  })

}

//function to check UV index and return the color
function checkUVIndex(index) {
  if(index <= 2) {
    return 'green'
  } else if (index <= 5) {
    return 'yellow'
  } else if (index <= 7) {
    return 'orange'
  } else {
    return 'red'
  }
}

function addHistoryButton (cityName) {
  console.log(cityName)
}



searchForm.on('submit', searchFunction)