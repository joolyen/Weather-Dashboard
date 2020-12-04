//defining variables needed
var citySearch = document.querySelector('#submit')
var cityDisplay = document.querySelector('#cityName');
var apiKey = "bd613cfad0bef6db63ac6849f52f7a0e";
var date = moment().format("MM/DD/YYYY");

function getWeather(cityValue) {

  var weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityValue + "&APPID=" + apiKey + "&units=imperial";
  var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityValue + "&APPID=" + apiKey + "&units=imperial";

  $.ajax({
    url: weatherQueryURL,
    method: "GET"
  }).then(function (response) {
 
    // Constructing Variables
    var temp = response.main.temp;
    var humidity = response.main.humidity;
    var wind = response.wind.speed;
    var lat = response.coord.lat;
    var long = response.coord.lon;
    var UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + long + "&appid=" + apiKey + "&units=imperial";
    
    $.ajax({
      url: UVQueryURL,
      method: "GET"
      }).then(function(data){
        $('#weather-display').empty();
        var uvIndex = data[0].value;

        $('#weather-display').append('<h1>' + cityValue + ' (' + date + ')</h1>' + 
                                     '<p>Temperature: ' + temp + '&#8457;' + `<img class="weatherImage" src="https://openweathermap.org/img/wn/${response.weather[0].icon}.png" />` + "</p>" + 
                                     '<p>Humidity: ' + humidity + "%</p>" +
                                     '<p>Wind Speed: ' + wind + "</p>" +
                                     '<p>UV Index: <span class="uvIndex">' + uvIndex + "</span></p>");
    });

    $.ajax({
      url: fiveDayURL,
      method: "GET"
    }).then(function (response) {
      var day = [0, 8, 16, 24, 32];
      var fiveDayCard = $(".fiveDayCard").addClass("card-body");
      var fiveDayDiv = $(".fiveDay").addClass("card-text");
      fiveDayDiv.empty();
      day.forEach(function (i) {
        var FiveDayTime = new Date(response.list[i].dt * 1000);
        FiveDayTime = FiveDayTime.toLocaleDateString("en-US");

        fiveDayDiv.append("<div class=blueCard>" + "<p>" + FiveDayTime + "</p>" + `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}.png">` + "<p>" + "Temperature: " + response.list[i].main.temp + "</p>" + "<p>" + "Humidity: " + response.list[i].main.humidity + "%" + "</p>" + "</div>");


    })
      console.log(response);
    });


  });

}

//on first search button click submit remove hide class from ul and create a li item for first city
$(citySearch).on('click', function (event) {

    // Preventing the button from trying to submit the form
    event.preventDefault();
    // Storing the city name
    var cityValue = $('#city').val().trim();
    $('.city-list').prepend('<a href="#" class="list-group-item list-group-item-action city-name">' + cityValue + '</a>');
    getWeather(cityValue);
    //when a city name in the list is clicked all of the information on the screen is populated
    $('.city-name').on('click', function () {
      console.log('city name clicked');
      var cityClicked = $(this).text().trim();
      getWeather(cityClicked);

  });
});

