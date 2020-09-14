// variable for cities searched
var createCityList = function(citySearchList) {
    $("#city-list").empty();

    var keys = Object.keys(citySearchList);
    for (var i = 0; i < keys.length; i++) {
        var cityEntry = $("<button>");
        cityEntry.addClass("list-group-item list-group-item-action");

        var split = keys[i].toLowerCase().split("");

        for (var j = 0; j < split.length; j++) {
            split[j] = split[j].charAt(0).toUpperCase() + split[j].substring(1);
        }
        var cityCase = split.join("");
        cityEntry.text(cityCase);

        $("#city-list").append(cityEntry);
    }
}


var cityWeather = function(city, citySearchList) {
    createCityList(citySearchList);
    
    var weatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=76292c20961c0a6755cbcf29b4b98e06";
    var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=76292c20961c0a6755cbcf29b4b98e06";
    
    var latitude = "";
    var longitude = "";

    $.ajax({
        url: weatherURL,
        method: "GET"
    })

    //store all retrieved data inside an object
    .then(function(weather) {
        console.log(weatherURL);
        console.log(weather);

        var currentTime = moment();

        var displayTime = $("<h3>");
        $("#city-name").empty();
        $("#city-name").append(displayTime.text("(" + currentTime.format("M/D/YYYY") + "("));

        var cityName = $("<h3>").text(weather.name);
        $("#city-name").prepend(cityName);

        var weatherIcons = $("<img>");
        //weatherIcons.attr("src", "" + weather.weather[0].icon + ".png");
        $("#current-icon").empty();
        $("#current-icon").append(weatherIcons);

        $("#current-temp").text("Temperature: " + weather.main.temp + " °F");
        $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
        $("#current-wind").text("Wind Speed: " + weather.wind.speed + " MPH");

        latitude = weather.coord.lat;
        longitude = weather.coord.lon;

        //longitude/latitude url
        var latLonURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=76292c20961c0a6755cbcf29b4b98e06" + "&lat=" + latitude + "&lon=" + longitude;

        $.ajax({url: latLonURL, method: "GET"})
        .then(function(uvIndex) {
            console.log(uvIndex);

            var uvIndexDisplay = $("<button>");
            uvIndexDisplay.addClass("btn btn-danger");

            $("#current-uv").text("UV Index: ");
            $("#current-uv").append(uvIndexDisplay.text(uvIndex[0].value));
            console.log(uvIndex[0].value);

            $.ajax({ url: forecastURL, method: "GET"})
            .then(function(forecast) {
                console.log(forecastURL);
                console.log(forecast);

                //loop through forecast array to display a single forecast
                for(var i = 6; i < forecast.list.length; i += 8) {
                    var forecastDate = $("<h5>");
                    var forecastPosition = (i + 2) / 8;

                    console.log("#forecast-date" + forecastPosition);

                    $("#forecast-date" + forecastPosition).empty();
                    $("#forecast-date" + forecastPosition).append(forecastDate.text(currentTime.add(1, "days").format("M/D/YYYY"))
                    );

                    var forecastIcon = $("<img>");
                    forecastIcon.attr("src", "https://openweathermap.org/img/w/" + forecast.list[i].weather[0].icon + ".png");

                    $("#forecast-icon" + forecastPosition).empty();
                    $("#forecast-icon" + forecastPosition).append(forecastIcon);

                    console.log(forecast.list[i].weather[0].icon);

                    $("#forecast-temp" + forecastPosition).text("Temperature: " + forecast.list[i].main.temp + "°F");
                    $("#forecast-humidity" + forecastPosition).text("Humidity: " + forecast.list[i].main.humidity + "%");

                    $(".forecast").attr("style", "background-color: dodgerblue; color: white");
                };
            });
        });
    });
};

//hide and show the current weather and forecast when searched
$(document).ready(function() {
    var citySearchListString = localStorage.getItem("citySearchList");

    var citySearchList = JSON.parse(citySearchListString);

    if (citySearchList == null) {
        citySearchList = {};
    };

    createCityList(citySearchList);

    $("#current-weather").hide();
    $("#forecast-weather").hide();


    $("#search-btn").on("click", function(event) {
        event.preventDefault();
        var city = $("#city-name").val().trim().toLowerCase();
        
        if (city != "") {
            citySearchList[city] = true;
            localStorage.setItem("citySearchList", JSON.stringify(citySearchList));

            cityWeather(city, citySearchList);
        
            $("#current-weather").show();
            $("#forecast-weather").show();
        }
    });

    $("#city-list").on("click", "button", function(event) {
        event.preventDefault();
        var city = $(this).text();

        cityWeather(city, citySearchList);

        $("#current-weather").show();
        $("#forecast-weather").show();
    });
});