let currentLocation;
let currentTown;
getCurrentLocation();

var currentLocationMarker;
var map;

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
            // console.log(data);
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
                console.log(data);
                let tem = "currentTemp" + i;
                let img = "homeIconY" + i;
                // console.log(tem);
                document.getElementById(tem).innerHTML = data["forecast"]["forecastday"]["0"]["day"]["avgtemp_c"] + "°C";
                document.getElementById(img).src = data["forecast"]["forecastday"]["0"]["day"]["condition"]["icon"];
            })
            .catch(error => {
                console.log("Failed", error);
            });
    }
    let repo = {
        method: "GET"
    };
    fetch(`http://api.weatherapi.com/v1/current.json?key=f743f38e0e294672b4593454240702&q=${currentTown}`, repo).then(respone => respone.json())
        .then(data => {
            document.getElementById("sCity").innerHTML = "";
            document.getElementById("cwIcon").src = data["current"]["condition"]["icon"];

            document.getElementById("cityName").innerHTML = currentTown;
            let lat = data["location"]["lat"];
            let lon = data["location"]["lon"];
            // initializeMap(lat, lon);
            updateMap(lat, lon);
            dayData();
            setData(data);
            let country = data.location.country;
            countryDetails(country);
        })
        .catch(error => {
            alert('City not found');
            document.getElementById("sCity").innerHTML = "Suggester city ";
            fetch(`http://api.weatherapi.com/v1/current.json?key=f743f38e0e294672b4593454240702&q=Colombo`, repo).then(respone => respone.json())
                .then(data => {
                    document.getElementById("cityName").innerHTML = "Colombo";
                    console.log(data);
                    let lat = data["location"]["lat"];
                    let lon = data["location"]["lon"];
                    updateMap(lat, lon);
                    dayData();
                    setData(data);
                    let country = data.location.country;
                    countryDetails(country);
                })
        })


}
// ================ weather seach ============================
function weatherSearch() {
    countryDetails();
    console.log("weather Search");
    let search = document.getElementById("searchText").value;
    console.log(search);
    let repo = {
        method: "GET"
    };
    fetch(`http://api.weatherapi.com/v1/current.json?key=f743f38e0e294672b4593454240702&q=${search}`, repo).then(respone => respone.json())
        .then(data => {
            // console.log(data);
            let Search = search.charAt(0).toUpperCase() + search.slice(1)
            document.getElementById("sCity").innerHTML = "";
            document.getElementById("cityName").innerHTML = data.location.name;
            currentLocation = search;

            let country = data.location.country;
            countryDetails(country);

            let lat = data["location"]["lat"];
            let lon = data["location"]["lon"];
            updateMap(lat, lon);

            dayData();
            setData(data);

        })
        .catch(error => {
            console.log("weather search " + error);
            document.getElementById("sCity").innerHTML = "Suggester city ";
            alert('City not found');
            dayData();


        })

};
function setData(data) {
    document.getElementById("cwIcon").src = data["current"]["condition"]["icon"];
    document.getElementById("uv").innerHTML = data["current"]["uv"];
    document.getElementById("humidity").innerHTML = data["current"]["humidity"] + " % ";
    document.getElementById("url").innerHTML = data["current"]["condition"]["text"];

    //change unit 
    let tem = document.getElementById("t_f").checked;
    let windspeed = document.getElementById("ws_mph").checked;
    let pressure = document.getElementById("ap_mph").checked;
    let gust = document.getElementById("wg_mph").checked;
    // console.log(windspeed + "speed");
    // console.log(pressure + "pressure");
    // console.log(gust + "gust");
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
function dayData() {
    let search = document.getElementById("searchText").value;
    for (let i = 1; i < 8; i++) {
        let currentDate = new Date();
        let DaysAgo = new Date(currentDate);
        DaysAgo.setDate(currentDate.getDate() + 2 - i);

        // Format the date to match the API's expected format (YYYY-MM-DD)
        let formattedDate = DaysAgo.toISOString().split('T')[0];
        let apiUrl = `http://api.weatherapi.com/v1/history.json?key=f743f38e0e294672b4593454240702&q=${search}&dt=${formattedDate}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data);
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


}

// country details

function countryDetails(country) {

    let repo = {
        method: "GET"
    };
    fetch(`https://restcountries.com/v3.1/name/${country}`, repo).then(respone => respone.json())
        .then(data => {
            console.log(data);
            document.getElementById("region").innerHTML = data[0].region;
            document.getElementById("Country").innerHTML = data[0].name.common;
            document.getElementById("capital").innerHTML = data[0].capital;
            document.getElementById("time").innerHTML = data[0].timezones;
            document.getElementById("flag").src = data[0].flags.png;
            document.getElementById("cost").src = data[0].coatOfArms.png;
            document.getElementById("population").innerHTML = data[0].population;

        })

}