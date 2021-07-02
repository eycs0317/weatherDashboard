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

  searchValue = 'fremont'
  let key = '676165cbb7e4501a39986378002e67ff'
  let units = 'imperial'

  let requestApi = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${key}&units=${units}`

  fetchCurrent(requestApi)


}

function fetchCurrent(api) {
  fetch(api)
  .then(res => {
    console.log(res)
    return res.json();
  }).then(data => {
    console.log(data)
    //temp
    console.log('temp', data.main.temp)
    //wind
    console.log('wind',data.wind.speed)
    console.log('wind speed in mph', data.wind.speed * 1.1507794)
    //humidity
    console.log('humidity',data.main.humidity)
    //lat
    console.log('lat', data.coord.lat)
    //lon
    console.log('lon', data.coord.lon)
  })

}



searchForm.on('submit', searchFunction)