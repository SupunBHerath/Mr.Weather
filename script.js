getCurrentLocation();
displayLocalTime();


let currentLocation = "";
let currentTown = "";

let currentLocationMarker;
let map;

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                initializeMap(latitude, longitude);
            },
            function (error) {
                console.error('Error getting location:', error.message);
                alert('Error getting your location. Please make sure location services are enabled and try again.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}


//  ================================= map ===========================

function initializeMap(latitude, longitude) {
    if (map) {
        map.remove();
    }

    map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then(data => {
            const locationName = data.display_name;
            currentLocation = data['address']['hamlet'];
            currentTown = data['address']['town'];

            CurrentWeather(currentTown);

            currentLocationMarker = L.marker([latitude, longitude]).addTo(map);
        })
        .catch(error => console.error('Error fetching location name:', error));
}


function updateMap(newLatitude, newLongitude) {
    if (map) {
        map.remove();
    }

    map = L.map('map').setView([newLatitude, newLongitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLatitude}&lon=${newLongitude}`)
        .then(response => response.json())
        .then(data => {
            const locationName = data.display_name;
            currentLocation = data['address']['hamlet'];
            currentTown = data['address']['town'];
            currentLocationMarker = L.marker([newLatitude, newLongitude]).addTo(map);
        })
        .catch(error => console.error('Error fetching location name:', error));
}


//  =================================  Current  weather ===========================

function CurrentWeather(currentTown) {
    console.log("Location" + currentTown);
    let repo = {
        method: "GET"
    };

    for (let i = 1; i < 4; i++) {
        let currentDate = new Date();
        let DaysAgo = new Date(currentDate);
        DaysAgo.setDate(currentDate.getDate() - i);

        // Format the date to match the API's expected format (YYYY-MM-DD)
        let formattedDate = DaysAgo.toISOString().split('T')[0];
        let apiUrl = `http://api.weatherapi.com/v1/history.json?key=f743f38e0e294672b4593454240702&q=${currentTown}&dt=${formattedDate}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                let tem = "currentTemp" + i;
                let img = "homeIconY" + i;
                document.getElementById(tem).innerHTML = data["forecast"]["forecastday"]["0"]["day"]["avgtemp_c"] + "°C";
                document.getElementById(img).src = data["forecast"]["forecastday"]["0"]["day"]["condition"]["icon"];

            })
            .catch(error => {
                // console.log("Failed", error);
                let apiUrl = `http://api.weatherapi.com/v1/history.json?key=f743f38e0e294672b4593454240702&q="Colombo"&dt=${formattedDate}`;
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        // console.log(data);
                        let tem = "currentTemp" + i;
                        let img = "homeIconY" + i;
                        document.getElementById(tem).innerHTML = data["forecast"]["forecastday"]["0"]["day"]["avgtemp_c"] + "°C";
                        document.getElementById(img).src = data["forecast"]["forecastday"]["0"]["day"]["condition"]["icon"];
                    })
            });
    }

    fetch(`http://api.weatherapi.com/v1/current.json?key=f743f38e0e294672b4593454240702&q=${currentTown}`, repo).then(respone => respone.json())
        .then(data => {
            document.getElementById("sCity").innerHTML = "";
            document.getElementById("cwIcon").src = data["current"]["condition"]["icon"];
            document.getElementById("cityName").innerHTML = currentTown;
            document.getElementById("newsCity").innerHTML = currentTown;
            let lat = data["location"]["lat"];
            let lon = data["location"]["lon"];
            updateMap(lat, lon);
            dayData(currentTown);
            setData(data);
            let country = data.location.country;
            countryDetails(country);
            alerts(currentTown);

        })
        .catch(error => {
            alert('Can not Find your location ');
            document.getElementById("sCity").innerHTML = "Suggester city ";
            fetch(`http://api.weatherapi.com/v1/current.json?key=f743f38e0e294672b4593454240702&q=Colombo`, repo).then(respone => respone.json())
                .then(data => {
                    document.getElementById("cityName").innerHTML = "Colombo";
                    document.getElementById("news").innerHTML = "Colombo";
                    let lat = data["location"]["lat"];
                    let lon = data["location"]["lon"];
                    updateMap(lat, lon);
                    dayData("Colombo");
                    setData(data);
                    let country = data.location.country;
                    countryDetails(country);
                    alerts("Colombo");
                })
        })


}
function weatherDataSet(search){
    let repo = {
        method: "GET"
    };
    fetch(`http://api.weatherapi.com/v1/current.json?key=f743f38e0e294672b4593454240702&q=${search}`, repo).then(respone => respone.json())
        .then(data => {


            let Search1 = search.charAt(0).toUpperCase() + search.slice(1)
            document.getElementById("sCity").innerHTML = "";
            document.getElementById("cityName").innerHTML = data.location.name;
            document.getElementById("newsCity").innerHTML = data.location.name;
            currentLocation = Search1;

            let country = data.location.country;
            countryDetails(country);
            let name = data["location"]["name"];
            alerts(name);

            let lat = data["location"]["lat"];
            let lon = data["location"]["lon"];
            updateMap(lat, lon);

            dayData(search);
            setData(data);

        })
        .catch(error => {
            console.log("weather search " + error);
            document.getElementById("sCity").innerHTML = "Suggester city ";
            alert('City not found');
         



        })
}
// ================ weather seach ============================
function weatherSearch() {
    // 
    console.log("weather Search");
    let search = document.getElementById("searchText").value;
    if (search.length === 0){
        weatherDataSet(currentTown);
          
    }else{
        weatherDataSet(search);

    }
};
function setData(data) {
    // console.log(data);
    document.getElementById("cwIcon").src = data["current"]["condition"]["icon"];
    document.getElementById("uv").innerHTML = data["current"]["uv"];
    document.getElementById("humidity").innerHTML = data["current"]["humidity"] + " % ";
    document.getElementById("url").innerHTML = data["current"]["condition"]["text"];
    document.getElementById("last_up").innerHTML = data["current"]["last_updated"];

    //change unit 
    let tem = document.getElementById("t_f").checked;
    let windspeed = document.getElementById("ws_mph").checked;
    let pressure = document.getElementById("ap_mph").checked;
    let gust = document.getElementById("wg_mph").checked;

    if (tem) {
        document.getElementById("temp_c").innerHTML = data["current"]["temp_f"] + " F";
        document.getElementById("temp").innerHTML = data["current"]["temp_f"] + " F";
    } else {
        document.getElementById("temp_c").innerHTML = data["current"]["temp_c"] + "  °C";
        document.getElementById("temp").innerHTML = data["current"]["temp_c"] + " °C";
    }
    if (windspeed) {
        document.getElementById("wind_kph").innerHTML = data["current"]["wind_mph"] + " mph";
    } else {
        document.getElementById("wind_kph").innerHTML = data["current"]["wind_kph"] + " kph";
    }
    if (gust) {
        document.getElementById("gust").innerHTML = data["current"]["gust_mph"] + " mph";
    } else {
        document.getElementById("gust").innerHTML = data["current"]["gust_kph"] + "  kph";
    }
    if (pressure) {
        document.getElementById("pressure").innerHTML = data["current"]["pressure_mb"] + " mb";
    } else {
        document.getElementById("pressure").innerHTML = data["current"]["pressure_in"] + " in";
    }
}




