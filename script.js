var userInput = $('#city')
var searchForm = $('#search-form')
var prevSearch = [];


// Get the search item and build up the API
function searchFunction(e) {
  e.preventDefault();
  $('.card-forecast').empty()

  if(userInput.val() === '') {
    alert('no input');
    return
  }
  let searchValue = userInput.val();
  let key = '676165cbb7e4501a39986378002e67ff'
  let units = 'imperial'

  let requestApi = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${key}&units=${units}`

  $("form").trigger("reset");

  fetchCurrent(requestApi, key)



}

//function to call 2 api to get the current weather and UV index
function fetchCurrent(api, key) {
  fetch(api)
  .then(res => {
    //console.log(res)
    return res.json();
  }).then(data => {
    //city
    //console.log('data', data)
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
    //console.log(iconUrl)
    fetchForecast(city, key, lat, lon)


    $('#current-location').text(`${city} (${date})`)
    $('#current-temp').text(`Temperature: ${temp} °F`)
    $('#current-wind').text(`Wind Speed: ${wind} MPH`)
    $('#current-hum').text(`Humidity: ${humidity}%`)
    $('#icon').attr('src', iconUrl)


    let oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${key}`
    fetch(oneCallApi)
    .then(res => res.json())
    .then(data => {
      //console.log(data)
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

    let newButton = $('<button>').attr('id',cityName).addClass('btn btn-primary')
    newButton.attr('type','button')
    newButton.text(cityName)
    $('.history-btn').append(newButton)
    console.log('newButton',newButton)

}

function fetchForecast (city, key, lat, lon) {
  let requestApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${key}&units=imperial`

  fetch(requestApi)
  .then((res) => {
    return res.json()
  }).then((data) => {
      for(var i = 1; i < 6 ; i++) {
        let date = new Date(data.daily[i].dt * 1000).toLocaleDateString("en-US");
        let icon = data.daily[i].weather[0].icon;
        let iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`
        let temp = data.daily[i].temp.day;
        let humidity = data.daily[i].humidity;
        // $('.card-forecast').empty()
        let $h4 = $('<h4>').text(date);
        let $img = $('<img>').attr('src', iconUrl);
        let $pTemp = $('<p>').text(`Temp: ${temp}°F`)
        let $pHumidity = $('<p>').text(`Humidity: ${humidity}%`)
        let $newCard = $('<div>').addClass('col-2 card')

        $newCard.append($h4, $img, $pTemp, $pHumidity)
        $('.card-forecast').append($newCard)

      }


    //we need - date, icon, temp, humidity

  })
}



searchForm.on('submit', searchFunction)