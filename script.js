// Get the search item and build up the API
function searchFunction(e) {
  e.preventDefault();

  //set up all the value to use
  let searchValue = $('#city').val();
  let key = '676165cbb7e4501a39986378002e67ff'

   //When search button got click with no input
   if(searchValue === '' &&  $(this).attr('id') === 'search-form') {
     alert('Please provide a City Name!')
     return;
   }
   $('.card-forecast').empty()

  //When one of the History button got click
  if(searchValue === '') {
    searchValue = $(this).attr('id')
  }

  let requestApi = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${key}&units=imperial`

  $("form").trigger("reset");
  fetchCurrent(requestApi, key)
}

//function to call 2 api to get the current weather and UV index
function fetchCurrent(api, key) {
  fetch(api)
  .then(res => {
    if(res.ok) {
      return res.json();
    } else {
      cityNotFound()
      return;
    }
  }).then(data => {

    let city = data.name

    // save all the city name to local storage
    let localStorageData = JSON.parse(localStorage.getItem('cityName'))
    //check to see if the local storage are empty
    if(localStorageData === null) {
      localStorageData = [];
      localStorageData.push(city);
      localStorage.setItem('cityName', JSON.stringify(localStorageData))
      addHistoryButton(city)
    } else if (!localStorageData.includes(city)) {
      localStorageData.push(city);
      localStorage.setItem('cityName', JSON.stringify(localStorageData))
      addHistoryButton(city)
    }

    let date = new Date(data.dt * 1000).toLocaleDateString("en-US")
    let temp = data.main.temp
    let wind = (data.wind.speed * 1.1507794).toFixed(2)
    let humidity = data.main.humidity
    let lat = data.coord.lat
    let lon = data.coord.lon
    let iconId = data.weather[0].icon
    let iconUrl = `http://openweathermap.org/img/wn/${iconId}@2x.png`

    fetchForecast(city, key, lat, lon)

    $('#current-location').text(`${city} (${date})`)
    $('#current-temp').text(`Temperature: ${temp} °F`)
    $('#current-wind').text(`Wind Speed: ${wind} MPH`)
    $('#current-hum').text(`Humidity: ${humidity}%`)
    $('#icon').attr('src', iconUrl)

    //Get the UV index
    let oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${key}`
    fetch(oneCallApi)
    .then(res => res.json())
    .then(data => {

      let uvIndex = data.current.uvi
      var uvColorResult = checkUVIndex(uvIndex)

      $('.text').text('UV Index: ')
      $('.uv-color').text(uvIndex)
      $('.uv-color').css("background-color", uvColorResult)
    })
  }).catch(err => {
    console.log('err ', err)
  })
}

//function to check UV index and return the color
function checkUVIndex(index) {
  if(index < 3) {
    return 'green'
  } else if (index < 6) {
    return 'yellow'
  } else if (index < 8) {
    return 'orange'
  } else if (index < 11) {
    return 'red'
  } else {
    return 'violet'
  }
}

function addHistoryButton (cityName) {
    var $newButton = $('<button>').attr('id',cityName).addClass('btn btn-primary history-btn')
    $newButton.attr('type','button')
    $newButton.text(cityName)
    $newButton.on('click',searchFunction)
    $('.history').prepend($newButton)
}

function loadInitHistory() {
  var history = JSON.parse(localStorage.getItem('cityName'))
  if (history !== null) {
    history.forEach(name => {
      addHistoryButton(name)
    })
  }
}
loadInitHistory()

function fetchForecast (city, key, lat, lon) {
  let requestApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${key}&units=imperial`

  fetch(requestApi)
  .then((res) => {
    return res.json()
  }).then((data) => {
      let $h2 = $('<h2>').text('5-day Forecast:')
      $('.card-forecast').append($h2)
      for(var i = 1; i < 6 ; i++) {
        let date = new Date(data.daily[i].dt * 1000).toLocaleDateString("en-US");
        let icon = data.daily[i].weather[0].icon;
        let iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`
        let temp = data.daily[i].temp.day;
        let humidity = data.daily[i].humidity;

        let $h2 = $('<h2>').text('5-day Forecast:')
        let $h4 = $('<h4>').text(date).css("color", 'white');
        let $img = $('<img>').attr('src', iconUrl);
        let $pTemp = $('<p>').text(`Temp: ${temp}°F`)
        let $pHumidity = $('<p>').text(`Humidity: ${humidity}%`)
        let $newCard = $('<div>').addClass('col-2 card')

        $newCard.append($h4, $img, $pTemp, $pHumidity)
        $('.card-forecast').append($newCard)
      }
  })
}

//clear search history
$('.btn-danger').click(function() {
  let emptyArr = []
  localStorage.setItem('cityName', JSON.stringify(emptyArr))
  $('.history').empty()
});

//if search city not found
function cityNotFound() {
  $('#current-location').text('City Not Found!')
  $('#current-temp').text('')
  $('#current-wind').text('')
  $('#current-hum').text('')
  $('#icon').removeAttr('src')
  $('.text').text('')
  $('.uv-color').text('')
  $('.uv-color').css("background-color", 'white')
}

//search button click
$('#search-form').on('submit', searchFunction)