// =================== 7 days forecast ================= 
function dayData(location) {
    for (let i = 1; i < 8; i++) {
        let currentDate = new Date();
        let DaysAgo = new Date(currentDate);
        DaysAgo.setDate(currentDate.getDate() - i);

        // Format the date to match the API's expected format (YYYY-MM-DD)
        let formattedDate = DaysAgo.toISOString().split('T')[0];
        let apiUrl = `http://api.weatherapi.com/v1/history.json?key=f743f38e0e294672b4593454240702&q=${location}&dt=${formattedDate}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                let d = "d" + i;
                document.getElementById(d).innerHTML = formattedDate;
                let tem = "t" + i;
                let img = "i" + i;
                document.getElementById(tem).innerHTML = data["forecast"]["forecastday"]["0"]["day"]["avgtemp_c"] + "°C";
                document.getElementById(img).src = data["forecast"]["forecastday"]["0"]["day"]["condition"]["icon"];


            })
            .catch(error => {
                console.log("Error: " + error);
            });


    }

    for (let i = 1; i < 8; i++) {
        let currentDate = new Date();
        let DaysAgo = new Date(currentDate);
        DaysAgo.setDate(currentDate.getDate() + i);

        let formattedDate = DaysAgo.toISOString().split('T')[0];
        let apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=f743f38e0e294672b4593454240702&q=${location}&dt=${formattedDate}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                let d = "df" + i;
                document.getElementById(d).innerHTML = formattedDate;
                let tem = "tf" + i;
                let img = "iconF" + i;
                document.getElementById(tem).innerHTML = data["forecast"]["forecastday"]["0"]["day"]["avgtemp_c"] + "°C";
                document.getElementById(img).src = data["forecast"]["forecastday"]["0"]["day"]["condition"]["icon"];


            })
            .catch(error => {
                console.log("Error: " + error);
            });
    }


}

// country details =================================================================

function countryDetails(country) {

    let repo = {
        method: "GET"
    };
    fetch(`https://restcountries.com/v3.1/name/${country}`, repo).then(respone => respone.json())
        .then(data => {
            document.getElementById("region").innerHTML = data[0].region;
            document.getElementById("Country").innerHTML = data[0].name.common;
            document.getElementById("capital").innerHTML = data[0].capital;
            document.getElementById("time").innerHTML = data[0].timezones;
            document.getElementById("flag").src = data[0].flags.png;
            document.getElementById("cost").src = data[0].coatOfArms.png;
            document.getElementById("population").innerHTML = data[0].population;

        })

}

// active inactive css  ==================================================

document.getElementById("history").classList.add("active");
document.getElementById("future").classList.add("inactive");
document.getElementById("showTable1").style.backgroundColor = "blue";

document.getElementById("showTable1").addEventListener("click", function () {
    document.getElementById("history").classList.add("active");
    document.getElementById("history").classList.remove("inactive");
    document.getElementById("future").classList.add("inactive");
    document.getElementById("future").classList.remove("active");
    document.getElementById("showTable1").style.backgroundColor = "blue";
    document.getElementById("showTable2").style.backgroundColor = "";

});

document.getElementById("showTable2").addEventListener("click", function () {
    document.getElementById("history").classList.add("inactive");
    document.getElementById("history").classList.remove("active");
    document.getElementById("future").classList.add("active");
    document.getElementById("future").classList.remove("inactive");
    document.getElementById("showTable2").style.backgroundColor = "blue";
    document.getElementById("showTable1").style.backgroundColor = "";

});


// news =================================================================

function alerts(cityName) {
    var apiKey = "f743f38e0e294672b4593454240702";
    var apiUrl = "http://api.weatherapi.com/v1/forecast.json?key=" + apiKey + "&q=" + cityName + "&alerts=yes";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.alerts && data.alerts.length > 0) {
                var alertsHtml = "<ul>";
                data.alerts.forEach(alert => {
                    alertsHtml += "<li class='p-2'><strong>" + alert.sender_name + ":</strong> " + alert.event + " - " + alert.start + " to " + alert.end + "</li>";
                });
                alertsHtml += "</ul>";

                document.getElementById("weatherAlerts").innerHTML = alertsHtml;
            } else {
                document.getElementById("weatherAlerts").innerHTML = "No news available.";
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}



function hideOverlay() {
    $('#temperatureModal').modal('hide');
}


// time 
function displayLocalTime() {
    var now = new Date();
    var localTime = now.toLocaleTimeString();
    document.getElementById('local-time').innerHTML = localTime;
}
setInterval(displayLocalTime, 1000);
window.onload = displayLocalTime;



document.getElementById('darkMode').addEventListener('change', function () {
    document.body.classList.toggle('dark-mode', this.checked);
});