//call out cityHistory list with class.history 
let cityHistory = $(".history")
//call out todayCast div with id#today  
let todayCast = $("#today")
//call out fiveCast div with id#forecast 
let fiveCast = $("#forecast")
//call out searchField input with id#search-value
let searchField = $("#search-value")
//call out searchButton with id#search-button
let searchButton = $("#search-button")
//global JSON response
let jason; 


//get API key 
//import {config} from './config.js' 
let myKey = config.MY_API_KEY;

//when I click on the searchButton  
searchButton.on("click",function(){
    searchBox();
    //clear searchField value 
    searchField.val("");

} )
    //grab current value of searchField 
function searchBox(){
    //I check to make sure this is a valid input (some city name not lizard or asd;ljf or 23947) - currently only checks for pure numbers 
            //VALIDATION COULD BE MORE ROBUST MAN!!! 
        if (!parseInt(searchField.val().trim())){
            console.log("hello!");
            //store value of searchField in localStorage
            localStorage.setItem("search", searchField.val().trim());
            makeButton();
            getWeather(searchField.val().trim())
        }else {
            alert("please use only letters for city name input")
        }
    }
               
    //make a button 
function makeButton() {
    let button = $("<button>")
      //give it text and value equal to searchField 
    button.val(localStorage.getItem("search"));
    button.text(localStorage.getItem("search"));
      //give button class.searchedCity
    button.attr("class", "searchedCity");
    //when I click this button
    button.on("click", function(){
        //todayCast is populated w/ information on this button's value 
        getWeather(button.val());
        //fiveCast is populated w/ information on this button's value 
    })
        //append button to cityHistory
    cityHistory.append(button);

}
 
//call openWeather API 
    //give it a city name with squid
function getWeather(squid){

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ squid + "&appid=" + myKey;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(queryURL);
      console.log(response);
      buildToday(response);
      jason = response;
    });
}




    
    //populate todayCast w/ information
function buildToday(squid){
    todayCast.empty();
    todayCast.attr("class","mt-3 bg-light border rounded p-2")
     //city name, 
    let cityName = $("<p><strong>City Name:</strong> "+ squid.name + "</p>")
    console.log(squid.name);
    todayCast.append(cityName)
        //the date, 
    const event = new Date(squid.dt*1000);
    console.log(squid.dt*1000)
    let todayDate = $("<p><strong>Today's Date:</strong> "+ event.toDateString() + "</p>")
    todayCast.append(todayDate)
        //an icon representation of weather conditions, 
    let currentConditions = $("<p><strong>Sky Condition:</strong> "+ squid.weather[0].description +"</p>")
    let weatherIcon = $("<img>")
    weatherIcon.attr("src", 
                   "http://openweathermap.org/img/wn/" + squid.weather[0].icon + "@2x.png"
    )
    currentConditions.append(weatherIcon)
    todayCast.append(currentConditions)
        //the temperature, 
    let currentTemp = squid.main.temp;
    currentTemp = (currentTemp - 273.15) * 1.80 + 32;
    let tempDisplay = $("<p><strong>Temperature:</strong> "+ currentTemp.toFixed(2) + "°F</p>")
    todayCast.append(tempDisplay);
        //the humidity, 
    let currentHumidity = $("<p><strong>Humidity:</strong> "+ squid.main.humidity +"%</p>")
    todayCast.append(currentHumidity);
        //the wind speed,
    let windSpeed = $("<p><strong>Wind Speed:</strong> "+ (squid.wind.speed * 2.237).toFixed(2) +"mph</p>")
    todayCast.append(windSpeed);
        //and the UV index
    //squid.coord.lat + squid.coord.lon into ajax url
    var onecallURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+ squid.coord.lat + "&lon=" + squid.coord.lon + "&exclude=alerts&appid=" + myKey;
    $.ajax({
      url: onecallURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      let currentUV =  $("<span>" + response.current.uvi +"</span>")
    //UV index is displayed in color coded field
     //favorable, 
      if (parseInt(response.current.uvi) < 3){
            currentUV.attr("class", "bg-success border rounded col-2")

    //moderate,
        }else if(parseInt(response.current.uvi) < 8){
            currentUV.attr("class", "bg-warning border rounded col-2")
    //or severe
        }else{
            currentUV.attr("class", "bg-danger border rounded col-2")
        }

      ultraViolet = $("<p><strong>UV Index: </strong></p>")
      ultraViolet.append(currentUV)
      todayCast.append(ultraViolet)

 //populate fiveCast w/ information 
        fiveCast.empty();
        let fiveDay = $("<div>")
        fiveDay.attr("class", "row")
        fiveCast.append(fiveDay);
        predictFuture(response.daily);
   




      
    });

}

//do this five times 
function predictFuture(squid){
    let fiveDay = $("<div>")
    fiveDay.attr("class", "row bg-light border rounded")
    fiveCast.append("<h1>Five Day Forecast:</h1>")

    for (let i= 1; i< 6; i++){
        //create forecast block
        let forecastBlock = $("<div>")
        forecastBlock.attr("class", "col-2 bg-primary border rounded text-light p-2 m-2")

        //create and append date value
        const event = new Date(squid[i].dt*1000);
        console.log(squid[i].dt*1000)
        let dateValue = $("<h5><strong>"+ event.toDateString() + "</strong></h5>")
        forecastBlock.append(dateValue);

        //an icon representation of weather conditions, 
        let currentConditions = $("<p><strong>Sky Condition:</strong></p>")
        let weatherIcon = $("<img>")
        weatherIcon.attr("src", 
                       "http://openweathermap.org/img/wn/" + squid[i].weather[0].icon + "@2x.png"
        )
        currentConditions.append(weatherIcon)
        forecastBlock.append(currentConditions)
        //the temperature, 
        let currentTemp = squid[i].temp.day;
        currentTemp = (currentTemp - 273.15) * 1.80 + 32;
        let tempDisplay = $("<p><strong>Temperature:</strong> "+ currentTemp.toFixed(2) + "°F</p>")
        forecastBlock.append(tempDisplay);

        //and the humidity
        let currentHumidity = $("<p><strong>Humidity:</strong> "+ squid[i].humidity +"%</p>")
        forecastBlock.append(currentHumidity);

        //append forecast block to column
        fiveDay.append(forecastBlock);
    }
       
       fiveCast.append(fiveDay);
}
   



            
    //when I refresh, 
        //I populate todayCast and fiveCast with last search
        //**I populate cityHistory with search history from localStorage
makeButton();
            //**append button to cityHistory to clear search history from localStorage 
    