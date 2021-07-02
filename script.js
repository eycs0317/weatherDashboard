var userInput = $('#city')
// $('submit-btn').click(function(e) {
//   e.preventDefault()
//   console.log('click')
//   console.log(userInput)
// })

var searchForm = $('#search-form')


https://api.openweathermap.org/data/2.5/weather?q=north pole&appid=676165cbb7e4501a39986378002e67ff
function searchFunction(e) {
  e.preventDefault();

  let searchValue = userInput.val();

  // searchValue = 'fremont'
  let key = '676165cbb7e4501a39986378002e67ff'
  let units = 'imperial'

  let requestApi = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${key}&units=${units}`

  fetchCurrent(requestApi, key)


}

function fetchCurrent(api, key) {
  fetch(api)
  .then(res => {
    console.log(res)
    return res.json();
  }).then(data => {
    //city
    console.log('data', data)
    let city = data.name
    let date = new Date(data.dt * 1000).toLocaleDateString("en-US")

    let temp = data.main.temp
    let wind = data.wind.speed * 1.1507794
    let humidity = data.main.humidity
    let lat = data.coord.lat
    let lon = data.coord.lon
    let iconId = data.weather[0].icon
    let iconUrl = `http://openweathermap.org/img/wn/${iconId}@2x.png`
    console.log(iconUrl)



    $('#current-location').text(`${city} (${date})`)
    $('#current-temp').text(`Temp: ${temp} °F`)
    $('#current-wind').text(`Wind: ${wind} MPH`)
    $('#current-hum').text(`Humidity: ${humidity} %`)


    let oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${key}`
    fetch(oneCallApi)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      let uvIndex = data.current.uvi
      $('#current-uv').text(`UV Index: ${uvIndex}`)
    })
  })

}



searchForm.on('submit', searchFunction)